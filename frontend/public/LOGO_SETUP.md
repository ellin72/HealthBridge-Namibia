# Logo Setup Instructions

## Where to Place Your Logo

Place your HealthBridge Namibia logo file in the `frontend/public/` directory with the name:
- `healthbridge-logo.png` (recommended)
- OR `healthbridge-logo.svg` (if using SVG format)

## Supported Formats
- PNG (recommended for best compatibility)
- SVG (for scalable vector graphics)
- JPG/JPEG (if needed)

## Logo Usage

The logo will automatically appear in:
1. **Sidebar** - Top of the navigation drawer
2. **Header** - Top navigation bar (desktop view)
3. **Login Page** - Above the sign-in form
4. **Register Page** - Above the registration form
5. **Browser Tab** - As the favicon

## File Naming

The current setup expects the logo to be named: `healthbridge-logo.png`

If you use a different name or format, update the `logoPath` constant in:
- `src/components/Layout.tsx`
- `src/pages/Login.tsx`
- `src/pages/Register.tsx`

## Alternative: Using Import (for src/assets/images)

If you prefer to place the logo in `src/assets/images/`, you can use:

```typescript
import logoPath from '../assets/images/healthbridge-logo.png';
```

Then update the import statements in the files mentioned above.

## Recommended Logo Dimensions

- **Sidebar/Header**: 32-40px height (width auto)
- **Login/Register**: 80px height (width auto)
- **Favicon**: 32x32px or 64x64px

The logo will automatically scale while maintaining aspect ratio.

