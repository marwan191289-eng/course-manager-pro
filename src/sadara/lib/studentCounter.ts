// Deterministic, realistic-looking growth of the trained-students counter.
// Every visitor sees the same number. On average ~1 new student per hour:
// some hours +1, some +2, some 0 (so "1 every 2 hours"), occasionally +3 over two hours.
const EPOCH = Date.UTC(2026, 9, 1, 0, 0, 0); // 1 Oct 2026
const BASE = 12419;
const PATTERN = [1, 1, 2, 1, 0, 1, 2, 1, 0, 1, 1, 0];

function hourIncrement(h: number): number {
  // simple integer hash so the sequence looks irregular but is stable
  let x = (h * 2654435761) >>> 0;
  x ^= x >>> 13;
  return PATTERN[x % PATTERN.length];
}

export function computeStudentCount(now: number): number {
  const hours = Math.max(0, Math.floor((now - EPOCH) / 3_600_000));
  let total = BASE;
  for (let h = 0; h < hours; h++) total += hourIncrement(h);
  return total;
}
