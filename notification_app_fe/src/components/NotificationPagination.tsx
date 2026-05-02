"use client";

import Link from "next/link";
import { Pagination, PaginationItem } from "@mui/material";
import type { NotificationType } from "@/services/api";

interface NotificationPaginationProps {
  basePath: string;
  count: number;
  page: number;
  type?: NotificationType;
}

function buildPageHref(
  basePath: string,
  page: number,
  type?: NotificationType
): string {
  const params = new URLSearchParams({
    page: String(page)
  });

  if (type) {
    params.set("type", type);
  }

  return `${basePath}?${params.toString()}`;
}

export default function NotificationPagination({
  basePath,
  count,
  page,
  type
}: NotificationPaginationProps) {
  return (
    <Pagination
      count={count}
      page={page}
      color="primary"
      renderItem={(item) => (
        <PaginationItem
          component={Link}
          href={buildPageHref(basePath, item.page ?? 1, type)}
          {...item}
        />
      )}
      sx={{ alignSelf: "center" }}
    />
  );
}
