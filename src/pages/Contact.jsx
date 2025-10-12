import React, { useEffect } from 'react';
import TopBar from '../components/TopBar';
import Button from '../components/Button';

export default function Contact({ section, onBack, onShowProfile }) {
  useEffect(() => {
    if (!section) return;
    const scrollToAnchor = () => {
      const el = document.getElementById(section);
      if (!el) return;
      const y = Math.max(0, el.getBoundingClientRect().top + window.scrollY - 96);
      window.scrollTo({ top: y, behavior: 'smooth' });
    };
    // Try a few times to account for late layout/paint when scrolled deep
    const timers = [0, 80, 220].map((ms) => setTimeout(scrollToAnchor, ms));
    return () => timers.forEach(clearTimeout);
  }, [section]);

  const Section = ({ id, title, intro, children }) => (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-center text-3xl sm:text-4xl text-white">{title}</h2>
      {intro && <p className="mt-2 max-w-3xl text-center text-white/90 mx-auto">{intro}</p>}
      <div className="mt-4 text-left">{children}</div>
    </section>
  );

  return (
    <div className="text-white">
      <TopBar onBack={onBack} onProfileClick={onShowProfile} backLabel="Back" />
      <div className="mx-auto max-w-4xl px-4 pt-[88px] pb-16 sm:px-6 lg:px-8">
        <Section id="campuses" title="Campus Contacts" intro="Select the campus team you want to reach. Email options and phone numbers are listed separately for each campus.">
          <div className="space-y-6">
            {/* Potchefstroom */}
            <div>
              <h3 className="font-semibold text-white">Potchefstroom Campus</h3>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-white font-medium">Emails</h4>
                  <ul className="list-disc pl-6 text-sm text-white/85 space-y-1">
                    <li>IT Support: IT-Services-PC@nwu.ac.za</li>
                    <li>Student Life / Events (SRC Office): studentlife@nwu.ac.za</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium">Phone</h4>
                  <ul className="list-disc pl-6 text-sm text-white/85 space-y-1">
                    <li>IT Support: +27 (0)18 299 2700</li>
                    <li>General Enquiries: +27 (0)18 299 1111</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mahikeng */}
            <div>
              <h3 className="font-semibold text-white">Mahikeng Campus</h3>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-white font-medium">Emails</h4>
                  <ul className="list-disc pl-6 text-sm text-white/85 space-y-1">
                    <li>IT Support: itm_help@nwu.ac.za</li>
                    <li>Student Life / Events (SRC Office): MCstudentlife@nwu.ac.za</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium">Phone</h4>
                  <ul className="list-disc pl-6 text-sm text-white/85 space-y-1">
                    <li>IT Support: +27 (0)18 389 2980</li>
                    <li>General Enquiries: +27 (0)18 389 2111</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Vanderbijlpark */}
            <div>
              <h3 className="font-semibold text-white">Vanderbijlpark Campus</h3>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-white font-medium">Emails</h4>
                  <ul className="list-disc pl-6 text-sm text-white/85 space-y-1">
                    <li>IT Support: itv_help@nwu.ac.za</li>
                    <li>Student Life / Events (SRC Office): VCstudentlife@nwu.ac.za</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium">Phone</h4>
                  <ul className="list-disc pl-6 text-sm text-white/85 space-y-1">
                    <li>IT Support: +27 (0)16 910 3324</li>
                    <li>General Enquiries: +27 (0)16 910 3111</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section id="hours" title="Operating Hours" intro="Standard NWU office and service desk hours.">
          <ul className="mt-4 list-disc pl-6 space-y-2 text-left">
            <li className="text-white/85 text-sm">Monday – Friday: 08:00 – 16:30 SAST</li>
            <li className="text-white/85 text-sm">Weekends & Public Holidays: Closed</li>
            <li className="text-white/85 text-sm">Typical response time: 1–2 business days via email</li>
          </ul>
        </Section>

        <Section id="help" title="Help Centre" intro="Quick answers to common questions about accounts, RSVPs, and reviews.">
          <ul className="mt-4 list-disc pl-6 space-y-2 text-sm text-white/85 text-left">
            <li>Reset or update your password</li>
            <li>Manage notifications and reminders</li>
            <li>Edit or cancel an RSVP</li>
            <li>Update your profile details</li>
          </ul>
        </Section>

        <Section id="report" title="Report an Issue" intro="Spotted a bug or concerning content? Send us a quick note.">
          <form className="mt-3 space-y-3">
            <input className="w-full rounded-lg border border-secondary/60 p-2 bg-white/90 text-text" placeholder="Subject" />
            <textarea className="w-full rounded-lg border border-secondary/60 p-2 h-28 bg-white/90 text-text" placeholder="Describe the issue"></textarea>
            <Button type="button" variant="primary">Submit Report</Button>
          </form>
        </Section>
      </div>
    </div>
  );
}
