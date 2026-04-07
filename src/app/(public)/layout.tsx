import { GlobalHeader } from "@/components/layout/global-header";
import { getCurrentLocale } from "@/lib/i18n/locale";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getCurrentLocale();

  return (
    <div className="min-h-screen">
      <GlobalHeader locale={locale} authenticated={false} />
      {children}
    </div>
  );
}
