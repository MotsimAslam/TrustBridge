import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  displayName: z.string().trim().min(2).max(80),
  bio: z.string().trim().max(300).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  preferredLanguage: z.enum(["en", "ur"]),
  showRealName: z.boolean().optional(),
  showProfilePhoto: z.boolean().optional(),
  showExactLocation: z.boolean().optional(),
  allowDirectContact: z.boolean().optional(),
  preferredCategories: z.array(z.string()).optional(),
  publicDonationHistoryEnabled: z.boolean().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
