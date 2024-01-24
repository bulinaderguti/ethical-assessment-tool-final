// pages/api/survey.js
import { Mongo } from '@/utils/mongo';

export default async function handler(req, res) {
  const {
    method,
    body: { surveyId, chartData, surveySlug, surveyAnswers, userId },
  } = req;

  switch (method) {
    case 'GET':
      try {
        const surveysResult = await Mongo.findAll({
          collection: 'SurveyResult',
          query: {},
        });

        res.status(200).json({ success: true, data: surveysResult });
      } catch (error) {
        res.status(500).json({ success: false, error });
      }
      break;

    case 'POST':
      try {
        const surveysResult = await Mongo.create({
          collection: 'SurveyResult',
          object: {
            surveyId: surveyId,
            chartData: chartData,
            surveySlug: surveySlug,
            surveyAnswers: surveyAnswers,
            userId: userId,
          },
        });
        res.status(200).json({ success: true, data: surveysResult });
      } catch (error) {
        res.status(500).json({ success: false, error });
      }
      break;

    case 'PATCH':
      try {
        const surveysResult = await Mongo.upsert({
          collection: 'SurveyResult',
          query: { userId: userId, surveySlug: surveySlug },
          updateData: {
            chartData: chartData,

            surveyAnswers: surveyAnswers,
          },
        });
        res.status(200).json({ success: true, data: surveysResult });
      } catch (error) {
        res.status(500).json({ success: false, error });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
      break;
  }
}
