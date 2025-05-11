import {
  Attendance,
  Course,
  Lecture,
  Student,
  User,
  Test,
  Response,
  Question,
} from "../models.js";

const coordinator = "67206fec1d8a427f2005d323";

export const index = async (req, res) => {
  res.send({
    message: "Deployement Done server is working",
  });
};
