'use client';

import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import {
  GraduationCap, Target, Heart, Zap, Users,
  Trophy, BookOpen, Star, ArrowRight, CheckCircle
} from 'lucide-react';

const team = [
  {
    name: 'Faisal Al-Mansouri',
    role: 'Founder & CEO',
    bio: 'Passionate educator and tech entrepreneur with 10+ years building learning platforms.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
    gradient: 'from-indigo-500 to-purple-600',
  },
  {
    name: 'Sara Ahmed',
    role: 'Head of Curriculum',
    bio: 'Former university professor dedicated to making world-class education accessible to all.',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop',
    gradient: 'from-purple-500 to-rose-500',
  },
  {
    name: 'Khalid Ibrahim',
    role: 'Lead Engineer',
    bio: 'Full-stack developer who built the platform from the ground up with a passion for great UX.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
    gradient: 'from-amber-500 to-orange-500',
  },
];

const values = [
  { icon: Target, title: 'Mission-Driven',    desc: 'We believe education is a right, not a privilege. Our mission is to make quality learning accessible to everyone.',  color: 'bg-indigo-500' },
  { icon: Heart,  title: 'Student-First',      desc: 'Every decision we make starts with one question: does this help our students learn better and faster?',              color: 'bg-rose-500' },
  { icon: Zap,    title: 'Constant Innovation',desc: 'We continuously improve our platform, tools, and content to stay ahead of the evolving education landscape.',       color: 'bg-amber-500' },
  { icon: Users,  title: 'Community-Led',      desc: 'Our thriving community of learners and instructors drives the culture of collaboration and mutual growth.',         color: 'bg-teal-500' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative w-full py-28 text-white text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4c1d95)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[15%] left-[8%] w-64 h-64 rounded-full bg-indigo-500 opacity-15 blur-3xl animate-pulse" />
          <div className="absolute bottom-[10%] right-[8%] w-80 h-80 rounded-full bg-purple-500 opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20 mb-6 animate-float">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-5 tracking-tight">
            About <span className="gradient-text-gold">Faisal Academy</span>
          </h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto leading-relaxed">
            We're on a mission to democratize world-class education — one course, one student, one dream at a time.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
          <svg className="relative block w-full h-[50px]" fill="#f8fafc" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" />
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-slate-50 w-full">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { icon: Users,       value: '10,000+', label: 'Students',    color: 'text-indigo-600' },
            { icon: BookOpen,    value: '200+',    label: 'Courses',     color: 'text-purple-600' },
            { icon: GraduationCap, value: '50+',  label: 'Instructors', color: 'text-amber-600' },
            { icon: Star,        value: '4.9★',   label: 'Avg Rating',  color: 'text-teal-600' },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform">
              <Icon className={`w-8 h-8 mx-auto mb-3 ${color}`} />
              <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
              <p className="text-sm text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Story */}
      <section className="py-24 w-full bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 px-4 py-1.5 rounded-full mb-4">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Building the future of education, together</h2>
            <div className="space-y-5 text-gray-500 leading-relaxed">
              <p>Faisal Academy was founded with a simple but powerful belief: <strong className="text-gray-800">everyone deserves access to high-quality education</strong>, regardless of where they live or what they earn.</p>
              <p>We started as a small team of educators and engineers who were frustrated by the gap between expensive traditional education and the scattered, low-quality content available online. So we decided to build something better.</p>
              <p>Today, Faisal Academy is home to over <strong className="text-indigo-600">10,000 learners</strong> and <strong className="text-indigo-600">50+ expert instructors</strong> delivering premium courses across technology, design, business, and more.</p>
            </div>
            <Link href="/courses" className="inline-block mt-8">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-none shadow-lg hover:shadow-indigo-200 hover:shadow-xl transition-all duration-300 font-bold group">
                Explore Courses <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=500&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1560472355-536de3962603?q=80&w=500&auto=format&fit=crop',
            ].map((src, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden shadow-md ${i === 1 ? 'mt-6' : ''} ${i === 3 ? '-mt-6' : ''}`}>
                <img src={src} alt="Academy" className="w-full h-36 object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gradient-to-br from-indigo-50 via-white to-purple-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-500 bg-purple-50 px-4 py-1.5 rounded-full mb-3">Our Values</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">What drives us every day</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group card-sheen">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-500 bg-amber-50 px-4 py-1.5 rounded-full mb-3">Our Team</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Meet the people behind the platform</h2>
            <p className="text-gray-500 max-w-xl mx-auto">A small but passionate team united by a love for education and technology.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map(({ name, role, bio, img, gradient }) => (
              <div key={name} className="text-center group">
                <div className="relative inline-block mb-5">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient} blur-md opacity-0 group-hover:opacity-60 transition-opacity duration-300 scale-110`} />
                  <img src={img} alt={name} className="relative w-28 h-28 rounded-full object-cover mx-auto border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{name}</h3>
                <p className={`text-sm font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-3`}>{role}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 w-full text-center"
        style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-5">Join Faisal Academy Today</h2>
          <p className="text-indigo-200 mb-8 text-lg">Start your learning journey for free. No credit card required.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-indigo-600 text-white border-none hover:bg-indigo-700 font-bold shadow-2xl hover:-translate-y-1 transition-all duration-300">
                Get Started Free
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:border-white transition-all duration-300">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
