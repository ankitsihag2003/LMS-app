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
        // creating a checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
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
            success_url: `${process.env.CLIENT_URL}/course-progress/${courseId}?success=true`,
            cancel_url: `${process.env.CLIENT_URL}/course-detail/${courseId}?canceled=true`,
            metadata: {
                courseId: courseId,
                userId: userId,
            },
            shipping_address_collection: {
                allowed_countries: ['IN'],   //restricting to only India
            },
        });
        if (!session.url) {
            return res.status(400).json({
                success: false,
                message: "Failed to create checkout session!"
            });
        }
        // creating a new purchase record
        const newPurchase = await CoursePurchase.create({
            courseId: courseId,
            userId: userId,
            amount: course.coursePrice,
            status: "pending",
            paymentId: session.id,
        });         
        return res.status(200).json({
            success: true,
            url: session.url,   // redirecting to the checkout page
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!"
        });
    }

}

export const webhook = async (req, res) => {
    let event;
    try {
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET;

        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret: secret,
        });
        event = stripe.webhooks.constructEvent(payloadString, header, secret);

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Webhook Error: " + error.message,
        });
    }
    try {
        //HANDLE the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // updating the purchase record
            const purchase = await CoursePurchase.findOne(
                { paymentId: session.id }).populate({path:"courseId"});
            if(!purchase) {
                return res.status(404).json({
                    success: false,
                    message: "Purchase not found!"
                });
            }
            if(session.amount_total){
                purchase.amount = session.amount_total / 100; // converting to INR
            }
            purchase.status = "completed";

            // update lecture preview after purchase
            if(purchase.courseId && purchase.courseId.lectures.length > 0){
                await Lecture.updateMany(
                    {_id:{$in: purchase.courseId.lectures}},
                    {$set:{isPreviewFree:true}}
                );
            }
            await purchase.save();
            //update course enrolled students
            await Course.findByIdAndUpdate(
                purchase.courseId._id,
                {$addToSet:{enrolledStudents:purchase.userId}},
                {new:true},
            );
            //update user enrolled courses
            await User.findByIdAndUpdate(
                purchase.userId,
                {$addToSet:{enrolled_courses:purchase.courseId._id}},
                {new:true}
            );

            
        }
        res.status(200).send();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Webhook Error: " + error.message,
        });
    }
}
export const getCourseDetailWithPurchaseStatus = async (req,res)=>{
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate({path:"creater"}).populate({path:"lectures"});
        if(!course){
            return res.status(404).json({
                success: false,
                message:"Course purchase not found!"
            })
        }
        const userId = req.id;
        const purchased = await CoursePurchase.findOne({courseId:courseId, userId:userId});
        return res.status(200).json({
            success: true,
            course,
            purchased:!!purchased,  // converting purchase to boolean value
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get course details',
        });
    }
} 
export const getPurchasedCourses = async (req,res)=>{
    try {
        const purchasedCourses = await CoursePurchase.find({status:"completed"}).populate({path:"courseId"});
        if(!purchasedCourses){
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