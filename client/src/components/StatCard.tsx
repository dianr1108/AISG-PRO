import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  "data-testid"?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, "data-testid": testId }: StatCardProps) {
  return (
    <Card className="p-6 hover-elevate" data-testid={testId}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold tracking-tight" data-testid={`${testId}-value`}>{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? "text-zone-success" : "text-zone-critical"
                }`}
                data-testid={`${testId}-trend`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">vs bulan lalu</span>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>
  );
}
