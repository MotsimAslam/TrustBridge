import { PageHeader } from "@/components/shared/page-header";
import { NotificationsPanel } from "@/components/shared/notifications-panel";
import { ensureAppUser } from "@/lib/auth/session";
import { getUserNotifications } from "@/server/services/notifications";

export default async function NotificationsPage() {
  const user = await ensureAppUser();
  const notifications = await getUserNotifications(user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Notifications"
        title="Notification center"
        description="In-app notifications and email preferences are now connected to platform lifecycle events."
      />
      <NotificationsPanel
        notifications={notifications}
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
