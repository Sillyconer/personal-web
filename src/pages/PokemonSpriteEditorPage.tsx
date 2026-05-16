import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent } from 'react';
import { Clipboard, FlipHorizontal2, Grid2X2, MousePointer2, RotateCcw } from 'lucide-react';

import overworldSheet from '../assets/pokemon/overworld_sprites.png';
import {
  POKEMON_GENERATIONS,
  POKEMON_SPRITES,
  SPRITE_SHEET_HEIGHT,
  SPRITE_SHEET_WIDTH,
  type Direction,
  type PokemonGeneration,
  type PokemonSprite,
  type SpriteFrame,
} from '../components/worlds/PokemonWorld';
import './PokemonSpriteEditorPage.css';

const DIRECTION_ORDER: Direction[] = ['up', 'down', 'left', 'right'];
const EDITOR_DRAFTS_KEY = 'pokemon-sprite-editor-drafts-v1';
const PREVIEW_SCALE = 3;

type EditableFrames = Record<Direction, [SpriteFrame, SpriteFrame]>;

interface EditablePokemonSprite extends Omit<PokemonSprite, 'frames'> {
  frames: EditableFrames;
}

interface ActiveFrame {
  direction: Direction;
  index: 0 | 1;
}

type DraftMap = Record<string, EditablePokemonSprite>;

const cloneFrame = (spriteFrame: SpriteFrame): SpriteFrame => ({
  x: spriteFrame.x,
  y: spriteFrame.y,
  ...(spriteFrame.flipX ? { flipX: true } : {}),
});

const normalizeFrames = (sprite: PokemonSprite): EditableFrames => ({
  up: [cloneFrame(sprite.frames.up[0]), cloneFrame(sprite.frames.up[1])],
  down: [cloneFrame(sprite.frames.down[0]), cloneFrame(sprite.frames.down[1])],
  left: [cloneFrame(sprite.frames.left[0]), cloneFrame(sprite.frames.left[1])],
  right: [cloneFrame(sprite.frames.right[0]), cloneFrame(sprite.frames.right[1])],
});

const normalizeSprite = (sprite: PokemonSprite): EditablePokemonSprite => ({
  name: sprite.name,
  generation: sprite.generation,
  w: sprite.w,
  h: sprite.h,
  frames: normalizeFrames(sprite),
});

const BASE_DRAFTS: DraftMap = Object.fromEntries(
  POKEMON_SPRITES.map((sprite) => [sprite.name, normalizeSprite(sprite)]),
);

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const readFrame = (value: unknown, fallback: SpriteFrame): SpriteFrame => {
  if (!isObject(value)) return cloneFrame(fallback);

  const { flipX, x, y } = value;
  return {
    x: typeof x === 'number' ? x : fallback.x,
    y: typeof y === 'number' ? y : fallback.y,
    ...(typeof flipX === 'boolean' ? { flipX } : fallback.flipX ? { flipX: true } : {}),
  };
};

const readStoredSprite = (value: unknown, fallback: EditablePokemonSprite): EditablePokemonSprite => {
  if (!isObject(value) || !isObject(value.frames)) return fallback;

  return {
    ...fallback,
    frames: {
      up: [
        readFrame(Array.isArray(value.frames.up) ? value.frames.up[0] : null, fallback.frames.up[0]),
        readFrame(Array.isArray(value.frames.up) ? value.frames.up[1] : null, fallback.frames.up[1]),
      ],
      down: [
        readFrame(Array.isArray(value.frames.down) ? value.frames.down[0] : null, fallback.frames.down[0]),
        readFrame(Array.isArray(value.frames.down) ? value.frames.down[1] : null, fallback.frames.down[1]),
      ],
      left: [
        readFrame(Array.isArray(value.frames.left) ? value.frames.left[0] : null, fallback.frames.left[0]),
        readFrame(Array.isArray(value.frames.left) ? value.frames.left[1] : null, fallback.frames.left[1]),
      ],
      right: [
        readFrame(Array.isArray(value.frames.right) ? value.frames.right[0] : null, fallback.frames.right[0]),
        readFrame(Array.isArray(value.frames.right) ? value.frames.right[1] : null, fallback.frames.right[1]),
      ],
    },
  };
};

const createInitialDrafts = (): DraftMap => {
  if (typeof window === 'undefined') return BASE_DRAFTS;

  const rawDrafts = window.localStorage.getItem(EDITOR_DRAFTS_KEY);
  if (!rawDrafts) return BASE_DRAFTS;

  try {
    const parsed: unknown = JSON.parse(rawDrafts);
    if (!isObject(parsed)) return BASE_DRAFTS;

    return Object.fromEntries(
      Object.entries(BASE_DRAFTS).map(([name, sprite]) => [name, readStoredSprite(parsed[name], sprite)]),
    );
  } catch {
    return BASE_DRAFTS;
  }
};

