import { InsertAudit } from "@shared/schema";

// ============================================
// CONSTANTS & DATA
// ============================================

// 18 Pilar Framework
const PILAR_NAMES = [
  "Kemampuan Mencari Calon Nasabah",
  "Kemampuan Menutup Penjualan",
  "Kemampuan Menjaga Nasabah Aktif",
  "Kemampuan Mencetak Tim Baru (Kaderisasi)",
  "Pencapaian Target Penjualan",
  "Penguasaan Pasar Wilayah",
  "Kelengkapan Struktur Tim",
  "Jumlah Jalur Aktif",
  "Produktivitas Pimpinan",
  "Kesiapan Regenerasi",
  "Kerja Sama Antar Tim",
  "Kemampuan Beradaptasi",
  "Disiplin & Konsistensi Kerja",
  "Semangat & Motivasi Tim",
  "Inovasi Cara Kerja",
  "Pelatihan & Pengembangan Keterampilan",
  "Kepuasan Nasabah",
  "Pemahaman Pasar Lokal"
];

// Pilar kritis (permanent - always monitored)
const CRITICAL_PILLARS = [4, 9, 13]; // P4 Kaderisasi, P9 Produktivitas Pimpinan, P13 Disiplin

// Motivational quotes
const QUOTES = [
  "The function of leadership is to produce more leaders, not more followers. – Ralph Nader",
  "Chase the vision, not the money; the money will end up following you. – Tony Hsieh",
  "The key to successful leadership today is influence, not authority. – Ken Blanchard",
  "Success is not final; failure is not fatal: It is the courage to continue that counts. – Winston Churchill",
  "If you don't build your dream, someone will hire you to build theirs. – Tony Gaskins",
  "Leadership is the capacity to translate vision into reality. – Warren Bennis",
  "The best investment you can make is in yourself. – Warren Buffett",
  "Dream big. Start small. Act now. – Robin Sharma",
  "Whether you think you can or you think you can't, you're right. – Henry Ford",
  "It always seems impossible until it's done. – Nelson Mandela"
];

