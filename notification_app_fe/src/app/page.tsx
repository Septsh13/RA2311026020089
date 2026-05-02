import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  Typography
} from "@mui/material";
import FilterBar from "@/components/FilterBar";
import NotificationPagination from "@/components/NotificationPagination";
import NotificationCard from "@/components/NotificationCard";
import {
  fetchNotifications,
  type NotificationItem,
  type NotificationType
} from "@/services/api";

const LIMIT = 10;
const validTypes: NotificationType[] = ["Placement", "Result", "Event"];

interface PageProps {
  searchParams: {
    page?: string;
    type?: string;
  };
}

function getPage(value?: string): number {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function getType(value?: string): NotificationType | undefined {
  return validTypes.find((type) => type === value);
}

function EmptyState() {
  return (
    <Box
      sx={{
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2,
        p: 4,
        textAlign: "center",
        backgroundColor: "background.paper"
      }}
    >
      <Typography variant="h6" fontWeight={700}>
        No notifications found
      </Typography>
      <Typography color="text.secondary">
        Try changing the selected type or page.
      </Typography>
    </Box>
  );
}

function NotificationList({ notifications }: { notifications: NotificationItem[] }) {
  if (notifications.length === 0) {
    return <EmptyState />;
  }

  return (
    <Stack spacing={2}>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} />
      ))}
    </Stack>
  );
}

export default async function AllNotificationsPage({ searchParams }: PageProps) {
  const page = getPage(searchParams.page);
  const type = getType(searchParams.type);
  const result = await fetchNotifications(LIMIT, page, type).catch(() => null);
  const pageCount = result ? Math.max(1, Math.ceil(result.total / LIMIT)) : 1;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
        >
          <Box>
            <Typography variant="h4" component="h1" fontWeight={800}>
              All Notifications
            </Typography>
            <Typography color="text.secondary">
              Browse placement, result, and event updates.
            </Typography>
          </Box>
          <Button LinkComponent={Link} href="/priority" variant="contained">
            Priority View
          </Button>
        </Stack>

        <FilterBar activeType={type} basePath="/" />

        {!result ? (
          <Alert severity="error">
            Notifications could not be loaded. Please try again later.
          </Alert>
        ) : (
          <>
            <NotificationList notifications={result.notifications} />
            <NotificationPagination
              basePath="/"
              count={pageCount}
              page={page}
              type={type}
            />
          </>
        )}
      </Stack>
    </Container>
  );
}
