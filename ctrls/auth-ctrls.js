// models
import { User, Otp } from "../models.js";
// services
import { sendMail } from "../services/mail-services.js";
import { templateToHTML } from "../services/mail-services.js";
import {
  generateJWT,
  verifyJWT,
  generateHash,
  compareHash,
} from "../services/misc-services.js";
import { handlebarsReplacements } from "../services/misc-services.js";

export const email = async (req, res) => {
  try {
    const { email } = req.body;
    // create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await new User({ email }).save();
    }
    // create token
    const newToken = generateJWT({ email }, { expiresIn: "3d" });
    res
      .status(201)
      .send({ message: "user created/updated", user, token: newToken });
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const token = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      res.status(200).send({ data: user, message: "existing user" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const otp_generate = async (req, res) => {
  const { email } = req.body;
  try {
    if (!email) {
      res.status(422);
      throw new Error("missing email");
    } else {
      // generating OTP
      const otpLen = 6;
      const otp =
        Math.floor(Math.random() * Math.pow(10, otpLen - 1) * 9) +
        Math.pow(10, otpLen - 1);
      // hashing OTP
      const hashedOtp = await generateHash(otp, 10);
      // generating token ref
      const token = generateJWT({ email }, { expiresIn: "3m" });
      // saving OTP
      const newOtp = new Otp({ token, email, hashedOtp });
      await newOtp.save();
      // generating content
      const replacements = { otp, expiresIn: "3 minutes" };
      const source = templateToHTML("templates/otp.html");
      const content = handlebarsReplacements({ source, replacements });
      // sending mail
      sendMail({
        to: email,
        subject: "OTP verification | " + process.env.COMPANY,
        html: content,
      })
        .then(() => res.status(200).send({ message: "OTP is sent", token }))
        .catch((err) => {
          console.log("error in otp sending", err);
          return res.status(424).send({ message: "OTP is not sent" });
        });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const otp_verify = async (req, res) => {
  try {
    const { otp, token } = req.body;
    // if otp is provided
    if (!otp) {
      res.status(422);
      throw Error("OTP is not provided");
    }
    // if token is provided
    else if (!token) {
      res.status(422);
      throw Error("token is not provided");
    }
    // else verify OTP
    else {
      const otps = await Otp.find({ token });
      if (otps.length <= 0) {
        res.status(404);
        throw Error("OTP doesn't exist");
      } else {
        try {
          // verify OTP
          const { email } = verifyJWT(token);
          const hashedOtp = otps[0].hashedOtp;
          const match = await compareHash(otp, hashedOtp);
          if (!match) {
            res.status(498);
            throw Error("OTP is inavalid");
          } else {
            // delete OTP
            await Otp.deleteOne({ $or: [{ token }, { email }, { hashedOtp }] });
            // create user
            let user = await User.findOne({ email });
            if (!user) {
              user = await new User({ email }).save();
            }
            // create token
            const newToken = generateJWT({ email }, { expiresIn: "3d" });
            res
              .status(201)
              .send({
                message: "OTP is verified",
                isVerified: true,
                user,
                token: newToken,
              });
          }
        } catch (err) {
          res.status(498);
          throw new Error("OTP has expired, try refreshing");
        }
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};
