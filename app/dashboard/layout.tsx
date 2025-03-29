import Header from "@/components/Header";
import { ClerkLoaded } from "@clerk/nextjs";
import React from "react";
import ReduxProvider from "../state/redux";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkLoaded>
      <ReduxProvider>
        <div className="flex-1 flex flex-col h-screen">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </ReduxProvider>
    </ClerkLoaded>
  );
};

export default DashboardLayout;
