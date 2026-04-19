'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '../components/ui/Button';
import { CourseCard } from '../components/CourseCard';
import api from '../lib/api';
import { Course } from '../types';
import {
  BookOpen, Video, Award, MonitorSmartphone,
  Star, ArrowRight, Users, GraduationCap, Zap,
  CheckCircle, PlayCircle, Trophy, ChevronRight
} from 'lucide-react';

/* ── Animated counter hook ──────────────────────────── */
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(timer); }
        else setCount(Math.floor(start));
      }, 16);
    }, { threshold: 0.4 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return { count, ref };
}

function StatCounter({ value, suffix, label, color }: { value: number; suffix: string; label: string; color: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <p className={`text-3xl sm:text-4xl font-extrabold ${color}`}>
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-indigo-200 mt-1">{label}</p>
    </div>
  );
}

export default function Home() {
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/courses');
        if (res.data.success) setPopularCourses(res.data.data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch courses', error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex flex-col items-center">

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden text-white py-28 sm:py-36"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #1e1b4b 100%)' }}>

        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[8%] left-[5%] w-72 h-72 bg-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse" />
          <div className="absolute top-[50%] right-[5%] w-96 h-96 bg-purple-600 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-[5%] left-[35%] w-56 h-56 bg-amber-400 rounded-full opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2 rounded-full mb-8 border border-white/20 animate-fadeInUp">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-sm font-medium text-indigo-100">10,000+ students already learning!</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            Elevate your future with{' '}
            <br className="hidden sm:block" />
            <span className="gradient-text-gold drop-shadow-lg">Faisal Academy</span>
          </h1>

          <p className="mt-4 max-w-2xl text-xl text-indigo-200 mx-auto mb-10 leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Learn anything, anywhere. Join the fastest-growing online learning community with premium interactive video lessons and top-tier instructors.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <Link href="/courses">
              <Button size="lg" className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 border-none shadow-2xl hover:scale-105 transition-all duration-300 font-bold group">
                Explore Courses
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 hover:border-white transition-all duration-300">
                Join for Free
              </Button>
            </Link>
          </div>
        </div>

        {/* Slanted divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-0 rotate-180">
          <svg className="relative block w-full h-[50px]" fill="#f8fafc" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" />
          </svg>
        </div>
      </section>

      {/* ── Stats Bar ─────────────────────────────────── */}
      <section className="w-full bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10">
          <StatCounter value={10000} suffix="+" label="Students Enrolled" color="text-white" />
          <StatCounter value={200}   suffix="+"  label="Premium Courses"   color="text-amber-400" />
          <StatCounter value={50}    suffix="+"  label="Expert Instructors" color="text-purple-300" />
          <StatCounter value={98}    suffix="%"  label="Satisfaction Rate"  color="text-teal-400" />
        </div>
      </section>

      {/* ── Features ──────────────────────────────────── */}
      <section id="features" className="py-24 w-full bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-4 py-1.5 rounded-full mb-3">Why Us</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why choose Faisal Academy?</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">We provide a premium, seamless learning experience designed to help you achieve your goals faster.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BookOpen, label: 'World-class Content', desc: 'Access thousands of premium courses crafted by top industry experts.', from: 'from-indigo-500', to: 'to-indigo-600', hover: 'group-hover:text-indigo-600' },
              { icon: Video,    label: 'Interactive Learning', desc: 'Engage with dynamic video lessons that make learning truly enjoyable.',    from: 'from-purple-500', to: 'to-purple-600', hover: 'group-hover:text-purple-600' },
              { icon: MonitorSmartphone, label: 'Learn Anywhere', desc: 'Seamlessly sync your progress across mobile, tablet, and desktop.',          from: 'from-rose-500', to: 'to-rose-600',   hover: 'group-hover:text-rose-500' },
              { icon: Award,    label: 'Certificates of Value', desc: 'Earn recognized certificates that boost your resume upon completion.',   from: 'from-amber-500', to: 'to-amber-600', hover: 'group-hover:text-amber-500' },
            ].map(({ icon: Icon, label, desc, from, to, hover }) => (
              <div key={label} className="group text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 cursor-default card-sheen">
                <div className={`w-14 h-14 mx-auto bg-gradient-to-br ${from} ${to} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className={`text-lg font-bold mb-3 text-gray-900 transition-colors ${hover}`}>{label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────── */}
      <section className="py-24 w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-500 bg-purple-50 px-4 py-1.5 rounded-full mb-3">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Get started in minutes and transform your career with three simple steps.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-12 left-[16.6%] right-[16.6%] h-0.5 bg-gradient-to-r from-indigo-200 via-purple-200 to-amber-200 z-0" />

            {[
              { step: '01', icon: Users,         title: 'Create an Account',         desc: 'Sign up for free in seconds — no credit card required. Join as a student or instructor.',           color: 'from-indigo-500 to-indigo-600' },
              { step: '02', icon: PlayCircle,    title: 'Browse & Enroll',           desc: 'Explore hundreds of courses across every category. Enroll instantly and start watching.',            color: 'from-purple-500 to-purple-600' },
              { step: '03', icon: Trophy,        title: 'Learn & Get Certified',     desc: 'Complete lessons at your own pace and earn a recognized certificate to showcase your skills.',       color: 'from-amber-500 to-amber-600' },
            ].map(({ step, icon: Icon, title, desc, color }, i) => (
              <div key={step} className="relative z-10 flex flex-col items-center text-center p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group card-sheen">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <span className="absolute top-4 right-5 text-5xl font-black text-gray-50 select-none">{step}</span>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Courses ────────────────────────────── */}
      <section id="courses" className="py-24 w-full bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-4 py-1.5 rounded-full mb-3">Trending Now</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Popular Courses</h2>
              <p className="text-gray-500">Join the courses everyone is talking about.</p>
            </div>
            <Link href="/courses" className="hidden sm:flex text-indigo-600 font-semibold hover:text-indigo-800 items-center transition-colors group bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl">
              View all <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingCourses ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-gray-100">
                  <div className="skeleton h-48 w-full" />
                  <div className="p-6 space-y-3">
                    <div className="skeleton h-5 w-3/4" />
                    <div className="skeleton h-4 w-full" />
                    <div className="skeleton h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : popularCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularCourses.map(course => (
                <div key={course._id} className="relative group">
                  <CourseCard course={course} />
                  <Link href={`/courses/${course._id}`} className="absolute inset-0 bg-indigo-900/55 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 backdrop-blur-[2px]">
                    <Button className="scale-90 group-hover:scale-100 transition-transform duration-300 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl">
                      Enroll Now
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center bg-white border border-gray-100 p-16 rounded-2xl shadow-sm">
              <BookOpen className="w-12 h-12 text-indigo-200 mx-auto mb-4" />
              <p className="text-gray-400 font-medium">More courses are coming soon. Stay tuned!</p>
            </div>
          )}

          <div className="mt-10 sm:hidden">
            <Link href="/courses">
              <Button variant="outline" className="w-full text-indigo-600 border-indigo-200">View all courses</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────── */}
      <section id="testimonials" className="py-24 w-full bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-rose-500 bg-rose-50 px-4 py-1.5 rounded-full mb-3">Testimonials</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Don't just take our word for it — listen to our community.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: 'Faisal Academy completely changed my career trajectory. The instructors are world-class and the interactive videos made complex topics so easy. I landed my dream job months after finishing!',
                name: 'Sarah Jenkins', role: 'Software Engineer',
                img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
                stars: 5, border: 'border-indigo-100 hover:border-indigo-300',
              },
              {
                quote: 'The flexibility of this platform is unmatched. I watch lessons on my phone during my commute and switch to my laptop at night. The quality is consistently excellent.',
                name: 'Ahmed Khalid', role: 'Business Analyst',
                img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
                stars: 5, border: 'border-purple-100 hover:border-purple-300',
              },
              {
                quote: 'As an instructor, I appreciate how easy it is to manage student enrollment and upload curriculum. Faisal Academy is the perfect educational ecosystem for creators.',
                name: 'Dr. Elena Martinez', role: 'University Professor',
                img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&auto=format&fit=crop',
                stars: 5, border: 'border-amber-100 hover:border-amber-300',
              },
            ].map(({ quote, name, role, img, stars, border }) => (
              <div key={name} className={`bg-white p-8 rounded-2xl shadow-sm border ${border} hover:-translate-y-2 transition-all duration-300 relative group`}>
                <div className="absolute top-5 right-6 text-5xl text-indigo-100 font-serif leading-none select-none group-hover:text-indigo-200 transition-colors">"</div>
                <div className="flex text-amber-400 mb-4 gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-8 leading-relaxed text-sm">{quote}</p>
                <div className="flex items-center gap-3">
                  <img src={img} alt={name} className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{name}</h4>
                    <p className="text-xs text-gray-400">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Learning Outcomes ─────────────────────────── */}
      <section className="py-24 w-full bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-500 bg-teal-50 px-4 py-1.5 rounded-full mb-4">What You Get</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Everything you need to succeed</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">Faisal Academy gives you all the tools, content, and community support to accelerate your learning journey and land your dream opportunity.</p>
              <ul className="space-y-4">
                {[
                  'HD video lessons with subtitles',
                  'Lifetime access to purchased courses',
                  'Downloadable resources & exercises',
                  'Community discussion & Q&A',
                  'Verified certificates upon completion',
                  'Mobile & desktop access',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register" className="inline-block mt-10">
                <Button className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-none shadow-lg hover:shadow-teal-200 hover:shadow-xl transition-all duration-300 font-bold group">
                  Start Learning Free <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Zap,          label: 'Fast-paced',      sub: 'Bite-sized lessons',          bg: 'bg-gradient-to-br from-indigo-500 to-indigo-600' },
                { icon: Users,        label: 'Community',       sub: '10K+ active learners',        bg: 'bg-gradient-to-br from-purple-500 to-purple-600' },
                { icon: Trophy,       label: 'Certified',       sub: 'Industry-recognised',         bg: 'bg-gradient-to-br from-amber-500 to-amber-600' },
                { icon: GraduationCap,label: 'Expert-led',      sub: '50+ top instructors',         bg: 'bg-gradient-to-br from-teal-500 to-teal-600' },
              ].map(({ icon: Icon, label, sub, bg }) => (
                <div key={label} className={`${bg} rounded-2xl p-6 text-white shadow-lg hover:scale-105 transition-transform duration-300 card-sheen`}>
                  <Icon className="w-8 h-8 mb-4 opacity-90" />
                  <h4 className="font-bold text-lg">{label}</h4>
                  <p className="text-white/75 text-sm mt-1">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────── */}
      <section id="trial" className="w-full py-24 text-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #2563eb)' }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #818cf8 0%, transparent 50%), radial-gradient(circle at 80% 20%, #a78bfa 0%, transparent 40%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-float inline-block mb-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Ready to Start Learning Today?
          </h2>
          <p className="text-xl text-indigo-200 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join thousands of successful students and transform your career path — completely risk-free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="border-none bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-lg px-10 shadow-2xl hover:-translate-y-1 hover:shadow-indigo-300 transition-all duration-300 rounded-xl">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:border-white transition-all duration-300">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
