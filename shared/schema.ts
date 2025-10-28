import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Branches table
export const branches = pgTable("branches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  region: text("region"),
});

export const insertBranchSchema = createInsertSchema(branches).omit({ id: true });
export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type Branch = typeof branches.$inferSelect;

// Audits table
export const audits = pgTable("audits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Identity
  nama: text("nama").notNull(),
  jabatan: text("jabatan").notNull(),
  cabang: text("cabang").notNull(),
  tanggalLahir: text("tanggal_lahir").notNull(), // DD-MM-YYYY for zodiac
  
  // Quarterly Performance Metrics - Team (Margin Tim & NA Tim in USD)
  marginTimQ1: integer("margin_tim_q1").notNull().default(0), // Jan-Mar
  marginTimQ2: integer("margin_tim_q2").notNull().default(0), // Apr-Jun
  marginTimQ3: integer("margin_tim_q3").notNull().default(0), // Jul-Sep
  marginTimQ4: integer("margin_tim_q4").notNull().default(0), // Oct-Dec
  
  naTimQ1: integer("na_tim_q1").notNull().default(0),
  naTimQ2: integer("na_tim_q2").notNull().default(0),
  naTimQ3: integer("na_tim_q3").notNull().default(0),
  naTimQ4: integer("na_tim_q4").notNull().default(0),
  
  // Quarterly Performance Metrics - Personal (Margin Pribadi & Nasabah Pribadi)
  marginPribadiQ1: integer("margin_pribadi_q1").notNull().default(0),
  marginPribadiQ2: integer("margin_pribadi_q2").notNull().default(0),
  marginPribadiQ3: integer("margin_pribadi_q3").notNull().default(0),
  marginPribadiQ4: integer("margin_pribadi_q4").notNull().default(0),
  
  nasabahPribadiQ1: integer("nasabah_pribadi_q1").notNull().default(0),
  nasabahPribadiQ2: integer("nasabah_pribadi_q2").notNull().default(0),
  nasabahPribadiQ3: integer("nasabah_pribadi_q3").notNull().default(0),
  nasabahPribadiQ4: integer("nasabah_pribadi_q4").notNull().default(0),
  
  // Team Structure (Under Langsung Aktif) - snapshot saat audit
  jumlahBC: integer("jumlah_bc").notNull().default(0),
  jumlahSBC: integer("jumlah_sbc").notNull().default(0),
  jumlahBsM: integer("jumlah_bsm").notNull().default(0),
  jumlahSBM: integer("jumlah_sbm").notNull().default(0),
  jumlahEM: integer("jumlah_em").notNull().default(0),
  jumlahSEM: integer("jumlah_sem").notNull().default(0),
  jumlahVBM: integer("jumlah_vbm").notNull().default(0),
  
  // 18 Pilar Scoring (Scale 1-5, Self vs Reality)
  pillarAnswers: jsonb("pillar_answers").notNull().$type<Array<{
    pillarId: number;
    pillarName: string;
    selfScore: number; // 1-5, user claim
    realityScore: number; // 1-5, calculated by engine
    gap: number; // selfScore - realityScore
    insight: string; // koreksi profesional per pilar
  }>>(),
  
  // Calculated Results - Total Scores
  totalSelfScore: integer("total_self_score").notNull(), // 0-90
  totalRealityScore: integer("total_reality_score").notNull(), // 0-90
  totalGap: integer("total_gap").notNull(), // total self - total reality
  
  // Results - Zona (based on Reality Score)
  zonaKinerja: text("zona_kinerja").notNull(), // success, warning, critical
  zonaPerilaku: text("zona_perilaku").notNull(), // success, warning, critical
  zonaFinal: text("zona_final").notNull(), // hijau (75-90), kuning (51-74), merah (0-50)
  
  // Results - Profile Classification
  profil: text("profil").notNull(), // Leader, Visionary, Performer, At-Risk
  
  // Results - Audit Report (12 Sections)
  auditReport: jsonb("audit_report").notNull().$type<{
    executiveSummary: string;
    insightLengkap: string;
    swotAnalysis: {
      strength: string[];
      weakness: string[];
      opportunity: string[];
      threat: string[];
    };
    coachingPoints: string[];
    actionPlan: Array<{
      periode: string; // "30 Hari" | "60 Hari" | "90 Hari"
      target: string;
      aktivitas: string;
      pic: string;
      output: string;
    }>;
    progressKuartal: {
      kuartalBerjalan: string; // "Q1" | "Q2" | "Q3" | "Q4"
      sisaHari: number;
      targetMargin: number;
      realisasiMargin: number;
      percentageMargin: number;
      targetNA: number;
      realisasiNA: number;
      percentageNA: number;
      catatan: string;
    };
    ews: Array<{
      faktor: string;
      indikator: string;
      risiko: string;
      saranCepat: string;
    }>;
    kesesuaianVisi: {
      status: "Align" | "Perlu Penyesuaian" | "Belum Sesuai";
      narasi: string;
    };
  }>(),
  
  // Results - ProDem Recommendation
  prodemRekomendasi: jsonb("prodem_rekomendasi").notNull().$type<{
    currentLevel: string;
    recommendation: "Promosi" | "Dipertahankan" | "Pembinaan" | "Demosi";
    nextLevel?: string;
    reason: string;
    konsekuensi: string;
    nextStep: string;
    strategyType: "Save by Margin" | "Save by Staff" | "N/A";
    requirements: Array<{
      label: string;
      value: string;
      met: boolean;
    }>;
  }>(),
  
  // Results - Magic Section
  magicSection: jsonb("magic_section").notNull().$type<{
    julukan: string;
    narasi: string; // 2-3 paragraf bombastis
    zodiak: string;
    generasi: "Gen Z" | "Millennial" | "Gen X" | "Boomer";
    zodiakBooster: string; // narasi lebay sesuai generasi
    coachingHighlight: string;
    callToAction: string;
    quote: string;
  }>(),
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAuditSchema = createInsertSchema(audits, {
  // Quarterly margins - Team
  marginTimQ1: z.number().int().nonnegative(),
  marginTimQ2: z.number().int().nonnegative(),
  marginTimQ3: z.number().int().nonnegative(),
  marginTimQ4: z.number().int().nonnegative(),
  
  // Quarterly NA - Team
  naTimQ1: z.number().int().nonnegative(),
  naTimQ2: z.number().int().nonnegative(),
  naTimQ3: z.number().int().nonnegative(),
  naTimQ4: z.number().int().nonnegative(),
  
  // Quarterly margins - Personal
  marginPribadiQ1: z.number().int().nonnegative(),
  marginPribadiQ2: z.number().int().nonnegative(),
  marginPribadiQ3: z.number().int().nonnegative(),
  marginPribadiQ4: z.number().int().nonnegative(),
  
  // Quarterly Nasabah - Personal
  nasabahPribadiQ1: z.number().int().nonnegative(),
  nasabahPribadiQ2: z.number().int().nonnegative(),
  nasabahPribadiQ3: z.number().int().nonnegative(),
  nasabahPribadiQ4: z.number().int().nonnegative(),
  
  // Team structure
  jumlahBC: z.number().int().nonnegative(),
  jumlahSBC: z.number().int().nonnegative(),
  jumlahBsM: z.number().int().nonnegative(),
  jumlahSBM: z.number().int().nonnegative(),
  jumlahEM: z.number().int().nonnegative(),
  jumlahSEM: z.number().int().nonnegative(),
  jumlahVBM: z.number().int().nonnegative(),
  
  tanggalLahir: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Format harus DD-MM-YYYY"),
  
  // For INPUT: only pillarId and selfScore (backend adds the rest)
  pillarAnswers: z.array(z.object({
    pillarId: z.number().int().min(1).max(18),
    selfScore: z.number().int().min(1).max(5),
  })).length(18),
}).omit({ 
  id: true, 
  createdAt: true,
  totalSelfScore: true,
  totalRealityScore: true,
  totalGap: true,
  zonaKinerja: true,
  zonaPerilaku: true,
  zonaFinal: true,
  profil: true,
  auditReport: true,
  magicSection: true,
  prodemRekomendasi: true
});

export type InsertAudit = z.infer<typeof insertAuditSchema>;
export type Audit = typeof audits.$inferSelect;

// Chat Messages table
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  auditId: varchar("audit_id").notNull().references(() => audits.id, { onDelete: 'cascade' }),
  role: text("role").notNull(), // "user" | "assistant" | "system"
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ 
  id: true, 
  createdAt: true 
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