const isEdited = (sprite: EditablePokemonSprite) =>
  JSON.stringify(sprite.frames) !== JSON.stringify(BASE_DRAFTS[sprite.name]?.frames);

const formatFrame = (spriteFrame: SpriteFrame) =>
  spriteFrame.flipX ? `frame(${spriteFrame.x}, ${spriteFrame.y}, true)` : `frame(${spriteFrame.x}, ${spriteFrame.y})`;

const formatSpriteDefinition = (sprite: EditablePokemonSprite) => [
  '  {',
  `    name: '${sprite.name}',`,
  `    generation: ${sprite.generation},`,
  `    w: ${sprite.w},`,
  `    h: ${sprite.h},`,
  '    frames: {',
  ...DIRECTION_ORDER.map(
    (direction) =>
      `      ${direction}: [${formatFrame(sprite.frames[direction][0])}, ${formatFrame(sprite.frames[direction][1])}],`,
  ),
  '    },',
  '  },',
].join('\n');

const getPreviewStyle = (
  sprite: EditablePokemonSprite,
  spriteFrame: SpriteFrame,
  scale = PREVIEW_SCALE,
): CSSProperties => ({
  width: `${sprite.w * scale}px`,
  height: `${sprite.h * scale}px`,
  backgroundImage: `url(${overworldSheet})`,
  backgroundPosition: `-${spriteFrame.x * scale}px -${spriteFrame.y * scale}px`,
  backgroundSize: `${SPRITE_SHEET_WIDTH * scale}px ${SPRITE_SHEET_HEIGHT * scale}px`,
  transform: spriteFrame.flipX ? 'scaleX(-1)' : undefined,
});

const getMarkerLabel = (direction: Direction, index: number) => `${direction.slice(0, 1).toUpperCase()}${index + 1}`;

