import express from "express";
import passport from "passport";
import { app, auth, firestore } from "../config/firbase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";
var router = express.Router();

router.get("/login", async (req, res, next) => {
  //Sign In User
  try {
    let email = "balochdanish2020@gmail.com";
    let password = "12345678";
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (user) {
      if (user.metadata.creationTime === user.metadata.lastSignInTime) {
        // First login logic
        console.log("First login");
      } else {
        // Returning user logic
        console.log("Returning user");
      }
    }
    // Respond to the client with a success message or other appropriate response
    res.status(200).send("Authentication success");
  } catch (error) {
    console.error("Authentication error:", error);
    // Respond with an error status and message
    res.status(500).send("Authentication error");
  }
});

router.get("/create", async (req, res, next) => {
  // Create User
  let existUser = false;
  let singleUserid;
  let supportemail = process.env.SUPPORT_EMAIL;
  let senderemail = process.env.SENDER_EMAIL;
  let founder = process.env.FOUNDER;
  let email = "balochdanish2020@gmail.com";
  let users = await getDocs(collection(firestore, "users"));
  users.forEach(async (singleUser) => {
    let userData = singleUser.data();
    if (userData.email === email) {
      existUser = true;
      singleUserid = singleUser.id;
    }
  });
  if (!existUser) {
    let document = doc(firestore, "users", singleUserid);
    await updateDoc(document, { plan: true });
    console.log("User Updated successfully");
    res.send({ success: "success" });
    return;
  } else {
    try {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";

      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars.charAt(randomIndex);
      }
      console.log(password);

      // const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;
      // if (user) {
      //   console.log("New user created:", user.uid);
      //   const postsCollectionRef = collection(firestore, "users");

      //   // await addDoc(postsCollectionRef, {
      //   //   email: email,
      //   //   uuids: [],
      //   //   History: [],
      //   //   userInfo: {
      //   //     name: "Danish",
      //   //     paymentStatus: "",
      //   //     profession: "",
      //   //   },
      //   //   plan: true,
      //   //   createdDate: Date.now(),
      //   // });
      // }
      try {
        let transporter = nodemailer.createTransport({
          host: "mail.promptsgenii.com",
          port: 26,
          secure: false,
          // service: "gmail",
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
          to: email,
          subject: "Your Account Information",
          text: `email: ${email}, password: ${password}`,
          // html: "<b>Hello world?</b>", // html body
          html: emailTemplate(email, password, "Danish", supportemail, senderemail, founder),
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log("Message sent: %s", info.messageId);
          }
        });
      } catch (err) {
        console.log(err);
        console.log({ message: "Not Sending Email" });
      }
      console.log("User created successfully");
    } catch (error) {
      console.error("User creation error:", error);
    }
  }
});

export default router;
