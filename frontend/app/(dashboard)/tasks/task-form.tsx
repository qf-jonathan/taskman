import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";
import { TaskCreate, TaskPublic, TaskStatus, TaskUpdate } from "@/core/models";
import { TaskService } from "@/core/services";
import { errorDetail, getInputDate, getISODate } from "@/core/utils";
import { Flex, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useHookFormMask } from "use-mask-input";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "@/components/ui/native-select";

interface TaskFormProps {
  task: TaskPublic | null;
  onCancel: () => void;
  onComplete: () => void;
}

export const TaskForm = ({
  task = null,
  onCancel,
  onComplete,
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskUpdate>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      dueDate: getInputDate(task?.dueDate),
      status: task?.status ?? TaskStatus.NEW,
    },
  });
  const registerWithMask = useHookFormMask(register);
  const isUpdateTask = Boolean(task?.id);
  console.log({ task, isUpdateTask });

  const onSubmit = async (data: TaskUpdate | TaskCreate) => {
    const currentData = { ...data, dueDate: getISODate(data.dueDate) };
    try {
      if (isUpdateTask) {
        await TaskService.update(task?.id as number, currentData as TaskUpdate);
      } else {
        await TaskService.create(currentData as TaskCreate);
      }
      toaster.success({
        title: "User information",
        description: "Your information has been updated successfully.",
      });
      onComplete();
    } catch (error) {
      toaster.error({
        title: "Delete failed",
        description: errorDetail(error),
      });
    }
  };

  return (
    <Flex
      as="form"
      direction="column"
      gap={2}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Field
        label="Title"
        errorText={errors.title?.message}
        invalid={!!errors.title}
      >
        <Input {...register("title", { required: "Title is required" })} />
      </Field>
      <Field
        label="Description"
        errorText={errors.description?.message}
        invalid={!!errors.description}
      >
        <Input {...register("description")} />
      </Field>
      <Field
        label="Due date"
        errorText={errors.dueDate?.message}
        invalid={!!errors.dueDate}
      >
        <Input
          {...registerWithMask("dueDate", "datetime", {
            inputFormat: "mm/dd/yyyy HH:MM:ss",
          })}
        />
      </Field>
      <Field
        label="Status"
        errorText={errors.status?.message}
        invalid={!!errors.status}
      >
        <NativeSelectRoot>
          <NativeSelectField {...register("status")}>
            <option value={TaskStatus.NEW}>New</option>
            <option value={TaskStatus.IN_PROGRESS}>In progress</option>
            <option value={TaskStatus.FINISHED}>Finished</option>
          </NativeSelectField>
        </NativeSelectRoot>
      </Field>
      <Flex gap={4} justifyContent="right">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Save
        </Button>
      </Flex>
    </Flex>
  );
};
