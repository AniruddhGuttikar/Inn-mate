import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { amount, propertyName, checkIn, checkOut, propDetails } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Property Name: ${propertyName}`, 
              description: `CheckIn Date: ${checkIn}\nCheckOut Date: ${checkOut}`, 
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_DOMAIN}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_DOMAIN}/cancel`,
      metadata: {
        propertyDetails: JSON.stringify(propDetails), // Ensure this is serialized for logging purposes
      },
    });

    console.log('SessionLogs: ', session.object);

    return NextResponse.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error creating Stripe session' }, { status: 500 });
  }
}
