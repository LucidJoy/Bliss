const { default: Stripe } = require("stripe");

const STRIPE_SECRET_KEY =
  "sk_test_51K6zdpSJoWGgDvdetMzAr2fjczuGEg00S7BnWW85n9r7hyDS23qKQhXy3906FftdpARuihL3lv7Kyun4mKonB2GI00xTdWdwgV";

const handler = async (req, res) => {
  const { method } = req;

  if (method === "GET") {
  }

  if (method === "POST") {
    if (!STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key not found");
    }

    const { walletAddress } = req.body;
    if (!walletAddress) {
      throw new Error("Buyer wallet address not found");
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2024-04-10",
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10_00,
      currency: "inr",
      description: "Example NFT delivered with thirdweb Engine.",
      payment_method_types: ["card"],
      metadata: { walletAddress },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  }
};

export default handler;
