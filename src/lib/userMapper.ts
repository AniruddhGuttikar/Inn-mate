import prisma from "./db";
import { kindeUserSchema, TKindeUser, TUser } from "./definitions";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

export async function mapKindeUserToUser(
  kindeUserData: KindeUser<TKindeUser>
): Promise<TUser | null> {
  const validatedKindeUser = kindeUserSchema.safeParse(kindeUserData);
  if (!validatedKindeUser.success) {
    console.log(kindeUserData);
    console.error("error in parsing the kinde user");
    return null;
  }
  let user = await prisma.user.findUnique({
    where: { email: validatedKindeUser.data.email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: validatedKindeUser.data.email,
        name: `${validatedKindeUser.data.given_name} ${
          validatedKindeUser.data.family_name || ""
        }`,
        dob: new Date(),
        gender: "OTHERS",
        image: validatedKindeUser.data.picture || undefined,
        // Create an associated address
        address: {
          create: {
            city: "",
            state: "",
            country: "",
          },
        },
      },
    });
  }
  return user;
}
