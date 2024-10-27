import { Attendance, Course, Lecture, Test, User } from "../models.js";

export const get_analytics = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send({ message: "unauthorized" });
    }

    const { course } = req.body;
    console.log("course", course);

    // Fetch attendances and collect unique lecture and coordinator IDs
    const attendances = await Attendance.find({ course });
    const lectureIds = new Set(
      attendances.map((attendance) => attendance.lecture)
    );
    const coordinatorIds = new Set(
      attendances.map((attendance) => attendance.coordinator)
    );

    // Fetch lecture and coordinator details using collected IDs
    const lectures = await Lecture.find(
      { _id: { $in: Array.from(lectureIds) } },
      { name: 1 }
    );
    const coordinators = await User.find(
      { _id: { $in: Array.from(coordinatorIds) } },
      { name: 1 }
    );

    // Convert lectures and coordinators into lookup dictionaries for quick access
    const lectureMap = Object.fromEntries(
      lectures.map((lecture) => [lecture._id.toString(), lecture.name])
    );
    const coordinatorMap = Object.fromEntries(
      coordinators.map((coordinator) => [
        coordinator._id.toString(),
        coordinator.name,
      ])
    );

    // Aggregate attendance data by lecture with coordinators as dynamic keys
    const lectureWiseAttendance = {};
    const lectureAttendanceArray = {}; // To store attendance per coordinator per lecture

    attendances.forEach((attendance) => {
      const lectureName = lectureMap[attendance.lecture.toString()];
      const coordinatorName = coordinatorMap[attendance.coordinator.toString()];

      // Initialize nested objects for lecture and coordinator entries
      if (!lectureWiseAttendance[lectureName]) {
        lectureWiseAttendance[lectureName] = {};
      }
      if (!lectureWiseAttendance[lectureName][coordinatorName]) {
        lectureWiseAttendance[lectureName][coordinatorName] =
          attendance.percentage;
      }

      // Initialize coordinator's entry if not present in lectureAttendanceArray
      if (!lectureAttendanceArray[coordinatorName]) {
        lectureAttendanceArray[coordinatorName] = {};
      }

      // Initialize lecture's entry under the coordinator if not present
      if (!lectureAttendanceArray[coordinatorName][lectureName]) {
        lectureAttendanceArray[coordinatorName][lectureName] = [];
      }

      // Add attendance percentage to the array
      lectureAttendanceArray[coordinatorName][lectureName] =
        attendance.attendance;
    });

    // Convert lectureWiseAttendance object into the desired array format
    const formattedAttendance = Object.entries(lectureWiseAttendance).map(
      ([lecture, coordinators]) => ({
        lecture,
        ...coordinators,
      })
    );
    const formattedAttendanceArray = Object.entries(lectureAttendanceArray).map(
      ([coordinator, lectures]) => ({
        coordinator,
        attendances: Object.entries(lectures).map(([lecture, attendance]) => ({
          lecture,
          attendance,
        })),
      })
    );

    const coordinatorNames = coordinators.map(
      (coordinator) => coordinator.name
    );

    res.status(200).send({
      data: formattedAttendance,
      coordinatorNames,
      formattedAttendanceArray, // Added this to the response
      message: "analytics found",
    });
  } catch (err) {
    res
      .status(res.statusCode < 400 ? 500 : res.statusCode)
      .send({ message: err.message || "something went wrong" });
  }
};

export const get_courses_analytics = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      const courses = await Course.find({}, { name: 1, _id: 1 });

      const data = courses.map((course) => {
        return {
          name: course.name,
          id: String(course._id),
        };
      });

      res.status(200).send({ data, message: "analytics found" });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};
export const get_lectures_analytics = async (req, res) => {
  try {
    // identify user
    const user = req.user;
    // check if user exists
    if (!user) {
      res.status(401);
      throw new Error("unauthorized");
    } else {
      const { course } = req.body;
      const lectures = await Lecture.find({ course }, { name: 1, _id: 1 });

      const tests = await Test.find({ course }, { name: 1, _id: 1 });

      const testData = tests.map((test) => {
        return {
          name: test.name,
          id: String(test._id),
        };
      });
      const data = lectures.map((lecture) => {
        return {
          name: lecture.name,
          id: String(lecture._id),
        };
      });

      const coordinators = await User.find(
        {
          role: "coordinator",
          courses: { $in: [course] },
        },
        { name: 1, _id: 1 }
      );

      const coordinatorsList = coordinators.map((coordinator) => {
        return {
          name: coordinator.name,
          id: String(coordinator._id),
        };
      });

      res.status(200).send({
        lecture: data,
        test: testData,
        coordinator: coordinatorsList,
        message: "analytics found",
      });
    }
  } catch (err) {
    if (res.statusCode < 400) res.status(500);
    res.send({ message: err.message || "something went wrong" });
  }
};
