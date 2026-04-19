'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { VideoPlayer } from '../../../components/VideoPlayer';
import api from '../../../lib/api';
import { Course, Lesson } from '../../../types';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${params.courseId}`);
        if (res.data.success) {
          setCourse(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch course', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await api.get(`/courses/${params.courseId}/comments`);
        if (res.data.success) {
          setComments(res.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch comments', error);
      }
    };

    if (params.courseId) {
      fetchCourse();
      fetchComments();
    }
  }, [params.courseId]);

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setEnrolling(true);
    try {
      const res = await api.post(`/courses/${params.courseId}/enroll`);
      if (res.data.success) {
        alert('Successfully enrolled!');
        window.location.reload();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    const textToSubmit = parentId ? replyText : newComment;
    if (!textToSubmit.trim()) return;

    setSubmittingComment(true);
    try {
      const payload: any = { text: textToSubmit };
      if (parentId) payload.parentComment = parentId;

      const res = await api.post(`/courses/${params.courseId}/comments`, payload);
      if (res.data.success) {
        setComments((prev) => [res.data.data, ...prev]);
        if (parentId) {
          setReplyText('');
          setActiveReplyId(null);
        } else {
          setNewComment('');
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading course...</div>;
  if (!course) return <div className="text-center py-20">Course not found</div>;

  const enrolledIds = user?.enrolledCourses?.map((c: any) => c._id || c) || [];
  const isEnrolled = enrolledIds.includes(course._id) || user?.role === 'admin' || user?._id === course.instructor._id;

  const activeLesson = course.lessons?.[activeLessonIndex];
  
  const rootComments = comments.filter(c => !c.parentComment);
  const getReplies = (parentId: string) => comments.filter(c => c.parentComment === parentId).reverse(); // oldest first usually for replies

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-500">By {course.instructor.name}</p>
          </div>

          {isEnrolled && activeLesson ? (
            <div className="space-y-4">
              <VideoPlayer videoUrl={activeLesson.videoUrl} />
              <h2 className="text-xl font-semibold">Lesson {activeLessonIndex + 1}: {activeLesson.title}</h2>
            </div>
          ) : (
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-xl flex items-center justify-center">
               <p className="text-gray-500 font-medium">
                 {course.lessons?.length > 0 ? 'Enroll to watch lessons' : 'No lessons available yet'}
               </p>
            </div>
          )}

          <div>
            <h3 className="text-xl font-bold mb-4">About this course</h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{course.description}</p>
          </div>
          
          {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4">What you will learn</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-700">
                {course.whatYouWillLearn.map((point: string, idx: number) => (
                  <li key={idx} className="flex gap-2 items-start">
                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Comments Section */}
          <div className="pt-8 border-t border-gray-200">
            <h3 className="text-2xl font-bold mb-6">Comments</h3>
            
            {user ? (
              <form onSubmit={handlePostComment} className="mb-8">
                <textarea
                  className="w-full rounded-md border border-gray-300 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                  placeholder="Share your thoughts about this course..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  maxLength={1000}
                  required
                />
                <div className="mt-3 flex justify-end">
                  <Button type="submit" disabled={submittingComment || !newComment.trim()}>
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center mb-8 border border-gray-100">
                <p className="text-gray-700 mb-4">Please log in to participate in the discussion.</p>
                <Button onClick={() => router.push('/login')}>Log In</Button>
              </div>
            )}

            <div className="space-y-6">
              {rootComments.length === 0 ? (
                <p className="text-gray-500 italic">No comments yet. Be the first to start the discussion!</p>
              ) : (
                rootComments.map((comment) => (
                  <div key={comment._id} className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <div className="flex gap-4">
                      <img 
                        src={comment.user?.photoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                        alt={comment.user?.name || 'User'} 
                        className="w-10 h-10 rounded-full object-cover shrink-0" 
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-semibold text-gray-900">{comment.user?.name || 'Deleted User'}</h4>
                            <div className="text-xs text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mt-2 text-sm leading-relaxed whitespace-pre-wrap">
                          {comment.text}
                        </p>
                        
                        {user && (
                          <button 
                            onClick={() => setActiveReplyId(activeReplyId === comment._id ? null : comment._id)}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 mt-3"
                          >
                            Reply
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Replies Section */}
                    {getReplies(comment._id).length > 0 && (
                      <div className="mt-4 ml-12 space-y-4 border-l-2 border-gray-100 pl-4">
                        {getReplies(comment._id).map(reply => (
                          <div key={reply._id} className="flex gap-3">
                            <img 
                              src={reply.user?.photoUrl || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'} 
                              alt={reply.user?.name || 'User'} 
                              className="w-8 h-8 rounded-full object-cover shrink-0" 
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-sm text-gray-900">{reply.user?.name || 'Deleted User'}</h4>
                                <span className="text-[10px] text-gray-400">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700 mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                                {reply.text}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quick Reply Form */}
                    {activeReplyId === comment._id && (
                      <div className="mt-4 ml-12 border-l-2 border-indigo-100 pl-4">
                        <form onSubmit={(e) => handlePostComment(e, comment._id)}>
                          <textarea
                            className="w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[60px]"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            maxLength={500}
                            required
                          />
                          <div className="mt-2 flex justify-end gap-2">
                             <Button type="button" variant="outline" size="sm" onClick={() => setActiveReplyId(null)}>Cancel</Button>
                             <Button type="submit" size="sm" disabled={submittingComment || !replyText.trim()}>Reply</Button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 sticky top-24">
            {!isEnrolled ? (
              <div className="space-y-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900">Ready to start learning?</h3>
                <Button 
                  className="w-full text-lg" 
                  size="lg" 
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? 'Enrolling...' : 'Enroll Now'}
                </Button>
                <p className="text-xs text-gray-500">Join thousands of students learning today.</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-900 border-b pb-2">Course Contents</h3>
                <ul className="space-y-2">
                  {course.lessons?.map((lesson, idx) => (
                    <li key={lesson._id || idx}>
                      <button 
                        onClick={() => setActiveLessonIndex(idx)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                          activeLessonIndex === idx 
                          ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold' 
                          : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {idx + 1}. {lesson.title}
                      </button>
                    </li>
                  ))}
                  {(!course.lessons || course.lessons.length === 0) && (
                    <p className="text-sm text-gray-500 text-center py-4">No content uploaded yet.</p>
                  )}
                </ul>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
