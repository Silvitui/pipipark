import { Router } from 'express';
import { updateUser, getProfile, changePassword } from '../controllers/user.controller';


const userRouter = Router();
userRouter.get('/profile',  getProfile);
userRouter.put('/profile', updateUser);
userRouter.post('/changePassword', changePassword);

export default userRouter;
