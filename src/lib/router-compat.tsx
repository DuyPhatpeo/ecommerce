"use client";

// SSR Safety polyfill for localStorage in Next.js Server Components
if (typeof window === "undefined" && typeof globalThis !== "undefined") {
  if (!(globalThis as any).localStorage) {
    (globalThis as any).localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    };
  }
}

import React from "react";
import NextLink from "next/link";
import {
  useRouter as useNextRouter,
  usePathname as useNextPathname,
  useSearchParams as useNextSearchParams,
  useParams as useNextParams,
} from "next/navigation";

export type NavigateFunction = (to: string | number, options?: any) => void;

export function useNavigate(): NavigateFunction {
  const router = useNextRouter();
  return (to: string | number, options?: any) => {
    if (typeof to === "number") {
      if (to === -1) router.back();
      else if (to === 1) router.forward();
    } else {
      if (options?.replace) {
        router.replace(to);
      } else {
        router.push(to);
      }
    }
  };
}

export function useLocation() {
  const pathname = useNextPathname() || "/";
  const searchParams = useNextSearchParams();
  const search = searchParams ? `?${searchParams.toString()}` : "";
  return {
    pathname,
    search,
    hash: typeof window !== "undefined" ? window.location.hash : "",
    state: {} as any,
    key: "default",
  };
}

export function useParams<T extends Record<string, string | string[] | undefined> = Record<string, string>>(): T {
  const params = useNextParams();
  return (params || {}) as unknown as T;
}

export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const router = useNextRouter();
  const pathname = useNextPathname();

  const setSearchParams = (nextParams: any, options?: { replace?: boolean }) => {
    const sp = new URLSearchParams(nextParams);
    const target = `${pathname}?${sp.toString()}`;
    if (options?.replace) {
      router.replace(target);
    } else {
      router.push(target);
    }
  };

  return [searchParams || new URLSearchParams(), setSearchParams] as const;
}

export const Link = React.forwardRef<HTMLAnchorElement, any>(function Link(
  { to, href, children, ...props },
  ref
) {
  const target = to || href || "#";
  return (
    <NextLink ref={ref} href={target} {...props}>
      {children}
    </NextLink>
  );
});

export const NavLink = React.forwardRef<HTMLAnchorElement, any>(function NavLink(
  { to, href, className, children, ...props },
  ref
) {
  const pathname = useNextPathname();
  const target = to || href || "#";
  const isActive = pathname === target;
  const resolvedClass =
    typeof className === "function" ? className({ isActive }) : className;

  return (
    <NextLink ref={ref} href={target} className={resolvedClass} {...props}>
      {children}
    </NextLink>
  );
});

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useNextRouter();
  React.useEffect(() => {
    if (replace) router.replace(to);
    else router.push(to);
  }, [to, replace, router]);
  return null;
}

export function BrowserRouter({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Routes({ children, location }: { children: React.ReactNode; location?: any }) {
  return <>{children}</>;
}

export function Route({
  path,
  element,
  children,
}: {
  path?: string;
  element?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return <>{element || children}</>;
}

export function Outlet() {
  return null;
}
