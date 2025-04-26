import express from 'express';
import { createCourse, createCourseLecture, editLecture, getCourseById, getCourseLectures, getCreatorCourses, getLectureById, getPublishedCourses, removeLecture, searchCourses, toggleCoursePublish, updateCourse } from '../controller/course.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../utils/multer.js';

const router = express.Router();

router.route('/')
    .post(isAuthenticated,createCourse)
    .get(isAuthenticated,getCreatorCourses);
router.route('/published-courses').get(getPublishedCourses);
router.route('/search').get(isAuthenticated,searchCourses);
router.route('/:courseId').put(isAuthenticated,upload.single("courseThumbnail"),updateCourse);
router.route('/:courseId').get(isAuthenticated,getCourseById);
router.route("/:courseId/lecture").post(isAuthenticated,createCourseLecture);
router.route("/:courseId/lecture").get(isAuthenticated,getCourseLectures);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated,editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated,removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated,getLectureById);
router.route('/:courseId').patch(isAuthenticated,toggleCoursePublish);

export default router;