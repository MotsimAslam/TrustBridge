type BeneficiaryVisibility = {
  fullName?: string | null;
  city?: string | null;
  country?: string | null;
  showRealName?: boolean;
  showExactLocation?: boolean;
};

export function getMaskedBeneficiaryName(input: BeneficiaryVisibility) {
  if (input.showRealName && input.fullName) {
    return input.fullName;
  }

  if (!input.fullName) {
    return "Verified beneficiary";
  }

  const [firstName] = input.fullName.split(" ");
  return `${firstName} •••`;
}

export function getMaskedBeneficiaryLocation(input: BeneficiaryVisibility) {
  if (!input.city && !input.country) {
    return "Location protected";
  }

  if (input.showExactLocation) {
    return [input.city, input.country].filter(Boolean).join(", ");
  }

  return input.country ?? "Location protected";
}
