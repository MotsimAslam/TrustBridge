import { PageHeader } from "@/components/shared/page-header";
import { SectionCard } from "@/components/shared/section-card";
import { NotificationsPanel } from "@/components/shared/notifications-panel";
import { ProfileForm } from "@/components/shared/profile-form";
import { ensureAppUser } from "@/lib/auth/session";
import { getUserNotifications } from "@/server/services/notifications";

export default async function SettingsPage() {
  const user = await ensureAppUser();
  const notifications = await getUserNotifications(user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Account settings"
        title="Settings foundation"
        description="Profile, language, privacy, and security placeholders are organized here for every role."
      />
      <SectionCard title="Account profile" description="Sensitive identity changes stay with Clerk-managed auth flows.">
        <ProfileForm user={user} />
      </SectionCard>
      <NotificationsPanel
        notifications={notifications.slice(0, 5)}
        preferences={
          user.notificationPreference ?? {
            inAppEnabled: true,
            emailEnabled: true,
            securityEmailsOnly: false,
            marketingEnabled: false,
          }
        }
      />
    </div>
  );
}
