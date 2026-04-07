import { z } from "zod";

export const beneficiaryOnboardingSchema = z.object({
  legalFullName: z.string().trim().min(2).max(140),
  dateOfBirth: z.string().min(1),
  gender: z.string().trim().min(1).max(40),
  nationalIdNumber: z.string().trim().min(5).max(40),
  phoneNumber: z.string().trim().min(8).max(20),
  addressLine1: z.string().trim().min(5).max(160),
  city: z.string().trim().min(2).max(80),
  provinceOrState: z.string().trim().min(2).max(80),
  country: z.string().trim().min(2).max(80),
  nearbyLandmark: z.string().trim().max(120).optional().or(z.literal("")),
  bankName: z.string().trim().max(80).optional().or(z.literal("")),
  accountTitle: z.string().trim().max(80).optional().or(z.literal("")),
  accountNumberMasked: z.string().trim().max(40).optional().or(z.literal("")),
  mobileWalletType: z.string().trim().max(40).optional().or(z.literal("")),
  showRealName: z.boolean(),
  showProfilePhoto: z.boolean(),
  showExactLocation: z.boolean(),
  allowDirectContact: z.boolean(),
});

export type BeneficiaryOnboardingInput = z.infer<typeof beneficiaryOnboardingSchema>;
