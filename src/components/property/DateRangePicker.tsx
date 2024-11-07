"use client";

import { useState } from "react";
import {
  eachDayOfInterval,
  format,
  isWithinInterval,
  startOfDay,
} from "date-fns";
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
import { TBooking } from "@/lib/definitions";

interface DateRangePickerProps {
  availabilityStart: Date;
  availabilityEnd: Date;
  bookings: TBooking[] | null;
  onSave: (dates: DateRange | undefined) => void;
  onClose: () => void;
}

export default function DateRangePicker({
  availabilityStart,
  availabilityEnd,
  bookings,
  onSave,
  onClose,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();

  const isDateBooked = (date: Date) => {
    if (!bookings) {
      return false;
    }
    return bookings.some((booking) =>
      isWithinInterval(startOfDay(date), {
        start: startOfDay(booking.checkInOut?.checkInDate ?? ''),
        end: startOfDay(booking.checkInOut?.checkOutDate ?? ''),
      })
    );
  };

  const isDateDisabled = (date: Date) => {
    if (
      date < startOfDay(availabilityStart) ||
      date > startOfDay(availabilityEnd)
    ) {
      return true;
    }

    return isDateBooked(date);
  };

  const handleSelect = (newDate: DateRange | undefined) => {
    if (!newDate?.from || !newDate?.to) {
      setDate(newDate);
      return;
    }

    const datesInRange = eachDayOfInterval({
      start: newDate.from,
      end: newDate.to,
    });

    const hasDisabledDate = datesInRange.some(isDateDisabled);

    if (hasDisabledDate) {
      setDate({ from: newDate.from, to: undefined });
    } else {
      setDate(newDate);
    }
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
            onSelect={handleSelect}
            numberOfMonths={2}
            disabled={(date) => isDateDisabled(date)}
          />
          <div className="flex justify-end gap-2 p-4">
            <Button
              variant="outline"
              onClick={() => {
                setDate(undefined);
                setIsOpen(false);
                onClose();
              }}
            >
              Clear
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                setDate(undefined);
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