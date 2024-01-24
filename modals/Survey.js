// models/Survey.js
import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  questionText: {
    type: String,
    required: true,
  },
  options: [optionSchema],
  recommendation: {
    type: String,
  },
});

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  questions: [questionSchema],
});

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  subSections: [subSectionSchema],
});

const surveySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  sections: [sectionSchema],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  rvn: {
    type: Number,
    required: true,
    default: 0,
  },
});

const Survey = mongoose.models.Survey || mongoose.model('Survey', surveySchema);

export default Survey;
