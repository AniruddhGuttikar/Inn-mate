
//handling the favotite action
'use server'
import {favouriteSchema , TFavourite} from "@/lib/definitions";
import { getUserByKindeId, isAuthenticatedUserInDb } from "./userActions";
import cuid from "cuid";
import prisma from "@/lib/db";


export default async function addliked(
    user_id : string,
    likedData : TFavourite
): Promise<TFavourite | null>{
    try{
        // console.log("likedData:1 " ,user_id)
        // console.log("likedData user_id: ", user_id);
        // console.log("Initial likedData:", likedData);
        const isAuthenticatedUser = await isAuthenticatedUserInDb(user_id);
        if (!isAuthenticatedUser) {
            throw new Error(
            "User not authenticated, please register before proceeding"
            );
        }
        const validatedFavorites=favouriteSchema.parse(likedData);
        const liked=await prisma.favourite.create({
            data:{
                userId:validatedFavorites.userId,
                propertyId : validatedFavorites.propertyId
            }
        })

        return liked
    }catch(error){
        console.log('Error in adding favorites :)',error)
        return null
    }

}

export  async function deleteLiked(likedData : TFavourite){
    try{
    const validatedFavorites=favouriteSchema.parse(likedData);
    const favorite = await prisma.favourite.findMany({
        where: {
            AND: [
                { userId: validatedFavorites.userId },
                { propertyId: validatedFavorites.propertyId }
            ]
        }
    });
    const delete_fav = await prisma.favourite.delete({
        where: {
            id: favorite[0].id, 
        },
    });
    if(!delete_fav){
        return null
    }
    return delete_fav
}catch(error){
    console.log('Error While deteting',error)
    return null
}    
}

export async function getIsFavorite(userId: string, propertyId: string | undefined){
    const favorite = await prisma.favourite.findMany({
        where: {
            AND: [
                { userId: userId },
                { propertyId:propertyId }
            ]
        }
    });
    console.log("Favoraite:",favorite)
    if(favorite.length > 0){
        return favorite
    }
    else{
        return null
    }
}


export async function getAllFavorite(KindeId : string | ''): Promise<TFavourite[] | null>{
    const user_id = await getUserByKindeId(KindeId);
    if (!user_id) {
      console.error('User not found in the database.');
      return null;
    }
    if(! await isAuthenticatedUserInDb(user_id?.id || '')){
        console.error('User not Authenticated');
        return null
    }

    const favorites=await prisma.favourite.findMany({
        where:{
            userId : user_id.id
        }
    })
    // console.log('fav:',favorites)
    if(!favorites){
        return null
    }
    return favorites
    
}