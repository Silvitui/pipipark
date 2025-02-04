import mongoose from 'mongoose';

const ParkVisitSchema = new mongoose.Schema({
  park: { type: mongoose.Schema.Types.ObjectId, ref: 'Park', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' }]
});

const ParkVisit = mongoose.model('ParkVisit', ParkVisitSchema);
export default ParkVisit;
