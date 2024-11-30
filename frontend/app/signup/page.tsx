"use client";

import { UserRegister } from "@/core/models";
import { VStack, Input, Container, Text } from "@chakra-ui/react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { useForm } from "react-hook-form";
import { emailPattern, errorDetail } from "@/core/utils";
import Link from "next/link";
import { UserService } from "@/core/services";
import { useRouter } from "next/navigation";
import { toaster } from "@/components/ui/toaster";

type UserRegisterForm = UserRegister & {
  confirmPassword: string;
};

export default function SignUp() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: UserRegisterForm) => {
    if (isSubmitting) return;
    try {
      await UserService.signup(data);
      router.push("/login");
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
          Sign Up
        </Text>
        <Container as="form" onSubmit={handleSubmit(onSubmit)} width="full">
          <VStack direction="row" gap={6} width="full">
            <Field
              label="Full name"
              errorText={errors.fullName?.message}
              invalid={!!errors.fullName}
            >
              <Input {...register("fullName")} />
            </Field>
            <Field
              label="Email"
              errorText={errors.email?.message}
              invalid={!!errors.email}
            >
              <Input
                {...register("email", {
                  required: "Email is required",
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
              <Input
                {...register("password", {
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  required: "Password is required",
                })}
                type="password"
                placeholder="Password"
              />
            </Field>
            <Field
              label="Confirm password"
              errorText={errors.confirmPassword?.message}
              invalid={!!errors.confirmPassword}
            >
              <Input
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    getValues("password") === value || "Passwords must match",
                })}
                type="password"
                placeholder="Confirm password"
              />
            </Field>
            <Button type="submit" loading={isSubmitting} width="full">
              Sign up
            </Button>
          </VStack>
        </Container>
        <Text fontSize="sm" color="ui.dim">
          Already have an account? <Link href="/">Sign in</Link>
        </Text>
      </VStack>
    </Container>
  );
}
