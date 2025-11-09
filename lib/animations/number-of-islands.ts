import type { GraphData, Step } from './types';

const grid = [
  [1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0],
  [0, 0, 1, 0, 0],
  [0, 0, 0, 1, 1],
];

const nodes = grid.flatMap((row, r) => row.map((cell, c) => ({
    id: `${r}-${c}`,
    x: 0, y: 0, // Not used in grid layout
    row: r, col: c,
})));

export const graphData: GraphData = {
  nodes,
  adj: {}, // Adjacency is implicit in grid
  layout: 'grid',
  grid,
};

export const dataStructureName = 'Island Count';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is the Number of Islands Problem?</h3>
  <p>
    This is a classic graph problem often represented by a 2D grid. Given a grid where '1's represent land and '0's represent water, the goal is to count the number of separate islands. An island is a group of connected '1's (horizontally or vertically).
  </p>
  <p>
    The solution involves iterating through each cell of the grid. If a cell contains '1' and hasn't been visited yet, we've found a new island. We then start a traversal (like BFS or DFS) from that cell to find all its connected land parts, marking them as visited so we don't count them again. This animation uses different colors to mark the cells of each discovered island.
  </p>
`;

const ISLAND_COLORS = ['#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#60a5fa'];

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = new Set<string>();
  const cellColors: Record<string, string> = {};
  let islandCount = 0;

  const createStep = (desc: string, currentNode: string | null = null) => {
    steps.push({
      description: desc,
      currentNode: currentNode,
      cellColors: { ...cellColors },
      dataStructure: [`${islandCount}`],
    });
  };

  createStep('Start scanning grid for islands.');

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellId = `${r}-${c}`;
      if (grid[r][c] === 1 && !visited.has(cellId)) {
        islandCount++;
        const color = ISLAND_COLORS[islandCount - 1 % ISLAND_COLORS.length];
        createStep(`Found unvisited land at (${r}, ${c}). Starting new island count.`, cellId);
        
        const queue = [[r, c]];
        visited.add(cellId);
        cellColors[cellId] = color;
        createStep(`Marking (${r}, ${c}) as part of island ${islandCount}.`, cellId);

        while (queue.length > 0) {
          const [currR, currC] = queue.shift()!;
          const currId = `${currR}-${currC}`;
          
          const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
          for (const [dr, dc] of directions) {
            const nr = currR + dr;
            const nc = currC + dc;
            const neighborId = `${nr}-${nc}`;

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1 && !visited.has(neighborId)) {
              visited.add(neighborId);
              cellColors[neighborId] = color;
              queue.push([nr, nc]);
              createStep(`Exploring neighbor (${nr}, ${nc}) and adding to island ${islandCount}.`, neighborId);
            }
          }
        }
      }
    }
  }

  createStep(`Grid scan complete. Found a total of ${islandCount} islands.`);
  return steps;
};