import User from '../models/user.js';
import hashPassword from '../utils/hashPassword.js';
import matchPasswords from '../utils/matchPasswords.js';
import validateEmail from '../utils/validateEmail.js';
import validatePassword from '../utils/validatePassword.js';
import validateUsername from '../utils/validateUsername.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import dotenv from 'dotenv';


const userControllers = {
    // Get all users
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({}, 'email role _id'); 
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Update user role (admin or user)
    updateUserRole: async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.role = role;
            await user.save();
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    // Get user profile  (username, email, role)  

        getUserProfile: async (req, res) => {
            const { id } = req.params;
            try {
                const user = await User.findById(id, 'username email role firstName lastName address');
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json(user);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
    
        updateUserProfile: async (req, res) => {
            const { id } = req.params;
            const { firstName, lastName, address } = req.body;
            try {
                const user = await User.findById(id);
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
    
                user.firstName = firstName || user.firstName;
                user.lastName = lastName || user.lastName;
                user.address = address || user.address;
    
                await user.save();
                res.json(user);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        },
    

    
// Register a new user
    register: async (req, res) => {
        const { username, email, password, rePassword } = req.body;
        try {
            if (!username || !email || !password || !rePassword) {
                return res
                    .status(400)
                    .json({ message: 'All fields are required' });
            }
            if (!validateUsername(username)) {
                return res.status(400).json({ message: 'Invalid username' });
            }
            if (!validateEmail(email)) {
                return res.status(400).json({ message: 'Invalid email' });
            }
            if (!validatePassword(password)) {
                return res.status(400).json({ message: 'Invalid password' });
            }
            if (!matchPasswords(password, rePassword)) {
                return res
                    .status(400)
                    .json({ message: 'Passwords do not match' });
            }
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            const hashedPassword = hashPassword(password);
            const user = await User.create({
                username,
                email,
                password: hashedPassword
            });
            res.status(201).json(user);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
    // Login a user
    login: async (req, res) => {
        const { email, password } = req.body;
        try {
            if (!email || !password)
                return res
                    .status(400)
                    .json({ message: 'All fields are required' });

            const userExists = await User.findOne({ email });
            if (!userExists) {
                return res.status(400).json({ message: 'Invalid credentials' });
            } 
  
            const isPasswordCorrect = await bcrypt.compare(
                password,
                userExists.password
            );
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign(
                { id: userExists._id },
                process.env.TOKEN_SECRET
            );

            res.cookie('token', token, { httpOnly: true });
            res.json({ message: 'Login successful', userId: userExists._id, username: userExists.username, role: userExists.role  });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    },
        
    logout: async (req, res) => {
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    },
    // recovering password

  forgotPassword : async (req, res) => {
      const { email } = req.body;
    
      try {
        // Controlla se l'utente esiste
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: "No user associated with this email" });
        }
    
        // Genera il token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "10m",
        });
    
        // Configura il trasportatore di Nodemailer
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD_APP_EMAIL, // Usa la password per app
          },
        });
    
        // Configura l'email
        const mailOptions = {
          from: process.env.EMAIL,
          to: email,
          subject: "Reset Password",
          html: `
            <h1>Reset Your Password</h1>
            <p>Click on the link below to reset your password:</p>
            <a href="${process.env.CORS_ORIGIN}/reset-password/${token}">
              Reset Password
            </a>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `,
        };
    
        // Invia l'email
        await transporter.sendMail(mailOptions);
    
        // Rispondi al client
        res.status(200).json({ message: "Password reset email sent successfully" });
      } catch (err) {
        console.error("Error sending password reset email:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    },
 // Assicurati di avere il modello User corretto
    
    // Resetting password
    resetPassword : async (req, res) => {
      try {
        // Verifica il token
        const decodedToken = jwt.verify(req.params.token, process.env.TOKEN_SECRET);

    
        // Trova l'utente nel DB
        const user = await User.findById(decodedToken.userId);
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        // Cifra la nuova password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    
        // Aggiorna la password dell'utente
        user.password = hashedPassword;
        await user.save();
    
        // Invia la risposta di successo
        res.status(200).json({ message: "Password aggiornata con successo" });
    
      } catch (err) {
        // Gestisce errori, come token non valido o altri
        res.status(500).json({ message: "Errore nel recupero della password: " + err.message });
      }
    }
    
 

    
};

export default userControllers;
