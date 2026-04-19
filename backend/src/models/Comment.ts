import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  text: string;
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Populate user information when querying comments
commentSchema.pre('find', function (next) {
  this.populate({ path: 'user', select: 'name photoUrl role' });
  next();
});
commentSchema.pre('findOne', function (next) {
  this.populate({ path: 'user', select: 'name photoUrl role' });
  next();
});

// Pre cascade delete hook
commentSchema.pre('findOneAndDelete', async function (next) {
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (docToUpdate) {
      await mongoose.model('Course').findByIdAndUpdate(docToUpdate.course, {
        $pull: { comments: docToUpdate._id },
      });
      // Delete any child comments that had this document as their parent
      await this.model.deleteMany({ parentComment: docToUpdate._id });
    }
    next();
  } catch (error: any) {
    next(error);
  }
});

commentSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await mongoose.model('Course').findByIdAndUpdate(this.course, {
      $pull: { comments: this._id },
    });
    // Delete any child comments recursively that have this document as their parent
    await mongoose.model('Comment').deleteMany({ parentComment: this._id });
    next();
  } catch (error: any) {
    next(error);
  }
});

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
