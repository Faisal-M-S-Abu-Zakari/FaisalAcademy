import React from 'react';
import Link from 'next/link';
import { Course } from '../types';
import { BookOpen, Star, User } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const levelConfig: Record<string, { label: string; color: string }> = {
  beginner:     { label: 'Beginner',     color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  intermediate: { label: 'Intermediate', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  advanced:     { label: 'Advanced',     color: 'bg-rose-50 text-rose-700 border-rose-200' },
};

export const CourseCard = ({ course }: CourseCardProps) => {
  const level = levelConfig[(course as any).level?.toLowerCase?.()] || levelConfig['beginner'];

  return (
    <Link href={`/courses/${course._id}`} className="block h-full group">
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full card-sheen">

        {/* Thumbnail */}
        <div className="relative w-full h-48 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
          {course.imageUrl ? (
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1000&auto=format&fit=crop';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-14 h-14 text-indigo-200" />
            </div>
          )}
          {/* Level badge */}
          <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border ${level.color}`}>
            {level.label}
          </span>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors" title={course.title}>
            {course.title}
          </h3>
          <p className="text-xs text-gray-400 mb-3 line-clamp-2 flex-grow leading-relaxed">
            {course.description}
          </p>

          {/* Instructor */}
          {course.instructor && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
              <User className="w-3 h-3 text-indigo-400" />
              <span>{(course.instructor as any)?.name || 'Faisal Academy'}</span>
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 mt-auto">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                {course.lessons?.length || 0} lessons
              </span>
            </div>
            {/* Rating */}
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-gray-700">{((course as any).rating || 4.8).toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Hover CTA bar */}
        <div className="px-5 pb-4">
          <div className="w-full py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold text-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            View Course →
          </div>
        </div>
      </div>
    </Link>
  );
};
