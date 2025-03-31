import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

// Define validation schema with Zod
const editTaskSchema = z.object({
  name: z
    .string({
      required_error: "Task name is required",
    })
    .min(4, { message: "Task name must be at least 4 characters" }),
});

type EditTaskFormValues = z.infer<typeof editTaskSchema>;

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskName: string;
  onTaskNameChange: (name: string) => void;
  onSave: () => void;
}

export function EditTaskDialog({
  open,
  onOpenChange,
  taskName,
  onTaskNameChange,
  onSave,
}: EditTaskDialogProps) {
  const form = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      name: taskName
    }
  });
  
  // Update form value when taskName prop changes
  useEffect(() => {
    form.reset({ name: taskName });
  }, [taskName, form]);

  const handleSubmit = (values: EditTaskFormValues) => {
    onTaskNameChange(values.name);
    onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
