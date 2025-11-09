import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 50, y: 200 },
    { id: 'B', x: 200, y: 100 },
    { id: 'C', x: 200, y: 300 },
    { id: 'D', x: 350, y: 100 },
    { id: 'E', x: 350, y: 300 },
    { id: 'F', x: 500, y: 200 },
  ],
  adj: {
    'A': ['B', 'C'], 'B': ['D'], 'C': ['D', 'E'],
    'D': ['F'], 'E': ['F'], 'F': [],
  },
  edges: [
    { from: 'A', to: 'B', weight: 5 }, { from: 'A', to: 'C', weight: 3 },
    { from: 'B', to: 'D', weight: 6 }, { from: 'C', to: 'D', weight: 2 },
    { from: 'C', to: 'E', weight: 4 }, { from: 'D', to: 'F', weight: 1 },
    { from: 'E', to: 'F', weight: 2 },
  ],
  directed: true,
};

export const dataStructureName = 'Topologically Sorted Order';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Longest Path in a Directed Acyclic Graph (DAG)</h3>
  <p>
    While finding the longest path in a general graph is a hard problem, it can be solved efficiently in a Directed Acyclic Graph (DAG). This is useful in applications like critical path analysis in project management, where the longest path represents the minimum time needed to complete the entire project.
  </p>
  <p>
    The algorithm is very similar to finding the shortest path in a DAG:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li><strong>Topologically Sort</strong> the vertices of the DAG.</li>
    <li>Initialize distances to all vertices as -∞ and the source vertex as 0.</li>
    <li>Process the vertices in topological order. For each vertex <code>u</code>, update the distances to its neighbors <code>v</code> by "relaxing" the edges: <code>dist[v] = max(dist[v], dist[u] + weight(u,v))</code>.</li>
  </ol>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const distances: Record<string, number | '∞'> = {};

  // 1. Topological Sort (Kahn's)
  const inDegree: Record<string, number> = {};
  graph.nodes.forEach(n => inDegree[n.id] = 0);
  graph.edges!.forEach(e => inDegree[e.to]++);
  const queue = graph.nodes.filter(n => inDegree[n.id] === 0).map(n => n.id);
  const topoSorted: string[] = [];
  while (queue.length > 0) {
    const u = queue.shift()!;
    topoSorted.push(u);
    (graph.adj[u] || []).forEach(v => {
      inDegree[v]--;
      if (inDegree[v] === 0) queue.push(v);
    });
  }

  steps.push({
    description: `Phase 1: Calculated the topological sort of the graph.`,
    currentNode: null,
    dataStructure: topoSorted,
  });

  // 2. Relax edges
  graph.nodes.forEach(n => distances[n.id] = '-∞' as any); // Using string for display
  distances[startNode] = 0;

  steps.push({
    description: `Phase 2: Initialize distances. Source node is 0, others are -∞.`,
    currentNode: startNode,
    distances: { ...distances },
    dataStructure: topoSorted,
  });

  for (const u of topoSorted) {
    if (distances[u] === ('-∞' as any)) continue;
    
    steps.push({
      description: `Processing node ${u} from the sorted list.`,
      currentNode: u,
      distances: { ...distances },
      dataStructure: topoSorted,
    });

    for (const v of graph.adj[u] || []) {
      const edge = graph.edges!.find(e => e.from === u && e.to === v)!;
      const newDist = (distances[u] as number) + edge.weight;
      
      if (distances[v] === ('-∞' as any) || newDist > (distances[v] as number)) {
        distances[v] = newDist;
        steps.push({
          description: `Relaxing edge ${u}→${v}. Updated longest distance to ${v} to ${newDist}.`,
          currentNode: u,
          neighbor: v,
          distances: { ...distances },
          highlightedEdge: edge,
          dataStructure: topoSorted,
        });
      }
    }
  }

  steps.push({
    description: `Algorithm complete. Longest paths from ${startNode} found.`,
    currentNode: null,
    distances: { ...distances },
    dataStructure: topoSorted,
  });

  return steps;
};