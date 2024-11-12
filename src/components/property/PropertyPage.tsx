"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Wifi,
  Coffee,
  WashingMachine,
  AirVent,
  Shrub,
  Waves,
  Dumbbell,
  CarFront,
  Microwave,
  Tv2,
  Dog,
  Bed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DateRangePicker from "@/components/property/DateRangePicker";
import { DateRange } from "react-day-picker";
import {
  TAmenity,
  TBooking,
  TImage,
  TListing,
  TLocation,
  TProperty,
  TReview,
  TUser,
} from "@/lib/definitions";

import { createBooking } from "@/actions/bookingActions";
import { useToast } from "@/hooks/use-toast";
import ReviewCard from "./ReviewCard";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";

export default function PropertyListingPage({
  property,
  location,
  amenities,
  reviews,
  image,
  host,
  listing,
  bookings,
  userId,
}: {

  property: TProperty;
  location: TLocation;
  amenities: TAmenity[] | null;
  reviews: TReview[] | null;
  image: TImage[] | null;
  host: TUser;
  listing: TListing;
  bookings: TBooking[] | null;
  userId: string;
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState<DateRange>();
  const [isSelectedDates, setIsSelectedDates] = useState(false);
  const [isReserved, setisReserved] = useState(false)
  const [reservationDetails, setreservationDetails] = useState<TBooking>();
  const [showDialog, setShowDialog] = useState(false);

  const { toast } = useToast();

  const { user: kindeUser } = useKindeBrowserClient();

  if (!property.id || !host || !kindeUser) {
    return <>Sorry this property doesn't exist</>;
  }
  const displayedImages =
    image && image.length > 0
      ? image
      : [
        {
          id: "default1",
          propertyId: property.id,
          link: "https://images.unsplash.com/photo-1579297206620-c410c4af42e4?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
          id: "default2",
          propertyId: property.id,
          link: "https://images.unsplash.com/photo-1579297206620-c410c4af42e4?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
      ];

  const nextImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % displayedImages.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + displayedImages.length) % displayedImages.length
    );
  };

  const findAverageRating = (reviews: TReview[] | null): number => {
    if (!reviews || reviews.length === 0) {
      return -1;
    }
    console.log("reviews: ", reviews[0].rating);
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    const average = total / reviews.length;

    return average;
  };

  const amenityIcons: { [key: string]: React.ElementType } = {
    WIFI: Wifi,
    PARKING: CarFront,
    AIR_CONDITIONING: AirVent,
    COFFEE: Coffee,
    PARK: Shrub,
    POOL: Waves,
    GYM: Dumbbell,
    KITCHEN: Microwave,
    TV: Tv2,
    LAUNDRY: WashingMachine,
    PET_FRIENDLY: Dog,
  };

  const handleSubmit = async () => {

    try {
      if (
        !host.id ||
        !property.id ||
        !selectedDates?.from ||
        !selectedDates.to
      ) {
        throw new Error("couldn't get all the booking details");
      }
      const msInDay = 1000 * 60 * 60 * 24;
      const totalDays = Math.ceil(
        (selectedDates.to.getTime() - selectedDates.from.getTime()) / msInDay
      );
      const bookingValues: TBooking = {
        userId,
        propertyId: property.id,
        checkInOut: {
          checkInDate: selectedDates?.from,
          checkOutDate: selectedDates?.to
        },
        status: "CONFIRMED",
        totalPrice: property.pricePerNight * totalDays,
      };
      setreservationDetails(bookingValues)
      // const booking = await createBooking(bookingValues);
      // if (!booking) {
      //   throw new Error("Error in creating the ");
      // }
      setisReserved(true);
      setShowDialog(true);


    } catch (error) {
      toast({
        title: "Error in Creating the Booking",
        variant: "destructive",
        description: "Sorry we couldn't create the booking",
      });
    }
  };

  const handleDateSave = async (dates: DateRange | undefined) => {
    // Handle the saved dates (e.g., update state, make API call, etc.)
    console.log("Selected dates:", dates);
    setSelectedDates(dates);
    setIsSelectedDates(true);
  };
  const handleClose = () => setShowDialog(false);

  const handleContinue = async () => {
    setShowDialog(true);
    //Handle the stripe booking part
    // router.push(`/bookings/${kindeUser.id}/${property.id}/payments`)
    setLoading(true);

    try {
      console.log(reservationDetails?.totalPrice ? reservationDetails?.totalPrice : 0)
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: reservationDetails?.totalPrice ? reservationDetails?.totalPrice * 100 : 0,
          PropName: property.name,
          checkIn: reservationDetails?.checkInOut ? reservationDetails.checkInOut.checkInDate.toLocaleDateString() : "N/A",
          checkOut: reservationDetails?.checkInOut ? reservationDetails.checkInOut.checkOutDate.toLocaleDateString() : "N/A",
          propDetails: reservationDetails,

        }), // Convert to cents
      });

      const { sessionId } = await res.json();

      if (sessionId) {
        const stripe = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        );
        await stripe?.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }


  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <Image
          src={displayedImages[currentImageIndex].link}
          alt={`${property.name} - Image ${currentImageIndex + 1}`}
          layout="fill"
          objectFit="cover"
          priority
        />
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80"
          onClick={prevImage}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80"
          onClick={nextImage}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {displayedImages.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
            />
          ))}
        </div>
      </div>


      <main className="container mx-auto px-4 py-8">
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="max-w-lg p-6 rounded-lg bg-white shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-gray-800 border-b border-gray-300 pb-4">
                Reservation Summary
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 space-y-4 text-gray-700">
              <p className="text-lg">
                <strong className="font-medium">Property:</strong> {property.name}
              </p>
              <p className="text-lg">
                <strong className="font-medium">Check-in:</strong> {reservationDetails?.checkInOut ? reservationDetails.checkInOut.checkInDate.toLocaleDateString() : "N/A"}
              </p>
              <p className="text-lg">
                <strong className="font-medium">Check-out:</strong> {reservationDetails?.checkInOut ? reservationDetails.checkInOut.checkOutDate.toLocaleDateString() : "N/A"}
              </p>
              <div className="flex justify-between items-center pt-2 border-t border-gray-300 mt-4">
                <p className="text-xl font-semibold">
                  <strong>Total Price:</strong> ₹{reservationDetails?.totalPrice}
                </p>
              </div>
            </div>
            <DialogFooter className="mt-6 flex justify-between gap-4">
              <Button variant="secondary" onClick={handleClose} className="w-full py-2 text-lg">
                Close
              </Button>
              <Button
                variant="default"
                onClick={handleContinue}
                className={`w-full py-2 text-lg ${loading ? "cursor-not-allowed opacity-50" : "hover:bg-gray-700 hover:text-white"}`}
                disabled={loading}
              >
                {loading ? "Processing..." : "Pay Now"}
              </Button>

            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{property.name}</h1>
            <div className="flex items-center mb-4">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span className="font-semibold">
                {(() => {
                  const averageRating = findAverageRating(reviews);
                  return averageRating === -1
                    ? "Be the first one to review"
                    : averageRating.toFixed(1);
                })()}
              </span>
              <span className="text-muted-foreground ml-1">
                ({reviews ? reviews.length : 0} reviews)
              </span>
              <span className="mx-2">•</span>
              <span className="text-muted-foreground">
                {location.city}, {location.state}, {location.country}
              </span>
            </div>
            <p className="text-muted-foreground mb-6">{property.description}</p>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Type</h3>
                    <p>{property.propertyType}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">{property.isHotel ? 'Rooms Availability' : ''}</h3>
                    <span>
                      {property.isHotel
                        ? (property.maxGuests !== 0 ? 'Rooms Available' : 'No Rooms Available')
                        : `Up to ${property.maxGuests} guests`}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Price per Night</h3>
                    <p>₹{property.pricePerNight}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Hotel</h3>
                    <p>{property.isHotel ? "Yes" : "No"}</p>
                  </div>
                  {property.isHotel && property.RoomType && (
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1 text-blue-500" /> {/* Bed icon with custom color */}
                      <span className="text-blue-500 font-semibold bg-blue-100 px-1 rounded">
                        Room Type: {property.RoomType}
                      </span>
                    </div>
                  )
                  }
                </div>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenities?.map((amenity) => {
                    const Icon = amenityIcons[amenity.name]; // Get the corresponding icon
                    return (
                      <div key={amenity.id} className="flex items-center">
                        {Icon && <Icon className="h-5 w-5 mr-2" />}{" "}
                        {/* Render the icon if it exists */}
                        <span>{amenity.name.replace(/_/g, " ")}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <ReviewCard reviews={reviews}  propertyId={property.id} user={host} />
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Check Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <DateRangePicker
                  availabilityStart={listing.availabilityStart}
                  availabilityEnd={listing.availabilityEnd}
                  bookings={bookings}
                  onSave={handleDateSave}
                  onClose={handleClose}
                />
                <Button
                  className="w-full mt-4"
                  onClick={handleSubmit}
                  disabled={!isSelectedDates}
                >
                  Reserve
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
