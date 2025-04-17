import { Request, Response } from 'express';
import Dog from '../models/Dog';
import { calculateCompatibility } from '../utils/compatibility';
import { validationResult } from 'express-validator';

export const getCompatibility = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { dog1Id, dog2Id } = req.body;

    const [dog1, dog2] = await Promise.all([
      Dog.findById(dog1Id).lean(),
      Dog.findById(dog2Id).lean(),
    ]);

    if (!dog1 || !dog2) {
      res.status(404).json({ message: 'Perro(s) no encontrado(s).' });
      return;
    }

    const dog1Parsed = {
      ...dog1,
      _id: dog1._id.toString(),
      owner: dog1.owner.toString(),
      gender: dog1.gender as 'macho' | 'hembra',
      size: dog1.size as 'pequeño' | 'mediano' | 'grande',
    };

    const dog2Parsed = {
      ...dog2,
      _id: dog2._id.toString(),
      owner: dog2.owner.toString(),
      gender: dog2.gender as 'macho' | 'hembra',
      size: dog2.size as 'pequeño' | 'mediano' | 'grande',
    };

    const result = calculateCompatibility(dog1Parsed, dog2Parsed);
    res.status(200).json({
      name: dog2.name,          
      score: result.score,
      summary: result.summary     
    });
    
  } catch (err) {
    console.error('[getCompatibility]', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
