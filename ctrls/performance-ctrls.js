import mongoose from "mongoose";
import { Course, Performance, Question, Student, Test, User } from "../models.js";

export const get_performance = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // get performances
      const query = JSON.parse(req.query.query) || {};
      // check if _id is present and convert it to ObjectId
      if (typeof query._id === "string") query._id = new mongoose.Types.ObjectId(query._id);
      else if (typeof query._id === "object") Object.keys(query._id).forEach((key) => (query._id[key] = query._id[key].map((_id) => new mongoose.Types.ObjectId(_id))));
      let performances = await Performance.find(query);

      const temp = await Promise.all(
        performances.map(async performance => {
          const courseQuery = {_id: new mongoose.Types.ObjectId(performance.course)};
          const studentQuery = {_id: new mongoose.Types.ObjectId(performance.student)};

          const [course] = await Course.find(courseQuery);
          const [student] = await Student.find(studentQuery);
          const teacherQuery = {_id:new mongoose.Types.ObjectId(course.teacher)};

          const [teacher] = await User.find(teacherQuery);

          const tests = await Promise.all(
            performance.tests.map(async (test) => {
              const testQuery = {_id:new mongoose.Types.ObjectId(test.test)};

              const [getTest] = await Test.find(testQuery);

              const courseQuery = {_id: new mongoose.Types.ObjectId(getTest.course)};
              const teacherQuery = {_id: new mongoose.Types.ObjectId(getTest.teacher)};
  
              const [course] = await Course.find(courseQuery);
              const [teacher] = await User.find(teacherQuery);
              const questions = await Promise.all( 
                getTest.questions.map(async question => {
                  const questionQuery = {_id: new mongoose.Types.ObjectId(question)};

                  const [getQuestion] = await Question.find(questionQuery);

                  return getQuestion;
                })
              )

              return ({
                ...getTest.toObject(),
                score: test.score,
                course,
                teacher,
                questions,
              })
            })
          )
          return ({
            ...performance.toObject(),
            course:{
              ...course.toObject(),
              teacher,
            },
            student,
            tests,
          })
        })
      ) 
      res.status(200).send({ data: temp, message: "performances found" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const new_performance = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      // create performance
      const data = req.body;
      const result = await new Performance(data).save({ new: true });
      // check if performance created
      if (!result) {
        res.status(403);
        throw new Error("performance not created");
      } else {
        res.status(201).send({ data: result, message: "performance created" });
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const edit_performance = async (req, res) => {
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
        const result = await Performance.updateMany(query, edits, { new: true });
        // check if performance updated
        if (!result) {
          res.status(404);
          throw new Error("performance not found");
        } else {
          res.status(201).send({ data: result, message: "performance updated" });
        }
      } else {
        res.status(404);
        throw new Error("performance not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const delete_performance = async (req, res) => {
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
        const result = await Performance.deleteMany(query);
        // check if performance deleted
        if (!result) {
          res.status(404);
          throw new Error("performance not found");
        } else {
          res.status(202).send({ data: result, message: "performance deleted" });
        }
      } else {
        res.status(404);
        throw new Error("performance not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};
