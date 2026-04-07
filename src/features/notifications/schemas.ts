import { z } from "zod";

export const notificationPreferenceSchema = z.object({
  inAppEnabled: z.boolean(),
  emailEnabled: z.boolean(),
  securityEmailsOnly: z.boolean(),
  marketingEnabled: z.boolean(),
});
