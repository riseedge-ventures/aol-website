import {
BRAND,
BUSINESS_HOURS,
CONTACT_EMAIL,
isPublicValue,
MAILTO_INFO,
MAILTO_OFFICE,
OFFICE_EMAIL,
PHONE_DISPLAY,
PHONE_HREF,
PHYSICAL_ADDRESS,
PORTAL_LOGIN_URL,
publicSocialLinks,
SUPPORTING_DOCUMENTS_STATEMENT,
TRADING_NAME,
WHATSAPP_URL,
} from "@/config/site";
import { words } from "@/content/approved";
import { servicePath, SERVICES } from "@/content/services";
import { PRIMARY_NAV } from "@/lib/seo";
import Link from "next/link";
import { Icon } from "../ui/Icon";

export function Footer() {
  const social = publicSocialLinks();
  const year = new Date().getFullYear();
  const footerServices = SERVICES.slice(0, 6);

  return (
    <footer className="ftr">
      <div className="container">
        <div className="ftr__grid">
          <div className="ftr__brand">
            <Link className="chip" href="/" aria-label={`${TRADING_NAME} — home`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BRAND.logoFull} alt={TRADING_NAME} width={98} height={90} loading="lazy" />
            </Link>
            <p>
              {words(0, 3)}
            </p>
            <p className="ftr__reg">{SUPPORTING_DOCUMENTS_STATEMENT}</p>
            {social.length > 0 ? (
              <div className="ftr__social">
                {social.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    {s.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <nav className="ftr__col" aria-label="Footer quick links">
            <h3>Quick Links</h3>
            <ul>
              {PRIMARY_NAV.map(([label, href]) => (
                <li key={label}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
              {PORTAL_LOGIN_URL ? (
                <li>
                  <a href={PORTAL_LOGIN_URL}>Client Portal</a>
                </li>
              ) : null}
            </ul>
          </nav>

          <nav className="ftr__col" aria-label="Footer services">
            <h3>Services</h3>
            <ul>
              {footerServices.map((service) => (
                <li key={service.slug}>
                  <Link href={servicePath(service.slug)}>{service.title}</Link>
                </li>
              ))}
              <li>
                <Link href="/services/">All services</Link>
              </li>
            </ul>
          </nav>

          <div className="ftr__col">
            <h3>Contact</h3>
            <ul className="ftr__contact">
              {isPublicValue(PHYSICAL_ADDRESS) ? (
                <li>
                  <Icon name="map-pin" size={17} />
                  <span>{PHYSICAL_ADDRESS}</span>
                </li>
              ) : null}
              {isPublicValue(PHONE_DISPLAY) ? (
                <li>
                  <Icon name="phone" size={17} />
                  <span>
                    <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
                  </span>
                </li>
              ) : null}
              {isPublicValue(CONTACT_EMAIL) ? (
                <li>
                  <Icon name="mail" size={17} />
                  <span>
                    Enquiries: <a href={MAILTO_INFO}>{CONTACT_EMAIL}</a>
                  </span>
                </li>
              ) : null}
              {isPublicValue(OFFICE_EMAIL) ? (
                <li>
                  <Icon name="mail" size={17} />
                  <span>
                    Office: <a href={MAILTO_OFFICE}>{OFFICE_EMAIL}</a>
                  </span>
                </li>
              ) : null}
              {isPublicValue(WHATSAPP_URL) ? (
                <li>
                  <Icon name="message-circle" size={17} />
                  <span>
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                      WhatsApp chat
                    </a>
                  </span>
                </li>
              ) : null}
              {isPublicValue(BUSINESS_HOURS) ? (
                <li>
                  <Icon name="clock" size={17} />
                  <span>{BUSINESS_HOURS}</span>
                </li>
              ) : null}
              <li>
                <Link href="/contact/">Contact page</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="ftr__bottom">
          <span>
            © {year} {TRADING_NAME}. All rights reserved.
          </span>
          <span className="links">
            <Link href="/privacy/">Privacy Notice</Link>
            <Link href="/cookies/">Cookie Policy</Link>
            <Link href="/terms/">Terms of Use</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
