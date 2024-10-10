"use server";

import prisma from "@/lib/db";
import { TUser, userSchema } from "@/lib/definitions";

export async function createUser(user: TUser): Promise<TUser | null> {
  try {
    const validatedUser = userSchema.parse(user);
    const { name, email, dob, gender, address } = validatedUser;

    // add the address and user to our database
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
    console.log(newUser, `was successfuly created`);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    return null;
  }
}

export async function updateUser(user: TUser): Promise<TUser | null> {
  try {
    const validatedUser = userSchema.parse(user);

    const { id, name, email, dob, gender, address } = validatedUser;

    const newAddress = await prisma.address.update({
      where: {
        id: address.id,
      },

      data: {
        ...address,
      },
    });

    const newUser = await prisma.user.update({
      where: {
        id,
        email,
      },
      data: {
        id,
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
    console.log("User updated: ", newUser);
    return newUser;
  } catch (error) {
    console.error("Error in updating the user", error);
    return null;
  }
}

export async function deleteUser(user: TUser): Promise<TUser | null> {
  try {
    const validatedUser = userSchema.parse(user);
    const { id, address } = validatedUser;
    const addressId = address.id;

    prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    const newUser = prisma.user.delete({
      where: {
        id,
      },
      include: {
        address: true,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error deleting the user: ", error);
    return null;
  }
}
