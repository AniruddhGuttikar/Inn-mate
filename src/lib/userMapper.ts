import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import prisma from "./db";
import { kindeUserSchema, TKindeUser, TUser } from "./definitions";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

// if the user is authenticated function will return the user or create a new user
export async function getUser(): Promise<TUser | null> {
  const { getUser: getUserKinde, isAuthenticated } = getKindeServerSession();

  if (!isAuthenticated) {
    return null;
  }

  const kindeUser = (await getUserKinde()) as KindeUser<TKindeUser>;

  const validatedKindeUser = kindeUserSchema.safeParse(kindeUser);
  if (!validatedKindeUser.success) {
    console.log(kindeUser);
    console.error("error in parsing the kinde user");
    return null;
  }
  let user = await prisma.user.findUnique({
    where: {
      id: validatedKindeUser.data.id,
    },
    include: {
      address: true,
    },
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
  return user;

  // //test
  // const newUser: TUser = {
  //   name: "john",
  //   email: "johndoe@gmail.com",
  //   gender: "OTHERS",
  //   dob: new Date(),
  //   address: {
  //     city: "",
  //     country: "",
  //     state: "",
  //   },
  // };
  // return newUser;
}

// will tell if the user is in our database or not
export async function isUserAuthenticated() {
  const user = await getUser();
  if (!user) {
    return false;
  }

  // if the user has an id then they are present in tje database
  if (!user.id) {
    return false;
  }

  return true;
}
