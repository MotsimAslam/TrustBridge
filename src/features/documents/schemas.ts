import { z } from "zod";

export const documentUploadSchema = z.object({
  filename: z.string().trim().min(1).max(160),
  mimeType: z.string().trim().min(1).max(120),
  sizeBytes: z.number().int().positive().max(10 * 1024 * 1024),
  type: z.enum([
    "NATIONAL_ID_FRONT",
    "NATIONAL_ID_BACK",
    "PROOF_OF_ADDRESS",
    "MEDICAL_DOCUMENT",
    "SCHOOL_FEE_SLIP",
    "QUOTATION_INVOICE",
    "PROFILE_SUPPORTING_IMAGE",
    "OTHER_SUPPORTING_DOCUMENT",
  ]),
});
