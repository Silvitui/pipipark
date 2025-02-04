import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  dogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dog' }] 
});

const User = mongoose.model('User', UserSchema);
export default User;
