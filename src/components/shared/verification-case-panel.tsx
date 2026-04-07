import { addAdminNote, updateVerificationCase } from "@/features/admin/actions";
import { reviewDocument } from "@/features/documents/actions";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { TextareaField } from "@/components/shared/form-field";

type CaseData = {
  id: string;
  status: string;
  decisionNotes: string | null;
  beneficiary: {
    email: string;
    profile: { fullName: string | null; city: string | null; country: string | null } | null;
    beneficiaryProfile: {
      legalFullName: string | null;
      phoneNumber: string | null;
      city: string | null;
      country: string | null;
      showRealName: boolean;
      showExactLocation: boolean;
    } | null;
  };
  documents: {
    id: string;
    originalFilename: string;
    type: string;
    reviewStatus: string;
    rejectionReason: string | null;
  }[];
  adminNotes: {
    id: string;
    body: string;
    createdAt: Date;
    author: { profile: { displayName: string | null } | null };
  }[];
};

export function VerificationCasePanel({ verificationCase }: { verificationCase: CaseData }) {
  const beneficiary = verificationCase.beneficiary;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-border/70 bg-background p-6">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold">Beneficiary information</h3>
            <StatusBadge value={verificationCase.status} />
          </div>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>Name: {beneficiary.beneficiaryProfile?.legalFullName ?? beneficiary.profile?.fullName ?? "Not provided"}</p>
            <p>Email: {beneficiary.email}</p>
            <p>Phone: {beneficiary.beneficiaryProfile?.phoneNumber ?? "Not provided"}</p>
            <p>
              Privacy: real name {beneficiary.beneficiaryProfile?.showRealName ? "visible" : "hidden"}, exact location{" "}
              {beneficiary.beneficiaryProfile?.showExactLocation ? "visible" : "hidden"}
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-border/70 bg-background p-6">
          <h3 className="text-xl font-semibold">Uploaded documents</h3>
          <div className="mt-4 space-y-4">
            {verificationCase.documents.map((document) => (
              <div key={document.id} className="rounded-2xl border border-border/70 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="font-medium">{document.originalFilename}</p>
                    <p className="text-sm text-muted-foreground">{document.type.replaceAll("_", " ")}</p>
                    <StatusBadge value={document.reviewStatus} />
                    {document.rejectionReason ? (
                      <p className="text-sm text-red-600 dark:text-red-300">{document.rejectionReason}</p>
                    ) : null}
                  </div>
                  <form action={reviewDocument} className="flex flex-wrap gap-2">
                    <input type="hidden" name="documentId" value={document.id} />
                    {["APPROVED", "REJECTED", "NEEDS_RESUBMISSION", "UNDER_REVIEW"].map((status) => (
                      <Button key={status} type="submit" size="sm" variant="outline" name="reviewStatus" value={status}>
                        {status.toLowerCase().replaceAll("_", " ")}
                      </Button>
                    ))}
                    <input name="rejectionReason" className="h-9 rounded-xl border border-input px-3 text-sm" placeholder="Reason if rejected" />
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[1.5rem] border border-border/70 bg-background p-6">
          <h3 className="text-xl font-semibold">Decision panel</h3>
          <form action={updateVerificationCase} className="mt-4 space-y-4">
            <input type="hidden" name="caseId" value={verificationCase.id} />
            <select name="status" defaultValue={verificationCase.status} className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm">
              {["IN_REVIEW", "APPROVED", "REJECTED", "NEEDS_MORE_INFO"].map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            <textarea
              name="decisionNotes"
              defaultValue={verificationCase.decisionNotes ?? ""}
              className="min-h-28 w-full rounded-3xl border border-input bg-background px-4 py-3 text-sm"
              placeholder="Decision rationale"
            />
            <Button type="submit">Save decision</Button>
          </form>
        </div>

        <div className="rounded-[1.5rem] border border-border/70 bg-background p-6">
          <h3 className="text-xl font-semibold">Timeline and notes</h3>
          <div className="mt-4 space-y-4">
            {verificationCase.adminNotes.map((note) => (
              <div key={note.id} className="rounded-2xl border border-border/70 p-4">
                <p className="text-sm">{note.body}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {note.author.profile?.displayName ?? "Admin"} · {note.createdAt.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <form action={addAdminNote} className="mt-4 space-y-4">
            <input type="hidden" name="caseId" value={verificationCase.id} />
            <TextareaField label="Add note" name="body" />
            <Button type="submit" variant="outline">
              Add note
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
