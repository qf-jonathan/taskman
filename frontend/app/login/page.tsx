"use client";

import { useState } from "react";
import { Credentials } from "@/core/models";
import {
  VStack,
  Input,
  IconButton,
  Container,
  Text,
  Group,
  InputAddon,
} from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { emailPattern, errorDetail } from "@/core/utils";
import Link from "next/link";
import { LoginService } from "@/core/services";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Credentials>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: Credentials) => {
    if (isSubmitting) return;
    try {
      await LoginService.login(data);
      router.replace("/");
    } catch (error) {
      toaster.error({
        title: "Sign up failed",
        description: errorDetail(error),
      });
    }
  };

  return (
    <Container
      height="100vh"
      maxW="sm"
      alignItems="stretch"
      justifyContent="center"
      centerContent
    >
      <VStack gap={6} width="full">
        <Text fontSize="2xl" fontWeight="bold">
          Taskman
        </Text>
        <Container as="form" onSubmit={handleSubmit(onSubmit)} width="full">
          <VStack direction="row" gap={6} width="full">
            <Field
              label="Email"
              errorText={errors.username?.message}
              invalid={!!errors.username}
            >
              <Input
                {...register("username", {
                  required: "Username is required",
                  pattern: emailPattern,
                })}
                placeholder="email@example.com"
              />
            </Field>
            <Field
              label="Password"
              errorText={errors.password?.message}
              invalid={!!errors.password}
            >
              <Group width="full" attached>
                <Input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                />
                <InputAddon>
                  <IconButton
                    variant="ghost"
                    size="2xs"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <LuEyeOff /> : <LuEye />}
                  </IconButton>
                </InputAddon>
              </Group>
            </Field>
            <Button type="submit" loading={isSubmitting} width="full">
              Log In
            </Button>
          </VStack>
        </Container>
        <Text fontSize="sm" color="ui.dim">
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </Text>
      </VStack>
    </Container>
  );
}
