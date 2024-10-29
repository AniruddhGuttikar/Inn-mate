import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { getAllFavorite } from "@/actions/favouritesAction";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TKindeUser } from "@/lib/definitions";
import { getAllAmenitiesForProperty } from "@/actions/amenitiesAction";
import { getLocationById } from "@/actions/locationActions";
import { getAllImagesbyId, getPropertyById } from "@/actions/propertyActions";
import { getAllReviewsById } from "@/actions/reviewActions";
import { getUserById } from "@/actions/userActions";
import PropertyCard from "@/components/property/Property";
import { Button } from "react-day-picker";
import PrimaryButton from "@/components/ui/simple_buttion";
import DynamicMarks from "@/components/ui/dynamicMarks";

// Define the Props interface
interface FavoritesProps {
  params: {
    userid: string; // The userid should be a string
  };
}

const Favorites = async ({ params: { userid } }: FavoritesProps) => {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const kindeUser = (await getUser()) as TKindeUser;

  if (!kindeUser || !isAuthenticated) {
    return <h2>Sorry, you are not authorized to see this route</h2>;
  }

  // Fetch favorites for the user
  const favorites = await getAllFavorite(kindeUser.id);
  console.log("Favorites Data:", favorites);

  if (!favorites || favorites.length === 0) {
    return (
      <>
<div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      
  <h1 className="font-bold text-3xl mb-2">No favorite property found</h1>
  <span className="text-5xl mb-4">😔</span>
  <h1 className="font-bold text-2xl mb-4">Select your favorite property</h1>
  <PrimaryButton/>
  <DynamicMarks/>
</div>
</>

    );
  }

  // Fetch favorite properties
  const fetchFavoriteProperties = async () => {
    const properties = await Promise.all(
      favorites.map(async (favorite) => await getPropertyById(favorite.propertyId))
    );

    // Fetch additional details for each property
    return await Promise.all(
      properties.map(async (property) => {
        if (!property || !property.id || !property.locationId) {
          return null; // Return null if property is invalid
        }

        const reviews = await getAllReviewsById(property.id);
        const amenities = await getAllAmenitiesForProperty(property.id);
        const images = await getAllImagesbyId(property.id);
        const location = await getLocationById(property.locationId);
        const user = await getUserById(property.userId);

        if (!amenities || !location || !user) {
          console.error("Couldn't get all the props for property: ", property);
          return null;
        }

        return (
          <PropertyCard
            key={property.id}
            property={property}
            location={location}
            reviews={reviews}
            amenities={amenities}
            images={images}
            bookOrList="book"
            hostName={user.name}
            hostKindeId={property.userId}
            favorites=""
          />
        );
      })
    );
  };

  const propertyCards = await fetchFavoriteProperties();

  return (
    <>
    <h1 className="font-bold text-center text-2xl mb-4">Favorite Properties</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        
        {propertyCards.filter(Boolean)}
      </div>
    </>
  );
};

export default Favorites;
