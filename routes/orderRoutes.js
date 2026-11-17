const router = require('express').Router();
const { createOrder, getMyOrders, returnOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect); // todas las rutas de órdenes requieren JWT

router.post('/', createOrder);
router.get('/', getMyOrders);
router.patch('/:id/return', returnOrder);

module.exports = router;
