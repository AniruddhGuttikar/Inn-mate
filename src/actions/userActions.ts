"use server";

import prisma from "@/lib/db";
import {
  kindeUserSchema,
  TKindeUser,
  TUser,
  userSchema,
} from "@/lib/definitions";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

export async function getUserByKindeId(kindeId: string): Promise<TUser | null> {
  try {
    const newUser = await prisma.user.findUnique({
      where: {
        kindeId,
      },
      include: {
        address: true,
      },
    });

    if (!newUser) {
      return null;
    }
    return newUser;
  } catch (error) {
    console.error("Error finding the user: ", error);
    return null;
  }
}

export async function isAuthenticatedUserInDb(
  id: string
): Promise<TUser | null> {
  try {
    if (!id) {
      return null;
    }

    const newUser = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        address: true,
      },
    });

    if (!newUser) {
      return null;
    }
    return newUser;
  } catch (error) {
    console.error("Error finding the user: ", error);
    return null;
  }
}

export async function createUser(user: TUser): Promise<TUser | null> {
  try {
    const validatedUser = userSchema.parse(user);
    const { name, email, dob, gender, address, kindeId } = validatedUser;

    // const isUser = await prisma.user.findUniqueOrThrow({
    //   where: {
    //     id: user.id,
    //   },
    // });
    // if (isUser) {
    //   throw new Error("User already exists, try upadating");
    // }

    if (user.id) {
      throw new Error("User already exists, try upadating");
    }

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
        kindeId,
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

export async function mapKindeUserToUser(
  user: TKindeUser
): Promise<TUser | null> {
  const kindeUser = user as KindeUser<TKindeUser>;
  console.log("kinde user in server action", kindeUser);
  try {
    const validatedKindeUser = kindeUserSchema.parse(kindeUser);

    const alreadyUser = await prisma.user.findUnique({
      where: {
        kindeId: kindeUser.id,
      },
      include: {
        address: true,
      },
    });

    if (alreadyUser) {
      return alreadyUser;
    }

    const user: TUser = {
      address: {
        city: "",
        country: "",
        state: "",
      },
      kindeId: validatedKindeUser.id,
      dob: new Date(),
      email: validatedKindeUser.email,
      name: validatedKindeUser.given_name,
      gender: "OTHERS",
    };
    return user;
  } catch (error) {
    console.error("Error in mapping the user to kindeUser: ", error);
    return null;
  }
}
