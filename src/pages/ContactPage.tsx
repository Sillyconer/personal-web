import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

import { clientFitPoints, contactChannels, engagementModes, siteProfile } from '../data/site';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './ContactPage.css';

export const ContactPage = () => {
  return (
    <div className="page-stack contact contact--terminal">
      {/* ── Hero ── */}
      <motion.section className="contact__hero t-frame" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="contact__hero-copy" variants={pixelReveal}>
          <p className="eyebrow">contact / collaboration channel</p>
          <h1>need a frontend partner for a product that deserves a stronger surface?</h1>
          <p className="muted">A direct route for project briefs, role outreach, and collaboration enquiries.</p>
        </motion.div>

        <motion.div className="contact__actions" variants={pixelReveal}>
          <a href={`mailto:${siteProfile.email}`} className="px-btn px-btn--primary">
            <Mail size={14} /> {siteProfile.email}
          </a>
        </motion.div>
      </motion.section>

      {/* ── Channels ── */}
      <motion.section
        className="contact__channels"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerGroup}
      >
        <motion.p className="eyebrow" variants={pixelReveal}>available channels</motion.p>
        <div className="grid-auto">
          {contactChannels.map((channel) => (
            <motion.a
              key={channel.label}
              href={channel.href}
              target={channel.external ? '_blank' : undefined}
              rel={channel.external ? 'noreferrer' : undefined}
              className="t-frame contact__channel"
              variants={cardReveal}
            >
              <span className="eyebrow">{channel.label}</span>
              <h3>{channel.value}</h3>
              <p className="muted">{channel.note}</p>
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* ── Engagement modes ── */}
      <motion.section
        className="contact__modes t-frame t-frame--sunken"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerGroup}
      >
        <div className="t-header">
          <div className="t-header__dots">
            <span className="t-header__dot t-header__dot--r" />
            <span className="t-header__dot t-header__dot--y" />
            <span className="t-header__dot t-header__dot--g" />
          </div>
          <span>ways to work together</span>
        </div>
        <div className="contact__mode-list">
          {engagementModes.map((mode) => (
            <motion.div key={mode} className="contact__mode-item" variants={cardReveal}>
               <span className="text-teal">*</span> {mode}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Best fit ── */}
      <motion.section
        className="contact__fit"
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={staggerGroup}
      >
        <motion.div variants={pixelReveal}>
          <p className="eyebrow">best fit</p>
          <h2>projects that benefit from structure and atmosphere together</h2>
        </motion.div>
        <div className="grid-auto">
          {clientFitPoints.map((point) => (
            <motion.div key={point} className="t-frame" variants={cardReveal}>
              <p>{point}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
};
