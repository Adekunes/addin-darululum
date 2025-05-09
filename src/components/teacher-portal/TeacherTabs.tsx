
import { useNavigate } from "react-router-dom";
import { Teacher } from "@/types/teacher";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Calendar, Users, BarChart2, MessageSquare, LayoutDashboard, Book, CalendarDays } from "lucide-react";

interface TeacherTabsProps {
  teacher: Teacher;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TeacherTabs = ({ teacher, activeTab, onTabChange }: TeacherTabsProps) => {
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    onTabChange(value);
    navigate(`/teacher-portal${value !== 'overview' ? `?tab=${value}` : ''}`);
  };
  
  return (
    <div className="mb-6">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full md:w-auto grid grid-cols-3 md:grid-cols-7 p-1 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="students" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Students</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="dhor-book" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200"
          >
            <Book className="h-4 w-4" />
            <span className="hidden sm:inline">Dhor Book</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="attendance" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Attendance</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="schedule" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200"
          >
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="performance" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200"
          >
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Performance</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="messages" 
            className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800/50 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-200"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
