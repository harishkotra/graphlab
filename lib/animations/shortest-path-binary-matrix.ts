import type { GraphData, Step } from './types';

// 0: open path, 1: obstacle
const grid = [
  [0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0],
  [0, 0, 1, 0, 1],
  [0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0],
];

const nodes = grid.flatMap((row, r) => row.map((cell, c) => ({
    id: `${r}-${c}`, x: 0, y: 0, row: r, col: c,
})));

export const graphData: GraphData = {
  nodes, adj: {}, layout: 'grid', grid,
};

export const dataStructureName = 'Queue';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Shortest Path in a Binary Matrix</h3>
  <p>
    Given a grid where '0' represents a clear path and '1' represents an obstacle, the goal is to find the length of the shortest path from the top-left corner (0,0) to the bottom-right corner. Movement is allowed in all 8 directions (horizontally, vertically, and diagonally).
  </p>
  <p>
    This is a classic shortest path problem on an unweighted graph, making <strong>Breadth-First Search (BFS)</strong> the ideal solution. We start a BFS from (0,0), exploring all 8 neighbors at each step. The "level" of the BFS corresponds to the length of the path. The first time we reach the destination, we've found the shortest path.
  </p>
`;

const COLORS = {
    PATH: '#d1d5db', // gray-300
    WALL: '#374151', // gray-700
    VISITED: '#60a5fa', // blue-400
    FINAL_PATH: '#22c55e', // green-500
};

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  const rows = grid.length;
  const cols = grid[0].length;
  
  if (grid[0][0] === 1 || grid[rows-1][cols-1] === 1) {
      steps.push({ description: 'Start or end cell is an obstacle. No path exists.', currentNode: null, dataStructure: [] });
      return steps;
  }

  const queue: [number, number, number][] = [[0, 0, 1]]; // r, c, distance
  const visited = new Set<string>(['0-0']);
  const predecessors: Record<string, string> = {};
  const cellColors: Record<string, string> = {};
  grid.forEach((row, r) => row.forEach((_, c) => cellColors[`${r}-${c}`] = grid[r][c] === 1 ? COLORS.WALL : COLORS.PATH));

  const createStep = (desc: string, current: string | null = null) => {
    steps.push({
      description: desc,
      currentNode: current,
      cellColors: { ...cellColors },
      dataStructure: queue.map(([r, c, d]) => `(${r},${c}) L:${d}`),
    });
  };

  createStep('Start BFS from (0,0). Path length is 1.', '0-0');

  while (queue.length > 0) {
    const [r, c, dist] = queue.shift()!;
    const currentId = `${r}-${c}`;
    cellColors[currentId] = COLORS.VISITED;
    createStep(`Processing cell (${r},${c}). Current path length: ${dist}`, currentId);

    if (r === rows - 1 && c === cols - 1) {
      // Path found, backtrack to highlight it
      let curr = currentId;
      while(curr) {
          cellColors[curr] = COLORS.FINAL_PATH;
          curr = predecessors[curr];
      }
      createStep(`Reached destination! Shortest path length is ${dist}.`, currentId);
      return steps;
    }

    const directions = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      const neighborId = `${nr}-${nc}`;

      if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 0 && !visited.has(neighborId)) {
        visited.add(neighborId);
        queue.push([nr, nc, dist + 1]);
        predecessors[neighborId] = currentId;
      }
    }
  }

  createStep('Queue is empty, but destination was not reached. No path exists.', null);
  return steps;
};
