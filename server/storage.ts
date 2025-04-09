import {
  users, type User, type InsertUser,
  members, type Member, type InsertMember,
  announcements, type Announcement, type InsertAnnouncement,
  events, type Event, type InsertEvent,
  transactions, type Transaction, type InsertTransaction,
  contactMessages, type ContactMessage, type InsertContactMessage
} from "@shared/schema";

// Interface for CRUD operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Member operations
  getAllMembers(): Promise<Member[]>;
  getMember(id: number): Promise<Member | undefined>;
  getMemberByNIM(nim: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: number, member: Partial<InsertMember>): Promise<Member | undefined>;
  deleteMember(id: number): Promise<boolean>;
  
  // Announcement operations
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Event operations
  getAllEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Transaction operations
  getAllTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  
  // Contact Message operations
  getAllContactMessages(): Promise<ContactMessage[]>;
  getContactMessage(id: number): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  deleteContactMessage(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private members: Map<number, Member>;
  private announcements: Map<number, Announcement>;
  private events: Map<number, Event>;
  private transactions: Map<number, Transaction>;
  private contactMessages: Map<number, ContactMessage>;
  
  private currentUserId: number;
  private currentMemberId: number;
  private currentAnnouncementId: number;
  private currentEventId: number;
  private currentTransactionId: number;
  private currentContactMessageId: number;

  constructor() {
    this.users = new Map();
    this.members = new Map();
    this.announcements = new Map();
    this.events = new Map();
    this.transactions = new Map();
    this.contactMessages = new Map();
    
    this.currentUserId = 1;
    this.currentMemberId = 1;
    this.currentAnnouncementId = 1;
    this.currentEventId = 1;
    this.currentTransactionId = 1;
    this.currentContactMessageId = 1;

    // Initialize with sample data
    this.initSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Member operations
  async getAllMembers(): Promise<Member[]> {
    return Array.from(this.members.values());
  }

  async getMember(id: number): Promise<Member | undefined> {
    return this.members.get(id);
  }

  async getMemberByNIM(nim: string): Promise<Member | undefined> {
    return Array.from(this.members.values()).find(
      (member) => member.nim === nim,
    );
  }

  async createMember(insertMember: InsertMember): Promise<Member> {
    const id = this.currentMemberId++;
    const member: Member = { ...insertMember, id };
    this.members.set(id, member);
    return member;
  }

  async updateMember(id: number, memberUpdate: Partial<InsertMember>): Promise<Member | undefined> {
    const member = this.members.get(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...memberUpdate };
    this.members.set(id, updatedMember);
    return updatedMember;
  }

  async deleteMember(id: number): Promise<boolean> {
    return this.members.delete(id);
  }

  // Announcement operations
  async getAllAnnouncements(): Promise<Announcement[]> {
    return Array.from(this.announcements.values());
  }

  async getAnnouncement(id: number): Promise<Announcement | undefined> {
    return this.announcements.get(id);
  }

  async createAnnouncement(insertAnnouncement: InsertAnnouncement): Promise<Announcement> {
    const id = this.currentAnnouncementId++;
    const announcement: Announcement = { ...insertAnnouncement, id };
    this.announcements.set(id, announcement);
    return announcement;
  }

  async updateAnnouncement(id: number, announcementUpdate: Partial<InsertAnnouncement>): Promise<Announcement | undefined> {
    const announcement = this.announcements.get(id);
    if (!announcement) return undefined;
    
    const updatedAnnouncement = { ...announcement, ...announcementUpdate };
    this.announcements.set(id, updatedAnnouncement);
    return updatedAnnouncement;
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcements.delete(id);
  }

  // Event operations
  async getAllEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentEventId++;
    const event: Event = { ...insertEvent, id };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, eventUpdate: Partial<InsertEvent>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    
    const updatedEvent = { ...event, ...eventUpdate };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Transaction operations
  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = { ...insertTransaction, id };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, transactionUpdate: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...transactionUpdate };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteTransaction(id: number): Promise<boolean> {
    return this.transactions.delete(id);
  }

  // Contact Message operations
  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }

  async getContactMessage(id: number): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentContactMessageId++;
    const message: ContactMessage = { ...insertMessage, id, date: new Date() };
    this.contactMessages.set(id, message);
    return message;
  }

  async deleteContactMessage(id: number): Promise<boolean> {
    return this.contactMessages.delete(id);
  }

  // Initialize with sample data
  private initSampleData() {
    // Core members
    this.createMember({
      name: "Ahmad Rizky",
      nim: "CS2023001",
      email: "ahmad.rizky@example.com",
      role: "president",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    });
    
    this.createMember({
      name: "Siti Rahma",
      nim: "CS2023002",
      email: "siti.rahma@example.com",
      role: "secretary",
      photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    });
    
    this.createMember({
      name: "Budi Santoso",
      nim: "CS2023003",
      email: "budi.santoso@example.com",
      role: "treasurer",
      photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    });
    
    // Regular members
    const regularMembers = [
      { name: "Dian Permata", nim: "CS2023004", email: "dian.p@example.com", photoUrl: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Ratna Sari", nim: "CS2023005", email: "ratna.s@example.com", photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Hadi Purnomo", nim: "CS2023006", email: "hadi.p@example.com", photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Eka Putra", nim: "CS2023007", email: "eka.p@example.com", photoUrl: "https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Nina Wijaya", nim: "CS2023008", email: "nina.w@example.com", photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
      { name: "Laila Putri", nim: "CS2023009", email: "laila.p@example.com", photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
    ];
    
    for (const member of regularMembers) {
      this.createMember({
        ...member,
        role: "member"
      });
    }
    
    // Add more members to reach a total of 41 (3 core + 38 regular)
    for (let i = 10; i <= 41; i++) {
      this.createMember({
        name: `Student ${i}`,
        nim: `CS2023${i.toString().padStart(3, '0')}`,
        email: `student${i}@example.com`,
        role: "member",
        photoUrl: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i % 12}.jpg`
      });
    }
    
    // Announcements
    this.createAnnouncement({
      title: "Midterm Exam Schedule Released",
      content: "The schedule for the midterm exams has been released. Please check the details below.",
      date: new Date('2023-09-15'),
      category: "academic",
      author: "Siti Rahma"
    });
    
    this.createAnnouncement({
      title: "Class Photo Day",
      content: "We will be taking class photos on September 20. Please wear your formal attire.",
      date: new Date('2023-09-10'),
      category: "event",
      author: "Ahmad Rizky"
    });
    
    this.createAnnouncement({
      title: "Project Submission Deadline",
      content: "The deadline for submitting your group projects is September 25.",
      date: new Date('2023-09-05'),
      category: "deadline",
      author: "Prof. Johnson"
    });
    
    this.createAnnouncement({
      title: "Monthly Dues Reminder",
      content: "This is a reminder to pay your monthly class dues by September 5.",
      date: new Date('2023-09-01'),
      category: "financial",
      author: "Budi Santoso"
    });
    
    // Events
    this.createEvent({
      title: "Database Design Workshop",
      date: new Date('2023-09-20'),
      time: "14:00 - 16:00",
      location: "Lab 302",
      description: "A workshop on database design principles and practices."
    });
    
    this.createEvent({
      title: "Group Project Meeting",
      date: new Date('2023-09-25'),
      time: "10:00 - 12:00",
      location: "Study Room B",
      description: "Meeting to discuss progress on group projects."
    });
    
    this.createEvent({
      title: "Midterm Exam",
      date: new Date('2023-10-05'),
      time: "09:00 - 11:00",
      location: "Lecture Hall 101",
      description: "Midterm examination for all subjects."
    });
    
    // Transactions
    this.createTransaction({
      description: "Monthly Dues Collection",
      amount: 1900000,
      date: new Date('2023-09-01'),
      type: "income",
      category: "dues"
    });
    
    this.createTransaction({
      description: "Study Materials",
      amount: 450000,
      date: new Date('2023-08-25'),
      type: "expense",
      category: "study"
    });
    
    this.createTransaction({
      description: "Class Event Supplies",
      amount: 350000,
      date: new Date('2023-08-15'),
      type: "expense",
      category: "supplies"
    });
    
    this.createTransaction({
      description: "Fundraising Event",
      amount: 750000,
      date: new Date('2023-08-10'),
      type: "income",
      category: "event"
    });
  }
}

export const storage = new MemStorage();
