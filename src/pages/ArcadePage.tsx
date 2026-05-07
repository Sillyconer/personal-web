import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { cardReveal, pixelReveal, staggerGroup, viewport } from '../utils/motion';
import './ArcadePage.css';

const BOARD_WIDTH = 16;
const BOARD_HEIGHT = 12;
const BLOCK_STORAGE_KEY = 'personalweb.arcade.board';
const NOTE_STORAGE_KEY = 'personalweb.arcade.notes';
const TOOL_STORAGE_KEY = 'personalweb.arcade.tool';
const NAME_STORAGE_KEY = 'personalweb.arcade.name';

const blockPalette = [
  { id: 'air', label: 'erase', color: 'transparent' },
  { id: 'grass', label: 'grass', color: '#59C135' },
  { id: 'dirt', label: 'dirt', color: '#71413B' },
  { id: 'stone', label: 'stone', color: '#4A5462' },
  { id: 'wood', label: 'wood', color: '#DBA463' },
  { id: 'water', label: 'water', color: '#285CC4' },
  { id: 'flower', label: 'flower', color: '#BC4A9B' },
  { id: 'glow', label: 'glow', color: '#FFD541' },
] as const;

type BlockId = (typeof blockPalette)[number]['id'];

interface ArcadeNote {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

const createEmptyBoard = () => Array.from({ length: BOARD_WIDTH * BOARD_HEIGHT }, () => 'air' as BlockId);

const readBoard = (): BlockId[] => {
  if (typeof window === 'undefined') {
    return createEmptyBoard();
  }

  try {
    const raw = window.localStorage.getItem(BLOCK_STORAGE_KEY);
    if (!raw) return createEmptyBoard();
    const parsed = JSON.parse(raw) as string[];
    if (!Array.isArray(parsed) || parsed.length !== BOARD_WIDTH * BOARD_HEIGHT) return createEmptyBoard();
    return parsed.map((value) => (blockPalette.some((block) => block.id === value) ? (value as BlockId) : 'air'));
  } catch {
    return createEmptyBoard();
  }
};

const readNotes = (): ArcadeNote[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(NOTE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ArcadeNote[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const ArcadePage = () => {
  const [board, setBoard] = useState<BlockId[]>(() => readBoard());
  const [tool, setTool] = useState<BlockId>(() => {
    if (typeof window === 'undefined') return 'grass';
    const savedTool = window.localStorage.getItem(TOOL_STORAGE_KEY) as BlockId | null;
    return savedTool && blockPalette.some((block) => block.id === savedTool) ? savedTool : 'grass';
  });
  const [name, setName] = useState(() => {
    if (typeof window === 'undefined') return 'traveler';
    return window.localStorage.getItem(NAME_STORAGE_KEY) || 'traveler';
  });
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState<ArcadeNote[]>(() => readNotes());

  useEffect(() => {
    window.localStorage.setItem(BLOCK_STORAGE_KEY, JSON.stringify(board));
  }, [board]);

  useEffect(() => {
    window.localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    window.localStorage.setItem(TOOL_STORAGE_KEY, tool);
  }, [tool]);

  useEffect(() => {
    window.localStorage.setItem(NAME_STORAGE_KEY, name);
  }, [name]);

  const counts = useMemo(() => {
    return blockPalette.reduce<Record<BlockId, number>>((acc, block) => {
      acc[block.id] = board.filter((cell) => cell === block.id).length;
      return acc;
    }, {} as Record<BlockId, number>);
  }, [board]);

  const paintCell = (index: number) => {
    setBoard((current) => {
      const next = [...current];
      next[index] = tool;
      return next;
    });
  };

  const handlePostNote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedMessage = message.trim();
    const trimmedName = name.trim() || 'traveler';

    if (!trimmedMessage) {
      return;
    }

    setNotes((current) => [
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name: trimmedName,
        message: trimmedMessage.slice(0, 120),
        createdAt: new Date().toISOString(),
      },
      ...current,
    ].slice(0, 10));
    setMessage('');
  };

  const resetBoard = () => {
    setBoard(createEmptyBoard());
  };

  return (
    <div className="page-stack arcade-page">
      <motion.section className="arcade-hero" initial="hidden" animate="show" variants={staggerGroup}>
        <motion.div className="arcade-hero__copy arcade-panel" variants={pixelReveal}>
          <p className="eyebrow">block craft / public toy world</p>
          <h1>Build a tiny scene, leave a note, and show off a little technical magic.</h1>
          <p className="arcade-hero__lead">
            This world is a Minecraft-inspired toy cartridge. Blocks and notes are stored locally on this device for now, so the page doubles as a mini build tool and persistence demo.
          </p>
          <div className="arcade-hero__chips">
            <span className="arcade-chip arcade-chip--green">chunk board</span>
            <span className="arcade-chip arcade-chip--tan">local save</span>
            <span className="arcade-chip arcade-chip--blue">toy persistence</span>
          </div>
        </motion.div>

        <motion.div className="arcade-hero__scene arcade-panel arcade-panel--bright" variants={cardReveal}>
          <div className="arcade-scene" aria-hidden="true">
            <div className="arcade-scene__sun" />
            <div className="arcade-scene__cloud arcade-scene__cloud--1" />
            <div className="arcade-scene__cloud arcade-scene__cloud--2" />
            <div className="arcade-scene__ground" />
            <div className="arcade-scene__tree arcade-scene__tree--1" />
            <div className="arcade-scene__tree arcade-scene__tree--2" />
          </div>
        </motion.div>
      </motion.section>

      <motion.section className="arcade-build" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="arcade-board arcade-panel" variants={cardReveal}>
          <div className="arcade-board__head">
            <div>
              <p className="eyebrow">build board</p>
              <h2>Place blocks</h2>
            </div>
            <button type="button" className="arcade-btn arcade-btn--ghost" onClick={resetBoard}>
              clear chunk
            </button>
          </div>

          <div className="arcade-toolbar">
            {blockPalette.map((block) => (
              <button
                key={block.id}
                type="button"
                className={`arcade-tool ${tool === block.id ? 'is-active' : ''}`}
                onClick={() => setTool(block.id)}
              >
                <span className="arcade-tool__swatch" style={{ background: block.color }} />
                <span>{block.label}</span>
              </button>
            ))}
          </div>

          <div className="arcade-grid" data-interactive>
            {board.map((block, index) => {
              const color = blockPalette.find((item) => item.id === block)?.color ?? 'transparent';

              return (
                <button
                  key={index}
                  type="button"
                  className={`arcade-cell arcade-cell--${block}`}
                  style={{ background: color }}
                  onClick={() => paintCell(index)}
                  aria-label={`Cell ${index + 1}`}
                />
              );
            })}
          </div>
        </motion.div>

        <motion.div className="arcade-side" variants={cardReveal}>
          <section className="arcade-panel arcade-panel--soft">
            <p className="eyebrow">world stats</p>
            <div className="arcade-stats">
              {blockPalette.filter((block) => block.id !== 'air').map((block) => (
                <div key={block.id} className="arcade-stat">
                  <span className="arcade-tool__swatch" style={{ background: block.color }} />
                  <strong>{counts[block.id]}</strong>
                  <span>{block.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="arcade-panel arcade-panel--soft">
            <p className="eyebrow">sign post</p>
            <form className="arcade-note-form" onSubmit={handlePostNote}>
              <label>
                <span>builder name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} maxLength={20} />
              </label>
              <label>
                <span>message</span>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={120} rows={4} />
              </label>
              <button type="submit" className="arcade-btn arcade-btn--primary">save sign</button>
            </form>
          </section>
        </motion.div>
      </motion.section>

      <motion.section className="arcade-notes arcade-panel" initial="hidden" whileInView="show" viewport={viewport} variants={staggerGroup}>
        <motion.div className="arcade-board__head" variants={pixelReveal}>
          <div>
            <p className="eyebrow">saved signs</p>
            <h2>Recent notes from this device</h2>
          </div>
        </motion.div>

        <div className="arcade-notes__list">
          {notes.length > 0 ? (
            notes.map((note) => (
              <motion.article key={note.id} className="arcade-note" variants={cardReveal}>
                <div className="arcade-note__head">
                  <strong>{note.name}</strong>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
                <p>{note.message}</p>
              </motion.article>
            ))
          ) : (
            <motion.div className="arcade-note arcade-note--empty" variants={cardReveal}>
              <p>No signs yet. Build something and leave the first message.</p>
            </motion.div>
          )}
        </div>
      </motion.section>
    </div>
  );
};
