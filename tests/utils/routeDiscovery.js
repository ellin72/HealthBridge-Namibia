/**
 * Automated Route Discovery
 * Extracts all routes from Express app for dynamic testing
 */

/**
 * Extract routes from Express app
 * @param {Object} app - Express application instance
 * @returns {Array} - Array of route objects
 */
function discoverRoutes(app) {
  const routes = [];
  
  if (!app || !app._router || !app._router.stack) {
    console.warn('Cannot discover routes: app structure not recognized');
    return routes;
  }

  function extractRoutes(layer, basePath = '') {
    if (!layer) return;

    // Handle route middleware
    if (layer.route) {
      const route = layer.route;
      const path = basePath + route.path;
      
      route.stack.forEach((stackItem) => {
        const method = stackItem.method || 'all';
        routes.push({
          method: method.toUpperCase(),
          path: path,
          fullPath: path,
          handlers: route.stack.map(s => s.name || 'anonymous')
        });
      });
    }
    // Handle router middleware
    else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      const routerPath = basePath + (layer.regexp.source
        .replace('\\/?', '')
        .replace('(?=\\/|$)', '')
        .replace(/^\^|\$$/g, '')
        .replace(/\\\//g, '/') || '');
      
      layer.handle.stack.forEach((stackItem) => {
        extractRoutes(stackItem, routerPath);
      });
    }
  }

  app._router.stack.forEach((layer) => {
    extractRoutes(layer);
  });

  return routes;
}

/**
 * Group routes by path prefix
 */
function groupRoutesByPrefix(routes) {
  const grouped = {};
  
  routes.forEach(route => {
    const prefix = route.path.split('/')[1] || 'root';
    if (!grouped[prefix]) {
      grouped[prefix] = [];
    }
    grouped[prefix].push(route);
  });
  
  return grouped;
}

/**
 * Filter routes by criteria
 */
function filterRoutes(routes, filters = {}) {
  let filtered = [...routes];
  
  if (filters.method) {
    filtered = filtered.filter(r => r.method === filters.method.toUpperCase());
  }
  
  if (filters.path) {
    filtered = filtered.filter(r => r.path.includes(filters.path));
  }
  
  if (filters.public !== undefined) {
    // This would require checking if route has authentication middleware
    // For now, we'll use heuristics (routes without /auth prefix that aren't /public)
    filtered = filtered.filter(r => {
      if (filters.public) {
        return r.path.includes('/public') || r.path.includes('/auth/register') || r.path.includes('/auth/login');
      } else {
        return !r.path.includes('/public') && !r.path.includes('/auth/register') && !r.path.includes('/auth/login');
      }
    });
  }
  
  return filtered;
}

module.exports = {
  discoverRoutes,
  groupRoutesByPrefix,
  filterRoutes
};

