import express from 'express';
import { registerUser, loginUser, logoutUser, checkAuth } from '../controllers/auth.controller';
import authMiddleware from '../middlewares/authMiddlewares';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser); 
authRouter.post('/logout', logoutUser);
authRouter.get('/check-auth', authMiddleware, checkAuth);
authRouter.get('/me', authMiddleware, checkAuth); 

export default authRouter;