// Zodiac data with generation-specific boosters
const ZODIAC_BOOSTERS: Record<string, { name: string; genZ: string; millennial: string }> = {
  "Capricorn": {
    name: "Capricorn ♑",
    genZ: "Capricorn, lu emang gaspol! Energi lu meledak, tapi pastikan diarahkan biar hasilnya maksimal.",
    millennial: "Karakter Capricorn yang kuat bisa jadi fondasi solid buat kaderisasi jangka panjang."
  },
  "Aquarius": {
    name: "Aquarius ♒",
    genZ: "Semangat lu bikin tim kebawa vibes. Jangan kendor, karena lu role model!",
    millennial: "Sebagai Aquarius, lu bisa jadi kompas buat tim. Jangan ragu untuk arahkan mereka."
  },
  "Pisces": {
    name: "Pisces ♓",
    genZ: "Jangan takut gagal, Pisces. Justru dari gagal itu lu belajar cara menang lebih cepat.",
    millennial: "Kekuatan Pisces ada pada konsistensi. Ingat, hasil besar lahir dari kebiasaan kecil."
  },
  "Aries": {
    name: "Aries ♈",
    genZ: "Aries, lu emang gaspol! Energi lu meledak, tapi pastikan diarahkan biar hasilnya maksimal.",
    millennial: "Karakter Aries yang kuat bisa jadi fondasi solid buat kaderisasi jangka panjang."
  },
  "Taurus": {
    name: "Taurus ♉",
    genZ: "Taurus itu bukan cuma kerja keras, tapi kerja cerdas plus konsisten. Itu kuncinya!",
    millennial: "Sebagai Taurus, lu dilahirkan untuk memimpin dengan keberanian. Pastikan visi lu jelas."
  },
  "Gemini": {
    name: "Gemini ♊",
    genZ: "Semangat lu bikin tim kebawa vibes. Jangan kendor, karena lu role model!",
    millennial: "Karakter Gemini yang kuat bisa jadi fondasi solid buat kaderisasi jangka panjang."
  },
  "Cancer": {
    name: "Cancer ♋",
    genZ: "Jangan takut gagal, Cancer. Justru dari gagal itu lu belajar cara menang lebih cepat.",
    millennial: "Sebagai Cancer, lu dilahirkan untuk memimpin dengan keberanian. Pastikan visi lu jelas."
  },
  "Leo": {
    name: "Leo ♌",
    genZ: "Kegigihan lu bikin orang lain minder. Pakai itu buat bikin impact positif di tim.",
    millennial: "Sebagai Leo, lu bisa jadi kompas buat tim. Jangan ragu untuk arahkan mereka."
  },
  "Virgo": {
    name: "Virgo ♍",
    genZ: "Virgo, lu emang gaspol! Energi lu meledak, tapi pastikan diarahkan biar hasilnya maksimal.",
    millennial: "Karakter Virgo yang kuat bisa jadi fondasi solid buat kaderisasi jangka panjang."
  },
  "Libra": {
    name: "Libra ♎",
    genZ: "Kalau ada yang meremehkan Libra, biarin aja. Fokus buktiin lewat hasil!",
    millennial: "Sebagai Libra, lu dilahirkan untuk memimpin dengan keberanian. Pastikan visi lu jelas."
  },
  "Scorpio": {
    name: "Scorpio ♏",
    genZ: "Kegigihan lu bikin orang lain minder. Pakai itu buat bikin impact positif di tim.",
    millennial: "Gunakan intuisi Scorpio untuk baca momentum. Jangan asal gas, tapi gas di saat yang tepat."
  },
  "Sagittarius": {
    name: "Sagittarius ♐",
    genZ: "Jangan takut gagal, Sagittarius. Justru dari gagal itu lu belajar cara menang lebih cepat.",
    millennial: "Karakter Sagittarius yang kuat bisa jadi fondasi solid buat kaderisasi jangka panjang."
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCurrentQuarter(date: Date = new Date()): { quarter: string; quarterNum: number; sisaHari: number } {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  let quarterNum: number;
  let endMonth: number;
  
  if (month >= 1 && month <= 3) {
    quarterNum = 1;
    endMonth = 3;
  } else if (month >= 4 && month <= 6) {
    quarterNum = 2;
    endMonth = 6;
  } else if (month >= 7 && month <= 9) {
    quarterNum = 3;
    endMonth = 9;
  } else {
    quarterNum = 4;
    endMonth = 12;
  }
  
  const quarterEndDate = new Date(year, endMonth, 0); // Last day of end month
  const today = new Date();
  const diffTime = quarterEndDate.getTime() - today.getTime();
  const sisaHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return {
    quarter: `Q${quarterNum}`,
    quarterNum,
    sisaHari: Math.max(0, sisaHari)
  };
}

function getGenerationFromBirthdate(tanggalLahir: string): "Gen Z" | "Millennial" | "Gen X" | "Boomer" {
  const [, , year] = tanggalLahir.split("-").map(Number);
  
  if (year >= 1997) return "Gen Z";
  if (year >= 1981) return "Millennial";
  if (year >= 1965) return "Gen X";
  return "Boomer";
}

function getZodiacSign(tanggalLahir: string): string {
  const [day, month] = tanggalLahir.split("-").map(Number);
  
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  return "Capricorn";
}

// ============================================
// REALITY SCORE CALCULATOR
// ============================================

function calculateRealityScores(data: InsertAudit): Array<{
  pillarId: number;
  pillarName: string;
  selfScore: number;
  realityScore: number;
  gap: number;
  insight: string;
}> {
  const { quarterNum } = getCurrentQuarter();
  
  // Get current quarter data
  const marginCurrentQ = [data.marginTimQ1, data.marginTimQ2, data.marginTimQ3, data.marginTimQ4][quarterNum - 1];
  const naCurrentQ = [data.naTimQ1, data.naTimQ2, data.naTimQ3, data.naTimQ4][quarterNum - 1];
  
  const totalTeam = data.jumlahBC + data.jumlahSBC + data.jumlahBsM + data.jumlahSBM + data.jumlahEM + data.jumlahSEM + data.jumlahVBM;
  
  return data.pillarAnswers.map(p => {
    let realityScore = p.selfScore; // Default: trust self-assessment
    let insight = "";
    
    // P1: Kemampuan Mencari Calon Nasabah - based on NA
    if (p.pillarId === 1) {
      if (naCurrentQ >= 3) realityScore = 5;
      else if (naCurrentQ === 2) realityScore = 4;
      else if (naCurrentQ === 1) realityScore = 3;
      else realityScore = 2;
      
      insight = naCurrentQ > 0 
        ? `NA kuartal ini: ${naCurrentQ}. ${realityScore >= 4 ? "Prospecting bagus!" : "Perlu lebih aktif mencari calon nasabah."}`
        : "Belum ada NA di kuartal ini. Focus prospecting!";
    }
    
    // P4: Kaderisasi - based on team structure
    else if (p.pillarId === 4) {
      const subordinates = data.jabatan.includes("BC") ? 0 : totalTeam;
      if (subordinates >= 10) realityScore = 5;
      else if (subordinates >= 5) realityScore = 4;
      else if (subordinates >= 2) realityScore = 3;
      else if (subordinates === 1) realityScore = 2;
      else realityScore = 1;
      
      insight = subordinates > 0
        ? `Tim: ${subordinates} orang. ${realityScore >= 4 ? "Kaderisasi berjalan baik." : "Perlu lebih aktif mencetak kader baru."}`
        : "Belum punya tim. Kaderisasi harus jadi prioritas utama!";
    }
    
    // P5: Pencapaian Target - based on margin vs target
    else if (p.pillarId === 5) {
      const targetMargin = getTargetMarginByLevel(data.jabatan);
      const achievement = targetMargin > 0 ? (marginCurrentQ / targetMargin) * 100 : 0;
      
      if (achievement >= 100) realityScore = 5;
      else if (achievement >= 80) realityScore = 4;
      else if (achievement >= 60) realityScore = 3;
      else if (achievement >= 40) realityScore = 2;
      else realityScore = 1;
      
      insight = `Margin: $${marginCurrentQ.toLocaleString()} (${Math.round(achievement)}% dari target). ${realityScore >= 4 ? "Target terpenuhi!" : "Perlu boost closing!"}`;
    }
    
    // P7: Kelengkapan Struktur Tim
    else if (p.pillarId === 7) {
      const expectedTeam = getExpectedTeamByLevel(data.jabatan);
      const completeness = expectedTeam > 0 ? (totalTeam / expectedTeam) * 100 : 100;
      
      if (completeness >= 100) realityScore = 5;
      else if (completeness >= 75) realityScore = 4;
      else if (completeness >= 50) realityScore = 3;
      else if (completeness >= 25) realityScore = 2;
      else realityScore = 1;
      
      insight = `Struktur tim: ${Math.round(completeness)}% lengkap. ${realityScore >= 4 ? "Struktur solid!" : "Perlu lengkapi struktur tim."}`;
    }
    
    // P9: Produktivitas Pimpinan - based on margin per team member
    else if (p.pillarId === 9) {
      const marginPerMember = totalTeam > 0 ? marginCurrentQ / totalTeam : marginCurrentQ;
      
      if (marginPerMember >= 20000) realityScore = 5;
      else if (marginPerMember >= 15000) realityScore = 4;
      else if (marginPerMember >= 10000) realityScore = 3;
      else if (marginPerMember >= 5000) realityScore = 2;
      else realityScore = 1;
      
      insight = totalTeam > 0
        ? `Produktivitas: $${Math.round(marginPerMember).toLocaleString()}/orang. ${realityScore >= 4 ? "Tim produktif!" : "Perlu tingkatkan output per member."}`
        : "Belum punya tim untuk diukur produktivitasnya.";
    }
    
    // P13: Disiplin & Konsistensi - based on quarterly consistency
    else if (p.pillarId === 13) {
      const margins = [data.marginTimQ1, data.marginTimQ2, data.marginTimQ3, data.marginTimQ4];
      const nonZeroMargins = margins.filter(m => m > 0);
      
      if (nonZeroMargins.length >= 4) realityScore = 5;
      else if (nonZeroMargins.length === 3) realityScore = 4;
      else if (nonZeroMargins.length === 2) realityScore = 3;
      else if (nonZeroMargins.length === 1) realityScore = 2;
      else realityScore = 1;
      
      insight = `Konsistensi: ${nonZeroMargins.length}/4 kuartal aktif. ${realityScore >= 4 ? "Disiplin terjaga!" : "Perlu lebih konsisten setiap kuartal."}`;
    }
    
    // Other pillars: trust self-assessment but add insight
    else {
      const gap = p.selfScore - realityScore;
      if (gap > 1) {
        insight = "Self-assessment cukup realistis. Pertahankan kejujuran dalam evaluasi diri.";
      } else if (gap < -1) {
        insight = "Kemungkinan terlalu rendah menilai diri. Percaya pada kemampuan sendiri!";
      } else {
        insight = p.selfScore >= 4 ? "Performa baik, pertahankan!" : "Ada ruang untuk improvement.";
      }
    }
    
    const gap = p.selfScore - realityScore;
    
    return {
      pillarId: p.pillarId,
      pillarName: PILAR_NAMES[p.pillarId - 1],
      selfScore: p.selfScore,
      realityScore,
      gap,
      insight
    };
  });
}

function getTargetMarginByLevel(jabatan: string): number {
  if (jabatan.includes("BC")) return 5000;
  if (jabatan.includes("SBC")) return 125000 / 4; // Quarterly
  if (jabatan.includes("BSM") || jabatan.includes("BsM")) return 200000 / 4;
  if (jabatan.includes("SBM")) return 300000 / 4;
  if (jabatan.includes("EM")) return 400000 / 4;
  if (jabatan.includes("SEM")) return 500000 / 4;
  if (jabatan.includes("VBM")) return 600000 / 4;
  return 10000;
}

function getExpectedTeamByLevel(jabatan: string): number {
  if (jabatan.includes("BC")) return 0;
  if (jabatan.includes("SBC")) return 3;
  if (jabatan.includes("BSM") || jabatan.includes("BsM")) return 10;
  if (jabatan.includes("SBM")) return 20;
  if (jabatan.includes("EM")) return 30;
  if (jabatan.includes("SEM")) return 40;
  if (jabatan.includes("VBM")) return 50;
  return 5;
}

// ============================================
// AUDIT REPORT GENERATOR (12 Sections)
// ============================================

export function processAuditData(data: InsertAudit) {
  // Calculate Reality Scores
  const pillarScores = calculateRealityScores(data);
  
  const totalSelfScore = pillarScores.reduce((sum, p) => sum + p.selfScore, 0);
  const totalRealityScore = pillarScores.reduce((sum, p) => sum + p.realityScore, 0);
  const totalGap = totalSelfScore - totalRealityScore;
  
  // Determine Zona Final (based on Reality Score, scale 0-90)
  let zonaFinal: "hijau" | "kuning" | "merah";
  if (totalRealityScore >= 75) zonaFinal = "hijau";
  else if (totalRealityScore >= 51) zonaFinal = "kuning";
  else zonaFinal = "merah";
  
  // Zona Kinerja & Perilaku (legacy compatibility)
  const zonaKinerja = zonaFinal === "hijau" ? "success" : zonaFinal === "kuning" ? "warning" : "critical";
  const zonaPerilaku = zonaFinal === "hijau" ? "success" : zonaFinal === "kuning" ? "warning" : "critical";
  
  // Profile Classification
  const profil = classifyProfile(totalRealityScore, pillarScores);
  
  // Current Quarter Info
  const quarterInfo = getCurrentQuarter();
  const { quarterNum } = quarterInfo;
  const marginCurrentQ = [data.marginTimQ1, data.marginTimQ2, data.marginTimQ3, data.marginTimQ4][quarterNum - 1];
  const naCurrentQ = [data.naTimQ1, data.naTimQ2, data.naTimQ3, data.naTimQ4][quarterNum - 1];
  
  // Generate 12-Section Audit Report
  const auditReport = generate12SectionReport(data, pillarScores, totalRealityScore, totalGap, zonaFinal, quarterInfo, marginCurrentQ, naCurrentQ);
  
  // Generate ProDem Recommendation
  const prodemRekomendasi = generateProDemRecommendation(data, totalRealityScore, zonaFinal, quarterInfo, marginCurrentQ);
  
  // Generate Magic Section
  const magicSection = generateMagicSection(data, profil, pillarScores, auditReport.coachingPoints);
  
  return {
    pillarAnswers: pillarScores,
    totalSelfScore,
    totalRealityScore,
    totalGap,
    zonaKinerja,
    zonaPerilaku,
    zonaFinal,
    profil,
    auditReport,
    prodemRekomendasi,
    magicSection
  };
}

function classifyProfile(totalRealityScore: number, pillarScores: any[]): "Leader" | "Visionary" | "Performer" | "At-Risk" {
  const kaderisasiScore = pillarScores.find(p => p.pillarId === 4)?.realityScore || 1;
  const produktivitasScore = pillarScores.find(p => p.pillarId === 9)?.realityScore || 1;
  const disiplinScore = pillarScores.find(p => p.pillarId === 13)?.realityScore || 1;
  
  const avgCriticalPillars = (kaderisasiScore + produktivitasScore + disiplinScore) / 3;
  
  if (totalRealityScore >= 75 && avgCriticalPillars >= 4) return "Leader";
  if (totalRealityScore >= 60 && produktivitasScore >= 4) return "Performer";
  if (avgCriticalPillars >= 4) return "Visionary";
  return "At-Risk";
}

function generate12SectionReport(
  data: InsertAudit,
  pillarScores: any[],
  totalRealityScore: number,
  totalGap: number,
  zonaFinal: string,
  quarterInfo: any,
  marginCurrentQ: number,
  naCurrentQ: number
) {
  const targetMargin = getTargetMarginByLevel(data.jabatan);
  const totalTeam = data.jumlahBC + data.jumlahSBC + data.jumlahBsM + data.jumlahSBM;
  
  // 0. Executive Summary
  const gapType = totalGap > 0 ? "over-claim" : totalGap < 0 ? "under-claim" : "realistis";
  const criticalPillar = pillarScores.filter(p => p.realityScore <= 2).map(p => p.pillarName).join(", ") || "Tidak ada";
  
  const executiveSummary = `${data.nama} berada di zona ${zonaFinal.toUpperCase()} dengan Reality Score ${totalRealityScore}/90. ` +
    `Terdapat gap ${Math.abs(totalGap)} poin (${gapType}) dari self-assessment, terutama pada ${criticalPillar}. ` +
    `Fokus 90 hari: ${zonaFinal === "merah" ? "Perbaikan urgent pada pilar kritis" : zonaFinal === "kuning" ? "Optimalkan margin dan kaderisasi" : "Maintain excellence dan kembangkan tim"}.`;
  
  // 1. Insight Lengkap
  const trendMargin = marginCurrentQ > targetMargin ? "over target" : "perlu boost";
  const insightLengkap = `Posisi: ${data.jabatan} di ${data.cabang}. Tim: ${totalTeam} orang aktif. ` +
    `Margin ${quarterInfo.quarter}: $${marginCurrentQ.toLocaleString()} (${trendMargin}). NA: ${naCurrentQ}. ` +
    `Karakter: ${totalRealityScore >= 75 ? "Disiplin tinggi, produktif, kaderisasi kuat" : "Perlu perbaikan konsistensi dan team building"}. ` +
    `Fit & Future: ${zonaFinal === "hijau" ? "Siap promosi dalam 90 hari" : "Perlu fokus perbaikan sebelum promosi"}.`;
  
  // 2. SWOT Analysis
  const swotAnalysis = generateSWOT(pillarScores, data, marginCurrentQ, totalGap);
  
  // 3. Coaching Points
  const coachingPoints = generateCoachingPoints(pillarScores, zonaFinal, data);
  
  // 4. Action Plan 30-60-90
  const actionPlan = generateActionPlan(coachingPoints, data);
  
  // 5. Progress Kuartal
  const progressKuartal = {
    kuartalBerjalan: quarterInfo.quarter,
    sisaHari: quarterInfo.sisaHari,
    targetMargin,
    realisasiMargin: marginCurrentQ,
    percentageMargin: targetMargin > 0 ? Math.round((marginCurrentQ / targetMargin) * 100) : 0,
    targetNA: 2,
    realisasiNA: naCurrentQ,
    percentageNA: Math.round((naCurrentQ / 2) * 100),
    catatan: marginCurrentQ >= targetMargin ? "Target tercapai!" : marginCurrentQ >= targetMargin * 0.8 ? "Cukup, perlu ditingkatkan" : "Under target, perlu perhatian khusus"
  };
  
  // 6. EWS (Early Warning System)
  const ews = generateEWS(pillarScores, totalGap, zonaFinal, marginCurrentQ, targetMargin);
  
  // 7. Kesesuaian Visi
  const kesesuaianVisi = {
    status: (totalRealityScore >= 75 ? "Align" : totalRealityScore >= 50 ? "Perlu Penyesuaian" : "Belum Sesuai") as "Align" | "Perlu Penyesuaian" | "Belum Sesuai",
    narasi: totalRealityScore >= 75 
      ? "Sudah align dengan visi pembinaan: disiplin, produktif, dan kaderisasi berjalan."
      : "Perlu penyesuaian pada pilar kaderisasi dan konsistensi agar sejalan dengan visi jangka panjang."
  };
  
  return {
    executiveSummary,
    insightLengkap,
    swotAnalysis,
    coachingPoints,
    actionPlan,
    progressKuartal,
    ews,
    kesesuaianVisi
  };
}

function generateSWOT(pillarScores: any[], data: InsertAudit, marginCurrentQ: number, totalGap: number) {
  const strength: string[] = [];
  const weakness: string[] = [];
  const opportunity: string[] = [];
  const threat: string[] = [];
  
  // Strength: pilar with reality >= 4
  pillarScores.filter(p => p.realityScore >= 4).forEach(p => {
    strength.push(`${p.pillarName}: Score ${p.realityScore}/5 - ${p.insight}`);
  });
  
  // Weakness: pilar with reality <= 2 or gap < -2
  pillarScores.filter(p => p.realityScore <= 2 || p.gap <= -2).forEach(p => {
    weakness.push(`${p.pillarName}: Score ${p.realityScore}/5 (Gap: ${p.gap}) - ${p.insight}`);
  });
  
  // Opportunity
  if (marginCurrentQ > 0) {
    opportunity.push("Momentum margin positif bisa dioptimalkan untuk ekspansi tim");
  }
  const targetMargin = getTargetMarginByLevel(data.jabatan);
  if (marginCurrentQ >= targetMargin * 0.8) {
    opportunity.push("Hampir mencapai target, sedikit lagi untuk breakthrough promosi");
  }
  
  // Threat
  if (totalGap < -2) {
    threat.push(`Over-claim ${Math.abs(totalGap)} poin menunjukkan gap antara persepsi dan realitas`);
  }
  if (data.jumlahBC + data.jumlahSBC === 0) {
    threat.push("Belum punya tim - risiko single point of failure tinggi");
  }
  
  if (strength.length === 0) strength.push("Perlu identifikasi kekuatan lebih lanjut");
  if (weakness.length === 0) weakness.push("Tidak ada weakness kritis terdeteksi");
  if (opportunity.length === 0) opportunity.push("Fokus pada konsistensi untuk membuka peluang baru");
  if (threat.length === 0) threat.push("Tidak ada threat signifikan saat ini");
  
  return { strength, weakness, opportunity, threat };
}

function generateCoachingPoints(pillarScores: any[], zonaFinal: string, data: InsertAudit): string[] {
  const points: string[] = [];
  
  // Identify critical pillars with low score
  const criticalLow = pillarScores.filter(p => CRITICAL_PILLARS.includes(p.pillarId) && p.realityScore <= 2);
  
  if (criticalLow.length > 0) {
    criticalLow.forEach(p => {
      points.push(`Fokus urgent pada ${p.pillarName} - skor critical (${p.realityScore}/5)`);
    });
  }
  
  // Add zone-specific coaching
  if (zonaFinal === "merah") {
    points.push("Perbaiki konsistensi kerja - minimal 1 NA per kuartal untuk stabilitas");
    points.push("Bangun tim minimal 2 orang dalam 60 hari untuk support system");
  } else if (zonaFinal === "kuning") {
    points.push("Boost margin dengan closing lebih agresif di sisa kuartal ini");
    points.push("Perkuat kaderisasi - minimal 1 kandidat promosi dalam 90 hari");
  } else {
    points.push("Maintain excellence - jadilah mentor bagi tim yang lebih junior");
    points.push("Ekspansi jalur baru untuk diversifikasi risk");
  }
  
  // Ensure at least 3 points
  while (points.length < 3) {
    points.push("Monitor progress mingguan dan adjust strategi sesuai data real-time");
  }
  
  return points.slice(0, 3);
}

function generateActionPlan(coachingPoints: string[], data: InsertAudit) {
  return [
    {
      periode: "30 Hari",
      target: coachingPoints[0] || "Stabilkan performa kuartal",
      aktivitas: "Daily prospecting, weekly closing target, team meeting 2x/minggu",
      pic: data.nama,
      output: "Minimal 1 NA baru, 1 closing, team engagement 80%"
    },
    {
      periode: "60 Hari",
      target: coachingPoints[1] || "Optimalkan margin dan team",
      aktivitas: "Kaderisasi 1 kandidat, training team, boost produktivitas per member",
      pic: data.nama,
      output: "1 kandidat ready promosi, margin +20% dari bulan sebelumnya"
    },
    {
      periode: "90 Hari",
      target: coachingPoints[2] || "Achieve target kuartal",
      aktivitas: "Review KPI bulanan, coaching 1-on-1, evaluasi struktur tim",
      pic: data.nama,
      output: "Target kuartal tercapai 100%, struktur tim lengkap, ready promosi"
    }
  ];
}

function generateEWS(pillarScores: any[], totalGap: number, zonaFinal: string, marginCurrentQ: number, targetMargin: number) {
  const ews: Array<{ faktor: string; indikator: string; risiko: string; saranCepat: string }> = [];
  
  // Check critical pillars
  CRITICAL_PILLARS.forEach(pillarId => {
    const pilar = pillarScores.find(p => p.pillarId === pillarId);
    if (pilar && pilar.realityScore <= 2) {
      ews.push({
        faktor: pilar.pillarName,
        indikator: `Score ${pilar.realityScore}/5 (Critical)`,
        risiko: "Gagal bertahan di level saat ini, rawan demosi",
        saranCepat: pilar.pillarId === 4 ? "Rekrut 1 kader dalam 30 hari" : pilar.pillarId === 9 ? "Coaching intensif ke tim" : "Disiplin harian & tracking progress"
      });
    }
  });
  
  // Check gap illusion
  if (totalGap >= 3) {
    ews.push({
      faktor: "Gap Self vs Reality",
      indikator: `Over-claim ${totalGap} poin`,
      risiko: "Ilusi performa, tidak aware terhadap kondisi real",
      saranCepat: "Self-reflection mingguan, feedback dari atasan"
    });
  }
  
  // Check margin under-performance
  if (marginCurrentQ < targetMargin * 0.5) {
    ews.push({
      faktor: "Margin Under Target",
      indikator: `${Math.round((marginCurrentQ/targetMargin)*100)}% dari target`,
      risiko: "Gagal memenuhi syarat bertahan di level saat ini",
      saranCepat: "Focus closing, daily activity tracking"
    });
  }
  
  // If no EWS, add positive note
  if (ews.length === 0) {
    ews.push({
      faktor: "No Critical Issues",
      indikator: "Semua indikator dalam batas aman",
      risiko: "Tidak ada risiko signifikan terdeteksi",
      saranCepat: "Maintain current momentum"
    });
  }
  
  return ews;
}

function generateProDemRecommendation(
  data: InsertAudit,
  totalRealityScore: number,
  zonaFinal: string,
  quarterInfo: any,
  marginCurrentQ: number
) {
  const level = data.jabatan.match(/\(([A-Z]+)\)/)?.[1] || "BC";
  const targetMargin = getTargetMarginByLevel(data.jabatan);
  const totalTeam = data.jumlahBC + data.jumlahSBC + data.jumlahBsM + data.jumlahSBM;
  
  let recommendation: "Promosi" | "Dipertahankan" | "Pembinaan" | "Demosi";
  let nextLevel = "";
  let reason = "";
  let konsekuensi = "";
  let nextStep = "";
  let strategyType: "Save by Margin" | "Save by Staff" | "N/A" = "N/A";
  
  const requirements: Array<{ label: string; value: string; met: boolean }> = [];
  
  // ProDem Logic based on level & quarterly performance
  if (zonaFinal === "merah" || totalRealityScore < 45) {
    recommendation = "Demosi";
    reason = `Reality Score ${totalRealityScore}/90 berada di zona merah. Performa kritis pada beberapa pilar utama.`;
    konsekuensi = "Tanpa perbaikan dalam 30 hari, demosi otomatis akan diproses.";
    nextStep = "Coaching intensif dengan atasan langsung, monitoring weekly.";
  } else if (zonaFinal === "kuning" || totalRealityScore < 65) {
    recommendation = "Pembinaan";
    reason = `Reality Score ${totalRealityScore}/90 di zona kuning. Perlu perbaikan pada margin dan kaderisasi.`;
    konsekuensi = "Status bertahan namun tidak eligible untuk promosi di kuartal ini.";
    nextStep = "Focus pada action plan 60 hari, review bi-weekly dengan atasan.";
    strategyType = marginCurrentQ >= targetMargin * 0.75 ? "Save by Margin" : "Save by Staff";
  } else if (totalRealityScore >= 75 && marginCurrentQ >= targetMargin) {
    recommendation = "Promosi";
    nextLevel = getNextLevel(level);
    reason = `Reality Score ${totalRealityScore}/90 di zona hijau. Target margin kuartal tercapai ($${marginCurrentQ.toLocaleString()}).`;
    konsekuensi = "Promosi akan diproses di akhir kuartal jika konsistensi terjaga.";
    nextStep = "Persiapkan transisi ke ${nextLevel}, mulai training untuk tanggung jawab baru.";
    
    requirements.push(
      { label: "Reality Score", value: `${totalRealityScore}/90`, met: true },
      { label: "Margin Target", value: `$${marginCurrentQ.toLocaleString()} / $${targetMargin.toLocaleString()}`, met: true },
      { label: "Tim Aktif", value: `${totalTeam} orang`, met: totalTeam >= 2 }
    );
  } else {
    recommendation = "Dipertahankan";
    reason = `Performa cukup baik (Score ${totalRealityScore}/90) namun belum memenuhi semua syarat promosi.`;
    konsekuensi = "Status aman, fokus pada gap yang masih ada untuk promosi periode berikutnya.";
    nextStep = "Implementasi action plan 90 hari, review monthly dengan atasan.";
    strategyType = marginCurrentQ >= targetMargin * 0.8 ? "Save by Margin" : "Save by Staff";
  }
  
  return {
    currentLevel: `${level} (${data.jabatan})`,
    recommendation,
    nextLevel,
    reason,
    konsekuensi,
    nextStep,
    strategyType,
    requirements
  };
}

function getNextLevel(currentLevel: string): string {
  const hierarchy: Record<string, string> = {
    "BC": "SBC",
    "SBC": "BSM/BsM",
    "BSM": "SBM",
    "BsM": "SBM",
    "SBM": "EM",
    "EM": "SEM",
    "SEM": "VBM",
    "VBM": "BM"
  };
  return hierarchy[currentLevel] || "Next Level";
}

function generateMagicSection(data: InsertAudit, profil: string, pillarScores: any[], coachingPoints: string[]) {
  const zodiacSign = getZodiacSign(data.tanggalLahir);
  const generasi = getGenerationFromBirthdate(data.tanggalLahir);
  const zodiacData = ZODIAC_BOOSTERS[zodiacSign];
  
  const julukan = profil === "Leader" ? "The Trailblazer" :
                  profil === "Visionary" ? "The Architect" :
                  profil === "Performer" ? "The Executor" :
                  "The Rising Phoenix";
  
  const narasi = `${data.nama}, Anda adalah ${julukan} - individu dengan potensi luar biasa yang sedang dalam perjalanan menuju puncak karier. ` +
    `Hasil audit menunjukkan bahwa Anda memiliki fondasi yang solid, namun masih ada ruang untuk tumbuh dan berkembang. ` +
    `Ingatlah, setiap pemimpin besar pernah berada di posisi Anda saat ini. Yang membedakan mereka adalah keberanian untuk terus maju, belajar dari setiap tantangan, dan tidak pernah berhenti berinovasi. ` +
    `90 hari ke depan adalah golden period Anda untuk membuktikan bahwa Anda siap untuk level berikutnya!`;
  
  const zodiakBooster = generasi === "Gen Z" ? zodiacData.genZ : zodiacData.millennial;
  
  const coachingHighlight = `Key Focus: ${coachingPoints[0]}. Ini adalah prioritas tertinggi yang akan membuka pintu kesuksesan Anda di kuartal ini.`;
  
  const callToAction = `3 Langkah Konkret untuk 90 Hari: (1) ${coachingPoints[0]}, (2) ${coachingPoints[1]}, (3) ${coachingPoints[2]}. Eksekusi dengan disiplin, pantau progress setiap minggu, dan celebrate setiap small win!`;
  
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  
  return {
    julukan,
    narasi,
    zodiak: zodiacData.name,
    generasi,
    zodiakBooster,
    coachingHighlight,
    callToAction,
    quote
  };
}
