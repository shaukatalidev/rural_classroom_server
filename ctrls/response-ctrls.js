import mongoose from "mongoose";
import { Response } from "../models.js";

export const get_response = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // get responses
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
      const responses = await Response.find(query);
      res.status(200).send({ data: responses, message: "responses found" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const new_response = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // create response
      const data = req.body;
      const result = await new Response(data).save({ new: true });
      // check if response created
      if (!result) {
        res.status(403);
        throw new Error("response not created");
      } else {
        res.status(201).send({ data: result, message: "response created" });
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

// array of new responses
export const new_responses = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = req.body;

    const createdResponses = await Promise.all(
      data.map(async (item) => {
        const existingResponse = await Response.findOne({
          question: item.question,
          test: item.test, // Adjusted from item.user to item.test
          student: item.student,
        });

        if (!existingResponse) {
          const newResponse = new Response(item);
          return newResponse.save();
        }
        return null;
      })
    );

    const validResponses = createdResponses.filter(Boolean);

    if (validResponses.length === 0) {
      return res
        .status(201)
        .json({ data: data, message: "No new responses created" });
    }

    res
      .status(201)
      .json({ data: validResponses, message: "Responses created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Something went wrong" });
  }
};

export const edit_response = async (req, res) => {
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
        if (typeof query._id === "string")
          query._id = new mongoose.Types.ObjectId(query._id);
        else if (typeof query._id === "object")
          Object.keys(query._id).forEach(
            (key) =>
              (query._id[key] = query._id[key].map(
                (_id) => new mongoose.Types.ObjectId(_id)
              ))
          );
        const result = await Response.updateMany(query, edits, { new: true });
        // check if response updated
        if (!result) {
          res.status(404);
          throw new Error("response not found");
        } else {
          res.status(201).send({ data: result, message: "response updated" });
        }
      } else {
        res.status(404);
        throw new Error("response not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const delete_response = async (req, res) => {
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
        if (typeof query._id === "string")
          query._id = new mongoose.Types.ObjectId(query._id);
        else if (typeof query._id === "object")
          Object.keys(query._id).forEach(
            (key) =>
              (query._id[key] = query._id[key].map(
                (_id) => new mongoose.Types.ObjectId(_id)
              ))
          );
        const result = await Response.deleteMany(query);
        // check if response deleted
        if (!result) {
          res.status(404);
          throw new Error("response not found");
        } else {
          res.status(202).send({ data: result, message: "response deleted" });
        }
      } else {
        res.status(404);
        throw new Error("response not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};
