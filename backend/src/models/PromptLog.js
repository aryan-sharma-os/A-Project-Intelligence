import mongoose from 'mongoose';

const PromptLogSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false 
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearchSession',
  },
  model: { 
    type: String, 
    required: true 
  },
  promptTokens: { 
    type: Number, 
    required: true 
  },
  completionTokens: { 
    type: Number, 
    required: true 
  },
  cost: { 
    type: Number, 
    required: true 
  }
}, { timestamps: true });

PromptLogSchema.index({ userId: 1 });

export default mongoose.model('PromptLog', PromptLogSchema);
