import express from 'express';
import { getHours } from '../controllers/statistic.controller';


const statsRouter = express.Router();

statsRouter.get("/",getHours);


export default statsRouter;