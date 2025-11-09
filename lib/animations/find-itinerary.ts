import type { GraphData, Step } from './types';

// Tickets represent directed edges in a multigraph
const tickets: [string, string][] = [
    ["JFK", "SFO"], ["JFK", "ATL"], 
    ["SFO", "ATL"], ["ATL", "JFK"], ["ATL", "SFO"]
];
const startNode = "JFK";

const buildGraph = () => {
    const nodesSet = new Set<string>();
    tickets.forEach(([from, to]) => {
        nodesSet.add(from);
        nodesSet.add(to);
    });
    
    const nodes = Array.from(nodesSet).sort().map((id, i) => {
         const angle = (2 * Math.PI * i) / nodesSet.size;
         return {
            id,
            x: 325 + 200 * Math.cos(angle),
            y: 200 + 150 * Math.sin(angle),
         }
    });

    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    const edges: GraphData['edges'] = [];

    // Sort tickets to process neighbors in lexical order
    const sortedTickets = [...tickets].sort((a,b) => a[1].localeCompare(b[1]));

    sortedTickets.forEach(([from, to]) => {
        adj[from].push(to);
        edges.push({ from, to, weight: 1 });
    });

    return { nodes, adj, edges };
}

export const graphData: GraphData = buildGraph();

export const dataStructureName = 'Itinerary (Built in Reverse)';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Find Itinerary from Tickets</h3>
  <p>
    Given a list of airline tickets representing <code>[from, to]</code>, the goal is to find a complete itinerary that uses every ticket exactly once, starting from a given airport (e.g., JFK). If there are multiple valid itineraries, the one with the smallest lexical order should be chosen.
  </p>
  <p>
    This problem is equivalent to finding an <strong>Eulerian Path</strong> in a directed multigraph. The airports are vertices, and the tickets are edges.
  </p>
  <p>A clever way to solve this is with <strong>Hierholzer's algorithm using DFS</strong>. We perform a DFS from the start airport. After we have visited all possible destinations from a given airport, we add it to the <em>front</em> of our result list. This post-order traversal effectively reverses the path, giving us the correct itinerary at the end.</p>
`;

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  // Make a mutable copy of the adjacency list
  const adj = JSON.parse(JSON.stringify(graphData.adj));
  const itinerary: string[] = [];
  const currentPath: string[] = [];
  
  const createStep = (desc: string) => {
    steps.push({
      description: desc,
      currentNode: currentPath[currentPath.length - 1] || null,
      highlightedPath: [...currentPath],
      dataStructure: itinerary.length > 0 ? [`[${itinerary.join('→')}]`] : [],
    });
  };

  const findPath = (u: string) => {
    currentPath.push(u);
    createStep(`DFS arrives at ${u}. Current path: [${currentPath.join('→')}]`);

    while (adj[u] && adj[u].length > 0) {
      // Get the next destination in lexical order and "use" the ticket
      const v = adj[u].shift()!;
      findPath(v);
    }
    
    // Add to the front of the result after exploring all paths from u
    itinerary.unshift(u);
    currentPath.pop();
    createStep(`Finished with ${u}. Add to front of itinerary. Backtrack.`, );
  };

  createStep(`Start finding itinerary from ${startNode}.`);
  findPath(startNode);
  createStep(`DFS complete. The final itinerary is [${itinerary.join('→')}]`);

  return steps;
};