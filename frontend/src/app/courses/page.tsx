'use client';

import { useState, useEffect, useMemo } from 'react';
import api from '../../lib/api';
import { Course } from '../../types';
import { CourseCard } from '../../components/CourseCard';
import { Search, SlidersHorizontal, BookOpen } from 'lucide-react';

const CATEGORIES = ['All', 'Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Personal Development'];
const LEVELS     = ['All', 'Beginner', 'Intermediate', 'Advanced'];

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100">
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-5/6" />
        <div className="flex justify-between pt-2">
          <div className="skeleton h-3 w-1/4" />
          <div className="skeleton h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses]       = useState<Course[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [category, setCategory]     = useState('All');
  const [level, setLevel]           = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        if (res.data.success) setCourses(res.data.data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase());
      const matchCat   = category === 'All' || (c as any).category === category;
      const matchLevel = level === 'All'    || (c as any).level?.toLowerCase() === level.toLowerCase();
      return matchSearch && matchCat && matchLevel;
    });
  }, [courses, search, category, level]);

  return (
    <div>
      {/* Hero banner */}
      <div className="relative w-full py-16 text-white text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[10%] w-72 h-72 bg-purple-500 opacity-10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-[5%] w-48 h-48 bg-indigo-400 opacity-15 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">Explore All Courses</h1>
          <p className="text-indigo-200 text-lg mb-8">Discover a world of knowledge with premium, interactive courses from expert instructors.</p>

          {/* Search bar */}
          <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3 max-w-xl mx-auto gap-3 focus-within:bg-white/20 focus-within:border-white/40 transition-all">
            <Search className="w-5 h-5 text-indigo-200 shrink-0" />
            <input
              type="text"
              placeholder="Search courses, topics, instructors…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white placeholder-indigo-300 w-full focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  category === cat
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-all duration-200 bg-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Level Filter
          </button>
        </div>

        {/* Level filter (expandable) */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-8 p-4 bg-indigo-50 rounded-2xl border border-indigo-100 animate-fadeInUp">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider self-center mr-2">Level:</span>
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  level === l
                    ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        {!loading && (
          <p className="text-sm text-gray-400 mb-6">
            Showing <span className="text-indigo-600 font-semibold">{filtered.length}</span> course{filtered.length !== 1 ? 's' : ''}
            {search && <span> for "<span className="font-medium text-gray-700">{search}</span>"</span>}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(course => <CourseCard key={course._id} course={course} />)}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <BookOpen className="w-16 h-16 text-indigo-100 mx-auto mb-5" />
            <h3 className="text-lg font-bold text-gray-700 mb-2">No courses found</h3>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters.</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setLevel('All'); }}
              className="mt-6 text-indigo-600 font-semibold hover:underline text-sm"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
