const router = require('express').Router();
const { getProducts, getProduct, createProduct } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, createProduct);

module.exports = router;
