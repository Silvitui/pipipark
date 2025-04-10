import mongoose from 'mongoose';

const DogSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  gender: { type: String, required: true },
  breed: { type: String, required: true, trim: true },
  birthday: { type: Date, required: true },
  size: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  castrated: { type: Boolean, required: true }, 
  personality: {
    type: [String],
    enum: [
      'aventurero', 'aventurera',
      'tranquilo', 'tranquila',
      'protector', 'protectora',
      'curioso', 'curiosa',
      'energético', 'energética',
      'gruñón', 'gruñona',
      'obediente',
      'valiente',
      'cariñoso', 'cariñosa',
      'miedoso', 'miedosa',
      'amistoso', 'amistosa',
      'perezoso', 'perezosa',
      'juguetón', 'juguetona',
      'inseguro', 'insegura',
      'territorial',
      'sociable',
      'líder',
      'audaz'
    ],
    required: true
  },
  
  photo: {
    type: String,
    default: "https://res.cloudinary.com/dcrpz7yol/image/upload/v1744221861/perrito-default_smy8eu.png"
  }
  
});


const Dog = mongoose.model('Dog', DogSchema);
export default Dog;
