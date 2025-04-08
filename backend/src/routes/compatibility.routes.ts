import express from 'express';
import { checkCompatibility } from '../controllers/compatibility.controller';

const router = express.Router();

router.post('/', checkCompatibility);

export default router;
