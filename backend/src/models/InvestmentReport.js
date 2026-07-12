import mongoose from 'mongoose';

const InvestmentReportSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: false 
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ResearchSession',
    required: true
  },
  ticker: { 
    type: String, 
    required: true, 
    uppercase: true 
  },
  recommendation: { 
    type: String, 
    enum: ['BUY', 'HOLD', 'SELL'], 
    required: true 
  },
  confidence: { 
    type: String, 
    enum: ['HIGH', 'MEDIUM', 'LOW'], 
    required: true 
  },
  content: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('InvestmentReport', InvestmentReportSchema);
