import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  Building2, 
  User, 
  TrendingUp, 
  Users as UsersIcon,
  Target,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Award,
  Clock,
  MessageSquare,
  X
} from "lucide-react";
import type { Audit } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatPanel } from "@/components/ChatPanel";

export default function AuditDetail() {
  const [, params] = useRoute("/audit/:id");
  const [, setLocation] = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const auditId = params?.id;

  const { data: audit, isLoading } = useQuery<Audit>({
    queryKey: [`/api/audit/${auditId}`],
    enabled: !!auditId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-card rounded-lg w-1/3" />
            <div className="h-64 bg-card rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-48 bg-card rounded-lg" />
              <div className="h-48 bg-card rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Audit tidak ditemukan</h2>
          <p className="text-muted-foreground mb-4">ID audit yang Anda cari tidak tersedia</p>
          <Button onClick={() => setLocation("/")}>Kembali ke Dashboard</Button>
        </div>
      </div>
    );
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("id-ID", { 
      day: "numeric", 
      month: "long", 
      year: "numeric" 
    });
  };

  const getZonaBadgeColor = (zona: string) => {
    if (zona === "hijau" || zona === "success") return "bg-green-500/20 text-green-600 border-green-500/30";
    if (zona === "kuning" || zona === "warning") return "bg-yellow-500/20 text-yellow-600 border-yellow-500/30";
    return "bg-red-500/20 text-red-600 border-red-500/30";
  };

  const getZonaText = (zona: string) => {
    if (zona === "hijau" || zona === "success") return "Hijau ✅";
    if (zona === "kuning" || zona === "warning") return "Kuning ⚠️";
    return "Merah 🔴";
  };

  const getProfilBadge = (profil: string) => {
    const colors: Record<string, string> = {
      "Leader": "bg-blue-500/20 text-blue-600 border-blue-500/30",
      "Visionary": "bg-purple-500/20 text-purple-600 border-purple-500/30",
      "Performer": "bg-green-500/20 text-green-600 border-green-500/30",
      "At-Risk": "bg-red-500/20 text-red-600 border-red-500/30"
    };
    return colors[profil] || colors["At-Risk"];
  };

  const report = audit.auditReport as any;
  const prodem = audit.prodemRekomendasi as any;
  const magic = audit.magicSection as any;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              data-testid="button-back"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Audit Report</h1>
                <Badge className={`${getProfilBadge(audit.profil)} border`}>
                  {audit.profil}
                </Badge>
              </div>
              <code className="text-sm font-mono text-muted-foreground" data-testid="detail-audit-id">
                {audit.id}
              </code>
            </div>
          </div>
          <Button 
            className="gap-2" 
            onClick={() => window.open(`/api/audit/${audit.id}/pdf`, "_blank")}
            data-testid="button-download-pdf"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>

        {/* Executive Summary */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Executive Summary</h2>
          </div>
          <p className="text-base leading-relaxed">{report?.executiveSummary}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{audit.totalRealityScore}</p>
              <p className="text-sm text-muted-foreground">Reality Score</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold">{audit.totalSelfScore}</p>
              <p className="text-sm text-muted-foreground">Self Score</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className={`text-2xl font-bold ${audit.totalGap > 0 ? 'text-yellow-500' : audit.totalGap < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {audit.totalGap > 0 ? '+' : ''}{audit.totalGap}
              </p>
              <p className="text-sm text-muted-foreground">Gap</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <Badge className={`${getZonaBadgeColor(audit.zonaFinal)} text-sm border`}>
                {getZonaText(audit.zonaFinal)}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Personal Info & Quarter Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Informasi Personal</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                  <p className="font-medium" data-testid="detail-nama">{audit.nama}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Jabatan</p>
                  <p className="font-medium" data-testid="detail-jabatan">{audit.jabatan}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Cabang</p>
                  <p className="font-medium" data-testid="detail-cabang">{audit.cabang}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Audit</p>
                  <p className="font-medium">{formatDate(audit.createdAt)}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Progress Kuartal</h2>
            </div>
            {report?.progressKuartal && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Kuartal: {report.progressKuartal.kuartalBerjalan}</span>
                    <span className="text-sm text-muted-foreground">{report.progressKuartal.sisaHari} hari tersisa</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Margin Target</span>
                    <span className="text-sm font-semibold">${report.progressKuartal.realisasiMargin.toLocaleString()} / ${report.progressKuartal.targetMargin.toLocaleString()}</span>
                  </div>
                  <Progress value={Math.min(report.progressKuartal.percentageMargin, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{report.progressKuartal.percentageMargin}% tercapai</p>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">NA Target</span>
                    <span className="text-sm font-semibold">{report.progressKuartal.realisasiNA} / {report.progressKuartal.targetNA}</span>
                  </div>
                  <Progress value={Math.min(report.progressKuartal.percentageNA, 100)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{report.progressKuartal.percentageNA}% tercapai</p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm italic">{report.progressKuartal.catatan}</p>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="pilar" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="pilar">18 Pilar</TabsTrigger>
            <TabsTrigger value="swot">SWOT & Action</TabsTrigger>
            <TabsTrigger value="prodem">ProDem</TabsTrigger>
            <TabsTrigger value="magic">Magic Section</TabsTrigger>
          </TabsList>

          {/* 18 Pilar Tab */}
          <TabsContent value="pilar">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">18 Pilar Reality Score</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Sistem menganalisis self-assessment Anda dan membandingkannya dengan data real performa untuk menghasilkan Reality Score
              </p>
              <div className="space-y-3">
                {audit.pillarAnswers && Array.isArray(audit.pillarAnswers) && audit.pillarAnswers.map((pilar: any) => (
                  <div
                    key={pilar.pillarId}
                    className="flex items-center gap-4 p-4 rounded-lg border hover-elevate"
                    data-testid={`pilar-${pilar.pillarId}`}
                  >
                    <div className="flex-1">
                      <p className="font-medium mb-1">{pilar.pillarName}</p>
                      <p className="text-sm text-muted-foreground">{pilar.insight}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{pilar.selfScore}</p>
                        <p className="text-xs text-muted-foreground">Self</p>
                      </div>
                      <div className="w-8 text-center">
                        {pilar.gap === 0 ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />
                        ) : pilar.gap > 0 ? (
                          <span className="text-yellow-500 font-semibold">+{pilar.gap}</span>
                        ) : (
                          <span className="text-red-500 font-semibold">{pilar.gap}</span>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{pilar.realityScore}</p>
                        <p className="text-xs text-muted-foreground">Reality</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* SWOT & Action Tab */}
          <TabsContent value="swot">
            <div className="space-y-6">
              {/* Insight Lengkap */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Insight Lengkap</h2>
                <p className="text-base leading-relaxed">{report?.insightLengkap}</p>
              </Card>

              {/* SWOT Analysis */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">SWOT Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strength */}
                  <div className="p-4 border border-green-500/30 rounded-lg bg-green-500/5">
                    <h3 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" />
                      Strength
                    </h3>
                    <ul className="space-y-2">
                      {report?.swotAnalysis?.strength?.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm flex gap-2">
                          <span className="text-green-600">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weakness */}
                  <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/5">
                    <h3 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      Weakness
                    </h3>
                    <ul className="space-y-2">
                      {report?.swotAnalysis?.weakness?.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm flex gap-2">
                          <span className="text-red-600">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunity */}
                  <div className="p-4 border border-blue-500/30 rounded-lg bg-blue-500/5">
                    <h3 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Opportunity
                    </h3>
                    <ul className="space-y-2">
                      {report?.swotAnalysis?.opportunity?.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm flex gap-2">
                          <span className="text-blue-600">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Threat */}
                  <div className="p-4 border border-yellow-500/30 rounded-lg bg-yellow-500/5">
                    <h3 className="font-semibold text-yellow-600 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Threat
                    </h3>
                    <ul className="space-y-2">
                      {report?.swotAnalysis?.threat?.map((item: string, idx: number) => (
                        <li key={idx} className="text-sm flex gap-2">
                          <span className="text-yellow-600">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Coaching Points */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h2 className="text-xl font-semibold">Coaching Points</h2>
                </div>
                <ul className="space-y-3">
                  {report?.coachingPoints?.map((point: string, idx: number) => (
                    <li key={idx} className="flex gap-3 p-3 bg-card/50 rounded-lg">
                      <span className="text-primary font-bold">{idx + 1}.</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {/* Action Plan 30-60-90 */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Action Plan 30-60-90</h2>
                </div>
                <div className="space-y-4">
                  {report?.actionPlan?.map((plan: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg hover-elevate">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline">{plan.periode}</Badge>
                        <h3 className="font-semibold">{plan.target}</h3>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Aktivitas: </span>
                          <span>{plan.aktivitas}</span>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">PIC: </span>
                          <span>{plan.pic}</span>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Output: </span>
                          <span className="text-primary font-medium">{plan.output}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* EWS */}
              <Card className="p-6 border-yellow-500/30 bg-yellow-500/5">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-xl font-semibold">Early Warning System (EWS)</h2>
                </div>
                <div className="space-y-3">
                  {report?.ews?.map((warning: any, idx: number) => (
                    <div key={idx} className="p-4 bg-background rounded-lg border border-yellow-500/20">
                      <div className="font-semibold mb-2">{warning.faktor}</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Indikator: </span>
                          <span className="font-medium">{warning.indikator}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risiko: </span>
                          <span className="font-medium text-red-600">{warning.risiko}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Saran: </span>
                          <span className="font-medium text-green-600">{warning.saranCepat}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* ProDem Tab */}
          <TabsContent value="prodem">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">Rekomendasi ProDem (Promotion-Demotion)</h2>
              {prodem && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 rounded-lg border-2 border-primary/30 bg-primary/5">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Level</p>
                      <p className="text-xl font-bold">{prodem.currentLevel}</p>
                    </div>
                    <div className="text-center">
                      <Badge 
                        className={`text-lg px-4 py-2 ${
                          prodem.recommendation === 'Promosi' ? 'bg-green-500' :
                          prodem.recommendation === 'Demosi' ? 'bg-red-500' :
                          prodem.recommendation === 'Pembinaan' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}
                      >
                        {prodem.recommendation}
                      </Badge>
                      {prodem.nextLevel && (
                        <p className="text-sm text-muted-foreground mt-2">→ {prodem.nextLevel}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Alasan</h3>
                      <p>{prodem.reason}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Konsekuensi</h3>
                      <p>{prodem.konsekuensi}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Next Step</h3>
                      <p>{prodem.nextStep}</p>
                    </div>
                    {prodem.strategyType && prodem.strategyType !== "N/A" && (
                      <div className="p-4 border rounded-lg bg-primary/5">
                        <h3 className="font-semibold mb-2">Strategy Type</h3>
                        <Badge variant="outline">{prodem.strategyType}</Badge>
                      </div>
                    )}
                  </div>

                  {prodem.requirements && prodem.requirements.length > 0 && (
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-4">Requirements Check</h3>
                      <div className="space-y-2">
                        {prodem.requirements.map((req: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-card/50 rounded">
                            <span className="font-medium">{req.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{req.value}</span>
                              {req.met ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Magic Section Tab */}
          <TabsContent value="magic">
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <h2 className="text-2xl font-bold mb-6 text-center">✨ Magic Section ✨</h2>
              {magic && (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-background/50 rounded-lg">
                    <h3 className="text-3xl font-bold mb-2">{magic.julukan}</h3>
                    <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                      <span>{magic.zodiak}</span>
                      <span>•</span>
                      <span>{magic.generasi}</span>
                    </div>
                  </div>

                  <div className="p-6 bg-background/50 rounded-lg">
                    <h3 className="font-semibold mb-3">Narasi Personal</h3>
                    <p className="leading-relaxed">{magic.narasi}</p>
                  </div>

                  <div className="p-6 bg-primary/10 rounded-lg border border-primary/20">
                    <h3 className="font-semibold mb-3">Zodiak Booster 🌟</h3>
                    <p className="italic">{magic.zodiakBooster}</p>
                  </div>

                  <div className="p-6 bg-background/50 rounded-lg">
                    <h3 className="font-semibold mb-3">Coaching Highlight</h3>
                    <p>{magic.coachingHighlight}</p>
                  </div>

                  <div className="p-6 bg-background/50 rounded-lg">
                    <h3 className="font-semibold mb-3">Call to Action</h3>
                    <p>{magic.callToAction}</p>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-lg border border-primary/30">
                    <p className="text-center text-lg italic font-medium">"{magic.quote}"</p>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        {/* Floating Chat Button - Prominent Style */}
        {!chatOpen && (
          <Button
            className="fixed bottom-8 right-8 h-16 px-6 rounded-full shadow-2xl z-50 animate-pulse hover:animate-none gap-3 text-base font-semibold"
            onClick={() => setChatOpen(true)}
            data-testid="button-toggle-chat"
          >
            <MessageSquare className="w-6 h-6" />
            <span>Chat dengan AI Coach</span>
          </Button>
        )}

        {/* Chat Panel Sidebar */}
        {chatOpen && (
          <div className="fixed bottom-8 right-8 w-96 h-[600px] z-50 shadow-2xl rounded-lg overflow-hidden border-2 border-primary/20">
            <div className="h-full flex flex-col bg-card">
              <div className="flex items-center justify-between p-3 border-b bg-primary/5">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <span className="font-semibold">AI Coach</span>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setChatOpen(false)}
                  data-testid="button-close-chat"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatPanel auditId={audit.id} auditName={audit.nama} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
