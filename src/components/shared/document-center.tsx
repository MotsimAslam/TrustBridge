import { deleteDocument, registerDocument } from "@/features/documents/actions";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";

type DocumentItem = {
  id: string;
  type: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  reviewStatus: string;
  rejectionReason: string | null;
  createdAt: Date;
};

const documentTypes = [
  "NATIONAL_ID_FRONT",
  "NATIONAL_ID_BACK",
  "PROOF_OF_ADDRESS",
  "MEDICAL_DOCUMENT",
  "SCHOOL_FEE_SLIP",
  "QUOTATION_INVOICE",
  "PROFILE_SUPPORTING_IMAGE",
  "OTHER_SUPPORTING_DOCUMENT",
];

export function DocumentCenter({
  documents,
  verificationCaseId,
}: {
  documents: DocumentItem[];
  verificationCaseId?: string;
}) {
  return (
    <div className="space-y-6">
      <form action={registerDocument} className="grid gap-4 rounded-[1.5rem] border border-border/70 bg-muted/30 p-5 md:grid-cols-2">
        <input type="hidden" name="verificationCaseId" value={verificationCaseId ?? ""} />
        <div className="space-y-2">
          <label className="text-sm font-medium">Document type</label>
          <select name="type" className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm">
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Original filename</label>
          <input name="filename" className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm" placeholder="document.pdf" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">MIME type</label>
          <input name="mimeType" defaultValue="application/pdf" className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">File size (bytes)</label>
          <input name="sizeBytes" type="number" defaultValue="250000" className="h-11 w-full rounded-2xl border border-input bg-background px-4 text-sm" />
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Register secure document</Button>
        </div>
      </form>

      <div className="space-y-4">
        {documents.map((document) => (
          <div key={document.id} className="rounded-[1.5rem] border border-border/70 bg-background p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-medium">{document.originalFilename}</p>
                  <StatusBadge value={document.reviewStatus} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {document.type.replaceAll("_", " ")} · {document.mimeType} · {document.sizeBytes.toLocaleString()} bytes
                </p>
                {document.rejectionReason ? (
                  <p className="text-sm text-red-600 dark:text-red-300">
                    Reason: {document.rejectionReason}
                  </p>
                ) : null}
              </div>
              {document.reviewStatus === "UPLOADED" ? (
                <form action={deleteDocument}>
                  <input type="hidden" name="documentId" value={document.id} />
                  <Button type="submit" variant="outline" size="sm">
                    Delete before review
                  </Button>
                </form>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
