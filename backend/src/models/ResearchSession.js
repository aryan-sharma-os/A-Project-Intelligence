import mongoose from 'mongoose';

const researchSessionSchema = new mongoose.Schema(
  {
    ticker: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    query: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'],
      default: 'PENDING',
    },
    error_message: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ResearchSession', researchSessionSchema);
