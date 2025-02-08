import express, { Response } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller';
import authMiddleware from '../middlewares/authMiddlewares';
import { AuthenticatedRequest } from '../utils/types/types';

const authRouter = express.Router();
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser); 
authRouter.post('/logout', logoutUser);
authRouter.get('/check-auth', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({ authenticated: true, user: req.user })});
authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ authenticated: false, error: 'Usuario no autenticado' });
        return 
    }
    res.status(200).json({ user });
});

export default authRouter;

