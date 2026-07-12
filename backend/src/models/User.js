import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: /.+\@.+\..+/ 
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  tier: { 
    type: String, 
    enum: ['FREE', 'PRO'], 
    default: 'FREE' 
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
