import { Log } from "./logger";
import { mockNotifications, type Notification } from "@/mocks/notifications";

const BASE_URL = "http://20.207.122.201/evaluation-service";
const USE_MOCK = true;

export type NotificationType = "Placement" | "Result" | "Event";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface FetchNotificationsResponse {
  notifications: NotificationItem[];
  total: number;
  page: number;
  limit: number;
}

type UnknownRecord = Record<string, unknown>;

let authToken: string | null = null;
let registered = false;
let clientId: string | null = process.env.CLIENT_ID ?? null;
let clientSecret: string | null = process.env.CLIENT_SECRET ?? null;

function getRequiredEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not configured`);
  }

  return value;
}

function getRegistrationPayload() {
  return {
    email: getRequiredEnv("APP_EMAIL"),
    name: getRequiredEnv("APP_NAME"),
    rollNo: getRequiredEnv("APP_ROLL_NO"),
    mobileNo: getRequiredEnv("APP_MOBILE_NO"),
    githubUsername: getRequiredEnv("APP_GITHUB_USERNAME"),
    accessCode: getRequiredEnv("ACCESS_CODE")
  };
}

function readToken(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    throw new Error("Authentication response was empty");
  }

  const record = payload as UnknownRecord;
  const token =
    record.access_token ??
    record.accessToken ??
    record.token ??
    record.authToken;

  if (typeof token !== "string" || token.length === 0) {
    throw new Error("Authentication token missing from response");
  }

  return token;
}

function captureClientCredentials(payload: unknown): void {
  if (!payload || typeof payload !== "object") {
    return;
  }

  const record = payload as UnknownRecord;
  const possibleClientId = record.clientID ?? record.clientId ?? record.client_id;
  const possibleClientSecret =
    record.clientSecret ?? record.client_secret ?? record.clientSECRET;

  if (typeof possibleClientId === "string") {
    clientId = possibleClientId;
  }

  if (typeof possibleClientSecret === "string") {
    clientSecret = possibleClientSecret;
  }
}

function normalizeNotification(raw: unknown, index: number): NotificationItem {
  const item = (raw && typeof raw === "object" ? raw : {}) as UnknownRecord;
  const type = item.type;
  const timestamp = item.timestamp ?? item.createdAt ?? item.created_at;
  const message = item.message ?? item.title ?? item.body;
  const id = item.id ?? item.notificationId ?? `${timestamp ?? "notification"}-${index}`;
  const read = item.read ?? item.isRead ?? item.seen;

  return {
    id: String(id),
    type:
      type === "Placement" || type === "Result" || type === "Event"
        ? type
        : "Event",
    message: typeof message === "string" ? message : "No message provided",
    timestamp:
      typeof timestamp === "string" ? timestamp : new Date().toISOString(),
    read: Boolean(read)
  };
}

function normalizeNotificationsResponse(
  payload: unknown,
  fallbackPage: number,
  fallbackLimit: number
): FetchNotificationsResponse {
  const record = (payload && typeof payload === "object" ? payload : {}) as UnknownRecord;
  const list = Array.isArray(record.notifications)
    ? record.notifications
    : Array.isArray(record.data)
      ? record.data
      : Array.isArray(payload)
        ? payload
        : [];

  const notifications = list.map(normalizeNotification);
  const total =
    typeof record.total === "number"
      ? record.total
      : typeof record.count === "number"
        ? record.count
        : notifications.length;

  return {
    notifications,
    total,
    page: typeof record.page === "number" ? record.page : fallbackPage,
    limit: typeof record.limit === "number" ? record.limit : fallbackLimit
  };
}

export async function register(): Promise<void> {
  if (registered) {
    return;
  }

  if (clientId && clientSecret) {
    registered = true;
    return;
  }

  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(getRegistrationPayload()),
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");

    if (errorText.includes("email already exists")) {
      await Log(
        "warn",
        "api",
        "Registration already exists; client credentials are required in environment"
      );
      registered = true;
      return;
    }

    await Log(
      "error",
      "api",
      `Registration failed with status ${response.status}`
    );
    throw new Error("Unable to register application");
  }

  captureClientCredentials(await response.json().catch(() => null));
  registered = true;
  await Log("info", "api", "Application registered successfully");
}

export async function getAuthToken(): Promise<string> {
  if (authToken) {
    return authToken;
  }

  await register();

  if (!clientId || !clientSecret) {
    await Log("error", "api", "Client credentials are missing for authentication");
    throw new Error("CLIENT_ID and CLIENT_SECRET are required for authentication");
  }

  const authPayload = {
    ...getRegistrationPayload(),
    clientID: clientId,
    clientSecret
  };

  const response = await fetch(`${BASE_URL}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(authPayload),
    cache: "no-store"
  });

  if (!response.ok) {
    await Log("error", "api", `Token request failed with status ${response.status}`);
    throw new Error("Unable to get auth token");
  }

  authToken = readToken(await response.json());
  await Log("info", "api", "Authentication token received");

  return authToken;
}

export async function fetchNotifications(
  limit: number,
  page: number,
  type?: NotificationType
): Promise<FetchNotificationsResponse> {
  if (USE_MOCK) {
    const filteredNotifications = type
      ? mockNotifications.filter((notification) => notification.Type === type)
      : mockNotifications;
    const startIndex = (page - 1) * limit;
    const paginatedNotifications = filteredNotifications.slice(
      startIndex,
      startIndex + limit
    );
    const notifications = paginatedNotifications.map(
      (notification: Notification, index): NotificationItem => ({
        id: notification.id,
        type: notification.Type,
        message: notification.Message,
        timestamp: notification.Timestamp,
        read: index % 3 !== 0
      })
    );

    return {
      notifications,
      total: filteredNotifications.length,
      page,
      limit
    };
  }

  const token = await getAuthToken();
  const params = new URLSearchParams({
    limit: String(limit),
    page: String(page)
  });

  if (type) {
    params.set("type", type);
  }

  const response = await fetch(`${BASE_URL}/notifications?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    await Log("error", "api", `Notification fetch failed with status ${response.status}`);
    throw new Error("Unable to fetch notifications");
  }

  const data = normalizeNotificationsResponse(await response.json(), page, limit);
  await Log("info", "api", `Fetched ${data.notifications.length} notifications`);

  return data;
}
