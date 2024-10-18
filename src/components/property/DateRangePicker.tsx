"use client";

import { useState } from "react";
import { format, addMonths, isBefore, isAfter, isSameDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  availabilityStart: Date;
  availabilityEnd: Date;
  onSave: (dates: DateRange | undefined) => void;
}

export default function DateRangePicker({
  availabilityStart,
  availabilityEnd,
  onSave,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();

  const isDateInRange = (date: Date) => {
    return (
      (isSameDay(date, availabilityStart) ||
        isAfter(date, availabilityStart)) &&
      (isSameDay(date, availabilityEnd) || isBefore(date, availabilityEnd))
    );
  };

  return (
    <div className="w-full max-w-sm">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Add dates for prices</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={availabilityStart}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            disabled={(date) => !isDateInRange(date)}
          />
          <div className="flex justify-end gap-2 p-4">
            <Button
              variant="outline"
              onClick={() => {
                setDate(undefined);
                setIsOpen(false);
              }}
            >
              Clear
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onSave(date);
                setIsOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
