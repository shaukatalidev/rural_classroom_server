import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
    email: { type: String, required: true },
    hashedOtp: { type: String, required: true },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    contact: { type: String },
    address1: { type: String },
    address2: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },
    role: { type: String, default: "teacher" },
    profilePic: { type: String }, // path to file
    coverPic: { type: String }, // path to file
    courses: [{ type: String, required: true, default: [] }], // course _ids
  },
  { timestamps: true }
);

const studentSchema = new mongoose.Schema(
  {
    name: { type: String },
    roll: { type: String, required: true, unique: true },
    contact: { type: String },
    profiePic: { type: String }, // path to file
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true }, // ISO string
    syllabus: { type: String, required: true },
    teacher: { type: String, required: true }, // teacher's _id
    coursePic: { type: String }, // path to file
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [
      {
        key: { type: String, required: true }, // A, 1, a, i, etc.
        value: { type: String }, // option text
      },
    ],
    answer: { type: String, required: true }, // correct option
  },
  { timestamps: true }
);

const responseSchema = new mongoose.Schema(
  {
    student: { type: String, required: true }, // coordinator _id + "_" + roll number
    test: { type: String, required: true }, // test _id
    question: { type: String, required: true }, // question _id
    response: { type: String, required: true },
  },
  { timestamps: true }
);

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    course: { type: String, required: true }, // course _id
    files: [{ type: String, required: true }], // path to file
  },
  { timestamps: true }
);

const testSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    syllabus: { type: String, required: true },
    teacher: { type: String, required: true }, // teacher's _id
    course: { type: String, required: true }, // course _id
    lecture: { type: String, required: true }, // lecture _id
    date: { type: String, required: true }, // ISO string
    testPic: { type: String }, // path to file
    questions: [{ type: String, required: true }], // question _ids
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    sentTo: [{ type: String, required: true }], // user _id
    sentBy: { type: String, required: true }, // user _id
  },
  { timestamps: true }
);

const lectureSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    course: { type: String, required: true }, // course _id
    youtubeId: { type: String }, // youtube video id
  },
  { timestamps: true }
);

const attendanceSchema = new mongoose.Schema(
  {
    coordinator: { type: String, required: true }, // coordinator _id
    lecture: { type: String, required: true }, // lecture _id
    attendance: [{ type: String, required: true }], // student _ids
    percentage: { type: String, required: true }, // attendance percentage
  },
  { timestamps: true }
);

const calendarSchema = new mongoose.Schema(
  {
    course: { type: String, required: true }, // course _id
    schedule: [
      {
        date: { type: String, required: true }, // date-time ISO string
        duration: { type: Number, required: true }, // duration in minutes
      },
    ],
  },
  { timestamps: true }
);

const performanceSchema = new mongoose.Schema(
  {
    student: { type: String, required: true }, // student _id
    course: { type: String, required: true }, // course _id
    tests: [
      {
        test: { type: String, required: true }, // test _id
        score: { type: Number, required: true }, // score in percentage
      },
    ],
  },
  { timestamps: true }
);

const feesSchema = new mongoose.Schema(
  {
    coordinator: { type: String, required: true }, // coordinator _id
    student: { type: String, required: true }, // student _id
    amount: { type: Number, required: true },
    last_date: { type: String, required: true },
    is_submitted: { type: Boolean },
  },
  { timestamps: true }
);

const messageSchema = new mongoose.Schema(
  {
    lecture: { type: String, required: true }, // lecture _id
    course: { type: String, required: true }, // course _id
    date: { type: String, required: true }, // date-time ISO string
    text: { type: String, required: true }, // message text
    from: { type: String, required: true }, // user _id
    fromName: { type: String, required: true }, // user name
  },
  { timestamps: true }
);

export const doubtSchema = new mongoose.Schema(
  {
    lecture: { type: String, required: true }, // lecture _id
    course: { type: String, required: true }, // course _id
    doubts: { type: String, required: true }, // number of doubts
    time: { type: String, required: true }, // timestamp (in seconds)
  },
  { timestamps: true }
);

export const Otp = new mongoose.model("otp", otpSchema);
export const User = new mongoose.model("user", userSchema);
export const Student = new mongoose.model("student", studentSchema);
export const Course = new mongoose.model("course", courseSchema);
export const Test = new mongoose.model("test", testSchema);
export const Notification = new mongoose.model(
  "notification",
  notificationSchema
);
export const Lecture = new mongoose.model("lecture", lectureSchema);
export const Attendance = new mongoose.model("attendance", attendanceSchema);
export const Calendar = new mongoose.model("calendar", calendarSchema);
export const Performance = new mongoose.model("performance", performanceSchema);
export const Question = new mongoose.model("question", questionSchema);
export const Response = new mongoose.model("response", responseSchema);
export const Material = new mongoose.model("material", materialSchema);
export const Fees = new mongoose.model("fees", feesSchema);
export const Message = new mongoose.model("message", messageSchema);
export const Doubt = new mongoose.model("doubt", doubtSchema);
