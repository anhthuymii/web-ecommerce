import stripe from "stripe";
import { Router } from "express";
import dotenv from "dotenv";
import express from "express";
dotenv.config();

const router = Router();
const stripeInstance = stripe(process.env.STRIPE_KEY);

router.post("/create-checkout-session", async (req, res) => {
  const products = req.body.products;
  const user = req.body.user;
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const orderData = products.map((item) => {
    return {
      _id: item._id,
      size: item.size,
      quantity: item.quantity,
      user: user.id,
    };
  });

  const customer = await stripeInstance.customers.create({
    email: user.email,
    name: user.name,
    phone: user.phone,
    // address: user.address,
    metadata: {
      products: JSON.stringify(orderData),
    },
  });

  const line_items = products.map((item) => {
    return {
      price_data: {
        currency: "VND",
        product_data: {
          name: item.name,
          images: [item.photo],
          metadata: {
            id: item._id,
            size: item.size,
          },
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    };
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
    line_items,
    mode: "payment",
    success_url: `${process.env.CLIENT}/dashboard/user/orders?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT}/cart`,
  });
  res.json({ url: session.url });
});

//webhook
let endpointSecret;
// console.log(endpointSecret)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const payload = request.body;
    const sig = request.headers["stripe-signature"];
    let eventType;
    let data;
    if (endpointSecret) {
      let event;
      try {
        event = stripeInstance.webhooks.constructEvent(
          payload,
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
      // stripe.customers.retrieve(data.customer).then((customer) => {
      //   console.log("Customer details: ", customer);
      //   console.log("data: ", data);
      //   createOrder(customer, data, res);
      // });
      // console.log(data);
      const customer = await stripeInstance.customers.retrieve(data.customer);
      createOrder(customer, data, response);
      console.log(data);
    }
    response.send().end();
  }
);

const createOrder = async (customer, sessionData, response) => {
  const { line_items, total } = sessionData;
  try {
    const orderData = {
      products: line_items.data,
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    response.status(200).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    response.status(400).json({ success: false, message: error.message });
  }
};

export default router;
