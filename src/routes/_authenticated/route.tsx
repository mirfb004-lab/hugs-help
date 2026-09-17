import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ensureSharedSession } from "@/lib/shared-session";

const UNLOCK_KEY = "loop:unlocked";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(UNLOCK_KEY) !== "true") {
      throw redirect({ to: "/auth" });
    }
    // Backend may be unavailable; the password gate alone controls access.
    try {
      await ensureSharedSession();
    } catch (err) {
      console.warn("Shared session unavailable", err);
    }
  },
  component: () => (
    <AppShell>
      <Outlet />
    </AppShell>
  ),
});
