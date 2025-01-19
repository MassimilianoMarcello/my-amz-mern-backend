import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import  checkUser  from '../middleware/checkUser.js';

import userControllers from '../controllers/user.js';

const { register, login, logout, getAllUsers, updateUserRole,getUserProfile,updateUserProfile,forgotPassword,resetPassword } = userControllers;

const router = express.Router();

// routes

// registration and login
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// managing users
router.get("/users",verifyToken,checkUser, getAllUsers);
router.put("/users/:id/role",verifyToken, checkUser, updateUserRole);

// SINGLE USER PROFILE
router.get("/users/:id",verifyToken , getUserProfile);
router.put("/users/:id",verifyToken, updateUserProfile);

// recover password
router.post('/forgotpassword', forgotPassword);
router.post('/api/auth/reset-password/:token', resetPassword);





export default router;
