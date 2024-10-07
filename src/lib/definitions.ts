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
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  dob: z.coerce.date(),
  gender: GenderTypeEnum,
  image: z.string().url().nullable().optional(),
  address: addressSchema.optional(),
});
export const kindeUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  family_name: z.string().optional().nullable(),
  given_name: z.string(),
  picture: z.string().url().optional().nullable(),
  username: z.string().optional().nullable(),
  phone_number: z.string().optional().nullable(),
});

// Property Schema
export const propertySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string(),
  pricePerNight: z.number().positive(),
  maxGuests: z.number().int().positive(),
  propertyType: PropertyTypeEnum,
  propertyDescription: z.string().optional(),
  locationId: z.string().cuid(),
});

// Image Schema
export const imageSchema = z.object({
  id: z.string().cuid(),
  link: z.string().url(),
  propertyId: z.string().cuid(),
});

// Booking Schema
export const bookingSchema = z.object({
  id: z.string().cuid(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  totalPrice: z.number().positive(),
  userId: z.string().cuid(),
  propertyId: z.string().cuid(),
  status: BookingStatusEnum,
});

// Review Schema
export const reviewSchema = z.object({
  id: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string(),
  userId: z.string().cuid(),
  propertyId: z.string().cuid(),
});

// Favorite Schema
export const favoriteSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  propertyId: z.string().cuid(),
});

// Listing Schema
export const listingSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  propertyId: z.string().cuid(),
});

// Amenity Schema
export const amenitySchema = z.object({
  id: z.string().cuid(),
  name: AmenityTypeEnum,
  propertyId: z.string().cuid(),
});

// Location Schema
export const locationSchema = z.object({
  id: z.string().cuid(),
  city: z.string(),
  state: z.string().optional(),
  country: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

// Payment Schema
export const paymentSchema = z.object({
  id: z.string().cuid(),
  amount: z.number().positive(),
  paymentDate: z.coerce.date(),
  bookingId: z.string().cuid(),
});

// CheckInCheckOut Schema
export const checkInCheckOutSchema = z.object({
  id: z.string().cuid(),
  checkInDate: z.coerce.date(),
  checkOutDate: z.coerce.date(),
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
export type TFavorite = z.infer<typeof favoriteSchema>;
export type TListing = z.infer<typeof listingSchema>;
export type TAmenity = z.infer<typeof amenitySchema>;
export type TLocation = z.infer<typeof locationSchema>;
export type TPayment = z.infer<typeof paymentSchema>;
export type TCheckInCheckOut = z.infer<typeof checkInCheckOutSchema>;
