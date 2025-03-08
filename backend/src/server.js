import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';

const app = express();

dotenv.config();
const corsOptions = { credentials: true, origin: process.env.URL || '*' };
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(json());

app.get('/', async (req, res) => {
  res.json({ message: `hello, this is server` });
});

app.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      project_type,
      project_description,
      budget_min,
      budget_max,
    } = req.body;

    console.log(req.body);

    if (!name || !email || !phone || !project_description) {
      return res
        .status(400)
        .json({ error: 'Invalid API request: missing required fields' });
    }

    const newProject = await pool.query(
      `INSERT INTO projects (name, email, phone, project_type, project_description, budget_min, budget_max)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [
        name,
        email,
        phone,
        project_type,
        project_description,
        +budget_min,
        +budget_max,
      ]
    );

    res.json(newProject.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

process.on('SIGINT', async () => {
  console.log('Closing database pool...');
  await pool.end();
  console.log('Database pool closed. Exiting...');
  process.exit(0);
});
