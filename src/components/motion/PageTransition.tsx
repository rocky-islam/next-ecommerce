import { ViewTransition, type ReactNode } from "react";

/**
 * Route-level enter/exit via React's <ViewTransition> + the browser View
 * Transitions API. App Router navigations are transitions, so this animates
 * automatically; unsupported browsers simply swap instantly.
 *
 * Must wrap content inside each page (layouts persist, so enter/exit
 * would never fire there). `default="none"` keeps Suspense reveals and
 * same-page updates (filters, cart) from triggering a page animation.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
