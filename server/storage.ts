import { 
  users, 
  members, 
  announcements, 
  transactions, 
  type User, 
  type InsertUser, 
  type Member, 
  type InsertMember, 
  type Announcement, 
  type InsertAnnouncement, 
  type Transaction, 
  type InsertTransaction 
} from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Members
  getAllMembers(): Promise<Member[]>;
  getMember(id: number): Promise<Member | undefined>;
  getMemberByStudentId(studentId: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: number, member: Partial<InsertMember>): Promise<Member | undefined>;
  deleteMember(id: number): Promise<boolean>;
  
  // Announcements
  getAllAnnouncements(): Promise<Announcement[]>;
  getAnnouncement(id: number): Promise<Announcement | undefined>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  updateAnnouncement(id: number, announcement: Partial<InsertAnnouncement>): Promise<Announcement | undefined>;
  deleteAnnouncement(id: number): Promise<boolean>;
  
  // Transactions
  getAllTransactions(): Promise<Transaction[]>;
  getTransaction(id: number): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: number): Promise<boolean>;
  getTransactionSummary(): Promise<{ totalIncome: number; totalExpense: number; balance: number; }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private members: Map<number, Member>;
  private announcements: Map<number, Announcement>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentMemberId: number;
  private currentAnnouncementId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.members = new Map();
    this.announcements = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentMemberId = 1;
    this.currentAnnouncementId = 1;
    this.currentTransactionId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User methods
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
  
  // Member methods
  async getAllMembers(): Promise<Member[]> {
    return Array.from(this.members.values());
  }
  
  async getMember(id: number): Promise<Member | undefined> {
    return this.members.get(id);
  }
  
  async getMemberByStudentId(studentId: string): Promise<Member | undefined> {
    return Array.from(this.members.values()).find(
      (member) => member.studentId === studentId,
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
  
  // Announcement methods
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
  
  // Transaction methods
  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }
  
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: new Date()
    };
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
  
  async getTransactionSummary(): Promise<{ totalIncome: number; totalExpense: number; balance: number; }> {
    const transactions = Array.from(this.transactions.values());
    
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
      
    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    };
  }
  
  // Helper method to initialize data
  private initializeData() {
    // Create members
    const coreMembers = [
      {
        name: "Ahmad Fauzan",
        studentId: "2201001234",
        role: "Class President",
        photoUrl: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Siti Aisyah",
        studentId: "2201001235",
        role: "Secretary",
        photoUrl: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Budi Santoso",
        studentId: "2201001236",
        role: "Treasurer",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ];
    
    const regularMembers = [
      {
        name: "Dani Pratama",
        studentId: "2201001237",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Dewi Anggraini",
        studentId: "2201001238",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Eko Kurniawan",
        studentId: "2201001239",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Fina Yulianti",
        studentId: "2201001240",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Galih Ramadhan",
        studentId: "2201001241",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Hana Putri",
        studentId: "2201001242",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ];
    
    [...coreMembers, ...regularMembers].forEach(member => {
      this.createMember(member);
    });
    
    // Create announcements
    const sampleAnnouncements = [
      {
        date: new Date("2023-10-15"),
        title: "Mid-Term Exam Schedule",
        description: "Details about the upcoming mid-term examinations",
        category: "Important",
        postedBy: "Siti Aisyah"
      },
      {
        date: new Date("2023-10-10"),
        title: "Group Project Assignment",
        description: "Instructions for the upcoming group project",
        category: "Assignment",
        postedBy: "Ahmad Fauzan"
      },
      {
        date: new Date("2023-10-05"),
        title: "Class Trip Registration",
        description: "Sign up for the upcoming educational trip",
        category: "Event",
        postedBy: "Budi Santoso"
      },
      {
        date: new Date("2023-09-28"),
        title: "Guest Lecture Announcement",
        description: "Information about the upcoming guest speaker",
        category: "Lecture",
        postedBy: "Siti Aisyah"
      }
    ];
    
    sampleAnnouncements.forEach(announcement => {
      this.createAnnouncement(announcement);
    });
    
    // Create transactions
    const sampleTransactions = [
      {
        date: new Date("2023-10-15"),
        description: "Monthly Class Dues",
        category: "dues",
        amount: 750000,
        type: "income",
        status: "completed"
      },
      {
        date: new Date("2023-10-12"),
        description: "Study Materials Printing",
        category: "printing",
        amount: 250000,
        type: "expense",
        status: "completed"
      },
      {
        date: new Date("2023-10-05"),
        description: "Class Event Sponsorship",
        category: "sponsorship",
        amount: 1500000,
        type: "income",
        status: "completed"
      },
      {
        date: new Date("2023-09-28"),
        description: "Guest Speaker Accommodation",
        category: "events",
        amount: 500000,
        type: "expense",
        status: "completed"
      },
      {
        date: new Date("2023-09-20"),
        description: "Class Party Supplies",
        category: "supplies",
        amount: 350000,
        type: "expense",
        status: "completed"
      }
    ];
    
    sampleTransactions.forEach(transaction => {
      this.createTransaction(transaction);
    });
  }
}

export const storage = new MemStorage();
