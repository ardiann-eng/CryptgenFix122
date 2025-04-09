import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema, insertAnnouncementSchema, insertTransactionSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // API routes prefix
  const apiPrefix = "/api";
  
  // Admin authentication middleware
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    
    next();
  };

  // Error handler helper
  const handleZodError = (error: unknown) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return { 
        status: 400, 
        message: validationError.message 
      };
    }
    return { 
      status: 500, 
      message: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  };

  // Members routes
  app.get(`${apiPrefix}/members`, async (req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.post(`${apiPrefix}/members`, requireAdmin, async (req, res) => {
    try {
      const validatedMember = insertMemberSchema.parse(req.body);
      const member = await storage.createMember(validatedMember);
      res.status(201).json(member);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.put(`${apiPrefix}/members/:id`, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedMember = insertMemberSchema.partial().parse(req.body);
      const updatedMember = await storage.updateMember(id, validatedMember);
      
      if (!updatedMember) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      res.json(updatedMember);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.delete(`${apiPrefix}/members/:id`, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteMember(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  // Announcements routes
  app.get(`${apiPrefix}/announcements`, async (req, res) => {
    try {
      const announcements = await storage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.post(`${apiPrefix}/announcements`, requireAdmin, async (req, res) => {
    try {
      const validatedAnnouncement = insertAnnouncementSchema.parse(req.body);
      const announcement = await storage.createAnnouncement(validatedAnnouncement);
      res.status(201).json(announcement);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.put(`${apiPrefix}/announcements/:id`, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedAnnouncement = insertAnnouncementSchema.partial().parse(req.body);
      const updatedAnnouncement = await storage.updateAnnouncement(id, validatedAnnouncement);
      
      if (!updatedAnnouncement) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      
      res.json(updatedAnnouncement);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.delete(`${apiPrefix}/announcements/:id`, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteAnnouncement(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  // Transactions routes
  app.get(`${apiPrefix}/transactions`, async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.post(`${apiPrefix}/transactions`, requireAdmin, async (req, res) => {
    try {
      const validatedTransaction = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedTransaction);
      res.status(201).json(transaction);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.put(`${apiPrefix}/transactions/:id`, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedTransaction = insertTransactionSchema.partial().parse(req.body);
      const updatedTransaction = await storage.updateTransaction(id, validatedTransaction);
      
      if (!updatedTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(updatedTransaction);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.delete(`${apiPrefix}/transactions/:id`, requireAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTransaction(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  // Get financial summary
  app.get(`${apiPrefix}/finance/summary`, async (req, res) => {
    try {
      const summary = await storage.getTransactionSummary();
      res.json(summary);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
