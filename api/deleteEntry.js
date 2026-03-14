import { ObjectId } from 'mongodb';
import client from '../lib/mongodb.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.body;

  try {
    const database = client.db('PacheteWebvertize');
    const entries = database.collection('PachetulWebvertizePremium');

    const query = { _id: new ObjectId(id) };
    const result = await entries.deleteOne(query);

    if (result.deletedCount === 1) {
      return res.status(204).json({ message: 'Successfully deleted!' });
    }
  } catch (error) {
    console.error(error);
  }
}
