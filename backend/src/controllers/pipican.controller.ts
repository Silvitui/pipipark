import { Request, Response } from 'express';
import Pipican from '../models/Pipican';


export const getPipicans = async (_req: Request, res: Response) => {

    try {
        const pipicans = await Pipican.find({})
        if(pipicans.length === 0) {
            res.status(404).json({ message: 'No pipicans found.' });
            return 
        }
        res.status(200).json(pipicans);
        return
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unknown error occurred.' });
        }
    }
}