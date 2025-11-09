import type { GraphData, Step } from './types';

const grid = [
  [1, 2, 2, 3, 5],
  [3, 2, 3, 4, 4],
  [2, 4, 5, 3, 1],
  [6, 7, 1, 4, 5],
  [5, 1, 1, 2, 4],
];

const nodes = grid.flatMap((row, r) => row.map((cell, c) => ({
    id: `${r}-${c}`,
    x: 0, y: 0,
    row: r, col: c,
})));

export const graphData: GraphData = {
  nodes,
  adj: {},
  layout: 'grid',
  grid,
};

export const dataStructureName = 'Reachable Sets';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Pacific Atlantic Water Flow</h3>
  <p>
    Given a 2D grid of numbers representing land height, find all cells from which water can flow to both the Pacific Ocean (top and left edges) and the Atlantic Ocean (bottom and right edges). Water can flow from a cell to an adjacent cell (up, down, left, right) if the adjacent cell's height is less than or equal to the current cell's height.
  </p>
  <p>
    A clever approach is to start from the oceans and see which cells the water can "flow back up to". We run two separate traversals (like BFS): one starting from all Pacific border cells and another from all Atlantic border cells. The cells that are visited in <strong>both</strong> traversals are our answer.
  </p>
`;

const COLORS = {
    LAND: '#a78bfa', // purple
    PACIFIC: '#3b82f6', // blue
    ATLANTIC: '#f97316', // orange
    BOTH: '#10b981', // green
};

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  const pacificReachable = new Set<string>();
  const atlanticReachable = new Set<string>();
  const cellColors: Record<string, string> = {};

  const createStep = (desc: string) => {
    // Determine cell colors based on reachable sets
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const id = `${r}-${c}`;
        const canReachPacific = pacificReachable.has(id);
        const canReachAtlantic = atlanticReachable.has(id);
        if (canReachPacific && canReachAtlantic) {
          cellColors[id] = COLORS.BOTH;
        } else if (canReachPacific) {
          cellColors[id] = COLORS.PACIFIC;
        } else if (canReachAtlantic) {
          cellColors[id] = COLORS.ATLANTIC;
        } else {
          cellColors[id] = COLORS.LAND;
        }
      }
    }
    steps.push({
      description: desc,
      currentNode: null,
      cellColors: { ...cellColors },
      dataStructure: [`P: ${pacificReachable.size}`, `A: ${atlanticReachable.size}`]
    });
  };

  createStep('Initial grid. Start by finding cells that can reach the Pacific.');

  const bfs = (queue: [number, number][], reachableSet: Set<string>) => {
    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const id = `${r}-${c}`;
      
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        const neighborId = `${nr}-${nc}`;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !reachableSet.has(neighborId) && grid[nr][nc] >= grid[r][c]) {
          reachableSet.add(neighborId);
          queue.push([nr, nc]);
        }
      }
    }
  };

  // Pacific BFS
  const pacificQueue: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    pacificQueue.push([r, 0]);
    pacificReachable.add(`${r}-0`);
  }
  for (let c = 1; c < cols; c++) {
    pacificQueue.push([0, c]);
    pacificReachable.add(`0-${c}`);
  }
  bfs(pacificQueue, pacificReachable);
  createStep('Finished Pacific traversal. Blue cells can reach the Pacific.');

  // Atlantic BFS
  const atlanticQueue: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    atlanticQueue.push([r, cols - 1]);
    atlanticReachable.add(`${r}-${cols-1}`);
  }
  for (let c = 0; c < cols - 1; c++) {
    atlanticQueue.push([rows - 1, c]);
    atlanticReachable.add(`${rows-1}-${c}`);
  }
  bfs(atlanticQueue, atlanticReachable);
  createStep('Finished Atlantic traversal. Orange cells can reach the Atlantic.');

  createStep('Final result: Green cells can reach both oceans.');
  return steps;
};
