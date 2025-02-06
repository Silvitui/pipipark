import { Request, Response } from 'express';
import { ParkVisitType } from '../interfaces/parkVisit.interface';
import ParkVisit from '../models/Park';


export const getDogsInPark = async (req: Request, res: Response) => {
    try {
        const { parkId } = req.params;
 const visits: ParkVisitType[] = await ParkVisit.find({ park: parkId })
            .populate('user', '-email -password') // trae solo el nombre del usuario, quitando el email y el password
            .populate('dogs'); //Trae toda la información de los perros

        if (!visits.length) {
            res.status(200).json({ parkId, dogsInPark: [] });
            return 
        }

        res.status(200).json({ parkId, dogsInPark: visits });
        return
    } catch (error) {
        console.error("Error en getDogsInPark:", error);
        res.status(500).json({ message: "Error al obtener perros en el parque" });
        return
    }
};

export const checkInPark = async (req: Request, res: Response) => {
    try {
        const { parkId, userId, dogIds } = req.body;
        if (!parkId || !userId || !dogIds || !dogIds.length) {
            res.status(400).json({ error: "Todos los campos son obligatorios." });
            return 
        }

        const newVisit = new ParkVisit({
            park: parkId,
            user: userId,
            dogs: dogIds
        });

        await newVisit.save();

        res.status(201).json({ message: "Check-in realizado con éxito", visit: newVisit });
        return
    } catch (error) {
        console.error("Error en checkInPark:", error);
        res.status(500).json({ message: "Error al hacer check-in en el pipicán" });
        return 
    }
};


export const checkOutPark = async (req: Request, res: Response) => {
    try {
        const { parkId, userId } = req.body;

        if (!parkId || !userId) {
            res.status(400).json({ error: "Se requieren parkId y userId." });
            return
        }

        const deletedVisit = await ParkVisit.findOneAndDelete({ park: parkId, user: userId });

        if (!deletedVisit) {
            res.status(404).json({ error: "No se encontró un registro para este usuario en este pipicán." });
            return
        }

        res.status(200).json({ message: "Check-out realizado con éxito" });
        return 
    } catch (error) {
        console.error("Error en checkOutPark:", error);
        res.status(500).json({ message: "Error al hacer check-out del pipicán" });
        return
    }
};
