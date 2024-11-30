"use client";

import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import { useAuth } from "@/hooks/auth";
import Sidebar from "@/components/common/sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Flex minHeight="100vh">
      <Sidebar />
      <Box flex="1" p="4">
        {children}
      </Box>
    </Flex>
  );
}
