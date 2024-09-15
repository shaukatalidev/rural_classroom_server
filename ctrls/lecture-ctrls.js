import mongoose from "mongoose";
import { Lecture } from "../models.js";

export const get_lecture = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // get lectures
      const query = JSON.parse(req.query.query) || {};
      // check if _id is present and convert it to ObjectId
      if (typeof query._id === "string") query._id = new mongoose.Types.ObjectId(query._id);
      else if (typeof query._id === "object") Object.keys(query._id).forEach((key) => (query._id[key] = query._id[key].map((_id) => new mongoose.Types.ObjectId(_id))));
      const lectures = await Lecture.find(query);
      res.status(200).send({ data: lectures, message: "lectures found" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const new_lecture = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // create lecture
      const data = req.body;
      const result = await new Lecture(data).save({ new: true });
      // check if lecture created
      if (!result) {
        res.status(403);
        throw new Error("lecture not created");
      } else {
        res.status(201).send({ data: result, message: "lecture created" });
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const edit_lecture = async (req, res) => {
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
        // get lectures
        // check if _id is present and convert it to ObjectId
        if (typeof query._id === "string") query._id = new mongoose.Types.ObjectId(query._id);
        else if (typeof query._id === "object") Object.keys(query._id).forEach((key) => (query._id[key] = query._id[key].map((_id) => new mongoose.Types.ObjectId(_id))));
        const result = await Lecture.updateMany(query, edits, { new: true });
        // check if lecture updated
        if (!result) {
          res.status(404);
          throw new Error("lecture not found");
        } else {
          res.status(201).send({ data: result, message: "lecture updated" });
        }
      } else {
        res.status(404);
        throw new Error("lecture not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const delete_lecture = async (req, res) => {
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
        const result = await Lecture.deleteMany(query);
        // check if lecture deleted
        if (!result) {
          res.status(404);
          throw new Error("lecture not found");
        } else {
          res.status(202).send({ data: result, message: "lecture deleted" });
        }
      } else {
        res.status(404);
        throw new Error("lecture not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};
