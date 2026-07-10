import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import FooterWatermark from "@/components/FooterWatermark";

const ventures = [
  { label: "BanglaReels", href: "/#ventures" },
  { label: "Danumai Studios", href: "/#ventures" },
  { label: "Care Technology", href: "/#ventures" },
  { label: "Danumai Labs", href: "/#labs" },
];

export default function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <FooterWatermark />
      <Reveal y={24} className="relative mx-auto max-w-6xl px-6 py-24 md:px-10">
        <div className="grid grid-cols-1 gap-14 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-display text-2xl tracking-tight text-paper"
            >
              Danumai<span className="text-copper">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist">
              A house of ventures. We don&rsquo;t build for clients — we build
              for ourselves, and we operate what we build.
            </p>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-faint">
              Ventures
            </h3>
            <ul className="mt-5 space-y-3">
              {ventures.map((v) => (
                <li key={v.label}>
                  <a
                    href={v.href}
                    className="link-line text-sm text-mist transition-colors hover:text-paper"
                  >
                    {v.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-faint">
              Contact
            </h3>
            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="link-line text-sm text-mist transition-colors hover:text-paper"
                >
                  Contact us
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="link-line text-sm text-mist transition-colors hover:text-paper"
                >
                  Careers
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@danumai.com"
                  className="link-line text-sm text-mist transition-colors hover:text-paper"
                >
                  hello@danumai.com
                </a>
              </li>
              <li className="text-sm text-faint">Dhaka · Remote</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t hairline pt-8 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Danumai Inc. All rights reserved.</p>
          <p>Built in-house by Danumai Labs.</p>
        </div>
      </Reveal>
    </footer>
  );
}
