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
  console.log(req.body.Name);
  try {
    let planType = "";

    let allCoupons = Object.values(couponList).flat();
    let values = req.body;
    let email = values.Email;
    let name = values.Name;
    let coupon = values.Coupon;
    let password = values.Password;
    console.log(email, name, coupon, password);

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
          return res.status(500).send({ error: "Coupon Already Used" });
        }
      }
    } else {
      return res.status(500).send({ error: "Coupon is not valid" });
    }
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const postsCollectionRef = collection(firestore, "users");
    await addDoc(postsCollectionRef, {
      email,
      coupon,
      uuids: [],
      History: [],
      paid: true,
      createdDate: Date.now(),
      planType,
      userInfo: { name, paymentStatus: "", profession: "" },
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

    res.send({ status: "New User Created Successfully" });
  } catch (error) {
    res.send({ error: error.message });
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
