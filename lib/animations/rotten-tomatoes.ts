import type { GraphData, Step } from './types';

// 0: Empty, 1: Fresh, 2: Rotten
const grid = [
  [2, 1, 1, 0, 1],
  [1, 1, 0, 1, 1],
  [0, 1, 1, 1, 0],
  [1, 0, 1, 2, 1],
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

export const dataStructureName = 'Time Elapsed';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Rotten Tomatoes Problem</h3>
  <p>
    Imagine a grid of oranges, some fresh (1), some rotten (2), and some empty cells (0). Every minute, a rotten orange can cause an adjacent (up, down, left, right) fresh orange to rot. The goal is to find the minimum time required until no fresh oranges are left.
  </p>
  <p>
    This problem is a perfect fit for a <strong>Multi-Source Breadth-First Search (BFS)</strong>. We start the BFS simultaneously from all initially rotten oranges. Each "level" of the BFS traversal corresponds to one minute passing. The total number of levels explored is the minimum time needed. If some oranges remain fresh, it's impossible to rot them all.
  </p>
`;

const COLORS = {
    EMPTY: '#4b5563', // gray-600
    FRESH: '#f97316', // orange-500
    ROTTEN: '#dc2626', // red-600
};


export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  const rows = grid.length;
  const cols = grid[0].length;
  let freshOranges = 0;
  
  const queue: [number, number, number][] = []; // [row, col, time]
  const cellColors: Record<string, string> = {};

  for(let r = 0; r < rows; r++){
      for(let c = 0; c < cols; c++){
          const cellId = `${r}-${c}`;
          if(grid[r][c] === 2) {
              queue.push([r, c, 0]);
              cellColors[cellId] = COLORS.ROTTEN;
          } else if(grid[r][c] === 1) {
              freshOranges++;
              cellColors[cellId] = COLORS.FRESH;
          } else {
              cellColors[cellId] = COLORS.EMPTY;
          }
      }
  }

  const createStep = (desc: string, currentNode: string | null = null, time: number) => {
    steps.push({
      description: desc,
      currentNode: currentNode,
      cellColors: { ...cellColors },
      dataStructure: [`${time} min`],
    });
  };

  createStep('Start. Initial grid with fresh and rotten oranges.', null, 0);

  let time = 0;
  let head = 0;
  while(head < queue.length){
      const [r, c, t] = queue[head++];
      time = t;
      
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;
          const neighborId = `${nr}-${nc}`;

          if(nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1){
              grid[nr][nc] = 2; // Mark as rotten in the underlying grid to avoid re-queueing
              freshOranges--;
              queue.push([nr, nc, t + 1]);
              cellColors[neighborId] = COLORS.ROTTEN;
              createStep(`Orange at (${r},${c}) rots its neighbor at (${nr},${nc}).`, neighborId, t + 1);
          }
      }
  }

  if (freshOranges > 0) {
      createStep(`Process complete. ${freshOranges} oranges could not be rotten.`, null, time);
  } else {
      createStep(`All fresh oranges have rotted. Total time: ${time} minutes.`, null, time);
  }
  
  return steps;
};
