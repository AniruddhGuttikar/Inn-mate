import getBookingDetailsByPropertyId from '@/actions/bookingActions';
import { mapKindeUserToUser } from '@/actions/userActions';
import DeleteProperty from '@/components/property/DeleteProperty'
import { TKindeUser } from '@/lib/definitions';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import React from 'react'

type Props = {
    params: {
      kindeUserId: string;
      propertyId: string;
    };
  };
export default async  function Deleteprops({ params }: Props){
    const {kindeUserId,propertyId}=params
    const { getUser } = getKindeServerSession();
    const kindeUser = (await getUser()) as TKindeUser;
    if(!kindeUser){
        return(<h1>Sorry..Something went wrong</h1>)
    }
    const user = await mapKindeUserToUser(kindeUser);
    if(!user){
        return(<h1>Sorry..Something went wrong</h1>)
    }
    
    // const bookings=await getBookingDetailsByPropertyId(propertyId)
    const bookings= {
        id: 'string',
        startDate: 'Date',
        endDate: 'Date',
        totalPrice: 2,
        userId: 'string',
        propertyId: 'string',
        status: "CONFIRMED" 
    }
    if(!bookings){
        return(
            <h1>hi</h1>
        )
    }
    return(
        <>
        <DeleteProperty bookings={bookings} userId={user.id}  kindeId={kindeUserId}/>
        </>
    )
}