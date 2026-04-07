import { saveBeneficiaryDraft, submitBeneficiaryOnboarding } from "@/features/onboarding/actions";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/form-field";

type BeneficiaryProfileData = {
  legalFullName?: string | null;
  dateOfBirth?: Date | null;
  gender?: string | null;
  nationalIdNumber?: string | null;
  phoneNumber?: string | null;
  addressLine1?: string | null;
  city?: string | null;
  provinceOrState?: string | null;
  country?: string | null;
  nearbyLandmark?: string | null;
  bankName?: string | null;
  accountTitle?: string | null;
  accountNumberMasked?: string | null;
  mobileWalletType?: string | null;
  showRealName?: boolean;
  showProfilePhoto?: boolean;
  showExactLocation?: boolean;
  allowDirectContact?: boolean;
};

export function BeneficiaryOnboardingForm({
  profile,
}: {
  profile?: BeneficiaryProfileData | null;
}) {
  const dateValue = profile?.dateOfBirth
    ? profile.dateOfBirth.toISOString().slice(0, 10)
    : "";

  return (
    <div className="space-y-8">
      <div className="grid gap-6 rounded-[1.5rem] border border-border/70 bg-muted/30 p-5 md:grid-cols-3">
        {[
          ["1", "Personal information"],
          ["2", "Identity and address"],
          ["3", "Privacy and submission"],
        ].map(([step, label]) => (
          <div key={step} className="rounded-3xl border border-border/70 bg-background px-4 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Step {step}</p>
            <p className="mt-2 font-medium">{label}</p>
          </div>
        ))}
      </div>

      <form className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Personal information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Full legal name" name="legalFullName" defaultValue={profile?.legalFullName} />
            <FormField label="Date of birth" name="dateOfBirth" type="date" defaultValue={dateValue} />
            <FormField label="Gender" name="gender" defaultValue={profile?.gender} />
            <FormField label="Phone number" name="phoneNumber" defaultValue={profile?.phoneNumber} />
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Identity and address</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="National ID / CNIC" name="nationalIdNumber" defaultValue={profile?.nationalIdNumber} />
            <FormField label="Address" name="addressLine1" defaultValue={profile?.addressLine1} />
            <FormField label="City" name="city" defaultValue={profile?.city} />
            <FormField label="Province / state" name="provinceOrState" defaultValue={profile?.provinceOrState} />
            <FormField label="Country" name="country" defaultValue={profile?.country} />
            <FormField label="Nearby landmark" name="nearbyLandmark" defaultValue={profile?.nearbyLandmark} />
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Internal settlement placeholders</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Bank name" name="bankName" defaultValue={profile?.bankName} />
            <FormField label="Account title" name="accountTitle" defaultValue={profile?.accountTitle} />
            <FormField label="Account number (masked)" name="accountNumberMasked" defaultValue={profile?.accountNumberMasked} />
            <FormField label="Mobile wallet type" name="mobileWalletType" defaultValue={profile?.mobileWalletType} />
          </div>
        </section>
        <section className="space-y-4 rounded-[1.5rem] border border-border/70 bg-muted/30 p-5">
          <h2 className="text-xl font-semibold">Privacy review</h2>
          <div className="grid gap-3">
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="showRealName" defaultChecked={profile?.showRealName ?? false} />
              Show real name publicly
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="showProfilePhoto" defaultChecked={profile?.showProfilePhoto ?? false} />
              Show profile photo publicly
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="showExactLocation" defaultChecked={profile?.showExactLocation ?? false} />
              Show exact location publicly
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="allowDirectContact" defaultChecked={profile?.allowDirectContact ?? false} />
              Allow direct contact in future modules
            </label>
          </div>
        </section>
        <div className="flex flex-wrap gap-3">
          <Button formAction={saveBeneficiaryDraft}>Save draft</Button>
          <Button variant="outline" formAction={submitBeneficiaryOnboarding}>
            Submit for verification
          </Button>
        </div>
      </form>
    </div>
  );
}
