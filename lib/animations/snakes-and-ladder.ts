import type { GraphData, Step, Edge } from './types';

const BOARD_SIZE = 36;
const snakesAndLadders: Record<number, number> = {
    3: 15,  // Ladder
    6: 25,  // Ladder
    19: 29, // Ladder
    16: 4,  // Snake
    23: 12, // Snake
    34: 21, // Snake
};

// Build the graph for visualization
const buildGraph = () => {
    const nodes = [];
    const edges: Edge[] = [];
    const adj: Record<string, string[]> = {};
    const cols = 6;
    
    for (let i = 1; i <= BOARD_SIZE; i++) {
        const row = Math.floor((i - 1) / cols);
        let col = (i - 1) % cols;
        if (row % 2 !== 0) { // zig-zag
            col = cols - 1 - col;
        }
        nodes.push({
            id: String(i),
            x: 100 + col * 90,
            y: 350 - row * 65,
        });
        adj[String(i)] = [];
    }

    for (const [start, end] of Object.entries(snakesAndLadders)) {
        edges.push({
            from: start,
            to: String(end),
            weight: 0,
            type: Number(start) < end ? 'ladder' : 'snake'
        });
    }

    return { nodes, edges, adj };
}

export const graphData: GraphData = buildGraph();

export const dataStructureName = 'Queue';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Snakes and Ladder Problem</h3>
  <p>
    The classic game of Snakes and Ladders can be modeled as a shortest path problem on a graph. Each square on the board is a node. From any square, a dice roll can take you to one of the next 6 squares. Snakes and ladders act as special, directed edges that instantly transport you from one square to another.
  </p>
  <p>
    The goal is to find the minimum number of dice rolls to reach the final square. Since each dice roll counts as one step (an edge of weight 1), we can use <strong>Breadth-First Search (BFS)</strong> to find the solution. This animation shows the BFS exploring the board, with distances representing the minimum number of rolls from the start.
  </p>
`;

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  const startNode = '1';
  const queue: string[] = [startNode];
  const visited = new Set<string>([startNode]);
  const distances: Record<string, number | '∞'> = {};
  graphData.nodes.forEach(n => distances[n.id] = '∞');
  distances[startNode] = 0;

  const createStep = (desc: string, current: string | null = null, neighbor: string | null = null) => {
    steps.push({
      description: desc,
      currentNode: current,
      neighbor: neighbor,
      visited: new Set(visited),
      distances: { ...distances },
      dataStructure: [...queue],
    });
  };

  createStep(`Start BFS from square 1. Rolls needed: 0.`, '1');

  while (queue.length > 0) {
    const currentNode = queue.shift()!;
    const currentNum = parseInt(currentNode, 10);
    
    createStep(`Processing square ${currentNode}.`, currentNode);

    if (currentNum === BOARD_SIZE) {
        createStep(`Reached the final square ${BOARD_SIZE}! Minimum rolls: ${distances[currentNode]}.`, currentNode);
        return steps;
    }

    for (let i = 1; i <= 6; i++) {
        let nextNum = currentNum + i;
        if (nextNum > BOARD_SIZE) continue;

        let finalDest = nextNum;
        if (snakesAndLadders[nextNum]) {
            finalDest = snakesAndLadders[nextNum];
        }
        
        const finalDestStr = String(finalDest);

        if (!visited.has(finalDestStr)) {
            visited.add(finalDestStr);
            const newDist = (distances[currentNode] as number) + 1;
            distances[finalDestStr] = newDist;
            queue.push(finalDestStr);
            createStep(`Rolled a ${i}, moved to ${nextNum}, landed on ${finalDestStr}. Rolls: ${newDist}.`, currentNode, finalDestStr);
        }
    }
  }

  createStep(`BFS complete.`, null);
  return steps;
};
