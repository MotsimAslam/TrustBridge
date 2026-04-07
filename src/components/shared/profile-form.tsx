import { updateProfile } from "@/features/profiles/actions";
import { Button } from "@/components/ui/button";
import { FormField, TextareaField } from "@/components/shared/form-field";
import { Label } from "@/components/ui/label";

type ProfileData = {
  currentRole?: string | null;
  profile?: {
    fullName?: string | null;
    displayName?: string | null;
    bio?: string | null;
    country?: string | null;
    city?: string | null;
    preferredCategories?: string[];
    publicDonationHistoryEnabled?: boolean;
  } | null;
  beneficiaryProfile?: {
    showRealName?: boolean;
    showProfilePhoto?: boolean;
    showExactLocation?: boolean;
    allowDirectContact?: boolean;
  } | null;
  preferredLanguage: string;
};

export function ProfileForm({ user }: { user: ProfileData }) {
  return (
    <form action={updateProfile} className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Full name" name="fullName" defaultValue={user.profile?.fullName} />
        <FormField label="Display name" name="displayName" defaultValue={user.profile?.displayName} />
      </div>
      <TextareaField label="Bio" name="bio" defaultValue={user.profile?.bio} />
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Country" name="country" defaultValue={user.profile?.country} />
        <FormField label="City" name="city" defaultValue={user.profile?.city} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferredLanguage">Preferred language</Label>
        <select
          id="preferredLanguage"
          name="preferredLanguage"
          defaultValue={user.preferredLanguage}
          className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm"
        >
          <option value="en">English</option>
          <option value="ur">Urdu</option>
        </select>
      </div>
      {user.currentRole === "DONOR" ? (
        <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-muted/30 p-5">
          <p className="font-medium">Donor preferences</p>
          <FormField
            label="Preferred categories"
            name="preferredCategories"
            defaultValue={(user.profile?.preferredCategories ?? []).join(", ")}
            placeholder="health, education"
          />
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              name="publicDonationHistoryEnabled"
              defaultChecked={user.profile?.publicDonationHistoryEnabled ?? false}
            />
            Public donation history toggle
          </label>
        </div>
      ) : null}
      {user.currentRole === "BENEFICIARY" ? (
        <div className="space-y-4 rounded-[1.5rem] border border-border/70 bg-muted/30 p-5">
          <p className="font-medium">Beneficiary privacy controls</p>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="showRealName" defaultChecked={user.beneficiaryProfile?.showRealName ?? false} />
            Show real name
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="showProfilePhoto" defaultChecked={user.beneficiaryProfile?.showProfilePhoto ?? false} />
            Show profile photo
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="showExactLocation" defaultChecked={user.beneficiaryProfile?.showExactLocation ?? false} />
            Show exact location
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="allowDirectContact" defaultChecked={user.beneficiaryProfile?.allowDirectContact ?? false} />
            Allow direct contact
          </label>
        </div>
      ) : null}
      <div>
        <Button type="submit">Save settings</Button>
      </div>
    </form>
  );
}
