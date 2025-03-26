import { Router } from 'express';
import { updateUser, getProfile } from '../controllers/user.controller';


const userRouter = Router();
userRouter.get('/profile',  getProfile);

userRouter.put('/', updateUser);

export default userRouter;
