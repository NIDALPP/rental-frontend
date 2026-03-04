# Rental Frontend

React + Vite frontend for rental property listings and management.

## Scripts

- `npm run dev` start development server
- `npm run build` build for production
- `npm run lint` run ESLint
- `npm run preview` preview production build

## Cloudinary image upload setup

Manage Properties supports direct image upload to Cloudinary.

1. Copy `.env.example` to `.env`
2. Set these variables:
   - `VITE_CLOUDINARY_CLOUD_NAME`
   - `VITE_CLOUDINARY_UPLOAD_PRESET` (unsigned preset)
   - `VITE_CLOUDINARY_FOLDER` (optional)
3. Restart the dev server after changing `.env`
# rental-frontend
