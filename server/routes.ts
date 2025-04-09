import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema, insertAnnouncementSchema, insertEventSchema, insertTransactionSchema, insertContactMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route('/api');

  // Members routes
  app.get('/api/members', async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get members' });
    }
  });

  app.get('/api/members/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const member = await storage.getMember(id);
      
      if (!member) {
        return res.status(404).json({ message: 'Member not found' });
      }
      
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get member' });
    }
  });

  app.post('/api/members', async (req, res) => {
    try {
      const member = insertMemberSchema.parse(req.body);
      const createdMember = await storage.createMember(member);
      res.status(201).json(createdMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid member data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create member' });
    }
  });

  app.put('/api/members/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const memberUpdate = insertMemberSchema.partial().parse(req.body);
      const updatedMember = await storage.updateMember(id, memberUpdate);
      
      if (!updatedMember) {
        return res.status(404).json({ message: 'Member not found' });
      }
      
      res.json(updatedMember);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid member data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update member' });
    }
  });

  app.delete('/api/members/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMember(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Member not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete member' });
    }
  });

  // Announcements routes
  app.get('/api/announcements', async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get announcements' });
    }
  });

  app.get('/api/announcements/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const announcement = await storage.getAnnouncement(id);
      
      if (!announcement) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      
      res.json(announcement);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get announcement' });
    }
  });

  app.post('/api/announcements', async (req, res) => {
    try {
      const announcement = insertAnnouncementSchema.parse(req.body);
      const createdAnnouncement = await storage.createAnnouncement(announcement);
      res.status(201).json(createdAnnouncement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid announcement data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create announcement' });
    }
  });

  app.put('/api/announcements/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const announcementUpdate = insertAnnouncementSchema.partial().parse(req.body);
      const updatedAnnouncement = await storage.updateAnnouncement(id, announcementUpdate);
      
      if (!updatedAnnouncement) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      
      res.json(updatedAnnouncement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid announcement data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update announcement' });
    }
  });

  app.delete('/api/announcements/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAnnouncement(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Announcement not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete announcement' });
    }
  });

  // Events routes
  app.get('/api/events', async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get events' });
    }
  });

  app.get('/api/events/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEvent(id);
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get event' });
    }
  });

  app.post('/api/events', async (req, res) => {
    try {
      const event = insertEventSchema.parse(req.body);
      const createdEvent = await storage.createEvent(event);
      res.status(201).json(createdEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid event data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create event' });
    }
  });

  app.put('/api/events/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const eventUpdate = insertEventSchema.partial().parse(req.body);
      const updatedEvent = await storage.updateEvent(id, eventUpdate);
      
      if (!updatedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.json(updatedEvent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid event data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update event' });
    }
  });

  app.delete('/api/events/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEvent(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete event' });
    }
  });

  // Transactions routes
  app.get('/api/transactions', async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get transactions' });
    }
  });

  app.get('/api/transactions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transaction = await storage.getTransaction(id);
      
      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get transaction' });
    }
  });

  app.post('/api/transactions', async (req, res) => {
    try {
      const transaction = insertTransactionSchema.parse(req.body);
      const createdTransaction = await storage.createTransaction(transaction);
      res.status(201).json(createdTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid transaction data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create transaction' });
    }
  });

  app.put('/api/transactions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const transactionUpdate = insertTransactionSchema.partial().parse(req.body);
      const updatedTransaction = await storage.updateTransaction(id, transactionUpdate);
      
      if (!updatedTransaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.json(updatedTransaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid transaction data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update transaction' });
    }
  });

  app.delete('/api/transactions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTransaction(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Transaction not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete transaction' });
    }
  });

  // Contact Messages routes
  app.get('/api/contact-messages', async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get contact messages' });
    }
  });

  app.post('/api/contact-messages', async (req, res) => {
    try {
      const message = insertContactMessageSchema.parse(req.body);
      const createdMessage = await storage.createContactMessage(message);
      res.status(201).json(createdMessage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid message data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create contact message' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
