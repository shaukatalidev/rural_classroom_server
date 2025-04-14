import mongoose from "mongoose";
import { Message } from "../models.js";

export const get_message = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // get messages
      const query = JSON.parse(req.query.query) || {};
      // check if _id is present and convert it to ObjectId
      if (typeof query._id === "string")
        query._id = new mongoose.Types.ObjectId(query._id);
      else if (typeof query._id === "object")
        Object.keys(query._id).forEach(
          (key) =>
            (query._id[key] = query._id[key].map(
              (_id) => new mongoose.Types.ObjectId(_id)
            ))
        );
      const messages = await Message.find(query);
      res.status(200).send({ data: messages, message: "messages found" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const new_message = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // create message
      const data = req.body;
      const result = await new Message(data).save({ new: true });
      // check if message created
      if (!result) {
        res.status(403);
        throw new Error("message not created");
      } else {
        res.status(201).send({ data: result, message: "message created" });
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const edit_message = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    }

    const { id, newText } = req.body;

    if (!id || !newText) {
      res.status(400);
      throw new Error("Missing 'id' or 'newText'");
    }

    const result = await Message.findByIdAndUpdate(
      id,
      { text: newText },
      { new: true }
    );

    if (!result) {
      res.status(404);
      throw new Error("message not found");
    }

    res.status(200).send({ data: result, message: "message updated" });
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const delete_message = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    const { _id } = req.query;

    if (!_id || typeof _id !== "string") {
      return res.status(400).send({ message: "Invalid or missing message ID" });
    }

    const objectId = new mongoose.Types.ObjectId(_id);
    const result = await Message.deleteOne({ _id: objectId });
    console.log("result", result);
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Message not found" });
    }

    res.status(202).send({ data: result, message: "Message deleted" });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};
