// Import necessary hooks and libraries
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
  type: boolean;
  max: number;
}

export default function DateRangePicker({
  availabilityStart,
  availabilityEnd,
  bookings,
  type,
  max,
  onSave,
  onClose,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();

  // Check if a date is booked
  const isDateBooked = (date: Date) => {
    if (!bookings) return false;

    return bookings.some((booking) =>
      isWithinInterval(startOfDay(date), {
        start: startOfDay(booking.checkInOut?.checkInDate ?? ""),
        end: startOfDay(booking.checkInOut?.checkOutDate ?? ""),
      })
    );
  };

  // Check if a date is in any booking range for highlighting
  const isDateInBookingRange = (date: Date) => {
    if (!bookings) return false;

    return bookings.some((booking) =>
      isWithinInterval(startOfDay(date), {
        start: startOfDay(new Date(booking.checkInOut?.checkInDate ?? "")),
        end: startOfDay(new Date(booking.checkInOut?.checkOutDate ?? "")),
      })
    );
  };

  // Disable unavailable dates
  const isDateDisabled = (date: Date) => {
    if (date < startOfDay(availabilityStart) || date > startOfDay(availabilityEnd)) {
      return true;
    }

    const dateIsBooked = isDateBooked(date);
    return dateIsBooked && !(type && max > 0);
  };

  // Handle date selection
  const handleSelect = (newDate: DateRange | undefined) => {
    if (!newDate?.from || !newDate?.to) {
      setDate(newDate);
      return;
    }

    // Check if any date in the selected range is disabled
    const datesInRange = eachDayOfInterval({
      start: newDate.from,
      end: newDate.to,
    });
    const hasDisabledDate = datesInRange.some(isDateDisabled);

    // If single-day or disabled dates exist, reset selection
    if (newDate.from === newDate.to || hasDisabledDate) {
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
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
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
            disabled={(day) => isDateDisabled(day)}
            className={cn(
              "base-calendar-class",
              date && isDateInBookingRange(date.from) ? "booking-range-highlight" : ""
            )}
            dayClassName={(day) =>
              isDateInBookingRange(day) ? "bg-orange-200" : ""
            }
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
                setDate(undefined);
                setIsOpen(false);
                onClose();
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
