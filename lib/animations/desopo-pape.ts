import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'S', x: 50, y: 200 },
    { id: 'A', x: 200, y: 100 },
    { id: 'B', x: 200, y: 300 },
    { id: 'C', x: 350, y: 100 },
    { id: 'D', x: 350, y: 300 },
    { id: 'T', x: 500, y: 200 },
  ],
  adj: { 'S': ['A', 'B'], 'A': ['C'], 'B': ['A', 'D'], 'C': ['D', 'T'], 'D': ['T'], 'T': [] },
  edges: [
    { from: 'S', to: 'A', weight: 4 },
    { from: 'S', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 3 },
    { from: 'B', to: 'A', weight: 1 },
    { from: 'B', to: 'D', weight: 2 },
    { from: 'C', to: 'D', weight: -2 },
    { from: 'C', to: 'T', weight: 3 },
    { from: 'D', to: 'T', weight: -1 },
  ],
  directed: true,
};

export const dataStructureName = 'Deque';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">D'Esopo-Pape Algorithm</h3>
  <p>
    The D'Esopo-Pape algorithm is a label-correcting algorithm for the single-source shortest path problem, similar to Bellman-Ford. It can handle negative edge weights (but not negative cycles). In many practical cases, it performs better than Bellman-Ford.
  </p>
  <p>
    It maintains a set of nodes to be processed in a <strong>Deque</strong> (double-ended queue). When a node's distance is updated:
  </p>
  <ul class="list-disc list-inside space-y-1 my-2">
    <li>If the node has <strong>never</strong> been in the deque before, it's added to the <strong>back</strong>.</li>
    <li>If the node <strong>has been</strong> in the deque, it's added to the <strong>front</strong>.</li>
  </ul>
  <p>This strategy prioritizes nodes whose paths have been improved, aiming to propagate distance updates more quickly.</p>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'S'): Step[] => {
  const steps: Step[] = [];
  const distances: Record<string, number | '∞'> = {};
  const deque: string[] = [];
  // 0: never in deque, 1: was in deque, 2: currently in deque
  const nodeStatus: Record<string, 0 | 1 | 2> = {};

  graph.nodes.forEach(node => {
    distances[node.id] = '∞';
    nodeStatus[node.id] = 0;
  });

  distances[startNode] = 0;
  deque.push(startNode);
  nodeStatus[startNode] = 2;

  steps.push({
    description: `Initialize. Add start node ${startNode} to the back of the deque.`,
    currentNode: startNode,
    distances: { ...distances },
    dataStructure: [...deque],
  });

  while (deque.length > 0) {
    const u = deque.shift()!;
    nodeStatus[u] = 1; // Mark as 'was in deque'

    steps.push({
      description: `Process node ${u} from the front of the deque.`,
      currentNode: u,
      distances: { ...distances },
      dataStructure: [...deque],
    });

    for (const v of graph.adj[u] || []) {
      const edge = graph.edges!.find(e => e.from === u && e.to === v)!;
      const newDist = (distances[u] as number) + edge.weight;

      if (distances[v] === '∞' || newDist < (distances[v] as number)) {
        distances[v] = newDist;
        let desc = `Updated distance of ${v} to ${newDist}. `;

        if (nodeStatus[v] === 0) {
          deque.push(v);
          nodeStatus[v] = 2;
          desc += "It's new, add to BACK.";
        } else if (nodeStatus[v] === 1) {
          deque.unshift(v);
          nodeStatus[v] = 2;
          desc += "It's been seen, add to FRONT.";
        }
        // If nodeStatus[v] is 2, it's already in the deque, do nothing.

        steps.push({
          description: desc,
          currentNode: u,
          neighbor: v,
          distances: { ...distances },
          highlightedEdge: edge,
          dataStructure: [...deque],
        });
      }
    }
  }

  steps.push({
    description: 'Algorithm complete. Deque is empty.',
    currentNode: null,
    distances: { ...distances },
    dataStructure: [],
  });

  return steps;
};
