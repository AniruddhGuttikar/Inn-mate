'use client';
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import addliked, { deleteLiked, getIsFavorite } from "@/actions/favoritesAction";
import { useForm } from "react-hook-form";
import { favoriteSchema, TFavorite } from "@/lib/definitions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getUserByKindeId } from '@/actions/userActions';

interface FavoriteButtonProps {
  propertyId: string | '';
}

export default function FavoriteButton({ propertyId }: FavoriteButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const { user, isAuthenticated } = useKindeBrowserClient();
  const kindeId = user?.id || "";  

  const favorites = useForm<TFavorite>({
    resolver: zodResolver(favoriteSchema),
    defaultValues: { userId: "", propertyId: "" },
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (kindeId) {
        const userId = await getUserByKindeId(kindeId);
        if (!userId) {
          console.error('User not found in the database.');
          return;
        }
        favorites.setValue("userId", userId?.id || '');
      }
    };
    fetchUser();
  }, [kindeId, favorites]);

  //make by default red for all liked fav things..
  const setFav=async()=>{
  if(favorites.getValues().userId){
    //user exists now check if the field is favorited or not then set isFavorite
    if(propertyId){
      const isRed=await getIsFavorite(favorites.getValues().userId,propertyId)
      if(isRed){
        //the property is in Favorites
        setIsFavorited(true)
      }
      else{
        setIsFavorited(false)
      }
    }
  }
}
  setFav();

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast({ title: "Error", description: "User not authenticated" });
      return;
    }

    if (!user?.id) {
      toast({ title: "Error", description: "Please log in first" });
      router.push(`/`);
      return;
    }

    try {
      let result;

      if (isFavorited) {
        result = await deleteLiked({ ...favorites.getValues(), propertyId });
        if (!result) {
          throw new Error("Couldn't remove favorites");
        }
        setIsFavorited(false);  // Update state after successful delete
      } else {
        result = await addliked(favorites.getValues().userId, { ...favorites.getValues(), propertyId });
        if (!result) {
          throw new Error("Couldn't add to favorites");
        }
        setIsFavorited(true);  // Update state after successful add
        router.refresh(); 
      }
    } catch (error) {
      console.error("Something went wrong", error);
      toast({ title: "Error", description: "Error updating favorites" });
    }
  };

  return (
    <Button
      size="icon"
      variant="secondary"
      className="absolute top-2 right-2 rounded-full"
      onClick={handleToggleFavorite}
    >
      <Heart
        className="h-4 w-4"
        style={{
          fill: isFavorited ? "red" : "none",
          stroke: isFavorited ? "red" : "gray",
        }}
      />
      <span className="sr-only">Add to favorites</span>
    </Button>
  );
}
