"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Task } from "@/types/task";
import { EditTaskDialog } from "@/components/EditTaskDialog";
import { TaskItem } from "@/components/TaskItem";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Définition du schéma de validation avec Zod
const taskSchema = z.object({
  name: z
    .string({
      required_error: "Le nom de la tâche est requis",
      invalid_type_error:
        "Le nom de la tâche doit être une chaîne de caractères",
    })
    .min(4, { message: "Le nom de la tâche doit avoir au moins 4 caractères" }),
  completed: z.boolean().optional(),
});

// Type inféré à partir du schéma Zod
type TaskFormValues = z.infer<typeof taskSchema>;

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Configuration du formulaire avec react-hook-form et Zod
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  const addTask = (values: TaskFormValues) => {
    const taskName = values.name.trim();

    if (taskName) {
      const newTask: Task = {
        id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        name: taskName,
        completed: false,
        createdAt: new Date(),
      };
      setTasks([...tasks, newTask]);
      form.reset();
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTaskName(task.name);
    setDialogOpen(true);
  };

  const saveEditedTask = () => {
    if (editingTask && newTaskName?.trim()) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, name: newTaskName.trim() }
            : task
        )
      );
      setDialogOpen(false);
      setEditingTask(null);
      setNewTaskName("");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-6">
      <h1 className="font-bold text-6xl text-gray-800 mb-8">Todo List</h1>
      <div className="mt-6 w-full max-w-2xl px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(addTask)} className="w-full">
            <div className="flex w-full items-start gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        className="py-6"
                        placeholder="Add new task ..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <div className="h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-start">
                <Button type="submit" className="py-6">
                  Add task
                </Button>
                <div className="h-5"></div>
              </div>
            </div>
          </form>
        </Form>
        <div className="mt-6">
          <ul className="w-full">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={(id) =>
                  setTasks(
                    tasks.map((t) =>
                      t.id === id ? { ...t, completed: !t.completed } : t
                    )
                  )
                }
                onEdit={handleEditTask}
                onDelete={(id) => setTasks(tasks.filter((t) => t.id !== id))}
              />
            ))}
          </ul>
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune tâche pour le moment. Ajoutez-en une !
            </div>
          )}
        </div>
      </div>

      <EditTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        taskName={newTaskName}
        onTaskNameChange={setNewTaskName}
        onSave={saveEditedTask}
      />
    </div>
  );
}
