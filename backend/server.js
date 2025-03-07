const app = express();

dotenv.config();
const corsOptions = { credentials: true, origin: process.env.URL || '*' };
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(json());

app.get('/', async (req, res) => {
  res.json({ message: `hello, this is server` });
});

app.use('/api/users', users);

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));

process.on('SIGINT', async () => {
  console.log('Closing database pool...');
  await pool.end();
  console.log('Database pool closed. Exiting...');
  process.exit(0);
});
