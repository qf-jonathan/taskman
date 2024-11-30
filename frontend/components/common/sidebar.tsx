import { LoginService } from "@/core/services";
import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FiHome, FiBriefcase, FiSettings, FiLogOut } from "react-icons/fi";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const items = [
  { icon: FiHome, title: "Dashboard", path: "/" },
  { icon: FiBriefcase, title: "Tasks", path: "/tasks" },
  { icon: FiSettings, title: "User Settings", path: "/settings" },
];

const Sidebar = () => {
  const router = useRouter();

  const listItems = items.map((item) => (
    <Link href={item.path} key={item.title}>
      <Flex key={item.title} alignItems="center" gap={2}>
        <item.icon />
        <Text fontWeight="bold">{item.title}</Text>
      </Flex>
    </Link>
  ));

  const logout = () => {
    LoginService.logout();
    router.replace("/login");
  };

  return (
    <Box
      bg="blackAlpha.200"
      p={3}
      h="100vh"
      position="sticky"
      top="0"
      display={{ base: "none", md: "flex" }}
    >
      <Flex flexDir="column" justify="space-between" p={4} borderRadius={12}>
        <Flex flexDir="column" gap={4}>
          <Text fontWeight="bold" fontSize="2xl" marginBottom={5}>
            Taskman
          </Text>
          {listItems}
        </Flex>
        <Button bgColor="red.400" onClick={logout}>
          <FiLogOut /> Logout
        </Button>
      </Flex>
    </Box>
  );
};

export default Sidebar;
