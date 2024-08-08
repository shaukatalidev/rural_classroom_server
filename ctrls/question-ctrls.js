import mongoose from "mongoose";
import { Question } from "../models.js";

export const get_question = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // get questions
      const query = JSON.parse(req.query.query) || {};
      // check if _id is present and convert it to ObjectId
      if (typeof query._id === "string") query._id = new mongoose.Types.ObjectId(query._id);
      else if (typeof query._id === "object") Object.keys(query._id).forEach((key) => (query._id[key] = query._id[key].map((_id) => new mongoose.Types.ObjectId(_id))));
      const questions = await Question.find(query);
      res.status(200).send({ data: questions, message: "questions found" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const new_question = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // create question
      const data = req.body;
      const result = await new Question(data).save({ new: true });
      // check if question created
      if (!result) {
        res.status(403);
        throw new Error("question not created");
      } else {
        res.status(201).send({ data: result, message: "question created" });
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const edit_question = async (req, res) => {
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
        const result = await Question.updateMany(query, edits, { new: true });
        // check if question updated
        if (!result) {
          res.status(404);
          throw new Error("question not found");
        } else {
          res.status(201).send({ data: result, message: "question updated" });
        }
      } else {
        res.status(404);
        throw new Error("question not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const delete_question = async (req, res) => {
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
        const result = await Question.deleteMany(query);
        // check if question deleted
        if (!result) {
          res.status(404);
          throw new Error("question not found");
        } else {
          res.status(202).send({ data: result, message: "question deleted" });
        }
      } else {
        res.status(404);
        throw new Error("question not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};
