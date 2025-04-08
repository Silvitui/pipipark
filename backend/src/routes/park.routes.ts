import express from "express";
import { checkInPark, checkOutPark, getDogsInPark } from "../controllers/park.controller";


const parksRouter = express.Router();
parksRouter.get("/:id",getDogsInPark);
parksRouter.post("/checkin",checkInPark);
parksRouter.post("/checkout",checkOutPark);
export default parksRouter;