import express from "express";
import passport from "passport";
import { app, auth, firestore } from "../config/firbase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import nodemailer from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";
var router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.send({ message: "server is working successfully" });
  } catch (error) {
    res.send({ error: error.message });
  }
});

export default router;
