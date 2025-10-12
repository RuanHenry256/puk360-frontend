import React from 'react';
import { Instagram as InstaIcon, Facebook as FacebookIcon, Twitter as TwitterIcon } from 'lucide-react';

// Footer: visually aligns with TopBar (border, subtle glass background).
// Desktop → multi‑column; mobile → stacked sections.
export default function Footer({ onOpenLegal, onOpenContact }) {
  return (
    <footer className="mt-12 w-full border-t border-secondary/40 bg-primary/5 backdrop-blur">
      {/* Full-bleed background; content centered inside */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl py-10">
          {/* Grid: stacks on mobile, columns on desktop */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <section className="text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">About</h3>
            <p className="mt-3 text-sm text-secondary/90">
              PUK360 helps students discover events, connect with societies,
              and stay in the loop on campus life.
            </p>
          </section>

          {/* Social */}
          <section className="text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Social</h3>
            <ul className="mt-3 space-y-2 text-sm text-secondary/90">
              <li>
                <a
                  href="https://www.instagram.com/my_nwu?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-secondary/90 hover:text-primary"
                >
                  <InstaIcon size={16} />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/mynorthwestuniversity/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-secondary/90 hover:text-primary"
                >
                  <FacebookIcon size={16} />
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/theNWU"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-secondary/90 hover:text-primary"
                >
                  <TwitterIcon size={16} />
                  Twitter / X
                </a>
              </li>
            </ul>
          </section>

          {/* Legal */}
          <section className="text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Legal</h3>
            <ul className="mt-3 space-y-2 text-sm text-secondary/90">
              <li>
                <button type="button" className="hover:text-primary" onClick={() => onOpenLegal?.('terms')}>
                  Terms of Service
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-primary" onClick={() => onOpenLegal?.('privacy')}>
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-primary" onClick={() => onOpenLegal?.('cookies')}>
                  Cookie Policy
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-primary" onClick={() => onOpenLegal?.('guidelines')}>
                  Community Guidelines
                </button>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="text-center">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-secondary">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-secondary/90">
              <li>
                <button type="button" className="hover:text-primary" onClick={() => onOpenContact?.('campuses')}>
                  Email options
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-primary" onClick={() => onOpenContact?.('campuses')}>
                  Phone options
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-primary" onClick={() => onOpenContact?.('help')}>
                  Help Centre
                </button>
              </li>
              <li>
                <button type="button" className="hover:text-primary" onClick={() => onOpenContact?.('report')}>
                  Report an issue
                </button>
              </li>
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
