import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TestimonialSlider } from './components/TestimonialSlider';
import { FeaturesSection } from './components/FeaturesSection';
import { ReactorSimulator } from './components/ReactorSimulator';
import { CoursesSection } from './components/CoursesSection';
import { LiveSessionsSection } from './components/LiveSessionsSection';
import { QuestionsBank } from './components/QuestionsBank';
import { TeacherProfile } from './components/TeacherProfile';
import { StudentPortal } from './components/StudentPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AuthModal } from './components/AuthModal';
import { CertificateModal } from './components/CertificateModal';
import { SocialBannerModal } from './components/SocialBannerModal';
import { LiveChatWidget } from './components/LiveChatWidget';

const MainAppContent: React.FC = () => {
  const { activeTab } = useApp();
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#060913] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top Main Navigation */}
      <Navbar />

      {/* Main Page Routing & Views */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* 1. Hero Section */}
            <HeroSection />

            {/* 2. New Testimonial Slider Section beneath HeroSection */}
            <TestimonialSlider />

            {/* 3. Core Value Features */}
            <FeaturesSection />

            {/* 4. Live Nuclear Reactor Core Simulator */}
            <ReactorSimulator />

            {/* 5. Courses & Packages (150 / 650 / 1,200 SAR) */}
            <CoursesSection />

            {/* 6. Live Sessions Schedule (Zoom & Google Meet) */}
            <LiveSessionsSection />

            {/* 7. Questions Bank (Qudrat & Tahsili & Nuclear) */}
            <QuestionsBank />

            {/* 8. Eng. Mahmoud Shaltoot Profile Preview */}
            <TeacherProfile />

            {/* 9. Frequently Asked Questions */}
            <FAQSection />
          </>
        )}

        {activeTab === 'courses' && (
          <div className="pt-4">
            <CoursesSection />
            <LiveSessionsSection />
            <QuestionsBank />
          </div>
        )}

        {activeTab === 'reactor' && (
          <div className="pt-4">
            <ReactorSimulator />
          </div>
        )}

        {activeTab === 'teacher' && (
          <div className="pt-4">
            <TeacherProfile />
          </div>
        )}

        {activeTab === 'student' && (
          <div className="pt-4">
            <StudentPortal />
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="pt-4">
            <AdminDashboard />
          </div>
        )}
      </main>

      {/* Footer with Certified Contact Details & Social Links */}
      <Footer onOpenSocialModal={() => setIsSocialModalOpen(true)} />

      {/* Global Modals & Live Widgets */}
      <BookingModal />
      <AuthModal />
      <CertificateModal />
      <SocialBannerModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
      />
      <LiveChatWidget />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