export const PokemonSpriteEditorPage = () => {
  const [drafts, setDrafts] = useState<DraftMap>(createInitialDrafts);
  const [selectedName, setSelectedName] = useState(POKEMON_SPRITES[0]?.name ?? '');
  const [generationFilter, setGenerationFilter] = useState<PokemonGeneration | 'all'>('all');
  const [query, setQuery] = useState('');
  const [activeFrame, setActiveFrame] = useState<ActiveFrame>({ direction: 'up', index: 0 });
  const [blockMode, setBlockMode] = useState(true);
  const [copiedLabel, setCopiedLabel] = useState('');

  const spriteList = useMemo(
    () =>
      Object.values(drafts).sort((a, b) =>
        a.generation === b.generation ? a.name.localeCompare(b.name) : a.generation - b.generation,
      ),
    [drafts],
  );

  const filteredSprites = useMemo(
    () =>
      spriteList.filter((sprite) => {
        const matchesGeneration = generationFilter === 'all' || sprite.generation === generationFilter;
        const matchesQuery = sprite.name.toLowerCase().includes(query.trim().toLowerCase());
        return matchesGeneration && matchesQuery;
      }),
    [generationFilter, query, spriteList],
  );

  const selectedSprite = drafts[selectedName] ?? spriteList[0];
  const editedSprites = useMemo(() => spriteList.filter(isEdited), [spriteList]);
  const selectedDefinition = selectedSprite ? formatSpriteDefinition(selectedSprite) : '';
  const editedDefinitions = editedSprites.length
    ? editedSprites.map(formatSpriteDefinition).join('\n')
    : '// no edited sprites yet';

  useEffect(() => {
    window.localStorage.setItem(EDITOR_DRAFTS_KEY, JSON.stringify(drafts));
  }, [drafts]);

  const updateSelectedSprite = (updater: (sprite: EditablePokemonSprite) => EditablePokemonSprite) => {
    setDrafts((currentDrafts) => {
      const currentSprite = currentDrafts[selectedName];
      if (!currentSprite) return currentDrafts;
      return {
        ...currentDrafts,
        [selectedName]: updater(currentSprite),
      };
    });
  };

  const setSpriteFrame = (direction: Direction, index: 0 | 1, nextFrame: SpriteFrame) => {
    updateSelectedSprite((sprite) => ({
      ...sprite,
      frames: {
        ...sprite.frames,
        [direction]: sprite.frames[direction].map((spriteFrame, frameIndex) =>
          frameIndex === index ? nextFrame : spriteFrame,
        ) as [SpriteFrame, SpriteFrame],
      },
    }));
  };

  const applyDirectionalBlock = (origin: SpriteFrame) => {
    updateSelectedSprite((sprite) => ({
      ...sprite,
      frames: {
        up: [{ x: origin.x, y: origin.y }, { x: origin.x + sprite.w, y: origin.y }],
        down: [{ x: origin.x, y: origin.y + sprite.h }, { x: origin.x + sprite.w, y: origin.y + sprite.h }],
        left: [{ x: origin.x, y: origin.y + sprite.h * 2 }, { x: origin.x + sprite.w, y: origin.y + sprite.h * 2 }],
        right: [{ x: origin.x, y: origin.y + sprite.h * 3 }, { x: origin.x + sprite.w, y: origin.y + sprite.h * 3 }],
      },
    }));
  };

  const mirrorRightFromLeft = () => {
    updateSelectedSprite((sprite) => ({
      ...sprite,
      frames: {
        ...sprite.frames,
        right: sprite.frames.left.map((spriteFrame) => ({
          x: spriteFrame.x,
          y: spriteFrame.y,
          flipX: true,
        })) as [SpriteFrame, SpriteFrame],
      },
    }));
    setActiveFrame({ direction: 'right', index: 0 });
  };

  const handleSheetClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!selectedSprite) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const rawX = ((event.clientX - rect.left) / rect.width) * SPRITE_SHEET_WIDTH;
    const rawY = ((event.clientY - rect.top) / rect.height) * SPRITE_SHEET_HEIGHT;
    const nextFrame = {
      x: Math.max(0, Math.floor(rawX / selectedSprite.w) * selectedSprite.w),
      y: Math.max(0, Math.floor(rawY / selectedSprite.h) * selectedSprite.h),
    };

    if (blockMode) {
      applyDirectionalBlock(nextFrame);
      return;
    }

    setSpriteFrame(activeFrame.direction, activeFrame.index, nextFrame);
  };

  const resetSelectedSprite = () => {
    if (!selectedSprite) return;
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [selectedSprite.name]: BASE_DRAFTS[selectedSprite.name],
    }));
  };

  const resetAllSprites = () => {
    setDrafts(BASE_DRAFTS);
  };

  const copyText = (text: string, label: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedLabel(label);
    window.setTimeout(() => setCopiedLabel(''), 1200);
  };

  if (!selectedSprite) return null;

  return (
    <section className="pokemon-editor">
      <header className="pokemon-editor__header">
        <div>
          <span className="eyebrow">sprite grid editor</span>
          <h1>Pokemon coordinates</h1>
        </div>
        <div className="pokemon-editor__header-actions">
          <button type="button" className={blockMode ? 'is-active' : ''} onClick={() => setBlockMode((value) => !value)}>
            <Grid2X2 size={14} /> block mode
          </button>
          <button type="button" onClick={mirrorRightFromLeft}>
            <FlipHorizontal2 size={14} /> mirror right
          </button>
          <button type="button" onClick={resetSelectedSprite}>
            <RotateCcw size={14} /> reset pokemon
          </button>
          <button type="button" onClick={resetAllSprites}>
            <RotateCcw size={14} /> reset all
          </button>
        </div>
      </header>

      <div className="pokemon-editor__layout">
        <aside className="pokemon-editor__roster">
          <div className="pokemon-editor__filters">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="filter pokemon"
            />
            <select
              value={generationFilter}
              onChange={(event) =>
                setGenerationFilter(event.target.value === 'all' ? 'all' : Number(event.target.value) as PokemonGeneration)
              }
            >
              <option value="all">all gens</option>
              {POKEMON_GENERATIONS.map((generation) => (
                <option key={generation} value={generation}>gen {generation}</option>
              ))}
            </select>
          </div>

          <div className="pokemon-editor__sprite-list">
            {filteredSprites.map((sprite) => (
              <button
                key={sprite.name}
                type="button"
                className={sprite.name === selectedSprite.name ? 'is-active' : ''}
                onClick={() => setSelectedName(sprite.name)}
              >
                <span>{sprite.name}</span>
                <small>gen {sprite.generation}{isEdited(sprite) ? ' / edited' : ''}</small>
              </button>
            ))}
          </div>
        </aside>

        <main className="pokemon-editor__workbench">
          <section className="pokemon-editor__panel pokemon-editor__inspector">
            <div className="pokemon-editor__selected">
              <div
                className="pokemon-editor__large-preview"
                style={getPreviewStyle(selectedSprite, selectedSprite.frames[activeFrame.direction][activeFrame.index])}
              />
              <div>
                <span className="eyebrow">selected</span>
                <h2>{selectedSprite.name}</h2>
                <p>gen {selectedSprite.generation} / {selectedSprite.w}x{selectedSprite.h}</p>
                <p>{blockMode ? 'clicking the sheet fills up/down/left/right from that top-left cell' : 'clicking the sheet edits only the active frame'}</p>
              </div>
            </div>

            <div className="pokemon-editor__frame-table">
              {DIRECTION_ORDER.map((direction) => (
                <div key={direction} className="pokemon-editor__frame-row">
                  <strong>{direction}</strong>
                  {selectedSprite.frames[direction].map((spriteFrame, index) => {
                    const frameIndex = index as 0 | 1;
                    const isActive = activeFrame.direction === direction && activeFrame.index === frameIndex;
                    return (
                      <div key={`${direction}-${index}`} className={isActive ? 'is-active' : ''}>
                        <button type="button" onClick={() => setActiveFrame({ direction, index: frameIndex })}>
                          <MousePointer2 size={12} /> f{index + 1}
                        </button>
                        <label>
                          x
                          <input
                            type="number"
                            step={selectedSprite.w}
                            value={spriteFrame.x}
                            onChange={(event) =>
                              setSpriteFrame(direction, frameIndex, { ...spriteFrame, x: Number(event.target.value) })
                            }
                          />
                        </label>
                        <label>
                          y
                          <input
                            type="number"
                            step={selectedSprite.h}
                            value={spriteFrame.y}
                            onChange={(event) =>
                              setSpriteFrame(direction, frameIndex, { ...spriteFrame, y: Number(event.target.value) })
                            }
                          />
                        </label>
                        <label className="pokemon-editor__flip-toggle">
                          flip
                          <input
                            type="checkbox"
                            checked={Boolean(spriteFrame.flipX)}
                            onChange={(event) =>
                              setSpriteFrame(direction, frameIndex, {
                                ...spriteFrame,
                                ...(event.target.checked ? { flipX: true } : { flipX: undefined }),
                              })
                            }
                          />
                        </label>
                        <span
                          className="pokemon-editor__mini-preview"
                          style={getPreviewStyle(selectedSprite, spriteFrame, 1.5)}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </section>

          <section className="pokemon-editor__sheet-panel">
            <div className="pokemon-editor__sheet-scroll">
              <div
                className="pokemon-editor__sheet"
                style={{ width: SPRITE_SHEET_WIDTH, height: SPRITE_SHEET_HEIGHT }}
                onClick={handleSheetClick}
              >
                <img src={overworldSheet} alt="Pokemon overworld sprite sheet" draggable="false" />
                {DIRECTION_ORDER.flatMap((direction) =>
                  selectedSprite.frames[direction].map((spriteFrame, index) => {
                    const isActive = activeFrame.direction === direction && activeFrame.index === index;
                    return (
                      <span
                        key={`${direction}-${index}`}
                        className={[
                          'pokemon-editor__marker',
                          isActive ? 'is-active' : '',
                          spriteFrame.flipX ? 'is-flipped' : '',
                        ].filter(Boolean).join(' ')}
                        style={{
                          left: spriteFrame.x,
                          top: spriteFrame.y,
                          width: selectedSprite.w,
                          height: selectedSprite.h,
                        }}
                      >
                        {getMarkerLabel(direction, index)}{spriteFrame.flipX ? 'F' : ''}
                      </span>
                    );
                  }),
                )}
              </div>
            </div>
          </section>

          <section className="pokemon-editor__panel pokemon-editor__output">
            <div className="pokemon-editor__output-column">
              <div className="pokemon-editor__output-header">
                <h3>selected definition</h3>
                <button type="button" onClick={() => copyText(selectedDefinition, 'selected')}>
                  <Clipboard size={14} /> copy
                </button>
              </div>
              <textarea readOnly value={selectedDefinition} />
            </div>
            <div className="pokemon-editor__output-column">
              <div className="pokemon-editor__output-header">
                <h3>edited definitions</h3>
                <button type="button" onClick={() => copyText(editedDefinitions, 'edited')}>
                  <Clipboard size={14} /> copy
                </button>
              </div>
              <textarea readOnly value={editedDefinitions} />
            </div>
            {copiedLabel ? <span className="pokemon-editor__copied">copied {copiedLabel}</span> : null}
          </section>
        </main>
      </div>
    </section>
  );
};
