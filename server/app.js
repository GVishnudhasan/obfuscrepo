const express = require('express');
const dotenv = require('dotenv');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const socketIo = require('socket.io');
const Booking = require('./modal/BookingModal');
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
// const io = socketIo(server);

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

const allowedOrigins = [CLIENT_URL, 'http://localhost:3000'];

const io = socketIo(server, {
  cors: {
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
  },
});

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

io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for driver location updates via Socket.IO
  socket.on('driverLocationUpdate', async (locationData) => {
    try {
      const { bookingId, lat, lng } = locationData;
      console.log('Location update received:', locationData);

      // Create or update the booking's current location in MongoDB
      const updatedBooking = await Booking.findOneAndUpdate(
        { _id: bookingId }, // Find the booking by its ID
        {
          $set: {
            driverLatitude: lat,
            driverLongitude: lng,
          },
        },
        { new: true, upsert: true } // Create the document if it doesn't exist
      );

      console.log(`Location updated for booking ${bookingId}`, updatedBooking);
    } catch (error) {
      console.error('Error updating driver location:', error);
    }
  });

  // Use MongoDB Change Streams to listen for updates to the bookings collection
  const changeStream = Booking.watch();

  changeStream.on('change', (change) => {
    if (change.operationType === 'update') {
      const updatedFields = change.updateDescription.updatedFields;

      // Check if the driver location fields were updated
      if (updatedFields.driverLatitude || updatedFields.driverLongitude) {
        const bookingId = change.documentKey._id;

        // Emit the updated location to all connected clients
        io.emit('updateLocation', {
          bookingId: bookingId,
          driverLatitude: updatedFields.driverLatitude,
          driverLongitude: updatedFields.driverLongitude,
        });

        console.log(`Emitted location update for booking ${bookingId}`);
      }
    }
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    changeStream.close(); // Close the Change Stream on disconnect
  });
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
