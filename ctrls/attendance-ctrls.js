import mongoose from "mongoose";
import { Attendance, Course, Lecture, Student, User } from "../models.js";

export const get_attendance = async (req, res) => {
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
      if (typeof query._id === "string")
        query._id = new mongoose.Types.ObjectId(query._id);
      else if (typeof query._id === "object")
        Object.keys(query._id).forEach(
          (key) =>
            (query._id[key] = query._id[key].map(
              (_id) => new mongoose.Types.ObjectId(_id)
            ))
        );
      const attendances = await Attendance.find(query);

      const temp = await Promise.all(
        attendances.map(async (attendance) => {
          const coordinatorQuery = {
            _id: new mongoose.Types.ObjectId(attendance.coordinator),
          };
          const lectureQuery = {
            _id: new mongoose.Types.ObjectId(attendance.lecture),
          };

          const [coordinator] = await User.find(coordinatorQuery);
          const [lecture] = await Lecture.find(lectureQuery);

          const courseQuery = {
            _id: new mongoose.Types.ObjectId(lecture.course),
          };

          const [course] = await Course.find(courseQuery);

          const teacherQuery = {
            _id: new mongoose.Types.ObjectId(course.teacher),
          };

          const [teacher] = await User.find(teacherQuery);

          const attendances = await Promise.all(
            attendance.attendance.map(async (student) => {
              const studentQuery = {
                _id: new mongoose.Types.ObjectId(student),
              };

              const [getStudent] = await Student.find(studentQuery);
              return getStudent;
            })
          );

          return {
            ...attendance.toObject(),
            coordinator,
            lecture: {
              ...lecture.toObject(),
              course: {
                ...course.toObject(),
                teacher,
              },
            },
            attendance: attendances,
          };
        })
      );
      res.status(200).send({ data: temp, message: "attendances found" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const new_attendance = async (req, res) => {
  try {
    // Identify user
    const user = req.user;
    if (!user) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Extract attendance details from the request body
    const { coordinator, lecture, attendance, percentage } = req.body;

    // Check if attendance already exists with the same lecture and coordinator
    const query = { coordinator, lecture };
    let result;
    const existingAttendance = await Attendance.findOne(query);

    if (existingAttendance) {
      // Calculate the original student strength based on the existing percentage
      const studentStrength =
        (existingAttendance.attendance.length * 100) /
        existingAttendance.percentage;

      // Merge and remove duplicates from the attendance arrays
      const combinedUnique = [
        ...new Set([...existingAttendance.attendance, ...attendance]),
      ];
      const newPercentage = (combinedUnique.length / studentStrength) * 100;

      // Update existing attendance
      result = await Attendance.updateOne(query, {
        $set: {
          attendance: combinedUnique,
          percentage: newPercentage,
        },
      });
    } else {
      // Create new attendance if none exists
      result = await Attendance.create({
        coordinator,
        lecture,
        attendance,
        percentage,
      });
    }

    if (result) {
      res.status(201).send({ data: result, message: "Attendance recorded" });
    } else {
      res.status(403).send({ message: "Attendance not created or updated" });
    }
  } catch (err) {
    res.status(500).send({ message: err.message || "Something went wrong" });
  }
};

export const edit_attendance = async (req, res) => {
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
        const result = await Attendance.updateMany(query, edits, { new: true });
        // check if attendance updated
        if (!result) {
          res.status(404);
          throw new Error("attendance not found");
        } else {
          res.status(201).send({ data: result, message: "attendance updated" });
        }
      } else {
        res.status(404);
        throw new Error("attendance not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const delete_attendance = async (req, res) => {
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
        const result = await Attendance.deleteMany(query);
        // check if attendance deleted
        if (!result) {
          res.status(404);
          throw new Error("attendance not found");
        } else {
          res.status(202).send({ data: result, message: "attendance deleted" });
        }
      } else {
        res.status(404);
        throw new Error("attendance not found");
      }
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};
