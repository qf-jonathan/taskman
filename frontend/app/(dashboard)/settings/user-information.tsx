import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";
import { UserPublic, UserUpdate } from "@/core/models";
import { UserService } from "@/core/services";
import { emailPattern, errorDetail } from "@/core/utils";
import { Box, Input, Stack, Text, VStack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface UserInformationProps {
  user: UserPublic | null;
}

export const UserInformation = ({ user }: UserInformationProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<UserUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      fullName: user?.fullName,
      email: user?.email,
    },
  });

  useEffect(() => {
    setValue("fullName", user?.fullName);
    setValue("email", user?.email);
  }, [user]);

  const onSubmit = async (data: UserUpdate) => {
    try {
      await UserService.updateMe(data);
      toaster.success({
        title: "User information",
        description: "Your information has been updated successfully.",
      });
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
        User Information
      </Text>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} w={200}>
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
            />
          </Field>
          <Button type="submit" loading={isSubmitting} width="full">
            Update Information
          </Button>
        </VStack>
      </Box>
    </Stack>
  );
};
