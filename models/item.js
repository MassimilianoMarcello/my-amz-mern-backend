import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        price: {
            type: Number,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        product_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;
