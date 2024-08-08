import { Attendance, Course, Lecture, Test, User } from "../models.js";

export const get_mappings = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      const coordinators = await User.find({ role: "coordinator" });
      const courses = await Course.find({});
      const lectures = await Lecture.find({});
      const tests = await Test.find({});
      // generate mappings
      const courseLectureMapping = {};
      courses.forEach((course) => (courseLectureMapping[course._id] = { course, data: lectures.filter((lecture) => lecture.course === String(course._id)).map((lecture) => ({ _id: String(lecture._id), name: lecture.name })) }));
      const courseTestMapping = {};
      courses.forEach((course) => (courseTestMapping[course._id] = { course, data: tests.filter((test) => test.course === String(course._id)).map((test) => ({ _id: String(test._id), name: test.name })) }));
      const coordinatorMapping = {};
      coordinators.forEach((coordinator) => (coordinatorMapping[coordinator._id] = coordinator.name));
      const lectureMapping = {};
      lectures.forEach((lecture) => (lectureMapping[lecture._id] = lecture.name));
      // create data
      const data = {
        courseLectureMapping,
        courseTestMapping,
        coordinatorMapping,
        lectureMapping,
      };
      res.status(200).send({ data, message: "analytics found" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};

export const get_analytics = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      const { course, lecture, coordinator, test } = req.body;
      // attendance
      const lectureWiseAttendance = {};
      const lectures = await Lecture.find({ course });
      const attendances = await Attendance.find({});
      lectures.forEach((lecture) => (lectureWiseAttendance[String(lecture._id)] = attendances.filter((attendance) => attendance.lecture === String(lecture._id))));
      // create data
      const data = { lectureWiseAttendance };
      res.status(200).send({ data, message: "analytics found" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};
