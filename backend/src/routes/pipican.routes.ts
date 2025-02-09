import express from 'express';
import { getPipicans } from '../controllers/pipican.controller';

const router = express.Router();

router.get('/', getPipicans);

export default router;


//utf8 es (Unicode transformation format 8 bits) es una forma de codificar texto para que pueda manejar cualquier carácter del mundo. 
// fs.readFile es el módulo de file system de node que permite interactuar con el sistema de archivos de mi servidor. 