import type { GraphData, Step } from './types';

// Unweighted directed graph
export const graphData: GraphData = {
  nodes: [
    { id: 'S', x: 100, y: 200 },
    { id: 'A', x: 275, y: 100 },
    { id: 'B', x: 275, y: 300 },
    { id: 'C', x: 450, y: 100 },
    { id: 'D', x: 450, y: 300 },
    { id: 'T', x: 600, y: 200 },
  ],
  adj: {
    'S': ['A', 'B'], 'A': ['C'], 'B': ['A','D'],
    'C': ['T'], 'D': ['T'], 'T': [],
  },
  edges: [
    { from: 'S', to: 'A', weight: 1 }, { from: 'S', to: 'B', weight: 1 },
    { from: 'A', to: 'C', weight: 1 }, { from: 'B', to: 'A', weight: 1 },
    { from: 'B', to: 'D', weight: 1 }, { from: 'C', to: 'T', weight: 1 },
    { from: 'D', to: 'T', weight: 1 },
  ],
  directed: true,
};

export const dataStructureName = 'Paths Found';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Maximum Edge-Disjoint Paths</h3>
  <p>
    The goal is to find the maximum number of paths from a source (S) to a sink (T) that do not share any common edges. This is a classic application of the max-flow min-cut theorem.
  </p>
  <p>
    The problem can be solved by transforming it into a max-flow problem. We assign every edge in the graph a <strong>capacity of 1</strong>. The maximum flow that can be sent from S to T in this network is then equal to the maximum number of edge-disjoint paths. Each unit of flow effectively "uses up" an edge, preventing other paths from using it.
  </p>
  <p>This animation runs the Ford-Fulkerson algorithm on this unit-capacity graph and then highlights the final paths found.</p>
`;

// Re-using Ford-Fulkerson logic
const getDirectedEdgeKey = (from: string, to: string) => `${from}->${to}`;

export const generateSteps = (graph: GraphData, startNode: string = 'S', endNode: string = 'T'): Step[] => {
  const steps: Step[] = [];
  const flows: Record<string, number> = {};
  graph.edges!.forEach(e => {
      flows[getDirectedEdgeKey(e.from, e.to)] = 0;
      flows[getDirectedEdgeKey(e.to, e.from)] = 0;
  });

  const capacities: Record<string, number> = {};
  graph.edges!.forEach(e => capacities[getDirectedEdgeKey(e.from, e.to)] = e.weight);

  let totalFlow = 0;

  const createStep = (desc: string, path: string[] | null = null, finalPaths: string[][] | null = null) => {
    steps.push({
      description: desc,
      currentNode: null,
      highlightedPath: path || (finalPaths ? finalPaths.flat() : undefined),
      flows: { ...flows },
      dataStructure: [`${totalFlow}`]
    });
  };

  createStep("Start. Assign capacity 1 to all edges.");

  while (true) {
    const parent: Record<string, string> = {};
    const queue: string[] = [startNode];
    const visited = new Set<string>([startNode]);
    
    pathFinding:
    while (queue.length > 0) {
      const u = queue.shift()!;
      const neighbors = new Set<string>();
      (graph.adj[u] || []).forEach(v => neighbors.add(v));
      Object.keys(graph.adj).forEach(n => { if(graph.adj[n].includes(u)) neighbors.add(n) });

      for (const v of neighbors) {
        const capacity = capacities[getDirectedEdgeKey(u, v)] || 0;
        const flow = flows[getDirectedEdgeKey(u, v)] || 0;
        if (!visited.has(v) && capacity - flow > 0) {
          parent[v] = u;
          visited.add(v);
          queue.push(v);
          if (v === endNode) break pathFinding;
        }
      }
    }
    
    if (!parent[endNode]) {
      break;
    }

    const path: string[] = [];
    let curr = endNode;
    while(curr !== startNode) {
        path.unshift(curr);
        curr = parent[curr];
    }
    path.unshift(startNode);
    
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i+1];
        flows[getDirectedEdgeKey(u, v)] += 1;
        flows[getDirectedEdgeKey(v, u)] -= 1;
    }

    totalFlow += 1;
    createStep(`Found path ${path.join(' → ')}. Total paths: ${totalFlow}.`, path);
  }

  // Final step: trace the paths from the flow
  const finalPaths: string[][] = [];
  const tempFlows = { ...flows };

  for(let i=0; i<totalFlow; i++) {
      const path: string[] = [startNode];
      let current = startNode;
      while (current !== endNode) {
          let foundNext = false;
          for (const neighbor of graph.adj[current] || []) {
              const key = getDirectedEdgeKey(current, neighbor);
              if (tempFlows[key] === 1) {
                  tempFlows[key] = 0;
                  path.push(neighbor);
                  current = neighbor;
                  foundNext = true;
                  break;
              }
          }
          if (!foundNext) break; // Should not happen in a valid flow
      }
      finalPaths.push(path);
  }
  
  createStep(`Max flow of ${totalFlow} found, corresponding to ${totalFlow} edge-disjoint paths.`, null, finalPaths);

  return steps;
};