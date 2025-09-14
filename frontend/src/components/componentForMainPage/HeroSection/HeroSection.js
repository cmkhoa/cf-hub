import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext/authContext';
import Image from 'next/image';
import './HeroSection.css';

/*
 * Redesigned Hero inspired by provided template image:
 *  - Clean white upper canvas with left-aligned heading
 *  - Two-line headline: blue then coral
 *  - Brand logo on the right
 *  - Wave divider leading into solid brand blue area
 *  - Coral call-to-action pill button on blue area (Vietnamese text)
 */

const HeroSection = () => {
  const router = useRouter();
  const { userLoggedIn } = useAuth();
  const handleGetStarted = () => {
    if(userLoggedIn){
      router.push('/apply');
    } else {
      router.push('/register?next=/apply');
    }
  };
  return (
  <section className="cf-hero" aria-labelledby="cf-hero-heading">
      <div className="cf-hero__inner">
        <div className="cf-hero__text">
          <p className="cf-hero__eyebrow">Career Foundation Hub</p>
          <h1 id="cf-hero-heading" className="cf-hero__heading">
            <span className="cf-hero__line cf-hero__line--blue">Build the foundation</span>
            <span className="cf-hero__line cf-hero__line--coral">take the first step</span>
          </h1>
          <p className="cf-hero__subtext">
            Join our comprehensive mentorship program designed specifically for Vietnamese students and professionals
            seeking to advance their careers in the United States. Get personalized guidance from industry experts
            and build your professional network.
          </p>
        </div>
        <div className="cf-hero__brand">
          <div className="cf-hero__logo-wrap">
            <Image
              src="/images/cfhub-logo.jpg"
              alt="CF Hub logo"
              width={160}
              height={160}
              priority
            />
          </div>
          <p className="cf-hero__tagline">career foundation</p>
        </div>
      </div>

  <div className="cf-hero__wave-wrapper">
        <svg className="cf-hero__wave" viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
          <path fill="var(--brand-blue)" d="M0,192 C120,160 240,96 360,96 C480,96 600,160 720,181.3 C840,203 960,181 1080,160 C1200,139 1320,117 1380,106.7 L1440,96 L1440,320 L1380,320 C1320,320 1200,320 1080,320 C960,320 840,320 720,320 C600,320 480,320 360,320 C240,320 120,320 60,320 L0,320 Z" />
        </svg>
        <div className="cf-hero__blue-section">
          <div className="cf-hero__stats-bar" aria-label="Program statistics">
            <div className="cf-hero__stat">
              <div className="cf-hero__stat-number">500+</div>
              <div className="cf-hero__stat-label">Students Helped</div>
            </div>
            <div className="cf-hero__stat">
              <div className="cf-hero__stat-number">50+</div>
              <div className="cf-hero__stat-label">Industry Mentors</div>
            </div>
            <div className="cf-hero__stat">
              <div className="cf-hero__stat-number">95%</div>
              <div className="cf-hero__stat-label">Success Rate</div>
            </div>
          </div>
          <div className="cf-hero__cta-row">
            <button className="cf-hero__cta" type="button" onClick={handleGetStarted}>Get Started</button>
            <button className="cf-hero__cta cf-hero__cta--secondary" type="button">Watch Demo</button>
          </div>
        </div>
      </div>
      {/* Section divider at bottom of hero, constrained to hero content width */}
      <div className="cf-hero__container">
        <div className="section-divider" aria-hidden="true" />
      </div>
    </section>
  );
};

export default HeroSection;
