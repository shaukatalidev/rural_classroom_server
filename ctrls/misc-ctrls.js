import { percentDecodeBytes } from "whatwg-url";
import { Attendance, Course, Lecture, Student, User } from "../models.js";
export const index = async (req, res) => {
  // return await consolidateAttendance(req, res);
  res.send({ message: "Welcome to the API" });
};

// export const consolidateAttendance = async (req, res) => {
//   try {
//     // Retrieve all attendance records

//     const allAttendances = await Attendance.find(
//       {},
//       { lecture: 1, attendance: 1, coordinator: 1, percentage: 1 }
//     );

    // const data = [
    //   {
    //     _id: "66321e21bfa66729ea2e53d9",
    //     coordinator: "65f282953459363c2a391a93",
    //     lecture: "65f353db05b69eeca23002a3",
    //     attendance: ["1", "2", "4", "7"],
    //     percentage: "10",
    //   },
    //   {
    //     _id: "66321e3cbfa66729ea2e53e2",
    //     coordinator: "65f282953459363c2a391a93",
    //     lecture: "65f3541d05b69eeca23002a6",
    //     attendance: ["1", "2", "4", "7"],
    //     percentage: "10",
    //   },
    //   {
    //     _id: "66321e47bfa66729ea2e53eb",
    //     coordinator: "65f282953459363c2a391a93",
    //     lecture: "65f3545405b69eeca23002a9",
    //     attendance: ["1", "2", "4", "7"],
    //     percentage: "10",
    //   },
    //   {
    //     _id: "66321e50bfa66729ea2e53f4",
    //     coordinator: "65f282953459363c2a391a93",
    //     lecture: "65f39c7a08a886016f509e6e",
    //     attendance: ["1", "2", "4", "7"],
    //     percentage: "10",
    //   },
    //   {
    //     _id: "6704ca4dce8700662d08e0d3",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "66ffc8fbce8700662d08dca6",
    //     attendance: ["15", "7", "16", "19"],
    //     percentage: "10",
    //   },
    //   {
    //     _id: "671a31ed3d58ba8bf23b5a62",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "66ffc703ce8700662d08dc93",
    //     attendance: ["12", "8", "23", "37"],
    //     percentage: "10",
    //   },
    //   {
    //     _id: "671a346e888d0e7bd8d84e6c",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "66bf3134d0d5feafca764d16",
    //     attendance: ["5", "19", "29"],
    //     percentage: "7.5",
    //   },
    //   {
    //     _id: "671a363caf6e6b80dbe9f10b",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "660d18942adc4239a1e66659",
    //     attendance: ["3", "11", "14", "27", "33"],
    //     percentage: "12.5",
    //   },
    //   {
    //     _id: "671a363caf6e6b80dbe9f112",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "66bf2d19d0d5feafca764cfa",
    //     attendance: ["18", "24", "30"],
    //     percentage: "7.5",
    //   },
    //   {
    //     _id: "671a363caf6e6b80dbe9f10d",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "66bb7bd301449ed775d014af",
    //     attendance: ["2", "10", "22"],
    //     percentage: "7.5",
    //   },
    //   {
    //     _id: "671a363caf6e6b80dbe9f10e",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "66bb7c9301449ed775d014b6",
    //     attendance: ["9", "17", "35"],
    //     percentage: "7.5",
    //   },
    //   {
    //     _id: "671a363caf6e6b80dbe9f110",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "66beec54b310d6451d30faae",
    //     attendance: ["4", "13", "36"],
    //     percentage: "7.5",
    //   },
    //   {
    //     _id: "671a363caf6e6b80dbe9f111",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "66beed7cb310d6451d30fab5",
    //     attendance: ["6", "20", "25", "38"],
    //     percentage: "10",
    //   },
    //   {
    //     _id: "671a363caf6e6b80dbe9f114",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "66dadb68ac6b843ce54fba0d",
    //     attendance: ["1", "3", "15", "31", "34"],
    //     percentage: "12.5",
    //   },
    //   {
    //     _id: "671a363caf6e6b80dbe9f10f",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "66bee8abb310d6451d30fa8b",
    //     attendance: ["8", "21", "27", "32"],
    //     percentage: "10",
    //   },
    //   {
    //     _id: "671a363caf6e6b80dbe9f10c",
    //     coordinator: "65f2d33f1d41295030938063",
    //     lecture: "660d19752adc4239a1e6665c",
    //     attendance: ["12", "26", "29"],
    //     percentage: "7.5",
    //   },
    // ];
    // for (let i = 0; i < data.length; i++) {
    //   const record = data[i];

    //   // Generate a random attendance array if it's empty
    //   // if (record.attendance.length === 0) {
    //   record.attendance = Array.from(
    //     { length: Math.floor(Math.random() * 40) + 1 },
    //     () => Math.floor(Math.random() * 40) + 1
    //   );
    //   record.percentage = ((record.attendance.length / 40) * 100).toFixed(0); // Update the percentage based on attendance count
    //   const updateAttendance = await Attendance.findOneAndUpdate(
    //     { _id: record._id },
    //     { attendance: record.attendance, percentage: record.percentage },
    //     { new: true }
    //   );
    // }

    // Update the record in the database
    // }
//     res.status(200).send({
//       message: "Attendance records consolidated successfully",
//       allAttendances,
//     });
//   } catch (err) {
//     res.status(500).send({ message: err.message || "Something went wrong" });
//   }
// };
