import Product from '../models/product.js';

const productControllers = {
    // get all products  
    getAllproducts: async (req, res) => {
        try {
            const products = await Product.find();
            res.json(products);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    // get product by ID    
    getProduct: async (req, res) => {
        const {id}=req.params;
        try {
            const product = await Product.findById(id);
            
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    // get products by category
    getProductsByCategory: async (req, res) => {
        const { category } = req.params;
        try {
            const products = await Product.find({ category });
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // get discounted products

    getDiscountedProducts: async (req, res) => {
        try {
            // console.log('Querying for discounted products...');
            const discountedProducts = await Product.find({ isDiscounted: true });
            // console.log('Discounted products found:', discountedProducts);
            
            if (discountedProducts.length === 0) {
                return res.status(404).json({ message: 'No discounted products found' });
            }
    
            res.json(discountedProducts);
        } catch (error) {
            console.error('Error fetching discounted products:', error);
            res.status(500).json({ message: error.message });
        }
    },
    getFeaturedProducts: async (req, res) => {
        try {
            const featuredProducts = await Product.find({ isFeatured: true })
                .sort({ createdAt: -1 })
                .limit(10);
    
            if (!featuredProducts.length) {
                return res.status(404).json({ message: 'No featured products found' });
            }
    
            res.json(featuredProducts);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    },
    

    getNewArrivals: async (req, res) => {
        try {
            const newArrivals = await Product.find({ newArrivals: true }).sort({ createdAt: -1 }).limit(10);
            res.json(newArrivals);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getRecommendedProducts: async (req, res) => {
        try {
            const recommendedProducts = await Product.find({ isRecommended: true });
            res.json(recommendedProducts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getDailyDeals: async (req, res) => {
        try {
            const dailyDeals = await Product.find({ isDailyDeal: true });
            res.json(dailyDeals);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
// create a new product     
    createProduct: async (req, res) => {
        const { title, description, price, category, images,mainImage , discount, isFeatured,isRecommended,isDailyDeal,newArrivals} = req.body;
        try {
            const product = await Product.create({
                title,
                description,
                price,
                category,
                images,
                mainImage,
                discount,
                isFeatured,
                isRecommended,
                isDailyDeal ,
                newArrivals
            });
            res.status(201).json(product);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },

    // update a product
    updateProduct: async (req, res) => {
        const { id } = req.params;
        const { title, description, price, category, mainImage, images,discount,isDailyDeal,isFeatured,isRecommended,newArrivals } = req.body;
        try {
            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            product.title = title || product.title;
            product.description = description || product.description;
            product.price = price || product.price;
            product.category = category || product.category;
            product.mainImage = mainImage || product.mainImage;
            product.images = images || product.images;
            product.discount = discount || product.discount;
            product.isDailyDeal = isDailyDeal || product.isDailyDeal;
            product.isFeatured = isFeatured || product.isFeatured;
            product.isRecommended = isRecommended || product.isRecommended;
            product.newArrivals = newArrivals || product.newArrivals;

            await product.save();
            res.json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // delete a product  FROM THE DATABASE
    deleteProduct: async (req, res) => {
        const { id } = req.params;
        console.log(`Attempting to delete product with ID: ${id}`);
        try {
            const product = await Product.findByIdAndDelete(id);
            if (!product) {
                console.log(`Product with ID: ${id} not found`);
                return res.status(404).json({ message: 'Product not found' });
            }
            console.log(`Product with ID: ${id} deleted`);
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error(`Error deleting product with ID: ${id}`, error);
            return res.status(500).json({ message: error.message });
        }
    
    }}
export default productControllers;