import express from 'express';
import { updateUser } from '../controllers/user.controller';


const usersRouter = express.Router();

usersRouter.put('/:id', updateUser); 


export default usersRouter;
