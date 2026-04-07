import { z } from "zod";

export const campaignSchema = z.object({
  title: z.string().trim().min(8).max(120),
  description: z.string().trim().min(40).max(3000),
  category: z.string().trim().min(2).max(80),
  urgency: z.string().trim().min(2).max(40),
  shortDescription: z.string().trim().min(20).max(240),
  targetAmount: z.coerce.number().positive(),
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  coverImageKey: z.string().trim().min(3).max(255),
  supportDocumentIds: z.array(z.string().uuid()).min(1),
  privacyShowRealName: z.boolean().optional(),
  privacyShowExactLocation: z.boolean().optional(),
});

export const moderationReportSchema = z.object({
  reason: z.string().trim().min(4).max(80),
  details: z.string().trim().max(500).optional().or(z.literal("")),
});
