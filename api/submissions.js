import client from '../lib/mongodb.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify JWT
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing token' });

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Fetch submissions
  try {
    await client.connect();
    const db = client.db('PacheteWebvertize');
    const collection = db.collection('PachetulWebvertizePremium');

    const entries = await collection
      .find(
        {},
        {
          projection: {
            name: 1,
            email: 1,
            message: 1,
            ip: 1,
            createdAt: 1,
            _id: 1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .toArray();

    return res.status(200).json(entries);
  } catch (error) {
    return res.status(500).json({ error: 'DB error', details: error.message });
  }
}
