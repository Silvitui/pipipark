import express from 'express';
import { addDog,  updateDog, deleteDog, getMyDogs, uploadDogPhoto } from '../controllers/dogs.controller';
import { upload } from '../middlewares/uploadMiddleware';

const dogsRouter = express.Router();

dogsRouter.post("/", addDog);
dogsRouter.get("/mine", getMyDogs)
dogsRouter.put("/:id", updateDog);
dogsRouter.delete("/:id", deleteDog);
dogsRouter.post("/upload-photo/:id", upload.single('image'), uploadDogPhoto);
export default dogsRouter;