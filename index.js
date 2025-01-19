import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

// import db connection
import connectToDB from './config/db.js';

// import middlewares
import logger from './middleware/logger.js';

// import routes
import userRoutes from './routes/user.js';
import itemRoutes from './routes/item.js';
import productRoutes from './routes/product.js';
import paymentRoutes from './routes/payment.js';



// load environment variables
dotenv.config();
const PORT = process.env.PORT || 5003;

// connect to database
connectToDB();

// initialize express
const app = express();

// cors
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:5173'];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true
    })
);

// use helmet
app.use(helmet());

// parses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// use logger
if (process.env.NODE_ENV === 'development') {
    app.use(logger);
}

// use routes
app.use('/api', userRoutes);
app.use('/api', itemRoutes);
app.use('/api', productRoutes);
app.use('/api', paymentRoutes);

// handle 404
app.use('*', (req, res) => {
    res.status(404).json({ message: '404 - Not Found' });
});

// handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: '500 - Internal Server Error' });
});

// listen to port
app.listen(PORT, () => {
    console.log(`server is up and running on port :  http://localhost:${PORT}`);
});
