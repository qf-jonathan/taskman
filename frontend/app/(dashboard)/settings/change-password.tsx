import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";
import { UpdatePassword } from "@/core/models";
import { UserService } from "@/core/services";
import { errorDetail } from "@/core/utils";
import { Box, Input, Stack, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

export const ChangePassword = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<UpdatePassword>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (data: UpdatePassword) => {
    try {
      await UserService.changePassword(data);
      setValue("currentPassword", "");
      setValue("newPassword", "");
      toaster.success({
        title: "Password changed",
        description: "Your password has been changed successfully.",
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
        Change password
      </Text>
      <Box as="form" onSubmit={handleSubmit(onSubmit)} w={200}>
        <VStack direction="row" gap={6} width="full">
          <Field
            label="Current password"
            errorText={errors.currentPassword?.message}
            invalid={!!errors.currentPassword}
          >
            <Input
              {...register("currentPassword", {
                required: "Current password is required",
              })}
              type="password"
            />
          </Field>
          <Field
            label="New password"
            errorText={errors.newPassword?.message}
            invalid={!!errors.newPassword}
          >
            <Input
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              type="password"
            />
          </Field>
          <Button type="submit" loading={isSubmitting} width="full">
            Change password
          </Button>
        </VStack>
      </Box>
    </Stack>
  );
};
