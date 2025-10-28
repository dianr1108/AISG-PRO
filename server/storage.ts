import { eq, desc } from "drizzle-orm";
import { db } from "./db";
import { type User, type InsertUser, type Audit, type InsertAudit, type ChatMessage, type InsertChatMessage, users, audits, chatMessages } from "@shared/schema";
import { randomUUID } from "crypto";
import { processAuditData } from "./business-logic";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Audit operations
  createAudit(data: InsertAudit): Promise<Audit>;
  getAudit(id: string): Promise<Audit | undefined>;
  getAllAudits(): Promise<Audit[]>;
  getAuditsByName(nama: string): Promise<Audit[]>;
  deleteAudit(id: string): Promise<void>;
  
  // Chat operations
  createChatMessage(data: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(auditId: string): Promise<ChatMessage[]>;
  deleteChatHistory(auditId: string): Promise<void>;
}

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  // Audit methods
  async createAudit(data: InsertAudit): Promise<Audit> {
    // Process audit data to calculate zones, profile, magic section, etc.
    const processed = processAuditData(data);
    
    const auditData = {
      ...data,
      ...processed
    };
    
    const result = await db.insert(audits).values(auditData).returning();
    return result[0];
  }

  async getAudit(id: string): Promise<Audit | undefined> {
    const result = await db.select().from(audits).where(eq(audits.id, id)).limit(1);
    return result[0];
  }

  async getAllAudits(): Promise<Audit[]> {
    const result = await db.select().from(audits).orderBy(desc(audits.createdAt));
    return result;
  }

  async getAuditsByName(nama: string): Promise<Audit[]> {
    const result = await db
      .select()
      .from(audits)
      .where(eq(audits.nama, nama))
      .orderBy(desc(audits.createdAt));
    return result;
  }

  async deleteAudit(id: string): Promise<void> {
    await db.delete(chatMessages).where(eq(chatMessages.auditId, id));
    await db.delete(audits).where(eq(audits.id, id));
  }

  // Chat methods
  async createChatMessage(data: InsertChatMessage): Promise<ChatMessage> {
    const result = await db.insert(chatMessages).values(data).returning();
    return result[0];
  }

  async getChatHistory(auditId: string): Promise<ChatMessage[]> {
    const result = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.auditId, auditId))
      .orderBy(chatMessages.createdAt);
    return result;
  }

  async deleteChatHistory(auditId: string): Promise<void> {
    await db.delete(chatMessages).where(eq(chatMessages.auditId, auditId));
  }
}

export const storage = new DbStorage();
