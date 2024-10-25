"use client"

import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Users, Star, Heart } from "lucide-react";
import {
  TProperty,
  TReview,
  TImage,
  TLocation,
  TAmenity,
} from "@/lib/definitions";
import BookPropertyButton from "./BookPropertyButton";
import ListPropertyButton from "./ListNowButton";
import { useState } from "react";

interface PropertyCardProps {
  property: TProperty;
  reviews: TReview[] | null;
  images: TImage[] | null;
  location: TLocation;
  amenities: TAmenity[];
  bookOrList: "book" | "list";
  hostName: string;
  hostKindeId?: string;
}

export default function PropertyCard({
  property,
  reviews,
  images,
  location,
  amenities,
  bookOrList,
  hostKindeId,
  hostName,
}: PropertyCardProps) {
  let averageRating;
  let imageLink;
  if (reviews) {
    averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        : null;
  }
  if (images && images?.length !== 0) {
    imageLink = images[0].link;
  } else {
    imageLink =
  //     "https://images.unsplash.com/photo-1579297206620-c410c4af42e4?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
  // }
  'https://th.bing.com/th/id/OIP.7uysmPeeGjhBNLLTiZc6fAHaLb?w=115&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7'
  }
  console.log("Image link: ", imageLink);

  const [isFavorited, setIsFavorited] = useState(false);

  // Function to toggle the favorite state
  const handleToggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="relative aspect-square">
        <Image
          src={imageLink}
          alt={property.name}
          fill
          className="object-cover rounded-t-lg"
        />


      <Button
        size="icon"
        variant="secondary"
        className="absolute top-2 right-2 rounded-full"
        onClick={handleToggleFavorite}
      >
        {/* Conditionally apply the fill color */}
        <Heart
        className="h-4 w-4"
        style={{
          fill: isFavorited ? "red" : "none", 
          stroke: isFavorited ? "red" : "gray", 
        }}
      />
        <span className="sr-only">Add to favorites</span>

        
      </Button>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h2 className="text-lg font-semibold line-clamp-1">
              {property.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {location.city}, {location.country}
            </p>
          </div>
          {averageRating !== null && averageRating !== undefined && (
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-primary text-primary mr-1" />
              <span className="text-sm font-medium">
                {averageRating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        <p className="text-sm line-clamp-2 mb-2">{property.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span>{property.propertyType}</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>Up to {property.maxGuests} guests</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity.id} variant="secondary">
              {amenity.name}
            </Badge>
          ))}
          {amenities.length > 3 && (
            <Badge variant="secondary">+{amenities.length - 3} more</Badge>
          )}
        </div>
        <h3>hosted by: {hostName}</h3>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <span className="text-lg font-bold">${property.pricePerNight}</span>
          <span className="text-sm text-muted-foreground"> / night</span>
        </div>
        {bookOrList === "book" ? (
          <BookPropertyButton propertyId={property.id} />
        ) : (
          <ListPropertyButton
            propertyId={property.id}
            kindeUserId={hostKindeId}
          />
        )}
      </CardFooter>
    </Card>
  );
}
