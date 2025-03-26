import { Request, Response } from 'express';
import Pipican from '../models/Pipican';

export const getPipicans = async (_req: Request, res: Response) => {
  try {
    const pipicans = await Pipican.find({});

    if (!pipicans.length) {
      res.status(404).json({ message: 'No pipicans found.' });
      return;
    }

    res.status(200).json(pipicans);
    return;
  } catch (error: unknown) {
    console.error("Error en getPipicans:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred.',
    });
    return;
  }
};
