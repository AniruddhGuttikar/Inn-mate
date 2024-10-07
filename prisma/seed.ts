// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed users
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "hashedPassword",
      dob: new Date("1990-01-01"),
      gender: "Male",
      address: {
        create: {
          city: "New York",
          state: "NY",
          country: "USA",
        },
      },
    },
  });

  // Seed properties
  const property1 = await prisma.property.create({
    data: {
      name: "Cozy Apartment",
      description: "A cozy apartment in the heart of the city.",
      pricePerNight: 120.5,
      maxGuests: 3,
      propertyType: "Apartment",
      location: {
        create: {
          city: "New York",
          state: "NY",
          country: "USA",
          latitude: 40.7128,
          longitude: -74.006,
        },
      },
      amenities: {
        create: [{ name: "WIFI" }, { name: "AIR_CONDITIONING" }],
      },
    },
  });

  // Seed bookings
  const booking1 = await prisma.booking.create({
    data: {
      startDate: new Date("2024-10-01"),
      endDate: new Date("2024-10-10"),
      totalPrice: 1205,
      userId: user1.id,
      propertyId: property1.id,
      status: "CONFIRMED",
    },
  });

  // Seed reviews
  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Amazing place!",
      userId: user1.id,
      propertyId: property1.id,
    },
  });

  // Seed favorite
  await prisma.favorite.create({
    data: {
      userId: user1.id,
      propertyId: property1.id,
    },
  });

  // Seed listing
  await prisma.listing.create({
    data: {
      userId: user1.id,
      propertyId: property1.id,
    },
  });

  // Seed images
  await prisma.image.create({
    data: {
      link: "https://example.com/image1.jpg",
      propertyId: property1.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
