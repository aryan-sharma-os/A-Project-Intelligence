import mongoose from 'mongoose';

const ApplicationLogSchema = new mongoose.Schema({
  level: { 
    type: String, 
    enum: ['INFO', 'WARN', 'ERROR'], 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  metadata: { 
    type: mongoose.Schema.Types.Mixed 
  }
}, { timestamps: true });

export default mongoose.model('ApplicationLog', ApplicationLogSchema);
