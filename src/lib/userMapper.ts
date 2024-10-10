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
    const newUser: TUser = {
      name:
        validatedKindeUser.data.given_name +
        (validatedKindeUser.data.family_name ?? ""),
      email: validatedKindeUser.data.email,
      gender: "OTHERS",
      dob: new Date(),
      address: {
        city: "",
        country: "",
        state: "",
      },
    };
    return newUser;
  }
  return null;
}
