"use client";

import React from "react";
import { StoreProvider } from "../../lib/store";
import { DashboardLayout } from "../../components/dashboard";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </StoreProvider>
  );
}
