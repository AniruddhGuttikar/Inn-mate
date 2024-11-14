'use client';

import { TBooking } from "@/lib/definitions";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useToast } from "@/hooks/use-toast";

interface ReservationSummaryProps {
  bookingDetails?: TBooking;
}

export default function ReservationSummary({ bookingDetails }: ReservationSummaryProps) {
    const { toast } = useToast();
    const { user, isAuthenticated } = useKindeBrowserClient();
    console.log(user+"buyuw247819881666^^&*(^")
    if (!isAuthenticated) {
        toast({
            title: "Error !!",
            variant: "destructive",
            description: "Sorry, but the user is not authenticated",
        });
        return <h1>Sorry, user not authenticated</h1>;
    }

    if (!bookingDetails) {
        return <h2>No booking details available</h2>;
    }

    return (
        <div>
            <h1>Order Summary</h1>
            {/* Display booking details */}
            <p>Booking ID: {bookingDetails.id}</p>
            {/* <p>Customer Name: {bookingDetails.customerName}</p>
            <p>Reservation Date: {bookingDetails.date}</p> */}
            {/* Add more fields as needed */}
        </div>
    );
}
