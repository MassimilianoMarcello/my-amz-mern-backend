import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const PATH = dirname(__filename);

dotenv.config({ path: path.join(PATH, '..', '.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const makePayment = async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // l'importo in centesimi
            currency: 'usd',
            payment_method_types: ['card'],
        });
        
        res.json({ client_secret: paymentIntent.client_secret });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export default { makePayment };

