import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson {
  title: string;
  videoUrl: string;
}

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  whatYouWillLearn: string[];
  instructor: mongoose.Types.ObjectId;
  lessons: ILesson[];
  createdAt: Date;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: [true, 'Lesson title is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL is required'],
      trim: true,
    },
  },
  { _id: true }
);

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      trim: true,
      maxlength: 2000,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop',
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      trim: true,
    },
    whatYouWillLearn: {
      type: [String],
      default: [],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessons: [lessonSchema],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model<ICourse>('Course', courseSchema);
export default Course;
