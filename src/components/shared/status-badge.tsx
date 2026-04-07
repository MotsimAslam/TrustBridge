import { Badge } from "@/components/ui/badge";

const variantMap: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  APPROVED: "success",
  PUBLISHED: "success",
  FULLY_APPROVED: "success",
  PENDING: "warning",
  UNDER_REVIEW: "warning",
  IN_REVIEW: "warning",
  NEEDS_MORE_INFO: "warning",
  NEEDS_RESUBMISSION: "warning",
  REJECTED: "destructive",
  PAUSED: "secondary",
  DRAFT: "secondary",
  SUBMITTED: "default",
  UPLOADED: "default",
};

export function StatusBadge({ value }: { value: string }) {
  const normalized = value.toUpperCase();
  return (
    <Badge variant={variantMap[normalized] ?? "outline"}>
      {normalized.toLowerCase().replaceAll("_", " ")}
    </Badge>
  );
}
