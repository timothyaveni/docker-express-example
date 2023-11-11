import express from 'express';
import sqlite3 from 'better-sqlite3';

const pageViewDb = new sqlite3('/data/page-views.sqlite3');

pageViewDb.exec(`
  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    path TEXT
  )
`);

const app = express();

app.get('/', (req, res) => {
  const statement = pageViewDb.prepare('INSERT INTO page_views (path) VALUES (?)');
  statement.run(req.path);

  const pageViewCount = pageViewDb.prepare('SELECT COUNT(*) AS count FROM page_views').get().count;

  res.status(200).send(`Hello! You are <strong>viewer number ${pageViewCount}</strong>.`);
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Server listening');
});
