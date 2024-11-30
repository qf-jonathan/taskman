'use client';

import { UserPublic } from "@/core/models";
import { LoginService, UserService } from "@/core/services";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const isLoggedIn = (): boolean => {
  return localStorage.getItem("token") !== null;
};

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserPublic | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      UserService.getMe()
        .then((user) => {
          setUser(user);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          router.replace("/login");
        });
    } else {
      router.replace("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    LoginService.logout();
    router.replace("/login");
  };

  return { isLoading, user, logout };
};
