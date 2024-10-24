// /app/api/webhooks/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

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
    return NextResponse.json({ status: "success", event: event.type });
  } catch (error) {
    console.log("Error in webhook:", error);
    return NextResponse.json({ status: "Failed", error });
  }
}

