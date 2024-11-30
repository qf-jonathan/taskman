import { toaster } from "@/components/ui/toaster";
import { LoginService, UserService } from "@/core/services";
import { errorDetail } from "@/core/utils";
import { Button, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export const DangerZone = () => {
  const router = useRouter();
  const onDeleteHandler = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }
    try {
      await UserService.deleteMe();
      await LoginService.logout();
      router.replace("/login");
    } catch (error) {
      toaster.error({
        title: "Delete failed",
        description: errorDetail(error),
      });
    }
  };

  return (
    <Stack p={4} gap={4}>
      <Text fontSize="large" fontWeight="bold">
        Delete Account
      </Text>
      <Text>
        Permanently delete your data and everything associated with your
        account.
      </Text>
      <Button bgColor="red.400" size="lg" w={200} onClick={onDeleteHandler}>
        Delete Account
      </Button>
    </Stack>
  );
};
