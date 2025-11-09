import type { GraphData, Step, Edge } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 200, y: 100 }, { id: 'B', x: 400, y: 100 },
    { id: 'C', x: 100, y: 250 }, { id: 'D', x: 300, y: 250 },
    { id: 'E', x: 500, y: 250 },
  ],
  adj: {
    'A': ['B', 'C', 'D'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'D'],
    'D': ['A', 'B', 'C', 'E'],
    'E': ['B', 'D'],
  },
  edges: [
    { from:'A', to:'B', weight:1}, { from:'A', to:'C', weight:1}, { from:'A', to:'D', weight:1},
    { from:'B', to:'D', weight:1}, { from:'B', to:'E', weight:1}, { from:'C', to:'D', weight:1},
    { from:'D', to:'E', weight:1},
  ],
};
// This graph has an Eulerian path between C and E.

export const dataStructureName = 'Current Path';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Fleury's Algorithm</h3>
  <p>
    Fleury's algorithm is a method for finding an Eulerian path or circuit in a graph. It's a simple idea but can be inefficient to implement.
  </p>
  <p>
    The algorithm starts at a vertex of odd degree (or any vertex if none exist) and builds the path edge by edge:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li>Choose an edge connected to the current vertex.</li>
    <li>Traverse it to the next vertex.</li>
    <li><strong>Remove</strong> the traversed edge from the graph.</li>
    <li>The crucial rule: <strong>Never cross a bridge</strong> of the remaining graph, unless there is no other choice.</li>
  </ol>
  <p>The animation shows this process, highlighting the chosen edge and removing it from the graph at each step.</p>
`;

// Helper to check for bridges
const isBridge = (graph: {adj: Record<string, string[]>, nodes: {id: string}[]}, u: string, v: string): boolean => {
  const tempAdj = JSON.parse(JSON.stringify(graph.adj));
  tempAdj[u] = tempAdj[u].filter(n => n !== v);
  tempAdj[v] = tempAdj[v].filter(n => n !== u);
  
  const visited = new Set<string>();
  const stack = [u];
  visited.add(u);
  let count = 0;
  while(stack.length > 0) {
    const node = stack.pop()!;
    count++;
    for(const neighbor of tempAdj[node]) {
      if(!visited.has(neighbor)) {
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }
  }
  // If v is still reachable from u, it's not a bridge
  return !visited.has(v);
};


export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  let currentGraph = JSON.parse(JSON.stringify(graphData));
  let path: string[] = ['C']; // Start at an odd degree node
  
  steps.push({
    description: "Start Fleury's algorithm at odd-degree node C.",
    currentNode: 'C',
    graphData: { ...currentGraph },
    dataStructure: [...path],
  });

  while(currentGraph.edges.length > 0) {
    const u = path[path.length - 1];
    let next_v: string | null = null;
    
    // Find a non-bridge edge
    for(const v of currentGraph.adj[u]) {
      if (!isBridge(currentGraph, u, v)) {
        next_v = v;
        break;
      }
    }

    // If all are bridges, pick any
    if (!next_v && currentGraph.adj[u].length > 0) {
      next_v = currentGraph.adj[u][0];
    }

    if (next_v) {
      path.push(next_v);
      
      steps.push({
        description: `From ${u}, chose edge to ${next_v}.`,
        currentNode: next_v,
        highlightedPath: [...path],
        graphData: { ...currentGraph },
        dataStructure: [...path],
      });
      
      // Remove edge from graph
      currentGraph.adj[u] = currentGraph.adj[u].filter((n: string) => n !== next_v);
      currentGraph.adj[next_v] = currentGraph.adj[next_v].filter((n: string) => n !== u);
      currentGraph.edges = currentGraph.edges.filter((e: Edge) => !((e.from === u && e.to === next_v) || (e.from === next_v && e.to === u)));
      
       steps.push({
        description: `Remove edge ${u}-${next_v} from the graph.`,
        currentNode: next_v,
        highlightedPath: [...path],
        graphData: { ...currentGraph },
        dataStructure: [...path],
      });
    } else {
      break; // No more edges from u
    }
  }

  steps.push({
    description: "Algorithm complete. Eulerian path found.",
    currentNode: null,
    highlightedPath: [...path],
    graphData: { ...currentGraph },
    dataStructure: [...path],
  });

  return steps;
};