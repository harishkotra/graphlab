import type { GraphData, Step } from './types';

const PALETTE = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];

// Initial grid of "colors" represented by indices in the PALETTE
const initialGrid = [
  [1, 1, 1, 2, 2],
  [1, 1, 0, 0, 2],
  [1, 0, 0, 2, 2],
  [3, 3, 0, 4, 4],
  [3, 3, 3, 4, 4],
];
// Deep copy for mutation
const grid = initialGrid.map(row => [...row]);

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

export const dataStructureName = 'Queue';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Flood Fill Algorithm</h3>
  <p>
    The Flood Fill algorithm is used to fill a connected region of a multi-dimensional array (like an image or a grid) with a new color. It starts at a specific "seed" pixel and changes its color, then recursively or iteratively does the same for all adjacent pixels that have the same original color.
  </p>
  <p>
    This animation visualizes the process using <strong>Breadth-First Search (BFS)</strong>. Starting from a seed cell, we add it to a queue. We then process the queue, changing the color of each dequeued cell and adding its valid, unvisited neighbors (of the same original color) to the queue.
  </p>
`;

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  const startRow = 2;
  const startCol = 1;
  const newColorIndex = 5; // A new color from our palette

  const rows = grid.length;
  const cols = grid[0].length;
  const originalColorIndex = grid[startRow][startCol];
  
  const cellColors: Record<string, string> = {};
  for(let r=0; r<rows; r++) {
      for(let c=0; c<cols; c++) {
          cellColors[`${r}-${c}`] = PALETTE[grid[r][c]];
      }
  }

  const createStep = (desc: string, queue: string[], currentNode: string | null = null) => {
    steps.push({
      description: desc,
      currentNode: currentNode,
      cellColors: { ...cellColors },
      dataStructure: [...queue],
    });
  };

  createStep('Initial grid state before flood fill.', []);
  
  if (originalColorIndex === newColorIndex) {
      createStep('Start color is the same as new color. Nothing to do.', []);
      return steps;
  }

  const queue = [[startRow, startCol]];
  const visited = new Set<string>([`${startRow}-${startCol}`]);
  cellColors[`${startRow}-${startCol}`] = PALETTE[newColorIndex];


  createStep(`Start flood fill at (${startRow},${startCol}). New color is purple.`, queue.map(([r,c]) => `(${r},${c})`));

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const currentId = `${r}-${c}`;
    
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      const neighborId = `${nr}-${nc}`;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(neighborId) && grid[nr][nc] === originalColorIndex) {
        visited.add(neighborId);
        cellColors[neighborId] = PALETTE[newColorIndex];
        queue.push([nr, nc]);
        createStep(`Filling neighbor (${nr},${nc}).`, queue.map(([r,c]) => `(${r},${c})`), neighborId);
      }
    }
  }

  createStep('Flood fill complete.', []);
  return steps;
};
