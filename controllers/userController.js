import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth, firestore } from "../config/firbase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { couponList } from "../coupons/coupons.js";
// import { addDoc } from "firebase/firestore";

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
      return res.status(500).send({ error: "Please fill all fields" });
    }

    if (coupon.includes("T1")) {
      console.log("t1");
      planType = "T1";
    } else if (coupon.includes("T2")) {
      planType = "T2";
      console.log("t2");
    } else if (coupon.includes("T3")) {
      planType = "T3";
      console.log("t3");
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
    console.log("ok3");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log(userCredential);
    if (!userCredential) {
      console.log("Email is already used");
      return res.status(500).send({ message: "Email is already used" });
    }
    const postsCollectionRef = collection(firestore, "users");
    let addUser = await addDoc(postsCollectionRef, {
      email,
      coupon,
      plan: true,
      uuids: [],
      History: [],
      paid: true,
      createdDate: Date.now(),
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
    console.log("New User Created Successfully");
    return res.status(200).send({ message: "New User Created Successfully" });
  } catch (error) {
    console.log({ error: error.message });
    return res.status(500).send({ message: error.message });
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
