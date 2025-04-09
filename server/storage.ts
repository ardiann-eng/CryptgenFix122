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
        name: "Ardiyansa",
        studentId: "230907501042",
        role: "Class President",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Siti Nurhaliza Adhani Asrullah",
        studentId: "230907501039",
        role: "Secretary",
        photoUrl: "https://images.unsplash.com/photo-1580894732930-0babd100d356?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Nur Aisyah",
        studentId: "230907500021",
        role: "Treasurer",
        photoUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      }
    ];
    
    const regularMembers = [
      {
        name: "Jesika Palepong",
        studentId: "230907500023",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Kayla Nethania Said",
        studentId: "230907500024",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1592124549776-a7f0cc973b24?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Umniatul Ula'",
        studentId: "230907500025",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Iit Febrianty Irwan Putri",
        studentId: "230907500026",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1596815064285-45ed8a9c0463?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Nur Akma",
        studentId: "230907500027",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1601288496920-b6154fe3626a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Amalia Nurul Jannah",
        studentId: "230907500028",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1610276198568-eb6d0ff53e48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Jelsi NASA",
        studentId: "230907500029",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Veniliani Sangngin",
        studentId: "230907500030",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Andi Ashraf Hak Bisyu",
        studentId: "230907501026",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Muh Luthfi Mauludi Lukman",
        studentId: "230907501028",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1508341591423-4347099e1f19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Ahmad Aqiil Farras",
        studentId: "230907501033",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Muthiah Adibah",
        studentId: "230907501034",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1591084728795-1149f32d9866?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Made Rizal Aprilian",
        studentId: "230907501035",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Afifah Qonita Muharani",
        studentId: "230907501036",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1611432579699-484f7990b127?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Muhammad Wildan Rusly",
        studentId: "230907501037",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1557862921-37829c790f19?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Nisfalah Zahrah Rahmadani",
        studentId: "230907501038",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1598550473802-d876d8ebd3ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Husayn Khalilurrahim Irfan",
        studentId: "230907501040",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Mohammad Afiat Wargabojo",
        studentId: "230907501041",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Hengki Setiawan",
        studentId: "230907501043",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Shasy Due Mahardika",
        studentId: "230907501044",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Muhammad Afiq Syukri",
        studentId: "230907501045",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Nicholas Jecson",
        studentId: "230907501047",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Nigel Trifosa Sarapang Allorante",
        studentId: "230907501048",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Muhammad Naufal Faiq",
        studentId: "230907502017",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Zahra Meifta Amalia",
        studentId: "230907502029",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Nia Ratdani",
        studentId: "230907502030",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1558898479-33c0b87c56e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Muh Taufik H",
        studentId: "230907502031",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1499887142886-791eca5918cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Arnisyah",
        studentId: "230907502032",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1586473219010-2ffc57b0d282?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Ahmad Zaki Al Afif",
        studentId: "230907502033",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Rayhan Kutana",
        studentId: "230907502034",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1495216875107-c6c043eb703f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Zulfadly Syahpahlevi Manguteren",
        studentId: "230907502035",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Ahmad Arif Hidayat",
        studentId: "230907502036",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1500048993953-d23a436266cf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Fadyah Putri Ameliah",
        studentId: "230907502037",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Kauzaki",
        studentId: "230907502038",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Arham Faturrahman",
        studentId: "230907502039",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Al Fira Damayanti",
        studentId: "230907502040",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1631947430066-48c30d0c3365?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
      },
      {
        name: "Raisyah Alief Kazraj",
        studentId: "230907502041",
        role: "member",
        photoUrl: "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
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
        postedBy: "Siti Nurhaliza Adhani Asrullah"
      },
      {
        date: new Date("2023-10-10"),
        title: "Group Project Assignment",
        description: "Instructions for the upcoming group project",
        category: "Assignment",
        postedBy: "Ardiyansa"
      },
      {
        date: new Date("2023-10-05"),
        title: "Class Trip Registration",
        description: "Sign up for the upcoming educational trip",
        category: "Event",
        postedBy: "Nur Aisyah"
      },
      {
        date: new Date("2023-09-28"),
        title: "Guest Lecture Announcement",
        description: "Information about the upcoming guest speaker",
        category: "Lecture",
        postedBy: "Siti Nurhaliza Adhani Asrullah"
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
