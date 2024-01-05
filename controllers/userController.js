import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, firestore } from "../config/firbase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { couponList } from "../coupons/coupons.js";
import nodemailer from "nodemailer";
import { emailTemplate } from "../routes/emailTemplate.js";
import { createUserTemplate } from "../routes/createUserTemplate.js";
import { generateRandomString } from "../utils/generateRandomString.js";

// import { addDoc } from "firebase/firestore";

// export const createUser = async (req, res) => {
//   try {
//     let planType = "";
//     let allCoupons = Object.values(couponList).flat();
//     let values = req.body;
//     let email = values.Email;
//     let name = values.Name;
//     let coupon = values.Coupon;
//     let password = values.Password;
//     if (
//       !email ||
//       email.trim === "" ||
//       !coupon ||
//       coupon.trim === "" ||
//       !name ||
//       name.trim === "" ||
//       !password ||
//       password.trim === ""
//     ) {
//       return res.status(500).send({ error: "Please fill all fields" });
//     }

//     if (coupon.includes("T1")) {
//       planType = "T1";
//     } else if (coupon.includes("T2")) {
//       planType = "T2";
//     } else if (coupon.includes("T3")) {
//       planType = "T3";
//     }

//     let docRef;
//     let docSnapshot;
//     if (allCoupons.includes(coupon)) {
//       docRef = doc(firestore, "coupons", "used_coupons");
//       docSnapshot = await getDoc(docRef);
//       if (docSnapshot.exists()) {
//         const data = docSnapshot.data();
//         if (data.coupons.includes(coupon)) {
//           console.log("Coupon Already Used");
//           return res.status(500).send({ message: "Coupon Already Used" });
//         }
//       }
//     } else {
//       console.log("Coupon is not valid");
//       return res.status(500).send({ message: "Coupon is not valid" });
//     }
//     let existUser = false;
//     let user_paid = false;
//     let singleUserid;
//     let users = await getDocs(collection(firestore, "users"));
//     users.forEach(async (singleUser) => {
//       let userData = singleUser.data();
//       if (userData.email === email) {
//         existUser = true;
//         singleUserid = singleUser.id;
//       }
//     });
//     if (existUser) {
//       if (!user_paid) {
//         let document = doc(firestore, "users", singleUserid);
//         await updateDoc(document, {
//           plan: true,
//           userInfo: {
//             name: name,
//           },
//           coupon,
//           planType,
//         });
//         if (allCoupons.includes(coupon)) {
//           if (docSnapshot.exists()) {
//             const data = docSnapshot.data();
//             await setDoc(docRef, { coupons: [...data.coupons, coupon] });
//           } else {
//             const initialData = [coupon];
//             await setDoc(docRef, { coupons: initialData });
//           }
//         }
//         let passwordvalue = "************";
//         await sendEmailtoUser(email, passwordvalue, coupon, name);
//         return res
//           .status(200)
//           .send({ message: "New User Updated Successfully" });
//       } else {
//         return res.status(500).send({ message: "you have already paid" });
//       }
//     } else {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       if (!userCredential) {
//         console.log("Email is already in used");
//         return res.status(500).send({ message: "Email is already used" });
//       }
//       const postsCollectionRef = collection(firestore, "users");
//       let addUser = await addDoc(postsCollectionRef, {
//         email,
//         plan: true,
//         coupon,
//         uuids: [],
//         History: [],
//         createdDate: Date.now(),
//         planType,
//         plans: {

//         },
//         userInfo: { name, paymentStatus: "", profession: "" },
//       });
//       if (!addUser) {
//         console.log("Something went wrong");
//         return res.status(500).send({ message: "Something went wrong" });
//       }
//       if (allCoupons.includes(coupon)) {
//         if (docSnapshot.exists()) {
//           const data = docSnapshot.data();
//           await setDoc(docRef, { coupons: [...data.coupons, coupon] });
//         } else {
//           const initialData = [coupon];
//           await setDoc(docRef, { coupons: initialData });
//         }
//       }
//       await sendEmailtoUser(email, password, coupon, name);

