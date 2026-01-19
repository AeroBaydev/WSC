import mongoose from 'mongoose';

const quizSessionSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  fullName: { 
    type: String, 
    required: true 
  },
  mentorName: { 
    type: String, 
    required: true 
  },
  schoolName: { 
    type: String, 
    required: true 
  },
  contactDetails: {
    type: String,
    required: true
  },
  sessionToken: { 
    type: String, 
    required: true, 
    unique: true 
  },
  startTime: { 
    type: Date, 
    required: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  lastHeartbeat: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  status: { 
    type: String, 
    enum: ['active', 'submitted', 'auto_submitted'],
    default: 'active'
  },
  answers: [{
    questionId: { type: Number, required: true },
    selectedOption: { type: Number }, // null if not answered
    answeredAt: { type: Date }
  }],
  questionOrder: [{
    type: Number
  }], // Store shuffled question order
  optionMappings: [{
    questionId: { type: Number },
    mapping: [{ type: Number }] // Maps shuffled index to original index
  }],
  score: { 
    type: Number,
    default: null // Only set after submission
  },
  submittedAt: { 
    type: Date,
    default: null
  },
  violationReasons: [{
    type: String // Store reasons for auto-submission
  }]
}, { 
  timestamps: true 
});

// Index for faster queries (email and sessionToken already indexed via unique: true)
quizSessionSchema.index({ status: 1 });
quizSessionSchema.index({ lastHeartbeat: 1 });

export default mongoose.models.QuizSession || mongoose.model('QuizSession', quizSessionSchema);

