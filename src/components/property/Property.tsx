import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bed, Users, Star, Heart } from "lucide-react";

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    description: string;
    pricePerNight: number;
    maxGuests: number;
    propertyType: string;
    images: { url: string }[];
    location: { city: string; country: string };
    amenities: { name: string }[];
    reviews: { rating: number }[];
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const averageRating =
    property.reviews.length > 0
      ? property.reviews.reduce((sum, review) => sum + review.rating, 0) /
        property.reviews.length
      : null;

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="relative aspect-square">
        <Image
          src={property.images[0]?.url || "/placeholder.svg"}
          alt={property.name}
          fill
          className="object-cover rounded-t-lg"
        />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 rounded-full"
        >
          <Heart className="h-4 w-4" />
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
              {property.location.city}, {property.location.country}
            </p>
          </div>
          {averageRating && (
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
          {property.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity.name} variant="secondary">
              {amenity.name}
            </Badge>
          ))}
          {property.amenities.length > 3 && (
            <Badge variant="secondary">
              +{property.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
          <span className="text-lg font-bold">${property.pricePerNight}</span>
          <span className="text-sm text-muted-foreground"> / night</span>
        </div>
        <Button>Book now</Button>
      </CardFooter>
    </Card>
  );
}
