import express from "express";
import { checkInPark, checkOutPark, getDogsInPark } from "../controllers/park.controller";


const parksRouter = express.Router();
parksRouter.get("/:id",getDogsInPark);
parksRouter.get("/id",checkInPark);
parksRouter.get("/id",checkOutPark);
export default parksRouter;