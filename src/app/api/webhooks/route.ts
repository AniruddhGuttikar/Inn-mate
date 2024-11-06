import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createBooking } from "@/actions/bookingActions";
import { BookingCnfMail } from "@/actions/userActions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("Stripe-Signature");

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log("Event received:", event.type);

    // Log property details when the payment is successful
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      if (session.metadata?.propertyDetails) {
        try {
          const propertyDetailsData = JSON.parse(session.metadata?.propertyDetails);
          console.log("prop",propertyDetailsData);
          const res = await createBooking(propertyDetailsData)
          if (!res) {
            return NextResponse.json({ status: "Failed", message: "Failed to add to database" });
        }
          const resM=await BookingCnfMail(propertyDetailsData,sig ||' ')



        } catch (error) {
          console.error("Error parsing propertyDetails JSON:", error);
        }
      }
      else {
        console.error("No data")
      }
      //Here we add something with Updating the property details to DataBase callling actions/bookingActions/CreateBooking
      
    }

    return NextResponse.json({ status: "success", event: event.type });
  } catch (error) {
    console.log("Error in webhook:", error);
    return NextResponse.json({ status: "Failed", error });
  }
}
