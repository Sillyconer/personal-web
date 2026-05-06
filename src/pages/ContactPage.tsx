import { Mail, MessageSquareMore, Rocket, Sticker } from 'lucide-react';
import { motion } from 'framer-motion';

import { clientFitPoints, contactChannels, engagementModes, siteProfile } from '../data/site';
import { cardReveal, sectionReveal, staggerGroup, viewport } from '../utils/motion';
import './ContactPage.css';

export const ContactPage = () => {
  return (
    <div className="page-stack contact-page">
      <motion.section className="page-hero contact-hero surface-panel" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="content-cluster" variants={sectionReveal}>
          <p className="eyebrow">contact</p>
          <h1>Need a frontend partner for a product that deserves a stronger surface?</h1>
          <p>
            If the work needs better structure, clearer storytelling, or a more intentional visual system, get in touch. The strongest fit is product-facing interfaces that need both polish and scalability.
          </p>
        </motion.div>

        <motion.div className="contact-hero__actions" variants={cardReveal}>
          <a href={`mailto:${siteProfile.email}`} className="button-link">
            <Mail size={16} />
            Email {siteProfile.email}
          </a>
          <span className="contact-hero__stamp"><Sticker size={16} /> guestbook open</span>
        </motion.div>
      </motion.section>

      <motion.section className="cards-grid contact-channel-grid" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        {contactChannels.map((channel, index) =>
          channel.external ? (
            <motion.a
              key={channel.label}
              href={channel.href}
              target="_blank"
              rel="noreferrer"
              className={`surface-panel contact-card contact-card--${index + 1}`}
              variants={cardReveal}
              whileHover={{ y: -6, rotate: index % 2 === 0 ? -1 : 1 }}
            >
              <p className="eyebrow">{channel.label}</p>
              <h2>{channel.value}</h2>
              <p>{channel.note}</p>
            </motion.a>
          ) : (
            <motion.a
              key={channel.label}
              href={channel.href}
              className={`surface-panel contact-card contact-card--${index + 1}`}
              variants={cardReveal}
              whileHover={{ y: -6, rotate: index % 2 === 0 ? -1 : 1 }}
            >
              <p className="eyebrow">{channel.label}</p>
              <h2>{channel.value}</h2>
              <p>{channel.note}</p>
            </motion.a>
          ),
        )}
      </motion.section>

      <motion.section className="contact-grid" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.article className="surface-panel contact-panel" variants={cardReveal}>
          <div className="section-copy content-cluster">
            <MessageSquareMore size={18} />
            <p className="eyebrow">good conversations start with</p>
            <h2>A clear product problem and what success should feel like</h2>
          </div>
          <div className="contact-list">
            {engagementModes.map((mode) => (
              <article key={mode} className="surface-faint contact-list-item">
                {mode}
              </article>
            ))}
          </div>
        </motion.article>

        <motion.article className="surface-panel contact-panel" variants={cardReveal}>
          <div className="section-copy content-cluster">
            <Rocket size={18} />
            <p className="eyebrow">strongest fit</p>
            <h2>Projects that benefit from structure and atmosphere together</h2>
          </div>
          <div className="contact-list">
            {clientFitPoints.map((point) => (
              <article key={point} className="surface-faint contact-list-item">
                {point}
              </article>
            ))}
          </div>
        </motion.article>
      </motion.section>
    </div>
  );
};
