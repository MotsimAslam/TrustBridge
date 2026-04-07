import { adminUpdateCampaignStatus, saveCampaignDraft, submitCampaignForReview, submitModerationReport } from "@/features/campaigns/actions";
import { Button } from "@/components/ui/button";
import { FormField, TextareaField } from "@/components/shared/form-field";
import { StatusBadge } from "@/components/shared/status-badge";

type CampaignItem = {
  id: string;
  title: string;
  shortDescription: string | null;
  description: string | null;
  category: string | null;
  urgency: string | null;
  targetAmount: { toString(): string } | null;
  city: string | null;
  country: string | null;
  coverImageKey: string | null;
  status: string;
  documents: { id: string; originalFilename: string }[];
};

export function BeneficiaryCampaignManager({
  campaigns,
  availableDocuments,
}: {
  campaigns: CampaignItem[];
  availableDocuments: { id: string; originalFilename: string }[];
}) {
  return (
    <div className="space-y-8">
      <form action={saveCampaignDraft} className="space-y-6 rounded-[1.5rem] border border-border/70 bg-muted/30 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Title" name="title" />
          <FormField label="Short description" name="shortDescription" />
          <FormField label="Category" name="category" />
          <FormField label="Urgency" name="urgency" />
          <FormField label="Target amount" name="targetAmount" type="number" />
          <FormField label="Cover image key" name="coverImageKey" />
          <FormField label="City" name="city" />
          <FormField label="Country" name="country" />
        </div>
        <TextareaField label="Description" name="description" />
        <div className="space-y-2">
          <label className="text-sm font-medium">Supporting document IDs</label>
          <input
            name="supportDocumentIds"
            className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm"
            defaultValue={availableDocuments.map((document) => document.id).join(",")}
          />
          <p className="text-xs text-muted-foreground">
            Available documents: {availableDocuments.map((document) => document.originalFilename).join(", ") || "None yet"}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="privacyShowRealName" />
            Show real name publicly
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input type="checkbox" name="privacyShowExactLocation" />
            Show exact location publicly
          </label>
        </div>
        <Button type="submit">Save draft</Button>
      </form>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="rounded-[1.5rem] border border-border/70 bg-background p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold">{campaign.title}</h3>
                  <StatusBadge value={campaign.status} />
                </div>
                <p className="text-sm text-muted-foreground">{campaign.shortDescription}</p>
              </div>
              <form action={submitCampaignForReview}>
                <input type="hidden" name="campaignId" value={campaign.id} />
                <Button type="submit" variant="outline" disabled={campaign.status !== "DRAFT"}>
                  Submit for review
                </Button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminCampaignStatusControls({
  campaignId,
}: {
  campaignId: string;
}) {
  return (
    <form action={adminUpdateCampaignStatus} className="flex flex-wrap gap-3">
      <input type="hidden" name="campaignId" value={campaignId} />
      {["APPROVED", "PUBLISHED", "REJECTED", "PAUSED"].map((status) => (
        <Button key={status} type="submit" name="status" value={status} variant="outline" size="sm">
          Mark {status.toLowerCase().replaceAll("_", " ")}
        </Button>
      ))}
    </form>
  );
}

export function ModerationReportForm({ campaignId }: { campaignId: string }) {
  return (
    <form action={submitModerationReport} className="space-y-4">
      <input type="hidden" name="campaignId" value={campaignId} />
      <FormField label="Reason" name="reason" placeholder="Misleading information" />
      <TextareaField label="Details" name="details" placeholder="Share any details that should be reviewed." />
      <Button type="submit" variant="outline">
        Report campaign
      </Button>
    </form>
  );
}
