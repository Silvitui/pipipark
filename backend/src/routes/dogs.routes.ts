import express from 'express';
import { addDog, getDogsByUser, updateDog, deleteDog } from '../controllers/dogs.controller';

const dogsRouter = express.Router();

dogsRouter.post("/", addDog);
dogsRouter.get("/:id",getDogsByUser)
dogsRouter.put("/:id", updateDog);
dogsRouter.delete("/:id", deleteDog);
export default dogsRouter;