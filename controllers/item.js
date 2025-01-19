import mongoose from 'mongoose';
import Item from '../models/item.js';
import Product from '../models/product.js';

const itemControllers = {
    // getAllItems: async (req, res) => {
    //     try {
    //         const items = await Item.find();
    //         res.status(200).json(items);
    //     } catch (error) {
    //         return res.status(500).json({ message: error.message });
    //     }
    // },
    // getItem: async (req, res) => {
    //     const { id } = req.params;
    //     try {
    //         const item = await Item.findById(id);
    //         if (!item) {
    //             return res.status(404).json({ message: 'Item not found' });
    //         }
    //         res.json(item);
    //     } catch (error) {
    //         return res.status(500).json({ message: error.message });
    //     }
    // },

    // Get all items in the shopping cart for a specific user
    getItemsByUser: async (req, res) => {
        const { id } = req.params;
        console.log('User ID receved:', id);
        try {
            console.log(`Fetching items for user_id: ${id}`);
            const items = await Item.find({ user_id: id });
            console.log(`Items found: ${items.length}`);
            res.json(items);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    // Add an item to the shopping cart
    addItem: async (req, res) => {
        const { product_id, user_id, price, quantity } = req.body;
    
        try {
            if (!product_id || !user_id || !price || !quantity) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
    
            // if (!mongoose.Types.ObjectId.isValid(product_id)) {
            //     return res.status(400).json({ message: 'Invalid product ID' });
            // }
    
            const product = await Product.findById(product_id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            // Controlla se l'item esiste già nel carrello
            const existingItem = await Item.findOne({ user_id, product_id });
            let item;
    
            if (existingItem) {
                // Se l'item esiste, aggiorna la quantità
                existingItem.quantity += quantity;
                item = await existingItem.save();
            } else {
                // Se l'item non esiste, crealo
                item = await Item.create({
                    product_id,
                    user_id,
                    title: product.title,
                    price,
                    quantity
                });
            }
    
     
    
            return res.status(201).json({
                message: 'Item added to cart',
                item,
       
            });
        } catch (error) {
            console.error("Error during addItem:", error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    
    

    // update the quantity of an item in the shopping cart

    updateItem: async (req, res) => {
        const { id } = req.params;
        const { quantity } = req.body;

        try {
            const item = await Item.findByIdAndUpdate(
                id,
                { quantity },
                { new: true }
            );

            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }

            res.status(200).json({ message: 'Item updated', item });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // delete an item from the shopping cart
    deleteItem: async (req, res) => {
        const { id } = req.params;
        try {
            const item = await Item.deleteOne({ _id: id });
            if (item.deletedCount > 0) {
                res.status(204).json({ message: 'Item deleted' });
            } else {
                return res.status(404).json({ message: 'Item not found' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }
    },
    // clean the shoppin cart after payment
    clearCartByUser: async (req, res) => {
        console.log('Clearing cart for user ID:', req.params.id);
        const { id } = req.params;
        try {
            const result = await Item.deleteMany({ user_id: id });
            console.log('Items deleted:', result.deletedCount);

            if (result.deletedCount > 0) {
                res.status(200).json({ message: 'Cart successfully cleared' });
            } else {
                res.status(404).json({ message: 'No items found in the cart' });
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({
                message: 'Error clearing the cart',
                error: error.message
            });
        }
    }
};

export default itemControllers;
