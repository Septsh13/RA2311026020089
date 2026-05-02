import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import type { NotificationItem } from "@/services/api";

interface NotificationCardProps {
  notification: NotificationItem;
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default function NotificationCard({
  notification
}: NotificationCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: notification.read ? "divider" : "primary.main",
        borderLeftWidth: 5,
        backgroundColor: notification.read ? "background.paper" : "#eef4ff"
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={notification.type}
                color={notification.type === "Placement" ? "primary" : "default"}
                size="small"
              />
              {!notification.read && (
                <Chip label="Unread" color="warning" size="small" />
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {formatTimestamp(notification.timestamp)}
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.primary">
            {notification.message}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
