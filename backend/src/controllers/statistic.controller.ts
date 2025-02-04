import { Request, Response } from 'express';
import User from '../models/User';
import Dog from '../models/Dog';
import Stats from '../models/statistic';
import ParkVisit from '../models/Park';



export const getStatistics = async (_req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDogs = await Dog.countDocuments();
        const totalEvents = await ParkVisit.countDocuments();

        // 🔥 Encontrar el parque más visitado
        const mostPopular = await ParkVisit.aggregate([
            { $group: { _id: "$park", count: { $sum: 1 } } }, 
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        const mostPopularPark = mostPopular.length ? mostPopular[0]._id : null;

        return res.status(200).json({
            totalUsers,
            totalDogs,
            totalEvents,
            mostPopularPark
        });
    } catch (error) {
        console.error("Error en getStatistics:", error);
        return res.status(500).json({ message: "Error al obtener estadísticas" });
    }
};

export const updateStatistics = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDogs = await Dog.countDocuments();
        const totalEvents = await ParkVisit.countDocuments();

        const mostPopular = await ParkVisit.aggregate([
            { $group: { _id: "$park", count: { $sum: 1 } } }, 
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        const mostPopularPark = mostPopular.length ? mostPopular[0]._id : null;

        await Stats.findOneAndUpdate({}, {
            totalUsers,
            totalDogs,
            totalEvents,
            mostPopularPark
        }, { upsert: true });

        console.log("📊 Estadísticas actualizadas correctamente.");
    } catch (error) {
        console.error("Error en updateStatistics:", error);
    }
};
