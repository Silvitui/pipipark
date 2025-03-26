import express from 'express';
import { addDog,  updateDog, deleteDog, getMyDogs } from '../controllers/dogs.controller';

const dogsRouter = express.Router();

dogsRouter.post("/", addDog);
dogsRouter.get("/mine", getMyDogs)
dogsRouter.put("/:id", updateDog);
dogsRouter.delete("/:id", deleteDog);
export default dogsRouter;