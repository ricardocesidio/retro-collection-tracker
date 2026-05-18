export function getCollectorLevel(gameCount: number): {
  name: string;
  tier: number;
} {
  if (gameCount >= 30) return { name: 'Museum', tier: 3 };
  if (gameCount >= 15) return { name: 'Curator', tier: 2 };
  if (gameCount >= 5) return { name: 'Collector', tier: 1 };
  return { name: 'New Collector', tier: 0 };
}
