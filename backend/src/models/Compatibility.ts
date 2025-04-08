import mongoose from 'mongoose';

const CompatibilitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  park: { type: mongoose.Schema.Types.ObjectId, ref: 'Pipican', required: true },
  myDog: {
    _id: String,
    name: String,
    personality: String
  },
  results: [
    {
      dogId: String,
      name: String,
      personality: String,
      compatibility: Number
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CompatibilityResult', CompatibilitySchema);
