import mongoose from 'mongoose';

    },
  },
  { timestamps: true }
);

export default mongoose.model('ResearchReport', researchReportSchema);
