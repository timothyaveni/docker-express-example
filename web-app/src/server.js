import express from 'express';
import pg from 'pg';

const pool = new pg.Pool({
  host: 'db',
  user: 'postgres',
  database: 'postgres',
  password: process.env.POSTGRES_PASSWORD,
});

const initDb = async () => {
  const client = await pool.connect();
  await client.query(`
    CREATE TABLE IF NOT EXISTS page_views (
      id SERIAL PRIMARY KEY,
      time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      path TEXT
    )
  `);
  client.release();
};

await initDb();

const app = express();

app.get('/', async (req, res) => {
  await pool.query('INSERT INTO page_views (path) VALUES ($1)', [req.path]);

  const { rows } = await pool.query('SELECT COUNT(*) AS count FROM page_views');
  const pageViewCount = rows[0].count;

  res.status(200).send(`Hello! You are <strong>viewer number ${pageViewCount}</strong>.`);
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server listening');
});
