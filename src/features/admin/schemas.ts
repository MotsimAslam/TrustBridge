import { z } from "zod";

export const verificationDecisionSchema = z.object({
  caseId: z.string().uuid(),
  status: z.enum(["APPROVED", "REJECTED", "NEEDS_MORE_INFO", "IN_REVIEW"]),
  decisionNotes: z.string().trim().min(4).max(1000),
  assignedAdminId: z.string().uuid().optional().or(z.literal("")),
});

export const adminNoteSchema = z.object({
  caseId: z.string().uuid(),
  body: z.string().trim().min(2).max(1000),
});
