import mongoose from 'mongoose';

const StatsSchema = new mongoose.Schema({
  totalUsers: { type: Number, default: 0 }, 
  totalDogs: { type: Number, default: 0 }, 
  mostPopularPark: { type: mongoose.Schema.Types.ObjectId, ref: 'Park' },
  totalEvents: { type: Number, default: 0 }, 
});

const Stats = mongoose.model('Stats', StatsSchema);
export default Stats;
