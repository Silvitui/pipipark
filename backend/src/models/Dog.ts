import mongoose from 'mongoose';

const DogSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  gender: {type: String, required: true},
  breed: { type: String, required: true, trim: true }, 
  age: { type: Number, required: true }, 
  size: { type: String, required: true }, 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personality: { 
    type: [String], 
    enum: [
'aventurero',
'tranquilo',
'protector',
'curioso',
'energético',
'gruñón',
'obediente',
'valiente',
'independiente',
'tímido',
'dominante',
'amistoso',
'perezoso',
'inteligente',
'juguetón'

    ], 
    required: true 
  },
  photo: { type: String, default: "https://via.placeholder.com/150" }, 

});

const Dog = mongoose.model('Dog', DogSchema);
export default Dog;
