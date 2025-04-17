import express from 'express';
import { getCompatibility } from '../controllers/compatibility.controller';


const router = express.Router();

router.post('/check', getCompatibility);

export default router;
