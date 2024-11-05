"use server";

import prisma from "@/lib/db";
import {
  kindeUserSchema,
  TBooking,
  TKindeUser,
  TUser,
  userSchema,
} from "@/lib/definitions";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { revalidatePath } from "next/cache";
import nodemailer from 'nodemailer' ;
import { getPropertyById } from "./propertyActions";
export async function getUserById(
  id: string | undefined
): Promise<TUser | null> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        address: true,
      },
    });

    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error finding the user: ", error);
    return null;
  }
}
export async function getUserByKindeId(kindeId: string): Promise<TUser | null> {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        kindeId,
      },
      include: {
        address: true,
      },
    });

    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error("Error finding the userByKindeId: ", error);
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
    revalidatePath("/");
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
export default async function SendMailToUsers(bookingDataList: TBooking[]) {
  try {
    // Configure your SMTP transport (e.g., Gmail or other email service)
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Or another email service provider
      auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS, // Your email password or app-specific password
      },
    });

    for (const bookingData of bookingDataList) {
      const userId = bookingData.userId;
      const user = await getUserById(userId);
      const prop = await getPropertyById(bookingData.propertyId);
      const propName = prop?.name;

      if (!user || !user.email) {
        console.error(`User not found or email not available for user ID ${userId}`);
        continue;
      }

      const userEmail = user.email;
      const subject = 'Booking Cancellation Notice';

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; margin: 20px; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
          <h1 style="color: #333;">Dear ${user.name},</h1>
          <p style="color: #555;">We regret to inform you that your booking has been canceled by the admin. <strong style="color: red;">This property is no longer available.</strong> We sincerely apologize for the inconvenience this may cause.</p>
          
          <h2 style="color: #333;">Booking Details:</h2>
          <ul style="list-style-type: none; padding: 0;">
            <li><strong>Booking ID:</strong> ${bookingData.id}</li>
            <li><strong>Property:</strong> ${propName}</li>
            <li><strong>Check-in:</strong> ${bookingData.startDate}</li>
            <li><strong>Check-out:</strong> ${bookingData.endDate}</li>
            <li><strong>Total Price:</strong> $${bookingData.totalPrice}</li>
          </ul>
          
          <p style="color: #555;">As a token of our apology, we will issue a full refund for your booking. Please allow 3-5 business days for the refund to process.</p>
          
          <p style="color: #555;">Thank you for your understanding. If you have any further questions or need assistance, feel free to reach out to our support team.</p>
          
          <p style="color: #555;">Best regards,</p>
          <p style="color: #555;">The Team</p>
          <footer style="margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px; color: #777;">
            <p>Contact us: support@example.com | Phone: +1 234 567 890</p>
            <p>Follow us on <a href="https://twitter.com/example" style="color: #1DA1F2;">Twitter</a> and <a href="https://facebook.com/example" style="color: #1877F2;">Facebook</a></p>
          </footer>
        </div>
      `;

      const mailOptions = {
        from: 'no-reply@example.com', // Your email or service email
        to: userEmail,
        subject,
        html: htmlContent,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Cancellation email sent successfully to:', userEmail);
        return 200
      } catch (error) {
        console.error(`Error sending email to ${userEmail}:`, error);
        return null
      }
    }
  } catch (error) {
    console.error('Error processing bookings:', error);
    return null
  }
}