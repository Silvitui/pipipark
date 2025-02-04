import mongoose from 'mongoose';

const DogSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  breed: { type: String, required: true, trim: true }, 
  age: { type: Number, required: true }, 
  size: { type: String, enum: ['small', 'medium', 'big'], required: true }, 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photo: { type: String, default: "https://via.placeholder.com/150" }, 
  personality: { 
    type: [String], 
    enum: [
      'playful',
      'calm',
      'protective',
      'affectionate',
      'curious',
      'energetic',
      'grumpy',
      'obedient',
      'brave',
      'independent',
      'shy',
      'dominant',
      'friendly',
      'lazy',
      'intelligent'
    ], 
    required: true 
  }
});

const Dog = mongoose.model('Dog', DogSchema);
export default Dog;
