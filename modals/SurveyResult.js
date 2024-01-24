// models/SurveyResult.js
import mongoose from 'mongoose';

const surveyResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.Mixed },
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  surveyAnswers: { type: mongoose.Schema.Types.Mixed },
  chartData: {
    type: mongoose.Schema.Types.Mixed,
  },
  surveySlug: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const SurveyResult =
  mongoose.models.SurveyResult ||
  mongoose.model('SurveyResult', surveyResultSchema);

export default SurveyResult;
