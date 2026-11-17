# Tienda API

Backend de tienda virtual: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt (MVC).

## Ejecución
```
npm install
cp .env.example .env     # completar MONGO_URI y JWT_SECRET
npm run seed             # productos de prueba + admin (admin@tienda.com / Admin123)
npm run dev              # o: npm start
```

## Endpoints
| Método | Ruta | Auth |
|---|---|---|
| POST | /api/auth/register | No |
| POST | /api/auth/login | No |
| GET | /api/products | No |
| GET | /api/products/:id | No |
| POST | /api/products | Bearer + admin |
| POST | /api/orders | Bearer |
| GET | /api/orders | Bearer |
| PATCH | /api/orders/:id/return | Bearer |
