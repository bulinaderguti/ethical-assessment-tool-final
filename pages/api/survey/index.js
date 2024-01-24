// pages/api/survey.js
import { Mongo } from '@/utils/mongo';

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const surveys = await Mongo.findAll({
          collection: 'Survey',
          query: {},
        });
        console.dir(surveys);
        res.status(200).json({ success: true, data: surveys });
      } catch (error) {
        res.status(500).json({ success: false, error });
      }
      break;

    default:
      res.status(405).json({ success: false, message: 'Method Not Allowed' });
      break;
  }
}
