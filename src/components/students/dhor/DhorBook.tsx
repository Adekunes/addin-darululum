import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client.ts";
import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { RevisionTabs } from "@/components/students/dhor/RevisionTabs.tsx";
import { NewRevisionDialog } from "@/components/students/dhor/NewRevisionDialog.tsx";
import { AlertCircle } from "lucide-react";

interface DhorBookProps {
  studentId: string;
  studentName: string;
}

export const DhorBook = ({ studentId, studentName }: DhorBookProps) => {
  const [isNewRevisionDialogOpen, setIsNewRevisionDialogOpen] = useState(false);

  // First fetch the student to verify they exist
  const { data: studentData, isLoading: isStudentLoading } = useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      console.log(`Checking if student exists with ID: ${studentId}`);

      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();

      if (error) {
        console.error("Error fetching student:", error);
        return null;
      }

      if (data) {
        console.log("Student found:", data.name);
      } else {
        console.log("No student found with ID:", studentId);
      }

      return data;
    },
  });

  // Only fetch other data if student exists
  const { isLoading } = useQuery({
    queryKey: ["difficult-ayahs", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("difficult_ayahs")
        .select("*")
        .eq("student_id", studentId)
        .order("surah_number", { ascending: true })
        .order("ayah_number", { ascending: true });

      if (error) {
        console.error("Error fetching difficult ayahs:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!studentData, // Only run this query if student exists
  });

  const {
    data: juzRevisions,
    isLoading: isRevisionsLoading,
    refetch: refetchRevisions,
  } = useQuery({
    queryKey: ["juz-revisions", studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("juz_revisions")
        .select("*")
        .eq("student_id", studentId)
        .order("revision_date", { ascending: false });

      if (error) {
        console.error("Error fetching juz revisions:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!studentData, // Only run this query if student exists
  });

  const onRevisionSuccess = () => {
    refetchRevisions();
  };

  if (isStudentLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 border rounded-lg bg-muted/20">
        <AlertCircle className="h-10 w-10 text-yellow-500" />
        <h3 className="text-lg font-medium">Student Not Found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          The student with ID {studentId}{" "}
          could not be found. Please check that the student ID is correct or
          select another student.
        </p>
      </div>
    );
  }

  if (isLoading || isRevisionsLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {studentName}
          </Badge>
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <h2 className="text-2xl font-bold">Dhor Book</h2>
        <Badge variant="secondary">
          {studentName}
        </Badge>
      </div>
      <p className="text-muted-foreground">
        Here you can track revisions and difficult ayahs for the student.
      </p>

      <ScrollArea className="h-[500px] w-full rounded-md border">
        <RevisionTabs
          studentId={studentId}
          studentName={studentName}
          juzRevisions={juzRevisions || []}
          loading={isRevisionsLoading}
          onAddJuzRevision={() => setIsNewRevisionDialogOpen(true)}
        />
      </ScrollArea>

      <NewRevisionDialog
        open={isNewRevisionDialogOpen}
        onOpenChange={setIsNewRevisionDialogOpen}
        studentId={studentId}
        studentName={studentName}
        onSuccess={onRevisionSuccess}
      />
    </div>
  );
};
