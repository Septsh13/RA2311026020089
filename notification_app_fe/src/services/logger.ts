export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

const BASE_URL = "http://20.207.122.201/evaluation-service";

export async function Log(
  level: LogLevel,
  packageName: string,
  message: string
): Promise<void> {
  try {
    await fetch(`${BASE_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        stack: "frontend",
        level,
        package: packageName,
        message
      }),
      cache: "no-store"
    });
  } catch {
    // Logging must never interrupt the notification experience.
  }
}
