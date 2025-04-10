import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage as dataStorage } from "./storage";
import { insertMemberSchema, insertAnnouncementSchema, insertTransactionSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import fs from "fs";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // API routes prefix
  const apiPrefix = "/api";
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Configure multer for file uploads
  const fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  });
  
  const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(null, false);
    }
    cb(null, true);
  };
  

  
  const upload = multer({ 
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
  });
  
  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));
  
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
      const members = await dataStorage.getAllMembers();
      res.json(members);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.post(`${apiPrefix}/members`, requireAdmin, async (req, res) => {
    try {
      const validatedMember = insertMemberSchema.parse(req.body);
      const member = await dataStorage.createMember(validatedMember);
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
      const updatedMember = await dataStorage.updateMember(id, validatedMember);
      
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
      const deleted = await dataStorage.deleteMember(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });
  
  // Photo upload endpoint for members
  app.post(`${apiPrefix}/members/:id/photo`, upload.single('photo'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: req.fileValidationError || "Please upload a valid image file" });
      }
      
      const id = parseInt(req.params.id);
      const member = await dataStorage.getMember(id);
      
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      
      // Remove old photo if it exists and is not a default image
      if (member.photoUrl && member.photoUrl.startsWith('/uploads/') && fs.existsSync(path.join(process.cwd(), member.photoUrl.substring(1)))) {
        try {
          fs.unlinkSync(path.join(process.cwd(), member.photoUrl.substring(1)));
        } catch (err) {
          console.error('Failed to delete old photo:', err);
        }
      }
      
      // Update member with new photo URL
      const photoUrl = `/uploads/${req.file.filename}`;
      const updatedMember = await dataStorage.updateMember(id, { photoUrl });
      
      res.json(updatedMember);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  // Announcements routes
  app.get(`${apiPrefix}/announcements`, async (req, res) => {
    try {
      const announcements = await dataStorage.getAllAnnouncements();
      res.json(announcements);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.post(`${apiPrefix}/announcements`, requireAdmin, async (req, res) => {
    try {
      const validatedAnnouncement = insertAnnouncementSchema.parse(req.body);
      const announcement = await dataStorage.createAnnouncement(validatedAnnouncement);
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
      const updatedAnnouncement = await dataStorage.updateAnnouncement(id, validatedAnnouncement);
      
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
      const deleted = await dataStorage.deleteAnnouncement(id);
      
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
      const transactions = await dataStorage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.post(`${apiPrefix}/transactions`, async (req, res) => {
    try {
      const validatedTransaction = insertTransactionSchema.parse(req.body);
      const transaction = await dataStorage.createTransaction(validatedTransaction);
      res.status(201).json(transaction);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.put(`${apiPrefix}/transactions/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedTransaction = insertTransactionSchema.partial().parse(req.body);
      const updatedTransaction = await dataStorage.updateTransaction(id, validatedTransaction);
      
      if (!updatedTransaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }
      
      res.json(updatedTransaction);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  app.delete(`${apiPrefix}/transactions/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await dataStorage.deleteTransaction(id);
      
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
      const summary = await dataStorage.getTransactionSummary();
      res.json(summary);
    } catch (error) {
      const { status, message } = handleZodError(error);
      res.status(status).json({ message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
