"use client";

import React from "react";
import { Button } from "../ui/button";
import { getUserByKindeId } from "@/actions/userActions";
import { toast } from "@/hooks/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useRouter } from "next/navigation";


const BookPropertyButton = ({ propertyId }: { propertyId: string | undefined }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useKindeBrowserClient();

  async function HandleBook() {
    console.log("User",user)
    // Early return if the user is not authenticated
    if (!user) {
      toast({
        title: 'Please LogIn/SignUp',
        description: 'You need to be logged in to book a property.',
      });
      router.push('/auth');
      return;
    }

    // If user is authenticated, try to get the user info
    try {
      const userData = await getUserByKindeId(user.id);
      if (userData) {
        if (propertyId) {
          router.push(`/properties/${propertyId}`);
        } else {
          toast({
            title: 'Property ID missing',
            description: 'We could not find the property to book.',
          });
        }
      } else {
        toast({
          title: 'No user found',
          description: 'User not found. Please sign up.',
        });
        router.push('/auth');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error fetching user details.',
      });
      console.error(error);
    }
  }

  return (
    <Button onClick={HandleBook}>
      Book Now
    </Button>
  );
};

export default BookPropertyButton;
