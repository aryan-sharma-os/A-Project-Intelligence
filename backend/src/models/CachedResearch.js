import mongoose from 'mongoose';

const CachedResearchSchema = new mongoose.Schema({
  ticker: { 
    type: String, 
    required: true, 
    unique: true, 
    uppercase: true 
  },
  financials: { 
    type: mongoose.Schema.Types.Mixed 
  },
  news: { 
    type: mongoose.Schema.Types.Mixed 
  },
  expiresAt: { 
    type: Date, 
    required: true, 
    expires: 0 // TTL Index
  }
});

export default mongoose.model('CachedResearch', CachedResearchSchema);
