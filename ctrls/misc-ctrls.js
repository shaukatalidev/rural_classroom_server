import { percentDecodeBytes } from "whatwg-url";
import { Attendance, Course, Lecture, Student, User } from "../models.js";

export const index = async (req, res) => {
  // return await consolidateAttendance(req, res);
  const coordinators = await User.find(
    {
      role: "coordinator",
      courses: { $in: ["660d17232adc4239a1e66622"] },
    },
    { name: 1, _id: 1 }
  );

  console.log("coordinators", coordinators);
  res.send({ message: "Welcome to the API" });
};
