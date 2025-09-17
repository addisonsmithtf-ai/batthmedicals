# Batth Medicals Ltd - Policy Portal

A secure medical policy management portal for healthcare professionals.

## Project Overview

This is a React-based web application that provides secure access to medical policies for staff and administrators at Batth Medicals Ltd.

## Features

- Role-based authentication (Staff/Admin)
- Policy viewing and management
- Responsive design
- Secure document access

## Local Development

To run this project locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Technologies Used

This project is built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn-ui components
- Supabase (backend)

## Building for Production

To create a production build:

```sh
npm run build
```

The build files will be generated in the `dist/` directory, ready for deployment to your web hosting provider.

## Deployment

1. Run `npm run build`
2. Upload the contents of the `dist/` folder to your web hosting's public directory
3. Configure your server for Single Page Application (SPA) routing

### Server Configuration

For Apache, add this to your `.htaccess` file:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

For Nginx, add this to your server configuration:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## License

© 2024 Batth Medicals Ltd. All rights reserved.