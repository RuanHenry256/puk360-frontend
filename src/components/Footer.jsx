import React from 'react';

// Footer: visually aligns with TopBar (border, subtle glass background).
// Desktop → multi‑column; mobile → stacked sections.
export default function Footer() {
  return (
    <footer className="mt-12 w-full border-t border-secondary/40 bg-primary/5 backdrop-blur">
      {/* Full-bleed background; content centered inside */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl py-10">
          {/* Grid: stacks on mobile, columns on desktop */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">About</h3>
            <p className="mt-3 text-sm text-secondary/90">
              PUK360 helps students discover events, connect with societies,
              and stay in the loop on campus life.
            </p>
          </section>

          {/* Social */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Social</h3>
            <ul className="mt-3 space-y-2 text-sm text-secondary/90">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>Twitter / X</li>
              <li>LinkedIn</li>
            </ul>
          </section>

          {/* Legal */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-secondary/90">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Cookie Policy</li>
              <li>Community Guidelines</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-secondary/90">
              <li>Email: support@puk360.example</li>
              <li>Phone: +27 (000) 000‑0000</li>
              <li>Help Centre</li>
              <li>Report an issue</li>
            </ul>
          </section>
        </div>

        {/* Bottom row */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-secondary/30 pt-6 sm:flex-row">
          <p className="text-xs text-secondary/80">© {new Date().getFullYear()} NWU. All rights reserved.</p>
          <p className="text-xs text-secondary/70">Built for campus communities.</p>
        </div>
        </div>
      </div>
    </footer>
  );
}
