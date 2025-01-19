import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Generic', 'Smartphones', 'Laptops', 'Tablets', 'Accessories', 'Wearables'],
        default: 'Generic'
    },
    mainImage: {
        type: String,
        required: true
    },
    images: {
        type: [String], // Array of strings for multiple images
    },
    discount: {
        type: Number,
        default: 0, // Default discount is 0%
        min: 0,
        max: 100
    },
    isDiscounted: {
        type: Boolean,
        default: false // Default is not discounted
    },
    isFeatured: {
        type: Boolean,
        default: false // Default is not featured
    },
    isRecommended: {
        type: Boolean,
        default: false // Default is not recommended
    },
    isDailyDeal: {
        type: Boolean,
        default: false // Default is not a daily deal
    },
    newArrivals: {
        type: Boolean,
        default: false // Default is not a new arrival
    }

}, {
    timestamps: true
});

// Middleware pre-save per impostare isDiscounted in base al valore di discount
productSchema.pre('save', function(next) {
    this.isDiscounted = this.discount > 0;
    next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
