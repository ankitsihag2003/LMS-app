import Stripe from 'stripe';
import { Course } from '../models/course.schema.js';
import { User } from '../models/user.schema.js';
import { CoursePurchase } from '../models/coursePurchase.schema.js';
import { Lecture } from '../models/lecture.schema.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.id;
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found!"
            });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: course.courseTitle,
                            images: [course.courseThumbnail],
                        },
                        unit_amount: course.coursePrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `https://lms-app-frontend.onrender.com/course-progress/${courseId}?success=true`,
            cancel_url: `https://lms-app-frontend.onrender.com/course-detail/${courseId}?canceled=true`,
            metadata: {
                courseId: courseId,
                userId: userId,
            },
            shipping_address_collection: {
                allowed_countries: ['IN'],
            },
        });

        if (!session.url) {
            return res.status(400).json({
                success: false,
                message: "Failed to create checkout session!"
            });
        }

        // 1. Create a pending purchase
        const newPurchase = await CoursePurchase.create({
            courseId: courseId,
            userId: userId,
            amount: course.coursePrice,
            status: "completed",
            paymentId: session.id,
        });

        // 2. Immediately update course enrolled students
        await Course.findByIdAndUpdate(
            courseId,
            { $addToSet: { enrolledStudents: userId } },
            { new: true }
        );

        // 3. Immediately update user's enrolled courses
        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { enrolled_courses: courseId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            url: session.url,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }
};

export const webhook = async (req, res) => {
    let event;

    try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });

        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error) {
        console.error("Webhook error:", error.message);
        return res.status(400).send(`Webhook error: ${error.message}`);
    }

    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        console.log("check session complete is called");

        try {
            const session = event.data.object;

            const purchase = await CoursePurchase.findOne({
                paymentId: session.id,
            }).populate({ path: "courseId" });

            if (!purchase) {
                return res.status(404).json({ message: "Purchase not found" });
            }

            if (session.amount_total) {
                purchase.amount = session.amount_total / 100;
            }
            purchase.status = "completed";

            // Make all lectures visible by setting `isPreviewFree` to true
            if (purchase.courseId && purchase.courseId.lectures.length > 0) {
                await Lecture.updateMany(
                    { _id: { $in: purchase.courseId.lectures } },
                    { $set: { isPreviewFree: true } }
                );
            }

            await purchase.save();

            // Update user's enrolledCourses
            await User.findByIdAndUpdate(
                purchase.userId,
                { $addToSet: { enrolled_courses: purchase.courseId._id } }, // Add course ID to enrolledCourses
                { new: true }
            );

            // Update course to add user ID to enrolledStudents
            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                { $addToSet: { enrolledStudents: purchase.userId } }, // Add user ID to enrolledStudents
                { new: true }
            );
        } catch (error) {
            console.error("Error handling event:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
    res.status(200).send();
};

export const getCourseDetailWithPurchaseStatus = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate({ path: "creater" }).populate({ path: "lectures" });
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course purchase not found!"
            })
        }
        const userId = req.id;
        const purchased = await CoursePurchase.findOne({ courseId: courseId, userId: userId });
        return res.status(200).json({
            success: true,
            course,
            purchased: !!purchased,  // converting purchase to boolean value
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get course details',
        });
    }
}
export const getPurchasedCourses = async (req, res) => {
    try {
        const purchasedCourses = await CoursePurchase.find({ status: "completed" }).populate({ path: "courseId" });
        if (!purchasedCourses) {
            return res.status(404).json({
                purchasedCourses: [],
            })
        }
        return res.status(200).json({
            purchasedCourses,
        })
    } catch (error) {
        console.error(error);
    }
}
