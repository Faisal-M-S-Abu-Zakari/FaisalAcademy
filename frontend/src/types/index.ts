export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  bio?: string;
  photoUrl?: string;
  enrolledCourses?: Course[] | string[];
}

export interface Lesson {
  _id: string;
  title: string;
  videoUrl: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  whatYouWillLearn?: string[];
  instructor: User;
  lessons: Lesson[];
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}
