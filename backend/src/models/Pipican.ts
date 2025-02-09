import mongoose from 'mongoose';

const PipicanSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  barrio: { type: String, required: true },
  coords: {
    type: [Number], //  [longitud, latitud]
    required: true
  }
});

const Pipican = mongoose.model('Pipican', PipicanSchema);
export default Pipican;
