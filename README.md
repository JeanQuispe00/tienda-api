# Tienda API

Backend de una tienda virtual desarrollado con Node.js, Express, MongoDB, Mongoose y JWT, siguiendo el patrón MVC.

## Ejecución

```bash
npm install
cp .env.example .env
npm run seed
npm run dev

## Endpoints
POST /api/auth/register
POST /api/auth/login
GET /api/products
POST /api/orders (requiere token)
PATCH /api/orders/:id/return (requiere token)

