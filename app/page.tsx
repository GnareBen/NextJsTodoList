"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect, FormEvent } from "react";
import { FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Task {
  id: number;
  name: string;
  completed?: boolean;
  createdAt: Date;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskName, setNewTaskName] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Charger les tâches depuis le localStorage au chargement du composant
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        // Conversion des dates stockées en objets Date
        setTasks(
          parsedTasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
          }))
        );
      } catch (error) {
        console.error("Erreur lors du chargement des tâches:", error);
      }
    }
  }, []);

  // Sauvegarder dans localStorage chaque fois que tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Fonction d'ajout de tâche
  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const taskInput = form.elements.namedItem("task") as HTMLInputElement;
    const task = taskInput.value.trim();

    if (task) {
      const newTask: Task = {
        id: tasks.length ? Math.max(...tasks.map((t) => t.id)) + 1 : 1,
        name: task,
        completed: false,
        createdAt: new Date(),
      };

      setTasks([...tasks, newTask]);
      form.reset();
    }
  };

  // Fonction de suppression
  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Préparer l'édition d'une tâche
  const prepareEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTaskName(task.name);
    setDialogOpen(true);
  };

  // Fonction d'édition
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

  // Fonction pour basculer l'état terminé
  const toggleTaskCompletion = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="flex flex-col justify-center items-center mt-6">
      <h1 className="font-bold text-6xl text-gray-800 mb-8">Todo List</h1>
      <div className="mt-6 w-full max-w-2xl px-4">
        <form onSubmit={addTask} className="w-full">
          <div className="flex w-full items-center gap-2">
            <Input
              className="flex-1 py-6"
              type="text"
              name="task"
              id="task"
              placeholder="Add new task ..."
            />
            <Button type="submit" className="py-6">
              Add task
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <ul className="w-full">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`flex items-center justify-between p-4 border-b border-gray-300 ${
                  task.completed ? "bg-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`p-1 rounded-full ${
                      task.completed
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <FaCheck size={14} />
                  </button>
                  <span
                    className={`text-lg ${
                      task.completed
                        ? "text-gray-500 line-through"
                        : "text-gray-800"
                    }`}
                  >
                    {task.name}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => prepareEditTask(task)}
                    className="text-blue-500 hover:text-blue-600 p-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-600 p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune tâche pour le moment. Ajoutez-en une !
            </div>
          )}
        </div>
      </div>

      {/* Dialog d'édition en dehors de la liste pour éviter les problèmes de rendu */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="name"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button onClick={saveEditedTask}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
