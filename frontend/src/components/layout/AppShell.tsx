import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AppShell({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-muted">
      <div className="mx-auto max-w-5xl h-screen p-6">
        {children}
      </div>
    </div>
  );
}