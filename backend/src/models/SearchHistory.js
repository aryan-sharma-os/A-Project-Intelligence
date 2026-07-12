import mongoose from 'mongoose';

const SearchHistorySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false // Optional for MVP until auth is hooked up
  },
  ticker: { 
    type: String, 
    required: true, 
    uppercase: true 
  },
  query: { 
    type: String, 
    default: null 
  }
}, { timestamps: true });

SearchHistorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('SearchHistory', SearchHistorySchema);
