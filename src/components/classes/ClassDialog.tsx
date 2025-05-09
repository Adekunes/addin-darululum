
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClassForm } from "./components/ClassForm";
import { useClassSubmit } from "./hooks/useClassSubmit";
import { ClassFormData } from "./validation/classFormSchema";

interface ClassDialogProps {
  selectedClass: any;
  onClose: () => void;
}

export function ClassDialog({ selectedClass, onClose }: ClassDialogProps) {
  // Fetch teachers for dropdown
  const { data: teachers } = useQuery({
    queryKey: ['teachers-dropdown'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      return data;
    },
  });

  const classMutation = useClassSubmit({
    selectedClass,
    onSuccess: onClose,
  });

  const handleSubmit = (values: ClassFormData) => {
    classMutation.mutate(values);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {selectedClass ? "Edit Class" : "Create New Class"}
        </DialogTitle>
        <DialogDescription>
          {selectedClass
            ? "Update the class details and schedule."
            : "Add a new class with its schedule."}
        </DialogDescription>
      </DialogHeader>

      <ClassForm
        selectedClass={selectedClass}
        onSubmit={handleSubmit}
        onCancel={onClose}
        isSubmitting={classMutation.isPending}
        teachers={teachers}
      />
    </DialogContent>
  );
}
