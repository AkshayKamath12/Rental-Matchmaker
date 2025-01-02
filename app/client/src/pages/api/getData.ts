import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Function to get environment variable with a default value
const getEnvVariable = (key: string, defaultValue: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    console.warn(`Warning: Environment variable ${key} is not set. Using default value.`);
    return defaultValue;
  }
  return value;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const result = await pool.query('SELECT * FROM playbooks');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching playbooks:', error);
      res.status(500).json({ error: 'Error fetching playbooks' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}