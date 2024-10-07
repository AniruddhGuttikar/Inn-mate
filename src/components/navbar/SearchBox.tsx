"use client";

import { useState } from "react";
import { CalendarIcon, MapPinIcon, SearchIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export default function SearchBox() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  const [isDestinationPopOverOpen, setDestinationPopOverOpen] = useState(false);
  const [isCheckInPopOverOpen, setCheckInPopOverOpen] = useState(false);
  const [ischeckOutPopOverOpen, setCheckOutPopOverOpen] = useState(false);

  return (
    <div className="flex flex-col mx-auto sm:flex-row items-center justify-center w-full max-w-3xl bg-white rounded-full shadow-lg">
      <Popover
        open={isDestinationPopOverOpen}
        onOpenChange={setDestinationPopOverOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="flex-1 justify-start rounded-l-full px-2 py-6 hover:bg-gray-100"
            onChange={() => setDestinationPopOverOpen(true)}
          >
            <MapPinIcon className="mr-2 h-4 w-4" />
            <span
              className={cn(
                "truncate",
                !destination && "text-muted-foreground"
              )}
            >
              {destination || "Where are you going?"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Input
            placeholder="Enter destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setDestinationPopOverOpen(false);
              }
            }}
            className="border-0 focus-visible:ring-0"
          />
        </PopoverContent>
      </Popover>

      <div className="h-8 w-px bg-gray-300 hidden sm:block" />

      <Popover open={isCheckInPopOverOpen} onOpenChange={setCheckInPopOverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="flex-1 justify-start px-2 py-6 hover:bg-gray-100"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span
              className={cn("truncate", !checkIn && "text-muted-foreground")}
            >
              {checkIn ? format(checkIn, "PPP") : "Check-in"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={checkIn}
            onSelect={(day) => {
              if (!day || (checkOut && checkOut < day)) {
                // TODO: change alert with toast error
                alert("choose a day before checkout date");
                return;
              }
              setCheckIn(day);
              setCheckInPopOverOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="h-8 w-px bg-gray-300  hidden sm:block" />

      <Popover
        open={ischeckOutPopOverOpen}
        onOpenChange={setCheckOutPopOverOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="flex-1 justify-start items-center py-6 hover:bg-gray-100"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span
              className={cn("truncate", !checkOut && "text-muted-foreground")}
            >
              {checkOut ? format(checkOut, "PPP") : "Check-out"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={checkOut}
            onSelect={(day) => {
              if (!day || (checkIn && checkIn > day)) {
                alert("choose a day after checkin date");
                return;
              }
              setCheckOut(day);
              setCheckOutPopOverOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Button className="rounded-r-full p-6" type="submit">
        <SearchIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
