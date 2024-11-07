import { getAllAmenitiesForProperty } from "@/actions/amenitiesAction";
import { getLocationById } from "@/actions/locationActions";
import {
  getAllImagesbyId,
  getAllListedProperties,
  getFilteredListings,
} from "@/actions/propertyActions";
import { getAllReviewsById } from "@/actions/reviewActions";
import { getUserById, getUserByKindeId } from "@/actions/userActions";
import PropertyCard from "@/components/property/Property";
import { useScheduler } from "@/hooks/useScheduler";
import { TKindeUser } from "@/lib/definitions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { useToast } from "@/hooks/use-toast";
import PropTypesSelect from "@/components/propertyTypes/propTypes";
import Footer from "@/components/footer/footer";
import AboutUs from "@/components/contents/Aboutus";

// export default async function Home() {
//   // const {toast}=useToast();
//   try{
//   useScheduler();
//   }
//   catch{
//     console.log("Error in loading schedular")
//   }
//   const { getUser, isAuthenticated } = getKindeServerSession();
//   const kindeUser = (await getUser()) as TKindeUser;

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { getUser, isAuthenticated } = getKindeServerSession();
  const kindeUser = (await getUser()) as TKindeUser;
  console.log(kindeUser)
  // if (!kindeUser) {
  //   return <h2>Sorry no kinduser to see this route</h2>;
  // }
  // else if (!isAuthenticated){
  //   return <h2>Sorry You are not authorized to see this route</h2>;

  // }

  // const user = await getUserByKindeId(kindeUser.id);
  // if (!user || !user.id || !isAuthenticated) {
  //   console.log("couldn't get the user in /user/userId/properties");
  //   return <>sorry couldn't fetch the user</>;
  // }
  
  //const user = await getUserByKindeId(kindeUser.id);
  // if (!user || !user.id || !isAuthenticated) {
  //   console.log("couldn't get the user in /user/userId/properties");
  //   return <>sorry couldn't fetch the user</>;
  // }

  const destination = searchParams.dest;
  const checkIn = searchParams.ci;
  const checkOut = searchParams.co;
  const type=searchParams.type === 'Any'? undefined :searchParams.type
  

  console.log(destination, checkIn, checkOut);

  const properties = 
    destination || checkIn || checkOut || type
      ? await getFilteredListings(destination, checkIn, checkOut,type)
      : await getAllListedProperties();
  if (!properties) {
    return <>sorry couldn't fetch the properties</>;
  }

  if (destination || checkIn || checkOut) {
    console.log("Called getFilteredListings with:", {
      destination,
      checkIn,
      checkOut,
      properties,
    });
  } else {
    console.log("Called getAllListedProperties, properties:", properties);
  }

  const propertyCards = await Promise.all(
    properties.map(async (property) => {
      if (!property.id || !property.locationId) {
        return null;
      }
      const reviews = await getAllReviewsById(property.id);
      const amenities = await getAllAmenitiesForProperty(property.id);
      const images = await getAllImagesbyId(property.id);
      const location = await getLocationById(property.locationId);
      const user = await getUserById(property.userId);

      if (!amenities || !location || !user) {
        console.error("couldn't get all the props for property: ", property);
        return null;
      }
      return (
        <>
        
        <PropertyCard
          key={property.id}
          property={property}
          location={location}
          reviews={reviews}
          amenities={amenities}
          images={images}
          type="book"
          hostName={user.name}
          hostKindeId={property.userId}
          favorites={''}
        />
        </>
      );
    })
  );
  return (
    <>
    <PropTypesSelect/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {propertyCards.filter(Boolean)}
      </div>
      <h1>Previous Bookings</h1>
      hey buddy here we will show your prevv boookings if available
      <AboutUs/>
      <Footer/>

    </>
  );
}
