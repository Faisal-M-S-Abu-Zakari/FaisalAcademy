'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { Card } from '../../../../components/ui/Card';
import api from '../../../../lib/api';

const CATEGORIES = ['Development', 'Business', 'Design', 'Marketing', 'IT & Software', 'Personal Development'];

export default function NewCourse() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [whatYouWillLearn, setWhatYouWillLearn] = useState(['']);
  const [lessons, setLessons] = useState([{ title: '', videoUrl: '' }]);

  const handleAddLesson = () => {
    setLessons([...lessons, { title: '', videoUrl: '' }]);
  };

  const handleLessonChange = (index: number, field: 'title' | 'videoUrl', value: string) => {
    const newLessons = [...lessons];
    newLessons[index][field] = value;
    setLessons(newLessons);
  };

  const handleRemoveLesson = (index: number) => {
    if (lessons.length > 1) {
      const newLessons = lessons.filter((_, i) => i !== index);
      setLessons(newLessons);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const filteredLessons = lessons.filter(l => l.title.trim() !== '' && l.videoUrl.trim() !== '');
      const filteredWhatYouWillLearn = whatYouWillLearn.filter(w => w.trim() !== '');

      const res = await api.post('/courses', {
        title,
        description,
        category,
        imageUrl: imageUrl.trim() !== '' ? imageUrl : undefined,
        whatYouWillLearn: filteredWhatYouWillLearn,
        lessons: filteredLessons
      });

      if (res.data.success) {
        router.push('/instructor/courses');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'instructor' && user?.role !== 'admin') {
    return <div className="text-center py-20">Access denied.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Course</h1>

      {error && (
        <div className="mb-6 bg-red-50 p-4 rounded-md text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Course Details</h2>
          <div className="space-y-5">
            <Input
              label="Course Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Advanced TypeScript"
            />
            
            <Input
              label="Course Image URL (optional)"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                className="w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Course detailed description"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  What will students learn?
                </label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setWhatYouWillLearn([...whatYouWillLearn, ''])}
                >
                  + Add Point
                </Button>
              </div>
              <div className="space-y-2">
                {whatYouWillLearn.map((point, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={point}
                      onChange={(e) => {
                        const newPoints = [...whatYouWillLearn];
                        newPoints[index] = e.target.value;
                        setWhatYouWillLearn(newPoints);
                      }}
                      placeholder={`Learning outcome ${index + 1}`}
                      required={index === 0}
                    />
                    {whatYouWillLearn.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newPoints = whatYouWillLearn.filter((_, i) => i !== index);
                          setWhatYouWillLearn(newPoints);
                        }}
                        className="text-red-500 hover:text-red-700 w-10 flex justify-center items-center"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold">Lessons</h2>
            <Button type="button" variant="outline" size="sm" onClick={handleAddLesson}>
              + Add Lesson
            </Button>
          </div>
          
          <div className="space-y-6">
            {lessons.map((lesson, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="font-bold text-gray-400 mt-2">{index + 1}.</div>
                <div className="flex-grow space-y-4">
                  <Input
                    placeholder="Lesson Title"
                    value={lesson.title}
                    onChange={(e) => handleLessonChange(index, 'title', e.target.value)}
                    required={index === 0}
                  />
                  <Input
                    placeholder="YouTube or Vimeo URL"
                    value={lesson.videoUrl}
                    onChange={(e) => handleLessonChange(index, 'videoUrl', e.target.value)}
                    required={index === 0}
                  />
                </div>
                {lessons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLesson(index)}
                    className="text-red-500 hover:text-red-700 mt-2"
                    title="Remove lesson"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Course'}
          </Button>
        </div>
      </form>
    </div>
  );
}
