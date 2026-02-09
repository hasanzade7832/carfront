import * as signalR from "@microsoft/signalr";
import { getToken } from "./auth";

let connection: signalR.HubConnection | null = null;

export function getHub() {
  if (connection) return connection;

  const hubUrl = process.env.NEXT_PUBLIC_HUB_URL!;
  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => getToken() ?? "",
      transport: signalR.HttpTransportType.WebSockets,
      withCredentials: false,
    })
    .withAutomaticReconnect([0, 1000, 2000, 5000, 10000])
    .build();

  return connection;
}

export async function ensureHubStarted() {
  const hub = getHub();
  if (hub.state === signalR.HubConnectionState.Connected) return;
  if (hub.state === signalR.HubConnectionState.Connecting) return;

  try {
    await hub.start();
  } catch (e) {
    // اگر fail شد، reconnect policy خودش دوباره تلاش می‌کنه
    // ولی این هم یک fallback ساده:
    setTimeout(() => ensureHubStarted(), 1500);
  }
}
