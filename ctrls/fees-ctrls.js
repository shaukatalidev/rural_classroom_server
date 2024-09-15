import mongoose from "mongoose";
import { Fees, Student, User } from "../models.js";

export const get_fees = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // get attendances
      const query = JSON.parse(req.query.query) || {};
      // check if _id is present and convert it to ObjectId
      if (typeof query._id === "string") query._id = new mongoose.Types.ObjectId(query._id);
      else if (typeof query._id === "object") Object.keys(query._id).forEach((key) => (query._id[key] = query._id[key].map((_id) => new mongoose.Types.ObjectId(_id))));
      const fees = await Fees.find(query);

      const temp = await Promise.all(
        fees.map(async fee => {
          const coordinatorQuery =  {_id: new mongoose.Types.ObjectId(fee.coordinator)};
          const studentQuery =  {_id: new mongoose.Types.ObjectId(fee.student)};

          const [coordinator] = await User.find(coordinatorQuery);
          const [student] = await Student.find(studentQuery);

          return ({
            ...fee.toObject(),
            coordinator,
            student,
          })
        })
      )
      res.status(200).send({ data: temp, message: "Fees found" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const new_fees = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // create fees
      const data = req.body;
      const result = await new Fees(data).save({ new: true });
      // check if fees created
      if (!result) {
        res.status(403);
        throw new Error("fees not created");
      } else {
        res.status(201).send({ data: result, message: "fees created" });
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const edit_fees = async (req, res) => {
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
        const result = await Fees.updateMany(query, edits, { new: true });
        // check if fees updated
        if (!result) {
          res.status(404);
          throw new Error("fees not found");
        } else {
          res.status(201).send({ data: result, message: "fees updated" });
        }
      } else {
        res.status(404);
        throw new Error("fees not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const delete_fees = async (req, res) => {
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
        const result = await Fees.deleteMany(query);
        // check if fees deleted
        if (!result) {
          res.status(404);
          throw new Error("fees not found");
        } else {
          res.status(202).send({ data: result, message: "fees deleted" });
        }
      } else {
        res.status(404);
        throw new Error("fees not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};
