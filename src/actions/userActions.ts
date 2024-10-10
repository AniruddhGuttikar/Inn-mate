"use server";

import prisma from "@/lib/db";
import { TUser, userSchema } from "@/lib/definitions";

export async function createUser(user: TUser): Promise<TUser | null> {
  try {
    const validatedUser = userSchema.safeParse(user);
    if (!validatedUser.success) {
      throw new Error("Couldn't validate the user");
    }
    const { name, email, dob, gender, address } = validatedUser.data;
    const newAddress = await prisma.address.create({
      data: {
        city: address.city,
        state: address.state,
        country: address.country,
      },
    });
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        dob,
        gender,
        addressId: newAddress.id,
      },
      include: {
        address: true,
      },
    });
    const userResult: TUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      dob: newUser.dob,
      gender: newUser.gender,
      image: newUser.image,
      address: {
        id: newUser.address.id,
        city: newUser.address.city,
        state: newUser.address.state,
        country: newUser.address.country,
      },
    };

    return userResult;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export function updateUser() {}

export function deleteUser() {}
