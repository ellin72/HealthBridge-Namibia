const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Only watch the mobile directory
config.watchFolders = [projectRoot];

// Block backend and frontend directories from being watched
config.resolver = {
  ...config.resolver,
  blockList: [
    // Block backend directory - match paths with backend in them
    /backend/,
    // Block frontend directory - match paths with frontend in them
    /frontend/,
  ],
};

// Set project root to prevent Metro from watching parent directories
config.projectRoot = projectRoot;

module.exports = config;

