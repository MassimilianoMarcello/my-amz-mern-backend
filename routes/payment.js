import express from 'express';
import paymentController from '../controllers/payment.js'; 

const router = express.Router();

// Definisci la route POST per il pagamento
router.post('/payments', paymentController.makePayment);

export default router;
