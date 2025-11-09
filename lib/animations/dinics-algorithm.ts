import type { GraphData, Step } from './types';

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
    'S': ['A', 'B'], 'A': ['C'], 'B': ['A', 'D'],
    'C': ['T'], 'D': ['C', 'T'], 'T': [],
  },
  edges: [
    { from: 'S', to: 'A', weight: 10 }, { from: 'S', to: 'B', weight: 8 },
    { from: 'A', to: 'C', weight: 5 }, { from: 'B', to: 'A', weight: 3 },
    { from: 'B', to: 'D', weight: 10 }, { from: 'C', to: 'T', weight: 7 },
    { from: 'D', to: 'C', weight: 4 }, { from: 'D', to: 'T', weight: 10 },
  ],
  directed: true,
};

export const dataStructureName = 'Phase / Total Flow';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Dinic's Algorithm</h3>
  <p>
    Dinic's algorithm is a highly efficient method for solving the max-flow problem. It's an improvement over the basic Ford-Fulkerson algorithm and works in phases. In each phase:
  </p>
  <ol class="list-decimal list-inside space-y-1 my-2">
    <li><strong>Build Level Graph:</strong> A BFS is run from the source on the residual graph to create a "level graph." This graph only contains edges that go from a level <code>i</code> to level <code>i+1</code>.</li>
    <li><strong>Find Blocking Flow:</strong> A DFS is used to find multiple augmenting paths in the level graph until no more paths can be found (a "blocking flow").</li>
  </ol>
  <p>The total flow is the sum of blocking flows from all phases. The algorithm stops when the sink is no longer reachable from the source in the level graph.</p>
`;

const getDirectedEdgeKey = (from: string, to: string) => `${from}->${to}`;

export const generateSteps = (graph: GraphData, startNode: string = 'S', endNode: string = 'T'): Step[] => {
    const steps: Step[] = [];
    const flows: Record<string, number> = {};
    const capacities: Record<string, number> = {};
    graph.edges!.forEach(e => {
        capacities[getDirectedEdgeKey(e.from, e.to)] = e.weight;
        flows[getDirectedEdgeKey(e.from, e.to)] = 0;
        flows[getDirectedEdgeKey(e.to, e.from)] = 0;
    });

    let totalFlow = 0;
    let phase = 1;

    const createStep = (desc: string, path: string[] | null = null, currentPhase: number = phase) => {
        steps.push({
            description: desc,
            currentNode: null,
            highlightedPath: path || undefined,
            flows: { ...flows },
            dataStructure: [`${currentPhase}`, `Flow: ${totalFlow}`],
        });
    };

    while (true) {
        // 1. Build level graph using BFS
        const levels: Record<string, number> = {};
        const queue: string[] = [startNode];
        levels[startNode] = 0;
        let head = 0;
        while(head < queue.length) {
            const u = queue[head++];
            for(const v of graph.nodes.map(n => n.id)) {
                if(!levels.hasOwnProperty(v) && ((capacities[getDirectedEdgeKey(u, v)] || 0) - flows[getDirectedEdgeKey(u, v)] > 0)) {
                    levels[v] = levels[u] + 1;
                    queue.push(v);
                }
            }
        }

        if (!levels.hasOwnProperty(endNode)) {
            createStep("Sink is not reachable. Algorithm complete.", null, phase - 1);
            break; // No more augmenting paths
        }
        
        createStep(`Phase ${phase}: Built level graph. Sink is at level ${levels[endNode]}.`);

        // 2. Find blocking flow using DFS
        const dfs = (u: string, pushed: number): number => {
            if (pushed === 0 || u === endNode) {
                return pushed;
            }
            
            for (const v of graph.nodes.map(n => n.id)) {
                const residual = (capacities[getDirectedEdgeKey(u, v)] || 0) - flows[getDirectedEdgeKey(u, v)];
                if (levels[v] !== levels[u] + 1 || residual === 0) {
                    continue;
                }
                
                const tr = dfs(v, Math.min(pushed, residual));
                if (tr > 0) {
                    flows[getDirectedEdgeKey(u, v)] += tr;
                    flows[getDirectedEdgeKey(v, u)] -= tr;
                    return tr;
                }
            }
            return 0;
        };

        let pushed;
        while (pushed = dfs(startNode, Infinity)) {
            totalFlow += pushed;
            createStep(`Found path in level graph, pushed ${pushed} flow. Total: ${totalFlow}`);
        }
        
        phase++;
    }

    return steps;
};
