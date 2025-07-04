import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  FormErrors,
  UserDialogProps,
  UserFormData,
  UserRole,
} from "@/types/adminUser.ts";
import { UserFormFields } from "./user/UserFormFields.tsx";
import { validateUserForm } from "./user/UserFormValidation.ts";
import { handleUserSubmit } from "./user/UserFormSubmitHandler.ts";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";

export const UserDialog = (
  { selectedUser, teachers, onSuccess }: UserDialogProps,
) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    username: "",
    password: "",
    teacherId: null,
    role: "teacher", // Default to teacher role
  });

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        email: selectedUser.email || "",
        username: selectedUser.username || "",
        password: "", // Don't populate password for security reasons
        teacherId: selectedUser.teacherId || null,
        role: selectedUser.role || "teacher",
      });
    } else {
      setFormData({
        email: "",
        username: "",
        password: "",
        teacherId: null,
        role: "teacher", // Default to teacher role
      });
    }
    setErrors({});
  }, [selectedUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTeacherChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      teacherId: value === "none" ? null : value,
    }));
  };

  const handleRoleChange = (value: string) => {
    // Ensure the value is cast to UserRole type
    setFormData((prev) => ({ ...prev, role: value as UserRole }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateUserForm(formData, !!selectedUser);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const message = await handleUserSubmit(
        formData,
        selectedUser?.id,
        onSuccess,
        (errorMsg: string) => {
          toast({
            title: selectedUser ? "Error updating user" : "Error creating user",
            description: errorMsg,
            variant: "destructive",
          });
        },
      );

      toast({
        title: "Success",
        description: message,
      });
    } catch (_error) {
      // Error is handled in handleUserSubmit
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {selectedUser ? "Edit User" : "Add New User"}
        </DialogTitle>
        <DialogDescription>
          {selectedUser
            ? "Update the user's information and credentials."
            : "Create a new user account with access to the system."}
        </DialogDescription>
      </DialogHeader>

      {selectedUser && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Editing existing users requires admin privileges and is currently
            disabled.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <UserFormFields
          formData={formData}
          errors={errors}
          isEdit={!!selectedUser}
          teachers={teachers}
          handleInputChange={handleInputChange}
          handleTeacherChange={handleTeacherChange}
          handleRoleChange={handleRoleChange}
        />

        <DialogFooter>
          <Button
            type="submit"
            disabled={isProcessing || !!selectedUser}
            className="w-full sm:w-auto"
          >
            {isProcessing
              ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {selectedUser ? "Updating..." : "Creating..."}
                </>
              )
              : (
                selectedUser ? "Update User" : "Create User"
              )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
