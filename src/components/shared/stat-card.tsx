import { ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  trend,
  className,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: string;
  className?: string;
}) {
  return (
    <Card className={cn("border-border/70", className)}>
      <CardHeader className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="flex items-center justify-between gap-4">
          <p className="text-3xl font-semibold tracking-tight">{value}</p>
          {trend ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <ArrowUpRight className="size-3.5" />
              {trend}
            </span>
          ) : null}
        </div>
      </CardHeader>
      {hint ? (
        <CardContent>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
