import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../config/firbase.js";
import stripe from "../utils/stripe.js";
import nodemailer from "nodemailer";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const handleWebhooks = async (request, response) => {
  try {
    let event = request.body;
    // Replace this endpoint secret with your endpoint's unique secret
    // If you are testing with the CLI, find the secret by running 'stripe listen'
    // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
    // at https://dashboard.stripe.com/webhooks
    // const endpointSecret =
    //   "whsec_53ff7ba4ca953a9868389cdca5509f9232a8bedcf66f36d6562ed36be9503abd";
    // const endpointSecret = "whsec_y8UwZiVUwOTbz0QZF8BY6rerkLHfMykf";
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
      // Get the signature sent by Stripe
      const signature = request.headers["stripe-signature"];
      try {
        event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
      } catch (err) {
        console.log(err);
        console.log(
          `⚠️  Webhook signature verification failed.`,
          err.message,
          request.body,
          signature,
          endpointSecret
        );
        return response.sendStatus(400);
      }
    }
    // console.log(event.data.object, event.type);

    // Handle the event
    switch (event.type) {
      //   case "customer.subscription.trial_will_end":
      //     subscription = event.data.object;
      //     status = subscription.status;
      //     console.log(`Subscription status is ${status}.`);
      //     // Then define and call a method to handle the subscription trial ending.
      //     // handleSubscriptionTrialEnding(subscription);
      //     break;
      //   case "customer.subscription.deleted":
      //     subscription = event.data.object;
      //     status = subscription.status;
      //     console.log(`Subscription status is ${status}. deleting`);
      //     // Then define and call a method to handle the subscription deleted.
      //     handleSubscriptionDeleted(subscription);
      //     break;
      //   case "customer.subscription.created":
      //     subscription = event.data.object;
      //     status = subscription.status;
      //     console.log(`Subscription status is ${status}.`);

      //     // Then define and call a method to handle the subscription created.
      //     handleSubscriptionCreated(subscription, status);
      //     break;

      //   case "customer.subscription.updated":
      //     subscription = event.data.object;
      //     status = subscription.status;

      //     console.log(`Subscription status is ${status}.`);
      //     // Then define and call a method to handle the subscription update.
      //     // handleSubscriptionUpdated(subscription);
      //     break;

      //   case "invoice.paid":
      //     subscription = event.data.object;
      //     status = subscription.status;
      //     console.log(`Subscription status is ${status}. Invoice`);

      //     await handleSubscriptionCreated(subscription, status);
      //     break;

      case "checkout.session.completed":
        let customer = event.data.object.customer_details;
        let existUser = false;
        let singleUserid;
        let users = await getDocs(collection(firestore, "users"));
        users.forEach(async (singleUser) => {
          let userData = singleUser.data();
          if (userData.email === customer.email) {
            existUser = true;
            singleUserid = singleUser.id;
          }
        });
        if (existUser) {
          let document = doc(firestore, "users", singleUserid);
          await updateDoc(document, {
            plan: true,
            userInfo: {
              name: customer.name,
              paymentStatus: event.data.object?.payment_status,
              profession: event.data.object?.custom_fields[0]?.text?.value,
            },
          });
          return;
        } else {
          try {
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            let password = "";

            for (let i = 0; i < 8; i++) {
              const randomIndex = Math.floor(Math.random() * chars.length);
              password += chars.charAt(randomIndex);
            }

            const userCredential = await createUserWithEmailAndPassword(
              auth,
              customer.email,
              password
            );
            const user = userCredential.user;

            if (user) {
              console.log("New user created:", user.uid);
              const postsCollectionRef = collection(firestore, "users");

              await addDoc(postsCollectionRef, {
                email: customer.email,
                uuids: [],
                History: [],
                userInfo: {
                  name: customer.name,
                  paymentStatus: event.data.object.payment_status,
                  profession: event.data.object?.custom_fields[0]?.text?.value,
                },
                plan: true,
                createdDate: Date.now(),
              });
            }
            try {
              let transporter = nodemailer.createTransport({
                // host: "smtp.office365.com",
                // port: 587,
                // secure: false,
                service: "gmail",
                auth: {
                  user: process.env.SENDER_EMAIL,
                  pass: process.env.SENDER_PASSWORD,
                },
                tls: {
                  rejectUnauthorized: false,
                },
              });
              let mailOptions = {
                from: process.env.SENDER_EMAIL,
                to: customer.email,
                subject: "Your Account Information",
                text: `email: ${customer.email}, password: ${password}`,
                // html: "<b>Hello world?</b>", // html body
              };
              transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Message sent: %s", info.messageId);
                }
              });
            } catch (err) {
              console.log({ message: "Not Sending Email" });
            }
            console.log("User created successfully");
          } catch (error) {
            console.error("User creation error:", error);
          }
        }

        break;

      // case "payment_intent.succeeded":
      //   console.log(event.data.object);
      //   break;

      // case "checkout.session.completed":
      //   console.log(event.data.object);
      //   break;

      // case "payment_intent.succeeded":
      //   subscription = event.data.object;
      //   status = subscription.status;
      //   console.log(`Life time payment is ${status}.`);

      //   await (subscription, status);
      //   break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  } catch (error) {
    console.log(error);
  }
};
