import express from "express";
// middlewares
import { isAuthenticated } from "./middlewares/auth-middlewares.js";
import { upload } from "./services/file-services.js";
// controllers
import * as miscCtrls from "./ctrls/misc-ctrls.js";
import * as fileCtrls from "./ctrls/file-ctrls.js";
import * as authCtrls from "./ctrls/auth-ctrls.js";
import * as userCtrls from "./ctrls/user-ctrls.js";
import * as studentCtrls from "./ctrls/student-ctrls.js";
import * as courseCtrls from "./ctrls/course-ctrls.js";
import * as testCtrls from "./ctrls/test-ctrls.js";
import * as notificationCtrls from "./ctrls/notification-ctrls.js";
import * as lectureCtrls from "./ctrls/lecture-ctrls.js";
import * as attendanceCtrls from "./ctrls/attendance-ctrls.js";
import * as calendarCtrls from "./ctrls/calendar-ctrls.js";
import * as performanceCtrls from "./ctrls/performance-ctrls.js";
import * as questionCtrls from "./ctrls/question-ctrls.js";
import * as responseCtrls from "./ctrls/response-ctrls.js";
import * as materialCtrls from "./ctrls/material-ctrls.js";
import * as analyticsCtrls from "./ctrls/analytics-ctrls.js";
import * as feesCtrls from "./ctrls/fees-ctrls.js";
import * as doubtCtrls from "./ctrls/doubt-ctrls.js";
import * as messageCtrls from "./ctrls/message-ctrls.js";

const Router = express.Router();

// misc routes
Router.get("/", miscCtrls.index);
// file routes
Router.post("/file/upload", isAuthenticated, upload.array("files"), fileCtrls.uploadFiles);
// Auth Routes
Router.post("/auth/token", isAuthenticated, authCtrls.token);
Router.post("/auth/email", authCtrls.email);
Router.post("/auth/otp-generate", authCtrls.otp_generate);
Router.post("/auth/otp-verify", authCtrls.otp_verify);
// User Routes
Router.get("/user/get", isAuthenticated, userCtrls.get_user);
Router.post("/user/new", isAuthenticated, userCtrls.new_user);
Router.patch("/user/edit", isAuthenticated, userCtrls.edit_user);
Router.delete("/user/delete", isAuthenticated, userCtrls.delete_user);
// Student Routes
Router.get("/student/get", isAuthenticated, studentCtrls.get_student);
Router.post("/student/new", isAuthenticated, studentCtrls.new_student);
Router.patch("/student/edit", isAuthenticated, studentCtrls.edit_student);
Router.delete("/student/delete", isAuthenticated, studentCtrls.delete_student);
// Course Routes
Router.get("/course/get", isAuthenticated, courseCtrls.get_course);
Router.post("/course/new", isAuthenticated, courseCtrls.new_course);
Router.patch("/course/edit", isAuthenticated, courseCtrls.edit_course);
Router.delete("/course/delete", isAuthenticated, courseCtrls.delete_course);
// Test Routes
Router.get("/test/get", isAuthenticated, testCtrls.get_test);
Router.post("/test/new", isAuthenticated, testCtrls.new_test);
Router.patch("/test/edit", isAuthenticated, testCtrls.edit_test);
Router.delete("/test/delete", isAuthenticated, testCtrls.delete_test);
// Notification Routes
Router.get("/notification/get", isAuthenticated, notificationCtrls.get_notification);
Router.post("/notification/new", isAuthenticated, notificationCtrls.new_notification);
Router.patch("/notification/edit", isAuthenticated, notificationCtrls.edit_notification);
Router.delete("/notification/delete", isAuthenticated, notificationCtrls.delete_notification);
// Lecture Routes
Router.get("/lecture/get", isAuthenticated, lectureCtrls.get_lecture);
Router.post("/lecture/new", isAuthenticated, lectureCtrls.new_lecture);
Router.patch("/lecture/edit", isAuthenticated, lectureCtrls.edit_lecture);
Router.delete("/lecture/delete", isAuthenticated, lectureCtrls.delete_lecture);
// Attendance Routes
Router.get("/attendance/get", isAuthenticated, attendanceCtrls.get_attendance);
Router.post("/attendance/new", isAuthenticated, attendanceCtrls.new_attendance);
Router.patch("/attendance/edit", isAuthenticated, attendanceCtrls.edit_attendance);
Router.delete("/attendance/delete", isAuthenticated, attendanceCtrls.delete_attendance);
// Question Routes
Router.get("/question/get", isAuthenticated, questionCtrls.get_question);
Router.post("/question/new", isAuthenticated, questionCtrls.new_question);
Router.patch("/question/edit", isAuthenticated, questionCtrls.edit_question);
Router.delete("/question/delete", isAuthenticated, questionCtrls.delete_question);
// Response Routes
Router.get("/response/get", isAuthenticated, responseCtrls.get_response);
Router.post("/response/new", isAuthenticated, responseCtrls.new_response);
Router.post("/response/news", isAuthenticated, responseCtrls.new_responses);
Router.patch("/response/edit", isAuthenticated, responseCtrls.edit_response);
Router.delete("/response/delete", isAuthenticated, responseCtrls.delete_response);
// Material Routes
Router.get("/material/get", isAuthenticated, materialCtrls.get_material);
Router.post("/material/new", isAuthenticated, materialCtrls.new_material);
Router.patch("/material/edit", isAuthenticated, materialCtrls.edit_material);
Router.delete("/material/delete", isAuthenticated, materialCtrls.delete_material);
// Calendar Routes
Router.get("/calendar/get", isAuthenticated, calendarCtrls.get_calendar);
Router.post("/calendar/new", isAuthenticated, calendarCtrls.new_calendar);
Router.patch("/calendar/edit", isAuthenticated, calendarCtrls.edit_calendar);
Router.delete("/calendar/delete", isAuthenticated, calendarCtrls.delete_calendar);
// Performance Routes
Router.get("/performance/get", isAuthenticated, performanceCtrls.get_performance);
Router.post("/performance/new", isAuthenticated, performanceCtrls.new_performance);
Router.patch("/performance/edit", isAuthenticated, performanceCtrls.edit_performance);
Router.delete("/performance/delete", isAuthenticated, performanceCtrls.delete_performance);
Router.delete("/calendar/delete", isAuthenticated, calendarCtrls.delete_calendar);
// Message Routes
Router.get("/message/get", isAuthenticated, messageCtrls.get_message);
Router.post("/message/new", isAuthenticated, messageCtrls.new_message);
Router.patch("/message/edit", isAuthenticated, messageCtrls.edit_message);
Router.delete("/message/delete", isAuthenticated, messageCtrls.delete_message);
// Fees Routes
Router.get("/fees/get", isAuthenticated, feesCtrls.get_fees);
Router.post("/fees/new", isAuthenticated, feesCtrls.new_fees);
Router.patch("/fees/edit", isAuthenticated, feesCtrls.edit_fees);
Router.delete("/fees/delete", isAuthenticated, feesCtrls.delete_fees);
// Doubt Routes
Router.get("/doubt/get", isAuthenticated, doubtCtrls.get_doubt);
Router.post("/doubt/new", isAuthenticated, doubtCtrls.new_doubt);
Router.patch("/doubt/edit", isAuthenticated, doubtCtrls.edit_doubt);
Router.delete("/doubt/delete", isAuthenticated, doubtCtrls.delete_doubt);
// Analytics
Router.post("/analytics/get", isAuthenticated, analyticsCtrls.get_analytics);
Router.get("/analytics/mappings", isAuthenticated, analyticsCtrls.get_mappings);

export default Router;
