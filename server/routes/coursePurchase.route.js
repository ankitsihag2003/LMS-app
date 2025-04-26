import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { createCheckoutSession, getCourseDetailWithPurchaseStatus, getPurchasedCourses, webhook } from "../controller/coursePurchase.controller.js";

const router = express.Router();

router.route("/checkout/create-checkout-session").post(isAuthenticated,createCheckoutSession);
router.route("/webhook").post(express.raw({type: 'application/json'}),webhook);
router.route("/course/:courseId/detail-with-status").get(isAuthenticated,getCourseDetailWithPurchaseStatus);
router.route("/").get(getPurchasedCourses)

export default router