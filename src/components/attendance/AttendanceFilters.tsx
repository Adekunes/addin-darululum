import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";

interface AttendanceFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  dateFilter: Date | null;
  setDateFilter: (date: Date | null) => void;
}

export function AttendanceFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
}: AttendanceFiltersProps) {
  return (
    <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search students or classes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-[300px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary/50"
        />
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left sm:w-[180px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600",
                !dateFilter && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={dateFilter ?? undefined}
              onSelect={(date) => setDateFilter(date ?? null)}
              initialFocus
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200"
            />
            {dateFilter && (
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="ghost"
                  className="w-full justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setDateFilter(null)}
                >
                  Clear Date
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <Select
          value={statusFilter || "all"}
          onValueChange={(value) =>
            setStatusFilter(value === "all" ? null : value)}
        >
          <SelectTrigger className="sm:w-[180px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">
            <SelectItem
              value="all"
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              All Statuses
            </SelectItem>
            <SelectItem
              value="present"
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Present
            </SelectItem>
            <SelectItem
              value="absent"
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Absent
            </SelectItem>
            <SelectItem
              value="late"
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Late
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
