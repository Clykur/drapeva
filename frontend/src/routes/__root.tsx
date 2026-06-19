import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { initAuthListener } from "@/lib/auth-store";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";
import { QuickView } from "@/components/quick-view";
import { WhatsAppButton } from "@/components/whatsapp-button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow text-gold">404</p>
        <h1 className="mt-3 font-display text-4xl">This piece is not in our atelier</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="mt-8 inline-block border-b border-foreground pb-1 eyebrow">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-foreground px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-border px-5 py-2.5 text-xs uppercase tracking-[0.2em]"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthRoute = pathname.startsWith("/auth");

  useEffect(() => {
    // Initialize Supabase auth state listener once at app root
    initAuthListener();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <main>
        <Outlet />
      </main>
      {!isAuthRoute && <SiteFooter />}
      <CartDrawer />
      <QuickView />
      <WhatsAppButton />
    </QueryClientProvider>
  );
}
