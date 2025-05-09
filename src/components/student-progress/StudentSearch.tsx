
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Student {
  id: string;
  name: string;
  grade?: string;
}

interface StudentSearchProps {
  onStudentSelect: (studentId: string, studentName: string) => void;
  selectedStudentId?: string;
  teacherId?: string;
  className?: string;
  showHeader?: boolean;
}

export const StudentSearch = ({ 
  onStudentSelect, 
  selectedStudentId,
  teacherId,
  className = "mb-6",
  showHeader = true
}: StudentSearchProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedName, setSelectedName] = useState("");
  
  // Determine whether to fetch all students or just those for a specific teacher
  const { data: students, isLoading } = useQuery({
    queryKey: teacherId ? ["teacher-students", teacherId] : ["all-students"],
    queryFn: async () => {
      try {
        if (teacherId) {
          // Get students assigned to a specific teacher
          const { data: assignments, error: assignmentsError } = await supabase
            .from("students_teachers")
            .select("student_name")
            .eq("teacher_id", teacherId)
            .eq("active", true);
            
          if (assignmentsError) throw assignmentsError;
          
          // If no assignments, return empty array
          if (!assignments || assignments.length === 0) {
            return [] as Student[];
          }
          
          // Get student details - use student names from assignments
          const studentNames = assignments.map(assignment => assignment.student_name);
          const { data: studentsData, error: studentsError } = await supabase
            .from("students")
            .select("id, name")
            .in("name", studentNames)
            .order("name");
            
          if (studentsError) throw studentsError;
          return (studentsData || []) as Student[];
        } else {
          // Get all students
          const { data, error } = await supabase
            .from("students")
            .select("id, name")
            .order("name");
            
          if (error) throw error;
          
          return (data || []) as Student[];
        }
      } catch (error) {
        console.error("Error fetching students:", error);
        return [] as Student[];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Find selected student name when studentId changes
  useEffect(() => {
    if (students && selectedStudentId) {
      const student = students.find(s => s.id === selectedStudentId);
      if (student) {
        setSelectedName(student.name);
      }
    }
  }, [selectedStudentId, students]);
  
  const filteredStudents = students?.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader className="pb-3">
          <CardTitle>Student Search</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  role="combobox" 
                  aria-expanded={open} 
                  className="w-full justify-between"
                >
                  {selectedName || "Select student..."}
                  <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search student..."
                    className="h-9"
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No students found.</CommandEmpty>
                    <CommandGroup>
                      {isLoading ? (
                        <>
                          <CommandItem>
                            <Skeleton className="h-5 w-full" />
                          </CommandItem>
                          <CommandItem>
                            <Skeleton className="h-5 w-full" />
                          </CommandItem>
                        </>
                      ) : (
                        filteredStudents.map(student => (
                          <CommandItem
                            key={student.id}
                            value={student.id}
                            onSelect={() => {
                              onStudentSelect(student.id, student.name);
                              setSelectedName(student.name);
                              setOpen(false);
                            }}
                          >
                            <div className="flex items-center">
                              <span>{student.name}</span>
                              {student.grade && (
                                <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                  Grade {student.grade}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
