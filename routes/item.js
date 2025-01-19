import express from 'express';
import itemControllers from '../controllers/item.js';
import verifyToken from '../middleware/verifyToken.js';


const { getAllItems, getItem, addItem, updateItem, deleteItem ,getItemsByUser, clearCartByUser} = itemControllers;

const router = express.Router();

// routes
// not necessary
// router.get('/items', getAllItems);
// router.get('/items/:id', getItem);

//  get items that user put in cart
router.get('/items/items/user/:id',verifyToken, getItemsByUser);

// user put item in cart
router.post('/items/add',verifyToken, addItem);

// user modify quantity of item in cart
router.put('/items/:id',verifyToken, updateItem);

// user delete item from cart
router.delete('/items/:id', verifyToken, deleteItem);

router.delete('/items/items/clearCart/:id',clearCartByUser);

export default router;