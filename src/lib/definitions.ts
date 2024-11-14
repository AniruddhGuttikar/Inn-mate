import { z } from "zod";

export const PropertyTypeEnum = z.enum([
  "Hotel",
  "Home",
  "Resort",
  "Farmhouse",
  "Beachhouse",
  "Cottage",
  "Apartment",
]);
export const BookingStatusEnum = z.enum(["CONFIRMED", "ACTIVE", "COMPLETED"]);
export const AmenityTypeEnum = z.enum([
  "WIFI",
  "PARKING",
  "AIR_CONDITIONING",
  "PARK",
  "POOL",
  "GYM",
  "KITCHEN",
  "TV",
  "LAUNDRY",
  "PET_FRIENDLY",
  "COFFEE",
]);
export const GenderTypeEnum = z.enum(["MALE", "FEMALE", "OTHERS"]);

// Address Schema
export const addressSchema = z.object({
  id: z.string().cuid().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
});

// User Schema
export const userSchema = z.object({
  id: z.string().cuid().optional(),
  kindeId: z.string(),
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  dob: z.coerce.date(),
  gender: GenderTypeEnum,
  image: z.string().url().nullable().optional(),
  address: addressSchema,
});

// Kinde User Schema
export const kindeUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  family_name: z.string().optional().nullable(),
  given_name: z.string(),
  picture: z.string().url().optional().nullable(),
});

// Location Schema
export const locationSchema = z.object({
  id: z.string().cuid().optional(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),

});
// Property Schema

// Image Schema
export const imageSchema = z.object({
  id: z.string().cuid(),
  link: z.string().url(),
  propertyId: z.string().cuid(),
});
export const propertySchema = z.object({
  id: z.string().cuid().optional(),
  userId: z.string().cuid().optional(),
  name: z.string(),
  description: z.string(),
  pricePerNight: z.number().positive(),
  maxGuests: z.number().int().positive(),
  propertyType: PropertyTypeEnum,
  locationId: z.string().cuid().optional(),
  RoomType: z.string().optional(),
  images: z.array(imageSchema).optional(),
  isHotel: z
    .union([z.boolean(), z.number()])
    .transform((val) => Boolean(val))
    .default(false), // Default to false if missing
  isDeleted: z
    .union([z.boolean(), z.number()])
    .transform((val) => Boolean(val))
    .default(false),
});

// CheckInCheckOut Schema
export const checkInCheckOutSchema = z.object({
  id: z.string().cuid().optional(),
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
  bookingId: z.string().cuid().optional(),
});

// Booking Schema
export const bookingSchema = z.object({
  id: z.string().cuid().optional(),
  // startDate: z.coerce.date(),
  // endDate: z.coerce.date(),
  totalPrice: z.number().positive(),
  userId: z.string().cuid(),
  propertyId: z.string().cuid(),
  status: BookingStatusEnum,
  checkInOut : checkInCheckOutSchema.nullable()
});

// Review Schema
export const reviewSchema = z.object({
  id: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string(),
  userId: z.string().cuid(),
  propertyId: z.string().cuid(),
  createdAt : z.date()
});

// favourite Schema
export const favouriteSchema = z.object({
  id: z.string().cuid().optional(),
  userId: z.string().cuid(),
  propertyId: z.string().cuid(),
});

// Listing Schema
export const listingSchema = z
  .object({
    id: z.string().cuid().optional(),
    availabilityStart: z.coerce.date(),
    availabilityEnd: z.coerce.date(),
    userId: z.string().cuid(),
    propertyId: z.string().cuid(),
  })
  .refine((data) => data.availabilityEnd > data.availabilityStart, {
    message: "End date must be after start date",
    path: ["availabilityEnd"],
  });

// Amenity Schema
export const amenitySchema = z.object({
  id: z.string().uuid().optional(),
  name: AmenityTypeEnum,
  propertyId: z.string().cuid().optional(),
});

// Payment Schema
export const paymentSchema = z.object({
  id: z.string().cuid(),
  amount: z.number().positive(),
  paymentDate: z.coerce.date(),
  bookingId: z.string().cuid(),
});



// Export types
export type TUser = z.infer<typeof userSchema>;
export type TKindeUser = z.infer<typeof kindeUserSchema>;
export type TAddress = z.infer<typeof addressSchema>;
export type TProperty = z.infer<typeof propertySchema>;
export type TImage = z.infer<typeof imageSchema>;
export type TBooking = z.infer<typeof bookingSchema>;
export type TReview = z.infer<typeof reviewSchema>;
export type TFavourite = z.infer<typeof favouriteSchema>;
export type TListing = z.infer<typeof listingSchema>;
export type TAmenity = z.infer<typeof amenitySchema>;
export type TLocation = z.infer<typeof locationSchema>;
export type TPayment = z.infer<typeof paymentSchema>;
export type TCheckInCheckOut = z.infer<typeof checkInCheckOutSchema>;
export type TAmenityType = z.infer<typeof AmenityTypeEnum>;

// additional merged schemas for the form validatoin
export const addPropertyFormValuesSchema = propertySchema
  .merge(locationSchema.omit({ id: true }))
  .extend({
    image: z.array(imageSchema).optional(),
    amenities: z.array(amenitySchema).optional(),
  });

export type TAddPropertyFormvaluesSchema = z.infer<
  typeof addPropertyFormValuesSchema
>;

export const userFormSchema = userSchema
  .merge(z.object({ address: addressSchema }))
  .omit({ id: true, kindeId: true, image: true });  

export type TUserFormValues = z.infer<typeof userFormSchema>;
