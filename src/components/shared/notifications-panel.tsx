import { readNotification, updateNotificationPreferences } from "@/features/notifications/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type NotificationItem = {
  id: string;
  title: string;
  body: string;
  href: string | null;
  isRead: boolean;
  createdAt: Date;
};

type NotificationPreferences = {
  inAppEnabled: boolean;
  emailEnabled: boolean;
  securityEmailsOnly: boolean;
  marketingEnabled: boolean;
};

export function NotificationsPanel({
  notifications,
  preferences,
}: {
  notifications: NotificationItem[];
  preferences: NotificationPreferences;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-[1.25rem] border p-4 ${notification.isRead ? "border-border/60 bg-background" : "border-primary/30 bg-primary/5"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="font-medium">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.body}</p>
                    <p className="text-xs text-muted-foreground">
                      {notification.createdAt.toLocaleString()}
                    </p>
                  </div>
                  {!notification.isRead ? (
                    <form action={readNotification}>
                      <input type="hidden" name="notificationId" value={notification.id} />
                      <Button type="submit" size="sm" variant="outline">
                        Mark read
                      </Button>
                    </form>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateNotificationPreferences} className="space-y-4">
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="inAppEnabled" defaultChecked={preferences.inAppEnabled} />
              Enable in-app notifications
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="emailEnabled" defaultChecked={preferences.emailEnabled} />
              Enable email notifications
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                name="securityEmailsOnly"
                defaultChecked={preferences.securityEmailsOnly}
              />
              Security emails only
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input type="checkbox" name="marketingEnabled" defaultChecked={preferences.marketingEnabled} />
              Product updates and announcements
            </label>
            <Button type="submit">Save preferences</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
