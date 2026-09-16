const MODULE_COUNT = 21;
const FINDER_SIZE = 7;
const QUIET_ZONE = 2;

function inFinderBlock(x: number, y: number, originX: number, originY: number): boolean {
  return (
    x >= originX &&
    x < originX + FINDER_SIZE &&
    y >= originY &&
    y < originY + FINDER_SIZE
  );
}

function isFinderDark(x: number, y: number, originX: number, originY: number): boolean {
  const dx = x - originX;
  const dy = y - originY;
  const onBorder = dx === 0 || dy === 0 || dx === FINDER_SIZE - 1 || dy === FINDER_SIZE - 1;
  const inCenter = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
  return onBorder || inCenter;
}

function inReservedFinder(x: number, y: number): boolean {
  const last = MODULE_COUNT - FINDER_SIZE;
  return (
    inFinderBlock(x, y, 0, 0) ||
    inFinderBlock(x, y, last, 0) ||
    inFinderBlock(x, y, 0, last)
  );
}

function buildModules(): Array<{ x: number; y: number }> {
  const last = MODULE_COUNT - FINDER_SIZE;
  const modules: Array<{ x: number; y: number }> = [];

  for (let y = 0; y < MODULE_COUNT; y += 1) {
    for (let x = 0; x < MODULE_COUNT; x += 1) {
      let dark = false;
      if (inFinderBlock(x, y, 0, 0)) {
        dark = isFinderDark(x, y, 0, 0);
      } else if (inFinderBlock(x, y, last, 0)) {
        dark = isFinderDark(x, y, last, 0);
      } else if (inFinderBlock(x, y, 0, last)) {
        dark = isFinderDark(x, y, 0, last);
      } else if (x === 6 || y === 6) {
        dark = (x + y) % 2 === 0;
      } else if (!inReservedFinder(x, y)) {
        const seed = (x * 13 + y * 29 + x * y * 3) % 11;
        dark = seed === 0 || seed === 2 || seed === 5 || seed === 8;
      }
      if (dark) {
        modules.push({ x: x + QUIET_ZONE, y: y + QUIET_ZONE });
      }
    }
  }

  return modules;
}

const MODULES = buildModules();
const VIEWBOX = MODULE_COUNT + QUIET_ZONE * 2;

export function QrCodePlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      role="presentation"
      aria-hidden
      className={className}
    >
      <rect width={VIEWBOX} height={VIEWBOX} className="fill-surface" />
      {MODULES.map((module) => (
        <rect
          key={`${module.x}-${module.y}`}
          x={module.x}
          y={module.y}
          width={1}
          height={1}
          className="fill-foreground"
        />
      ))}
    </svg>
  );
}
