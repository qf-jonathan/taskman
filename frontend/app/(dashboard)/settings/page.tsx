"use client";

import { useAuth } from "@/hooks/auth";
import { Tabs, Text, Stack } from "@chakra-ui/react";
import { LuUser, LuKey, LuAlertTriangle } from "react-icons/lu";
import { DangerZone } from "./danger-zone";
import { ChangePassword } from "./change-password";
import { UserInformation } from "./user-information";

export default function Settings() {
  const { user } = useAuth();

  return (
    <Stack gap={6}>
      <Text fontSize="2xl" fontWeight="bold">
        User Settings
      </Text>
      <Tabs.Root defaultValue="members">
        <Tabs.List>
          <Tabs.Trigger value="members">
            <LuUser />
            My profile
          </Tabs.Trigger>
          <Tabs.Trigger value="password">
            <LuKey />
            Password
          </Tabs.Trigger>
          <Tabs.Trigger value="danger">
            <LuAlertTriangle />
            Danger Zone
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="members">
          <UserInformation user={user} />
        </Tabs.Content>
        <Tabs.Content value="password">
          <ChangePassword />
        </Tabs.Content>
        <Tabs.Content value="danger">
          <DangerZone />
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  );
}
