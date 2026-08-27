import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
    // ログイン確認
    const supabase = await createClient();

    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        return NextResponse.redirect(
            new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL),
            303
        );
    }

    // Stripe Checkout Sessionを作成
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price: "price_1U8zXcEJ4lKl95AqMGNuJX9J",
                quantity: 1,
            },
        ],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success`,
    });

    // Stripe Checkoutへリダイレクト
    return NextResponse.redirect(session.url!, 303);
}