//       console.log("New User Created Successfully");
//       return res.status(200).send({ message: "New User Created Successfully" });
//     }
//   } catch (error) {
//     console.log({ error: error.message });
//     return res.status(500).send({ message: error.message });
//   }
// };
export const createUser = async (req, res) => {
  try {
    let planType = "";
    let allCoupons = Object.values(couponList).flat();
    let values = req.body;
    let email = values.Email;
    let name = values.Name;
    let coupon = values.Coupon;
    let password = values.Password;
    if (
      !email ||
      email.trim === "" ||
      !coupon ||
      coupon.trim === "" ||
      !name ||
      name.trim === "" ||
      !password ||
      password.trim === ""
    ) {
      console.log("Please fill all fields");
      return res.status(500).send({ error: "Please fill all fields" });
    }

    if (coupon.includes("T1")) {
      planType = "T1";
    } else if (coupon.includes("T2")) {
      planType = "T2";
    } else if (coupon.includes("T3")) {
      planType = "T3";
    }

    let docRef;
    let docSnapshot;
    if (allCoupons.includes(coupon)) {
      docRef = doc(firestore, "coupons", "used_coupons");
      docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data.coupons.includes(coupon)) {
          console.log("Coupon Already Used");
          return res.status(500).send({ message: "Coupon Already Used" });
        }
      }
    } else {
      console.log("Coupon is not valid");
      return res.status(500).send({ message: "Coupon is not valid" });
    }
    let existUser = false;
    let user_paid = false;
    let singleUserid;
    let users = await getDocs(collection(firestore, "users"));
    let allPlans = [];
    let couponarray;
    users.forEach(async (singleUser) => {
      let userData = singleUser.data();
      if (userData.email === email) {
        allPlans = userData.plans
          ? userData.plans
          : userData.plan
          ? [
              {
                type: userData.planType,
                licenseKey: generateRandomString(26),
                count:
                  userData.planType === "T1"
                    ? 1
                    : userData.planType === "T2"
                    ? 5
                    : userData.planType === "T3"
                    ? 20
                    : 1,
              },
            ]
          : [];
        couponarray = userData?.coupon ? userData?.coupon : [];
        if (Array.isArray(couponarray)) {
          couponarray.push(coupon);
        } else if (typeof couponarray === "string") {
          couponarray = [couponarray, coupon];
        }

        existUser = true;
        singleUserid = singleUser.id;
      }
    });

    let licenseKey = generateRandomString(26);
    let planlength;
    if (existUser) {
      if (!user_paid) {
        let filteredPlans = allPlans?.filter((item, i) => {
          if (item.type.includes(planType)) {
            return item;
          }
        });
        if (filteredPlans.length >= 1) {
          planlength = `${planType}_${filteredPlans?.length}`;
        } else {
          planlength = planType;
        }
        allPlans.push({
          type: planlength,
          licenseKey,
          count:
            planType === "T1"
              ? 1
              : planType === "T2"
              ? 5
              : planType === "T3"
              ? 20
              : null,
        });

        console.log(allPlans);
        console.log(couponarray);
        let document = doc(firestore, "users", singleUserid);
        await updateDoc(document, {
          plan: true,
          userInfo: {
            name: name,
          },
          coupon: couponarray,
          planType,
          plans: allPlans,
        });
        if (allCoupons.includes(coupon)) {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            await setDoc(docRef, { coupons: [...data.coupons, coupon] });
          } else {
            const initialData = [coupon];
            await setDoc(docRef, { coupons: initialData });
          }
        }
        let passwordvalue = "************";
        await sendEmailtoUser(email, passwordvalue, coupon, name);
        return res
          .status(200)
          .send({ message: "New User Updated Successfully" });
      } else {
        return res.status(500).send({ message: "you have already paid" });
      }
    } else {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!userCredential) {
        console.log("Email is already in used");
        return res.status(500).send({ message: "Email is already used" });
      }
      const postsCollectionRef = collection(firestore, "users");
      let addUser = await addDoc(postsCollectionRef, {
        email,
        plan: true,
        coupon: [coupon],
        uuids: [],
        History: [],
        createdDate: new Date(Date.now()),
        adminLogin: false,
        loginIds: [],
        plans: [
          {
            type: planType,
            licenseKey: licenseKey,
            count:
              planType === "T1"
                ? 1
                : planType === "T2"
                ? 5
                : planType === "T3"
                ? 20
                : null,
          },
        ],
        planType,
        userInfo: { name, paymentStatus: "", profession: "" },
      });
      if (!addUser) {
        console.log("Something went wrong");
        return res.status(500).send({ message: "Something went wrong" });
      }
      if (allCoupons.includes(coupon)) {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          await setDoc(docRef, { coupons: [...data.coupons, coupon] });
        } else {
          const initialData = [coupon];
          await setDoc(docRef, { coupons: initialData });
        }
      }
      await sendEmailtoUser(email, password, coupon, name);

      console.log("New User Created Successfully");
      return res.status(200).send({ message: "New User Created Successfully" });
    }
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).send({ message: error.message });
  }
};

const sendEmailtoUser = async (email, password, coupon, name) => {
  let supportemail = process.env.SUPPORT_EMAIL;
  let senderemail = process.env.SENDER_EMAIL;
  let founder = process.env.FOUNDER;
  let SENDER_PASSWORD = process.env.SENDER_PASSWORD;
  try {
    let transporter = nodemailer.createTransport({
      host: "mail.promptsgenii.com",
      port: 26,
      secure: false,
      auth: {
        user: senderemail,
        pass: SENDER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    let mailOptions = {
      from: senderemail,
      to: email,
      subject: "Your Account Information",
      html: createUserTemplate(
        email,
        password,
        name,
        supportemail,
        senderemail,
        founder
      ),
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        // response.send(error);
      } else {
        // response.send("Message sent: %s", info.messageId);
        console.log("Message sent: %s", info.messageId);
      }
    });
  } catch (err) {
    // response.send(err);
    console.log(err);
    console.log({ message: "Not Sending Email" });
  }
};

export const getUser = async (req, res) => {
  try {
    const usersCollection = collection(firestore, "users");
    const querySnapshot = await getDocs(usersCollection);

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const subscriptionUser = async (req, res) => {
  try {
    const usersCollection = collection(firestore, "users");
    const querySnapshot = await getDocs(usersCollection);

    const users = [];

    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    let specificusers = users
      .map((item, i) => {
        console.log(item);
        if (item.data.planType) {
          if (item.data.planType === "T1" && item.data.uuids.length > 1) {
            return item;
          }
          if (item.data.planType === "T2" && item.data.uuids.length > 5) {
            return item;
          }
          if (item.data.planType === "T3" && item.data.uuids.length > 20) {
            return item;
          }
        }
        return null;
      })
      .filter((item) => item !== null);
    return res.status(200).json({ specificusers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: error.message });
  }
};
