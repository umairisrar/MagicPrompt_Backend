import config from "../config/config.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserService {
  /**
   * loginUser
   ** Logs in the user
   * @param email email for login
   * @param password password for login
   **/
  async loginUser({ email, password }) {
    console.log(password);
    try {
      // Check if the email already exists
      const user = await User.findOne({ email }).select("+password +email");

      if (!user) {
        return { error: { message: "Invalid email or password" }, status: "NO" };
      }

      // Compare the provided password with the hashed password in the database
      console.log(user.password);
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return { error: { message: "Invalid email or password" }, status: "NO" };
      }

      // Passwords match, generate and return a JWT token
      const token = jwt.sign({ id: user.id, role: user.role }, config.jwtSecretKey);
      return { token, status: "OK" };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * addUser
   ** Adds a new user
   * @param email email for registration
   * @param password password for registration
   * @param name password for registration
   **/
  async addUser({ email, password, username, role }) {
    try {
      // Check if the email already exists
      const existingUserName = await User.findOne({ username });
      if (existingUserName) {
        return { error: { message: "User Name already exists" }, status: "NO" };
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return { error: { message: "Email already exists" }, status: "NO" };
      }

      // Create a new user
      const newUser = new User({ email, password, username, role });
      await newUser.save();

      // Passwords match, generate and return a JWT token
      const token = jwt.sign({ id: newUser.id, role: newUser.role }, config.jwtSecretKey);

      return { status: "OK", user: newUser, token };
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * updateUser
   ** Updates user profile
   * @param email email to update
   * @param username username to update
   * @param image image to update
   * @param userId userId of the user to be updated
   **/
  async updateUser(data, userId) {
    try {
      let userData = await User.findOne({ _id: userId.id });
      const existingUserName = await User.findOne({ username: data.username });

      if (existingUserName && existingUserName.username !== userData.username) {
        console.log("User Name already exists");
        return { error: { message: "User Name already exists" }, status: "NO" };
      }
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser && existingUser.email !== userData.email) {
        console.log("Email already exists");
        return { error: { message: "Email already exists" }, status: "NO" };
      }

      const values = {};

      if (data.username) {
        values.username = data.username;
      }

      if (data.email) {
        values.email = data.email;
      }

      if (data?.image) {
        values.image = data.image;
      }

      console.log("data -", JSON.stringify(data));
      const user = await User.findByIdAndUpdate(userId.id, { $set: data });
      return user;
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * validateLoginInput
   ** Validates input for login
   * @param email email for login
   * @param password password for login
   **/
  validateLoginInput({ email, password }) {
    try {
      const errors = {};

      // Validate email
      if (email?.trim() === "") {
        errors.email = "Email field shouldn't be empty";
      } else {
        let regExp =
          /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regExp)) {
          errors.email = "Invalid Email";
        }
      }

      if (password === "") {
        errors.password = "password field shouldn't be empty";
      } else {
        if (password.length < 6) {
          errors.password = "Password should be at least 6 characters";
        }
      }

      return {
        errors,
        isValid: Object.keys(errors).length === 0,
        values: { email, password },
      };
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * validateRegisterInput
   ** Validates input for Registration
   * @param email email for registration
   * @param password password for registration
   * @param name name for registration
   **/
  validateRegisterInput({ email, password, username, role }) {
    try {
      const errors = {};

      // validate name
      if (!username || username?.trim() === "") {
        errors.username = "Username field shouldn't be empty";
      }

      // validate role
      if (!role || (role?.trim() === "" && ["seller", "user"].includes(role))) {
        errors.role = "role field shouldn't be empty";
      }

      // Validate email
      if (!email || email?.trim() === "") {
        errors.email = "Email field shouldn't be empty";
      } else {
        let regExp =
          /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regExp)) {
          errors.email = "Invalid Email";
        }
      }

      // validate password
      if (!password || password === "") {
        errors.password = "password field shouldn't be empty";
      } else {
        if (password.length < 6) {
          errors.password = "Password should be at least 6 characters";
        }
      }

      return {
        errors,
        isValid: Object.keys(errors).length === 0,
        values: { email, password, username, role },
      };
    } catch (error) {
      console.log(error);
    }
  }

  validatePasswordInput({ email, password, username, role }) {
    try {
      const errors = {};

      // validate password
      if (!password || password === "") {
        errors.password = "password field shouldn't be empty";
      } else {
        if (password.length < 6) {
          errors.password = "Password should be at least 6 characters";
        }
      }

      return {
        errors,
        isValid: Object.keys(errors).length === 0,
        values: { password },
      };
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UserService();
