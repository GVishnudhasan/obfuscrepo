const express = require('express');
const dotenv = require('dotenv');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const socketIo = require('socket.io');
// const isAuthenticated = require('./middleware/isAuthenticated');

dotenv.config({ path: '.env' });

if (
  !process.env.PORT ||
  !process.env.SESSION_SECRET ||
  !process.env.CLIENT_URL
) {
  console.error('Error: .env file missing required environment variables.');
  process.exit(1);
}

require('./db/database');

const registerRouter = require('./routes/registerRoutes');
const loginRouter = require('./routes/loginRoutes');
const adminRouter = require('./routes/adminRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const profileRoutes = require('./routes/profileRoutes');

const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;
const ONEWEEK = 1000 * 60 * 60 * 24 * 7;

const app = express();
const server = require('http').createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  sessions({
    secret: SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: ONEWEEK, sameSite: 'lax' },
    resave: false,
  })
);

app.use(cookieParser());

const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);


app.post('/api/driver/update-location', (req, res) => {
  const { cabId, latitude, longitude } = req.body;

  // Emit the new location to the specific booking user
  io.emit(`driverLocation_${cabId}`, { latitude, longitude });
  
  res.status(200).send('Location updated');
});

app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/booking', bookingRoutes);
app.use('/api/admin', adminRouter);
app.use('/api/profile', profileRoutes);

app.get('/', (_, res) => {
  res.json({ message: 'Server Set Up Successfully (Health Check)' });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
