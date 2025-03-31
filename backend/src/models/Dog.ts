import mongoose from 'mongoose';

const DogSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  gender: { type: String, required: true },
  breed: { type: String, required: true, trim: true },
  birthday: { type: Date, required: true },
  size: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  castrated: { type: Boolean, required: true }, // ✅ NUEVO CAMPO
  personality: {
    type: [String],
    enum: [
      'aventurero', 'tranquilo', 'protector', 'curioso', 'energético',
      'gruñón', 'obediente', 'valiente', 'dependiente', 'miedoso',
      'amistoso', 'perezoso', 'juguetón','inseguro','territorial','sociable','líder','listo'
    ],
    required: true
  },
  
  photo: { type: String, default: "https://via.placeholder.com/150" },
});


const Dog = mongoose.model('Dog', DogSchema);
export default Dog;
