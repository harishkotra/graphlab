import type { GraphData, Step, Node } from './types';

const jug1Capacity = 4;
const jug2Capacity = 3;
const target = 2;

// Pre-build the state-space graph for visualization
const buildGraph = () => {
    const nodes: Node[] = [];
    const adj: Record<string, string[]> = {};
    const q: [number, number][] = [[0, 0]];
    const visited = new Set<string>(['0,0']);
    const positions = new Map<string, {x: number, y: number}>();
    
    positions.set('0,0', { x: 325, y: 50 });

    while (q.length > 0) {
        const [j1, j2] = q.shift()!;
        const u = `${j1},${j2}`;
        if (!adj[u]) adj[u] = [];

        const nextStates: [number, number, string][] = [
            [jug1Capacity, j2, 'Fill Jug 1'],
            [j1, jug2Capacity, 'Fill Jug 2'],
            [0, j2, 'Empty Jug 1'],
            [j1, 0, 'Empty Jug 2'],
            [j1 - Math.min(j1, jug2Capacity - j2), j2 + Math.min(j1, jug2Capacity - j2), 'Pour 1->2'],
            [j1 + Math.min(j2, jug1Capacity - j1), j2 - Math.min(j2, jug1Capacity - j1), 'Pour 2->1'],
        ];

        for (const [nj1, nj2] of nextStates) {
            const v = `${nj1},${nj2}`;
            if (!visited.has(v)) {
                visited.add(v);
                q.push([nj1, nj2]);
                adj[u].push(v);
                if (!adj[v]) adj[v] = [];
                adj[v].push(u); // for layout purposes
            }
        }
    }

    // A simple force-like layout simulation
    const nodeIds = Array.from(visited);
    nodeIds.forEach(id => {
        if (!positions.has(id)) {
            positions.set(id, { x: Math.random() * 600 + 25, y: Math.random() * 350 + 25 });
        }
    });

    for(let i=0; i<30; i++) { // iterations
        nodeIds.forEach(id1 => {
            const pos1 = positions.get(id1)!;
            // Repulsion from other nodes
            nodeIds.forEach(id2 => {
                if (id1 === id2) return;
                const pos2 = positions.get(id2)!;
                const dx = pos1.x - pos2.x;
                const dy = pos1.y - pos2.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 150) {
                    pos1.x += dx / dist * 5;
                    pos1.y += dy / dist * 5;
                }
            });
            // Attraction to neighbors
            (adj[id1] || []).forEach(id2 => {
                const pos2 = positions.get(id2)!;
                const dx = pos2.x - pos1.x;
                const dy = pos2.y - pos1.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                pos1.x += dx * 0.01;
                pos1.y += dy * 0.01;
            });
        });
    }

    nodeIds.forEach(id => nodes.push({ id, ...positions.get(id)! }));

    return { nodes, adj };
}

export const graphData: GraphData = buildGraph();

export const dataStructureName = 'Queue of States';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Water Jug Problem</h3>
  <p>
    This is a classic puzzle where you have two jugs of different capacities and a water source. The goal is to measure a specific amount of water. You can perform actions like filling a jug, emptying it, or pouring water from one to another.
  </p>
  <p>
    The problem can be modeled as a state-space graph, where each node is a state representing the amount of water in each jug (e.g., '(4, 0)'). Edges represent the actions that transition between states. We use <strong>Breadth-First Search (BFS)</strong> to find the shortest sequence of actions from the initial state (0, 0) to a state where one jug has the target amount.
  </p>
`;

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  const startState = [0, 0];
  const queue: [number, number, string[]][] = [[startState[0], startState[1], [`${startState[0]},${startState[1]}`]]];
  const visited = new Set<string>([`${startState[0]},${startState[1]}`]);

  const createStep = (desc: string, path: string[]) => {
    steps.push({
      description: desc,
      currentNode: path[path.length - 1],
      visited: new Set(visited),
      dataStructure: queue.map(p => `[${p[2].join('→')}]`),
      highlightedPath: path,
    });
  };

  createStep('Start BFS from state (0,0).', [`${startState[0]},${startState[1]}`]);

  while (queue.length > 0) {
    const [j1, j2, path] = queue.shift()!;
    
    createStep(`Processing state (${j1},${j2}).`, path);
    
    if (j1 === target || j2 === target) {
      createStep(`Target of ${target}L reached! Path: ${path.join(' -> ')}`, path);
      return steps;
    }
    
    const nextStates: [number, number][] = [
        [jug1Capacity, j2], [j1, jug2Capacity], [0, j2], [j1, 0],
        [j1 - Math.min(j1, jug2Capacity - j2), j2 + Math.min(j1, jug2Capacity - j2)],
        [j1 + Math.min(j2, jug1Capacity - j1), j2 - Math.min(j2, jug1Capacity - j1)],
    ];
    
    for (const [nj1, nj2] of nextStates) {
        const stateStr = `${nj1},${nj2}`;
        if (!visited.has(stateStr)) {
            visited.add(stateStr);
            const newPath = [...path, stateStr];
            queue.push([nj1, nj2, newPath]);
            createStep(`Added new state (${nj1},${nj2}) to queue.`, newPath);
        }
    }
  }

  createStep('Queue is empty. Target amount cannot be reached.', []);
  return steps;
};
