// pages/api/survey.js
import { Mongo } from '@/utils/mongo';

export default async function handler(req, res) {
  const {
    query: { slug },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const survey = await Mongo.findOne({
          collection: 'Survey',
          query: { slug: slug },
        });
        console.dir(survey);
        res.status(200).json({ success: true, data: survey });
      } catch (error) {
        res.status(500).json({ success: false, error });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
      break;
  }
}
