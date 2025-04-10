import mongoose from 'mongoose';

const ParkVisitSchema = new mongoose.Schema({
  park: { type: mongoose.Schema.Types.ObjectId, ref: 'Pipican', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog', required: true }],
  checkedInAt: { type: Date, default: Date.now },
  expiresAt: { type: Date } 
});

export default mongoose.model('ParkVisit', ParkVisitSchema);
