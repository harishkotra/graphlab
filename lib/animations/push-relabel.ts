import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'S', x: 100, y: 200 },
    { id: 'A', x: 275, y: 100 },
    { id: 'B', x: 275, y: 300 },
    { id: 'T', x: 450, y: 200 },
  ],
  adj: { 'S': ['A', 'B'], 'A': ['T'], 'B': ['A', 'T'], 'T': [] },
  edges: [
    { from: 'S', to: 'A', weight: 15 }, { from: 'S', to: 'B', weight: 8 },
    { from: 'A', to: 'T', weight: 10 }, { from: 'B', to: 'A', weight: 4 },
    { from: 'B', to: 'T', weight: 10 },
  ],
  directed: true,
};

export const dataStructureName = 'Active Nodes';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Push-Relabel Algorithm</h3>
  <p>
    The Push-Relabel algorithm is another method for finding maximum flow, which is often more efficient in practice than Ford-Fulkerson. It works with a "pre-flow," where nodes are allowed to have more flow entering than leaving.
  </p>
  <p>
    Key concepts, shown below each node (h:height, e:excess):
  </p>
  <ul class="list-disc list-inside space-y-1 my-2">
    <li><strong>Height (h):</strong> An estimate of the distance to the sink. Flow can only be pushed "downhill" to a neighbor with a height exactly one less.</li>
    <li><strong>Excess Flow (e):</strong> The amount of pre-flow sitting at a node. A node is "active" if it has excess flow.</li>
    <li><strong>Push:</strong> Move excess flow from an active node to a downhill neighbor.</li>
    <li><strong>Relabel:</strong> If an active node has no downhill neighbors, increase its height.</li>
  </ul>
  <p>The algorithm continues until no nodes (other than S and T) are active.</p>
`;

const getDirectedEdgeKey = (from: string, to: string) => `${from}->${to}`;

export const generateSteps = (graph: GraphData, startNode: string = 'S', endNode: string = 'T'): Step[] => {
  const steps: Step[] = [];
  const V = graph.nodes.length;
  const nodes = graph.nodes.map(n => n.id);
  
  const heights: Record<string, number> = {};
  const excess: Record<string, number> = {};
  const flows: Record<string, number> = {};

  const capacities: Record<string, number> = {};
  graph.edges!.forEach(e => {
    capacities[getDirectedEdgeKey(e.from, e.to)] = e.weight;
    flows[getDirectedEdgeKey(e.from, e.to)] = 0;
    flows[getDirectedEdgeKey(e.to, e.from)] = 0;
  });

  nodes.forEach(n => {
    heights[n] = 0;
    excess[n] = 0;
  });
  heights[startNode] = V;

  const createStep = (desc: string, current: string | null, neighbor: string | null = null, path: string[] | null = null) => {
    const activeNodes = nodes.filter(n => n !== startNode && n !== endNode && excess[n] > 0);
    steps.push({
      description: desc,
      currentNode: current,
      neighbor: neighbor,
      highlightedPath: path || undefined,
      flows: { ...flows },
      nodeHeights: { ...heights },
      excessFlows: { ...excess },
      dataStructure: activeNodes,
    });
  };
  
  createStep("Initialize: Height of S is |V|, others are 0. No excess flow yet.", startNode);

  // Initial push from source
  for (const v of graph.adj[startNode]) {
    const capacity = capacities[getDirectedEdgeKey(startNode, v)];
    flows[getDirectedEdgeKey(startNode, v)] = capacity;
    flows[getDirectedEdgeKey(v, startNode)] = -capacity;
    excess[v] += capacity;
    excess[startNode] -= capacity;
  }
  
  createStep("Saturate all edges out of the source S.", startNode);

  let activeNodes = nodes.filter(n => n !== startNode && n !== endNode && excess[n] > 0);
  while(activeNodes.length > 0) {
    const u = activeNodes[0];
    let pushed = false;
    
    // PUSH operation
    const neighbors = new Set([...(graph.adj[u] || []), ...Object.keys(graph.adj).filter(n => graph.adj[n].includes(u))]);
    for (const v of neighbors) {
      const residualCapacity = (capacities[getDirectedEdgeKey(u, v)] || 0) - flows[getDirectedEdgeKey(u, v)];
      if (residualCapacity > 0 && heights[u] === heights[v] + 1) {
        const pushAmount = Math.min(excess[u], residualCapacity);
        
        flows[getDirectedEdgeKey(u, v)] += pushAmount;
        flows[getDirectedEdgeKey(v, u)] -= pushAmount;
        excess[u] -= pushAmount;
        excess[v] += pushAmount;
        
        createStep(`Push ${pushAmount} from ${u} to ${v}.`, u, v, [u,v]);
        pushed = true;
        if (excess[u] === 0) break;
      }
    }
    
    // RELABEL operation
    if (!pushed) {
      let minHeight = Infinity;
      for (const v of neighbors) {
        const residualCapacity = (capacities[getDirectedEdgeKey(u, v)] || 0) - flows[getDirectedEdgeKey(u, v)];
        if (residualCapacity > 0) {
          minHeight = Math.min(minHeight, heights[v]);
        }
      }
      if (minHeight !== Infinity) {
        heights[u] = minHeight + 1;
        createStep(`No valid push from ${u}. Relabel ${u} to height ${heights[u]}.`, u);
      }
    }

    activeNodes = nodes.filter(n => n !== startNode && n !== endNode && excess[n] > 0);
  }

  createStep(`Algorithm complete. No more active nodes. Max flow is ${excess[endNode]}.`, endNode);

  return steps;
};