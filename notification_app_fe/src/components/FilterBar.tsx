import Link from "next/link";
import { Box, Button, ButtonGroup, Stack, Typography } from "@mui/material";
import type { NotificationType } from "@/services/api";

const notificationTypes: NotificationType[] = ["Placement", "Result", "Event"];

interface FilterBarProps {
  activeType?: NotificationType;
  basePath: string;
}

function buildHref(basePath: string, type?: NotificationType): string {
  const params = new URLSearchParams();

  if (type) {
    params.set("type", type);
  }

  params.set("page", "1");
  return `${basePath}?${params.toString()}`;
}

export default function FilterBar({ activeType, basePath }: FilterBarProps) {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 2
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Filter by type
        </Typography>
        <ButtonGroup
          variant="outlined"
          aria-label="notification type filters"
          sx={{
            flexWrap: "wrap",
            "& .MuiButton-root": {
              minWidth: 96
            }
          }}
        >
          <Button
            LinkComponent={Link}
            href={buildHref(basePath)}
            variant={!activeType ? "contained" : "outlined"}
          >
            All
          </Button>
          {notificationTypes.map((type) => (
            <Button
              key={type}
              LinkComponent={Link}
              href={buildHref(basePath, type)}
              variant={activeType === type ? "contained" : "outlined"}
            >
              {type}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>
    </Box>
  );
}
