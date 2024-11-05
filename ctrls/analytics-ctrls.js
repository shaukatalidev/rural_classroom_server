import {
  Attendance,
  Course,
  Lecture,
  Question,
  Test,
  User,
  Response,
} from "../models.js";

export const get_analytics = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send({ message: "unauthorized" });
    }

    const { course, test, coordinator } = req.body;
    console.log("course", course);
    const { rawData, correctAnswers } = await get_data_for_test_analytics(
      test,
      coordinator
    );
    // console.log("rawData", rawData[0]);
    const questionAnalytics = prepareQuestionAnalytics(rawData, correctAnswers);
    const studentScores = calculateStudentScores(rawData, correctAnswers);

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
          attendance: attendance.map((item) => item.split("_").pop()),
        })),
      })
    );

    const coordinatorNames = coordinators.map(
      (coordinator) => coordinator.name
    );

    res.status(200).send({
      data: formattedAttendance,
      questionAnalytics,
      studentScores,
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

function prepareQuestionAnalytics(rawData, correctAnswers) {
  const questionData = {};

  // Initialize structure for each question
  rawData.forEach(({ questionNo, response }) => {
    if (!questionData[questionNo]) {
      questionData[questionNo] = {
        number: questionNo,
        correctAnswer: correctAnswers[questionNo],
        responses: {}, // Dynamic response object for this question
        correctCount: 0,
        totalCount: 0,
      };
    }

    const question = questionData[questionNo];

    // Initialize the response option if it hasn't been encountered yet
    if (!question.responses[response]) {
      question.responses[response] = 0;
    }

    // Increment response count and total count
    question.responses[response] += 1;
    question.totalCount += 1;

    // Increment correct count if the response matches the correct answer
    if (response === correctAnswers[questionNo]) {
      question.correctCount += 1;
    }
  });

  // Finalize question analytics
  return Object.values(questionData).map((question, index) => {
    // Determine the most common answer dynamically
    const mostCommonAnswer = Object.keys(question.responses).reduce((a, b) =>
      question.responses[a] > question.responses[b] ? a : b
    );

    return {
      number: index + 1,
      correctAnswer: question.correctAnswer,
      mostCommonAnswer,
      percentageCorrect: (
        (question.correctCount / question.totalCount) *
        100
      ).toFixed(2),
      distribution: question.responses,
    };
  });
}

const get_data_for_test_analytics = async (test, coordinator) => {
  const test_data = await Test.findById(test);
  const rawData = [];
  const correctAnswers = {};
  for (const question_id of test_data.questions) {
    const responses = await Response.find({ question: question_id, test });
    const question = await Question.findById(question_id);
    correctAnswers[question_id] = question.answer;
    for (const response of responses) {
      const student = response.student;
      if (student.split("_")[0] !== coordinator) {
        continue;
      }
      const student_answer = response.response;
      rawData.push({
        questionNo: question_id,
        rollNo: student.split("_")[1],
        response: student_answer,
      });
    }
  }
  return { rawData, correctAnswers };
};

function calculateStudentScores(rawData, correctAnswers) {
  const studentScores = {};

  rawData.forEach(({ rollNo, questionNo, response }) => {
    if (!studentScores[rollNo]) {
      studentScores[rollNo] = { id: rollNo, score: 0 };
    }

    if (response === correctAnswers[questionNo]) {
      studentScores[rollNo].score += 1;
    }
  });

  return Object.values(studentScores);
}
