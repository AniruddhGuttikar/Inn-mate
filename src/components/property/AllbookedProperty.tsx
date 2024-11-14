'use client'
import { FC, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // Assuming you have a utility for conditional classes

type BookingDetails = {
  propertyId: string;
  PropertyName: string;
  bookingID: string;
  BookedUser: string;
  BookedUserEmail: string;
  totalprice: number;
  updatedAt: string;
  roomId: string | null;
  status: string;
  review: number | null;
};

interface AllBookingsPropProps {
  bookingData: BookingDetails[];
}

const AllBookingsProp: FC<AllBookingsPropProps> = ({ bookingData }) => {
  const [sortedData, setSortedData] = useState<BookingDetails[]>(bookingData);
  const [sortAscending, setSortAscending] = useState<boolean>(true);
  const [maxPrice, setMaxPrice] = useState<number>(Math.max(...bookingData.map(b => b.totalprice)));

  // Sort booking data by price
  const handleSort = () => {
    const sorted = [...sortedData].sort((a, b) =>
      sortAscending ? a.totalprice - b.totalprice : b.totalprice - a.totalprice
    );
    setSortedData(sorted);
    setSortAscending(!sortAscending);
  };
  console.log("Booking Data",bookingData)
  // Filter booking data by max price
  const handleFilter = (value: number) => {
    const filtered = bookingData?.filter(b => b.totalprice <= value);
    setSortedData(filtered);
    setMaxPrice(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 rounded-md shadow-md">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">All Bookings</h2>

      {/* Filter and Sort Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-gray-700">Filter by Price:</span>
          <Slider
            defaultValue={[maxPrice]}
            max={Math.max(...bookingData.map(b => b.totalprice))}
            min={0}
            step={100}
            value={[maxPrice]}
            onValueChange={(value: any) => handleFilter(value[0])}
            className="w-72"
          />
          <Input
            type="number"
            value={maxPrice}
            onChange={(e) => handleFilter(Number(e.target.value))}
            className="w-24"
          />
        </div>

        <Button onClick={handleSort} className="bg-blue-500 hover:bg-blue-600 text-white">
          Sort by Price {sortAscending ? "▲" : "▼"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-100 text-gray-700 uppercase text-sm">
              <th className="py-3 px-6 text-left">Sl. No</th>
              <th className="py-3 px-6 text-left">Property ID</th>
              <th className="py-3 px-6 text-left">Property Name</th>
              <th className="py-3 px-6 text-left">Booking ID</th>
              <th className="py-3 px-6 text-left">Booked User</th>
              <th className="py-3 px-6 text-left">User Email</th>
              <th className="py-3 px-6 text-right">Total Price</th>
              <th className="py-3 px-6 text-left">Booked On</th>
              <th className="py-3 px-6 text-left">Status</th>
              <th className="py-3 px-6 text-left">Review</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {sortedData.map((booking, index) => (
              <tr
                key={booking.bookingID}
                className="border-b border-gray-200 hover:bg-blue-50 transition duration-150"
              >
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">{booking.propertyId}</td>
                <td className="py-3 px-6">{booking.PropertyName}</td>
                <td className="py-3 px-6">{booking.bookingID}</td>
                <td className="py-3 px-6">{booking.BookedUser}</td>
                <td className="py-3 px-6">{booking.BookedUserEmail}</td>
                <td className="py-3 px-6 text-right">{booking.totalprice}</td>
                <td className="py-3 px-6">
                  {new Date(booking.updatedAt).toLocaleDateString("en-GB")}
                </td>
                <td className="py-3 px-6">{booking.status}</td>
                <td className="py-3 px-6">{booking.review || "No review"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllBookingsProp;
