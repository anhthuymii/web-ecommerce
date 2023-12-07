import stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripeInstance = stripe(process.env.STRIPE_KEY);
let endpointSecret;

export const paymentController = async (req, res) => {
  const products = req.body.products;
  const user = req.body.user;
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const customer = await stripeInstance.customers.create({
    email: user.email,
    name: user.name,
    phone: user.phone,
    // address: user.address,
    metadata: {
      products: products.map((item) => {
        return {
          _id: item._id,
          size: item.size,
          quantity: item.quantity,
        };
      }),
    },
  });

  const line_items = products.map((item) => {
    return {
      price_data: {
        currency: "VND",
        product_data: {
          name: item.name,
          images: [item.image],
          metadata: {
            size: item.size,
          },
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
      metadata: {
        size: item.size,
        _id: item._id,
      },
    };
  });

  products.forEach((item) => {
    console.log("Item Metadata:", item);
  });

  const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ["card"],
    shipping_address_collection: {
      allowed_countries: ["VN"],
    },

    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 0,
            currency: "VND",
          },
          display_name: "Miễn phí ship",
          delivery_estimate: {
            minimum: {
              unit: "day",
              value: 5,
            },
            maximum: {
              unit: "day",
              value: 7,
            },
          },
        },

        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: {
            amount: 35000,
            currency: "VND",
          },
          display_name: "Trong Tuần",
          delivery_estimate: {
            minimum: {
              unit: "day",
              value: 2,
            },
            maximum: {
              unit: "day",
              value: 3,
            },
          },
        },
      },
    ],
    phone_number_collection: {
      enabled: true,
    },
    customer: customer.id,
    line_items: line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT}/paymentgateway?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT}/cart`,
  });
  res.json({ url: session.url });
};

export const checkOutSession = async (request, response) => {
  const payload = request.body;
  const sig = request.headers["stripe-signature"];
  let eventType;
  let data;
  if (endpointSecret) {
    let event;
    try {
      event = stripeInstance.webhooks.constructEvent(
        request.body,
        sig,
        endpointSecret
      );
      console.log("payment success");
    } catch (err) {
      console.log(err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    data = event.data.object;
    eventType = event.type;
  } else {
    data = request.body.data.object;
    eventType = request.body.type;
  }
  if (eventType === "checkout.session.completed") {
    const customer = await stripe.customers.retrieve(data.customer);
    console.log("customer: ", customer);
    console.log(data);
  }
  response.send();
};
