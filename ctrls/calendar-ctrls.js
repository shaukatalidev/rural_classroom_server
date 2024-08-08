import mongoose from "mongoose";
import { Calendar } from "../models.js";

export const get_calendar = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // get calendars
      const query = JSON.parse(req.query.query) || {};
      // check if _id is present and convert it to ObjectId
      if (typeof query._id === "string") query._id = new mongoose.Types.ObjectId(query._id);
      else if (typeof query._id === "object") Object.keys(query._id).forEach((key) => (query._id[key] = query._id[key].map((_id) => new mongoose.Types.ObjectId(_id))));
      const calendars = await Calendar.find(query);
      res.status(200).send({ data: calendars, message: "calendars found" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const new_calendar = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // create calendar
      const data = req.body;
      const result = await new Calendar(data).save({ new: true });
      // check if calendar created
      if (!result) {
        res.status(403);
        throw new Error("calendar not created");
      } else {
        res.status(201).send({ data: result, message: "calendar created" });
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const edit_calendar = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // update users
      const { query, edits } = req.body;
      if (query) {
        // check if _id is present and convert it to ObjectId
        if (typeof query._id === "string") query._id = new mongoose.Types.ObjectId(query._id);
        else if (typeof query._id === "object") Object.keys(query._id).forEach((key) => (query._id[key] = query._id[key].map((_id) => new mongoose.Types.ObjectId(_id))));
        const result = await Calendar.updateMany(query, edits, { new: true });
        // check if calendar updated
        if (!result) {
          res.status(404);
          throw new Error("calendar not found");
        } else {
          res.status(201).send({ data: result, message: "calendar updated" });
        }
      } else {
        res.status(404);
        throw new Error("calendar not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const delete_calendar = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // delete user
      const { query } = req.body;
      if (query) {
        // check if _id is present and convert it to ObjectId
        if (typeof query._id === "string") query._id = new mongoose.Types.ObjectId(query._id);
        else if (typeof query._id === "object") Object.keys(query._id).forEach((key) => (query._id[key] = query._id[key].map((_id) => new mongoose.Types.ObjectId(_id))));
        const result = await Calendar.deleteMany(query);
        // check if calendar deleted
        if (!result) {
          res.status(404);
          throw new Error("calendar not found");
        } else {
          res.status(202).send({ data: result, message: "calendar deleted" });
        }
      } else {
        res.status(404);
        throw new Error("calendar not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};
