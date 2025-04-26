import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true,
    },
    courseSubtitle: {
        type: String,
    },
    courseDescription: {
        type: String,
    },
    courseCategory: {
        type: String,
        required: true,
    },
    courseLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    coursePrice: {
        type: Number,
    },
    courseThumbnail: {
        type: String,
    },
    enrolledStudents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    creater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    lectures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Lecture',
        }
    ],
    isPublished: {
        type: Boolean,
        default: false,
    }

},{timestamps: true});

export const Course = mongoose.model('Course', courseSchema);