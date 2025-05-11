// Vercel serverless function for API routes
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { storage } from '../server/storage.js';
import passport from 'passport';
import session from 'express-session';
import MemoryStore from 'memorystore';

const app = express();
const MemoryStoreSession = MemoryStore(session);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(
  session({
    secret: 'cryptgen-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 86400000, // 24 hours
      secure: process.env.NODE_ENV === 'production',
    },
    store: new MemoryStoreSession({
      checkPeriod: 86400000, // 24 hours
    }),
  })
);

// Auth
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// API routes
app.get("/", (req, res) => {
  res.send("API is running!");
});
app.get('/api/members', async (req, res) => {
  try {
    const members = await storage.getAllMembers();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await storage.getAllAnnouncements();
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await storage.getAllTransactions();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

app.get('/api/finance/summary', async (req, res) => {
  try {
    const summary = await storage.getTransactionSummary();
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch finance summary' });
  }
});

// Handle OPTIONS requests for CORS
app.options('*', (req, res) => {
  res.status(200).end();
});

// Catch all handler
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// For Vercel serverless function
export default app;
