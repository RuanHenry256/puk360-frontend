import React, { useEffect } from 'react';
import TopBar from '../components/TopBar';

const sections = {
  terms: {
    title: 'Terms of Service',
    intro: 'These Terms of Service govern your use of the PUK360 platform. By accessing or using PUK360 you agree to these terms and to comply with all policies referenced here. If you do not agree, you may not use the service.',
    bullets: [
      { h: 'Eligibility', t: 'You must be a registered student, staff member, or authorized guest to use PUK360. By creating an account you confirm that the information provided is accurate and that you have the authority to act on behalf of any organization you represent.' },
      { h: 'Acceptable Use', t: 'You may not use PUK360 to break the law, harass others, or post content that is harmful, defamatory, hateful, or infringing. Do not attempt to probe or circumvent security, scrape or copy large portions of the site, or interfere with the service or events hosted on it.' },
      { h: 'Event Participation', t: 'RSVPs indicate interest and may not guarantee entry. Event hosts control admission and may change details such as time, location, capacity, and safety requirements. Always check the event page for the latest information before attending.' },
      { h: 'Content Ownership', t: 'You retain rights to content you submit (e.g., event descriptions, images, reviews). You grant PUK360 a worldwide, royalty‑free license to host, store, reproduce and display that content for the operation and promotion of the platform. Do not upload content you do not have rights to share.' },
      { h: 'Termination', t: 'We may suspend or terminate accounts that violate these terms or our Community Guidelines, or when required by law. You may stop using the service at any time; certain obligations (such as licenses you granted) may continue as necessary for platform operation and legal compliance.' },
      { h: 'Disclaimers', t: 'PUK360 provides a venue for hosts to share events. We do not control or endorse events and are not responsible for the actions of hosts or attendees. The service is provided “as is” without warranties, to the extent permitted by law.' },
      { h: 'Limitation of Liability', t: 'To the maximum extent permitted by law, PUK360 and its team are not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, revenues, or data, arising from your use of the service.' },
      { h: 'Changes to the Service', t: 'We may modify, suspend, or discontinue features at any time to improve performance, security, or user experience. Where changes are material, we will provide reasonable notice.' },
      { h: 'Governing Law', t: 'These terms are governed by South African law. Any disputes should first be raised with support for informal resolution.' },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'We respect your privacy. This Policy explains what personal information we collect, how we use and share it, and the choices available to you. It applies to all features of PUK360.',
    bullets: [
      { h: 'Data We Collect', t: 'We collect account details (such as name and email), device and log information, and interaction data like RSVPs, attendance confirmations, and reviews. When you upload images or files, associated metadata may be retained.' },
      { h: 'How We Use Data', t: 'We use your data to provide and improve the service, personalize recommendations, enforce our policies, and maintain platform security. We may send service‑related messages (for example, RSVP reminders or important policy updates).' },
      { h: 'Sharing', t: 'We do not sell your personal information. We share limited data with trusted service providers who process it on our behalf under contractual safeguards, and we may disclose information when required by law or to protect safety and integrity.' },
      { h: 'Security', t: 'We implement reasonable technical and organizational measures, including access controls and encryption in transit, to protect your information. No system is perfectly secure, and we encourage you to use a strong password and keep it confidential.' },
      { h: 'Your Rights', t: 'You may request access to, correction of, or deletion of your personal information subject to legal obligations and data retention requirements. You can also manage certain preferences in your account settings.' },
      { h: 'Retention', t: 'We retain personal information only as long as necessary for the purposes described, to comply with legal obligations, or to resolve disputes. Non‑essential logs may be aggregated or anonymised after a limited period.' },
      { h: 'Lawful Basis', t: 'Depending on your location, our legal bases for processing include performance of a contract (providing the service), legitimate interests (security, service improvement), and your consent (for optional features such as certain notifications).' },
      { h: 'International Transfers', t: 'If your data is processed outside your country, we take steps to ensure appropriate safeguards are in place as required by applicable law.' },
      { h: 'Contact', t: 'Questions or requests related to privacy can be directed to support@puk360.example. We aim to respond within two business days.' },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    intro: 'This Policy describes how PUK360 uses cookies and similar technologies to operate the site, analyze usage, and remember your preferences.',
    bullets: [
      { h: 'Essential Cookies', t: 'These are required for sign‑in, session management, fraud prevention, and security features. The site cannot function properly without them.' },
      { h: 'Analytics Cookies', t: 'These help us understand which pages are popular and how features perform so we can improve stability and usability. Data is aggregated whenever possible.' },
      { h: 'Preferences', t: 'These remember your settings such as theme, language, or notification preferences to provide a consistent experience.' },
      { h: 'Advertising Cookies', t: 'PUK360 does not use third‑party advertising cookies. If this changes, we will update this policy and obtain any necessary consent.' },
      { h: 'Your Choices', t: 'Most browsers allow you to control or block cookies. Blocking essential cookies may prevent you from signing in or using key features.' },
    ],
  },
  guidelines: {
    title: 'Community Guidelines',
    intro: 'Our Guidelines help ensure PUK360 remains a safe and welcoming place for all members of the NWU community. These apply to events, reviews, and any user‑generated content.',
    bullets: [
      { h: 'Be Respectful', t: 'Treat others with dignity and assume good intent. We do not tolerate harassment, hate speech, threats, or targeted abuse. Disagreements are fine—personal attacks are not.' },
      { h: 'Keep It Relevant', t: 'Share content that is on‑topic and useful to attendees. Avoid spam, misleading promotions, or content intended primarily to drive traffic elsewhere.' },
      { h: 'Protect Privacy', t: 'Only share photos or information you have permission to share. Do not post personal data (such as phone numbers or addresses) without explicit consent.' },
      { h: 'Safety at Events', t: 'Follow host instructions and campus rules. If you feel unsafe, contact event staff or campus security. PUK360 may restrict events or users where safety concerns are reported.' },
      { h: 'Report Issues', t: 'If you see unsafe behaviour or content that violates these rules, report it via the Help Centre or contact support. We review reports and may take action, including content removal or account restrictions.' },
      { h: 'Enforcement & Appeals', t: 'We may remove content, limit features, or suspend accounts that breach these rules. If you believe an action was taken in error, you may appeal via support.' },
    ],
  },
};

export default function Legal({ section = 'terms', onBack, onShowProfile }) {
  useEffect(() => {
    const id = section || 'terms';
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 96; // offset for fixed TopBar
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, [section]);

  const render = (key, data) => (
    <section id={key} key={key} className="mb-12 scroll-mt-24">
      <h1 className="text-center text-3xl sm:text-4xl text-white">{data.title}</h1>
      <p className="mt-2 max-w-3xl text-center text-white/90 mx-auto">{data.intro}</p>
      <ul className="mt-4 space-y-4 list-disc pl-6">
        {data.bullets.map((b, i) => (
          <li key={i}>
            <h3 className="text-left font-semibold text-white">{b.h}</h3>
            <p className="mt-1 max-w-3xl text-left text-white/85 text-sm">{b.t}</p>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className="text-white">
      <TopBar onBack={onBack} onProfileClick={onShowProfile} backLabel="Back" />
      <div className="mx-auto max-w-4xl px-4 pt-[88px] pb-16 sm:px-6 lg:px-8">
        {render('terms', sections.terms)}
        {render('privacy', sections.privacy)}
        {render('cookies', sections.cookies)}
        {render('guidelines', sections.guidelines)}
        <p className="mt-4 text-left text-xs text-white/70">This document is provided for informational purposes and may be updated from time to time.</p>
      </div>
    </div>
  );
}
