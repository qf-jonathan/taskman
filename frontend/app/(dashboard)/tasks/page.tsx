"use client";

import { Button } from "@/components/ui/button";
import { TaskPublic, TasksPublic } from "@/core/models";
import { TaskService } from "@/core/services";
import { Text, Stack, Table, IconButton, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPen, LuPlus, LuTrash } from "react-icons/lu";
import { TaskForm } from "./task-form";
import { SimpleDialog } from "@/components/common/simple-dialog";
import { getLocalDate } from "@/core/utils";

export default function Tasks() {
  const [tasks, setTasks] = useState<TasksPublic | null>(null);
  const [currentTask, setCurrentTask] = useState<TaskPublic | {} | null>(null);

  useEffect(() => {
    TaskService.getMany().then((tasksPublic) => setTasks(tasksPublic));
  }, []);

  const onTaskFormComplete = () => {
    setCurrentTask(null);
    TaskService.getMany().then((tasksPublic) => setTasks(tasksPublic));
  };

  const onDeleteTask = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }
    TaskService.delete(id).then(() =>
      TaskService.getMany().then((tasksPublic) => setTasks(tasksPublic))
    );
    setCurrentTask(null);
  };

  return (
    <Stack gap={6}>
      <Text fontSize="2xl" fontWeight="bold">
        Tasks
      </Text>

      <Button bg="green.600" w={200} onClick={() => setCurrentTask({})}>
        <LuPlus /> Add Task
      </Button>

      <SimpleDialog
        title="Add Task"
        open={currentTask !== null}
        setOpen={() => setCurrentTask(null)}
      >
        <TaskForm
          task={currentTask as TaskPublic}
          onCancel={() => setCurrentTask(null)}
          onComplete={onTaskFormComplete}
        />
      </SimpleDialog>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Title</Table.ColumnHeader>
            <Table.ColumnHeader>Description</Table.ColumnHeader>
            <Table.ColumnHeader width={100}>Status</Table.ColumnHeader>
            <Table.ColumnHeader width={220}>Due date</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end" width={50}>
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tasks?.data.map((task) => (
            <Table.Row key={task.id}>
              <Table.Cell>{task.title}</Table.Cell>
              <Table.Cell>{task.description}</Table.Cell>
              <Table.Cell>{task.status}</Table.Cell>
              <Table.Cell>{getLocalDate(task.dueDate)}</Table.Cell>
              <Table.Cell justifyItems="end">
                <HStack gap={2}>
                  <IconButton size="sm" onClick={() => onDeleteTask(task.id)}>
                    <LuTrash />
                  </IconButton>
                  <IconButton size="sm" onClick={() => setCurrentTask(task)}>
                    <LuPen />
                  </IconButton>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
}
