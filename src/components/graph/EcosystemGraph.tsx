import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { ecosystemGraph } from '../../data/site';
import type { EcosystemGraphNode } from '../../types/site';
import { cardReveal, pixelReveal, staggerGroup, viewport } from '../../utils/motion';
import './EcosystemGraph.css';

const accentMap: Record<EcosystemGraphNode['accent'], string> = {
  blue: 'var(--signal-blue)',
  teal: 'var(--signal-teal)',
  red: 'var(--signal-red)',
  yellow: 'var(--signal-yellow)',
};

const kindMap: Record<EcosystemGraphNode['type'], string> = {
  project: 'proj',
  collab: 'collab',
  discipline: 'disc',
  signal: 'sig',
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
      className="egraph t-frame"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={staggerGroup}
    >
      <motion.div variants={pixelReveal}>
        <p className="eyebrow">route map / ecosystem</p>
        <h2>project neighbourhood map</h2>
        <p className="muted">click nodes to explore connections between projects, disciplines, and collaboration modes.</p>
      </motion.div>

      <div className="egraph__legend flex-row">
        <span className="px-tag px-tag--red">project</span>
        <span className="px-tag px-tag--yellow">collab</span>
        <span className="px-tag px-tag--blue">discipline</span>
        <span className="px-tag px-tag--teal">signal</span>
      </div>

      <div className="egraph__layout">
        <motion.div className="egraph__field" variants={cardReveal}>
          <svg className="egraph__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
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
                  className={isActive ? 'egraph__line--active' : ''}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isActive ? 'var(--signal-teal)' : 'var(--border)'}
                  strokeWidth={isActive ? 0.5 : 0.25}
                  strokeDasharray={isActive ? 'none' : '1.5 1'}
                />
              );
            })}
          </svg>

          {ecosystemGraph.nodes.map((node) => {
            const isActive = node.id === activeNode.id;

            return (
              <button
                key={node.id}
                type="button"
                className={`egraph__node ${isActive ? 'egraph__node--active' : ''}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  borderColor: isActive ? accentMap[node.accent] : undefined,
                  boxShadow: isActive ? `0 0 8px ${accentMap[node.accent]}40` : undefined,
                }}
                onClick={() => setActiveNodeId(node.id)}
              >
                <span className="egraph__node-kind">[{kindMap[node.type]}]</span>
                <span>{node.label}</span>
              </button>
            );
          })}
        </motion.div>

        <motion.aside className="egraph__detail t-frame t-frame--sunken" variants={cardReveal}>
          <p className="eyebrow">selected: {activeNode.label}</p>
          <p>{activeNode.description}</p>

          <div className="egraph__connections">
            <p className="eyebrow">connected to:</p>
            <div className="flex-row">
              {connectedNodes.map((node) => (
                <button
                  key={node.id}
                  type="button"
                  className="px-btn"
                  onClick={() => setActiveNodeId(node.id)}
                >
                  {node.label}
                </button>
              ))}
            </div>
          </div>

          {activeNode.href ? (
            activeNode.href.startsWith('/') ? (
              <Link to={activeNode.href} className="px-btn px-btn--accent">
                open route
              </Link>
            ) : (
              <a href={activeNode.href} target="_blank" rel="noreferrer" className="px-btn px-btn--accent">
                open route
              </a>
            )
          ) : null}
        </motion.aside>
      </div>
    </motion.section>
  );
};
