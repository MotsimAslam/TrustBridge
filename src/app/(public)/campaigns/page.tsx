import { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { listPublicCampaigns } from "@/server/services/campaigns";

export const metadata: Metadata = {
  title: "Campaign discovery",
  description: "Browse verified TrustBridge campaigns by urgency, category, and location.",
};

export default async function CampaignsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; urgency?: string; location?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const campaigns = await listPublicCampaigns();
  const filtered = campaigns
    .filter((campaign) =>
      params.q
        ? `${campaign.title} ${campaign.description} ${campaign.shortDescription}`
            .toLowerCase()
            .includes(params.q.toLowerCase())
        : true,
    )
    .filter((campaign) =>
      params.category ? campaign.category?.toLowerCase() === params.category.toLowerCase() : true,
    )
    .filter((campaign) =>
      params.urgency ? campaign.urgency?.toLowerCase() === params.urgency.toLowerCase() : true,
    )
    .filter((campaign) =>
      params.location ? campaign.safeLocation.toLowerCase().includes(params.location.toLowerCase()) : true,
    )
    .sort((a, b) => {
      if (params.sort === "urgent") {
        return (a.urgency ?? "").localeCompare(b.urgency ?? "");
      }
      return new Date(b.publishedAt ?? b.createdAt).getTime() - new Date(a.publishedAt ?? a.createdAt).getTime();
    });

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 max-w-2xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Campaign discovery</p>
        <h1 className="text-4xl font-semibold tracking-tight">Public campaign browsing foundation</h1>
        <p className="text-muted-foreground">
          Discovery is wired for privacy-safe campaign rendering and future search, filters, sorting, and donor actions.
        </p>
      </div>
      <form className="mb-8 grid gap-3 md:grid-cols-5">
        <input name="q" defaultValue={params.q ?? ""} placeholder="Search campaigns" className="h-11 rounded-2xl border border-input bg-background px-4 text-sm md:col-span-2" />
        <input name="category" defaultValue={params.category ?? ""} placeholder="Category" className="h-11 rounded-2xl border border-input bg-background px-4 text-sm" />
        <input name="urgency" defaultValue={params.urgency ?? ""} placeholder="Urgency" className="h-11 rounded-2xl border border-input bg-background px-4 text-sm" />
        <input name="location" defaultValue={params.location ?? ""} placeholder="City or country" className="h-11 rounded-2xl border border-input bg-background px-4 text-sm" />
        <select name="sort" defaultValue={params.sort ?? "latest"} className="h-11 rounded-2xl border border-input bg-background px-4 text-sm">
          <option value="latest">Latest</option>
          <option value="urgent">Most urgent</option>
        </select>
        <Button type="submit" variant="outline" className="md:col-span-5 w-fit">
          Apply filters
        </Button>
      </form>
      <div className="grid gap-6">
        {filtered.map((campaign) => (
          <Card key={campaign.slug}>
            <CardContent className="grid gap-6 px-6 py-8 md:grid-cols-[220px_1fr]">
              <div className="h-48 rounded-[1.5rem] bg-gradient-to-br from-primary/20 via-secondary to-background" />
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <StatusBadge value="PUBLISHED" />
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {campaign.category}
                  </span>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                    {campaign.urgency} urgency
                  </span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">{campaign.title}</h2>
                  <p className="text-muted-foreground">{campaign.shortDescription}</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span>{campaign.safeBeneficiaryName}</span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4" />
                    {campaign.safeLocation}
                  </span>
                </div>
                <Button asChild>
                  <Link href={`/campaigns/${campaign.slug}`}>View campaign</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
