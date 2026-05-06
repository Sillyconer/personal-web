import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Network } from 'lucide-react';
import { motion } from 'framer-motion';

import { ecosystemGraph } from '../../data/site';
import type { EcosystemGraphNode } from '../../types/site';
import { cardReveal, motionEase, sectionReveal, staggerGroup, viewport } from '../../utils/motion';
import './EcosystemGraph.css';

const accentClassMap: Record<EcosystemGraphNode['accent'], string> = {
  blue: 'is-blue',
  teal: 'is-teal',
  red: 'is-red',
  yellow: 'is-yellow',
};

const kindLabelMap: Record<EcosystemGraphNode['type'], string> = {
  project: 'project node',
  collab: 'collab mode',
  discipline: 'discipline',
  signal: 'signal layer',
};

export const EcosystemGraph = () => {
  const [activeNodeId, setActiveNodeId] = useState('personalweb');

  const activeNode = useMemo(
    () => ecosystemGraph.nodes.find((node) => node.id === activeNodeId) ?? ecosystemGraph.nodes[0],
    [activeNodeId],
  );

  const connectedEdgeKeys = useMemo(
    () =>
      ecosystemGraph.edges
        .filter((edge) => edge.from === activeNode.id || edge.to === activeNode.id)
        .map((edge) => `${edge.from}-${edge.to}`),
    [activeNode.id],
  );

  const connectedNodes = useMemo(() => {
    const ids = new Set<string>();

    ecosystemGraph.edges.forEach((edge) => {
      if (edge.from === activeNode.id) ids.add(edge.to);
      if (edge.to === activeNode.id) ids.add(edge.from);
    });

    return ecosystemGraph.nodes.filter((node) => ids.has(node.id));
  }, [activeNode.id]);

  return (
    <motion.section
      className="ecosystem-graph surface-panel"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={staggerGroup}
    >
      <motion.div className="ecosystem-graph__header" variants={sectionReveal}>
        <div className="section-copy content-cluster">
          <p className="eyebrow">relationship map</p>
          <h2>Click around the project neighbourhood</h2>
          <p>
            A little retro, a little systems diagram. This shows how the flagship projects connect to collaboration modes,
            disciplines, and the overall design signal.
          </p>
        </div>

        <div className="ecosystem-graph__legend">
          <span className="legend-chip is-red">project</span>
          <span className="legend-chip is-yellow">collab</span>
          <span className="legend-chip is-blue">discipline</span>
          <span className="legend-chip is-teal">signal</span>
        </div>
      </motion.div>

      <div className="ecosystem-graph__layout">
        <motion.div className="ecosystem-graph__field surface-subpanel" variants={cardReveal}>
          <div className="ecosystem-graph__grid" aria-hidden="true" />

          <svg className="ecosystem-graph__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {ecosystemGraph.edges.map((edge) => {
              const from = ecosystemGraph.nodes.find((node) => node.id === edge.from);
              const to = ecosystemGraph.nodes.find((node) => node.id === edge.to);

              if (!from || !to) {
                return null;
              }

              const isActive = connectedEdgeKeys.includes(`${edge.from}-${edge.to}`);

              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  className={isActive ? 'is-active' : ''}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                />
              );
            })}
          </svg>

          {ecosystemGraph.nodes.map((node) => {
            const isActive = node.id === activeNode.id;

            return (
              <motion.button
                key={node.id}
                type="button"
                className={`graph-node ${accentClassMap[node.accent]} ${isActive ? 'is-active' : ''}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => setActiveNodeId(node.id)}
                whileHover={{ y: -4, scale: 1.03, rotate: isActive ? 0 : -1, transition: { duration: 0.2, ease: motionEase } }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="graph-node__kind">{kindLabelMap[node.type]}</span>
                <strong>{node.label}</strong>
              </motion.button>
            );
          })}
        </motion.div>

        <motion.aside className="ecosystem-graph__detail surface-faint" variants={cardReveal}>
          <div className="ecosystem-graph__detail-head">
            <Network size={18} />
            <p className="eyebrow">selected node</p>
          </div>

          <div className="content-cluster">
            <h3>{activeNode.label}</h3>
            <p>{activeNode.description}</p>
          </div>

          <div className="ecosystem-graph__connections">
            <p className="eyebrow">connected to</p>
            <div className="ecosystem-graph__connection-list">
              {connectedNodes.map((node) => (
                <button key={node.id} type="button" className={`connection-chip ${accentClassMap[node.accent]}`} onClick={() => setActiveNodeId(node.id)}>
                  {node.label}
                </button>
              ))}
            </div>
          </div>

          {activeNode.href ? (
            activeNode.href.startsWith('/') ? (
              <Link to={activeNode.href} className="inline-link">
                Open linked page
                <ArrowRight size={16} />
              </Link>
            ) : (
              <a href={activeNode.href} target="_blank" rel="noreferrer" className="inline-link">
                Open linked page
                <ArrowUpRight size={16} />
              </a>
            )
          ) : null}
        </motion.aside>
      </div>
    </motion.section>
  );
};
