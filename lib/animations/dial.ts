import type { GraphData, Step } from './types';

export const graphData: GraphData = {
  nodes: [
    { id: 'A', x: 100, y: 200 },
    { id: 'B', x: 250, y: 100 },
    { id: 'C', x: 250, y: 300 },
    { id: 'D', x: 450, y: 100 },
    { id: 'E', x: 450, y: 300 },
    { id: 'F', x: 600, y: 200 },
  ],
  adj: { 'A': ['B', 'C'], 'B': ['D'], 'C': ['B', 'E'], 'D': ['F'], 'E': ['D', 'F'], 'F': [] },
  edges: [
    { from: 'A', to: 'B', weight: 2 },
    { from: 'A', to: 'C', weight: 4 },
    { from: 'B', to: 'D', weight: 3 },
    { from: 'C', to: 'B', weight: 1 },
    { from: 'C', to: 'E', weight: 2 },
    { from: 'D', to: 'F', weight: 1 },
    { from: 'E', to: 'D', weight: 1 },
    { from: 'E', to: 'F', weight: 5 },
  ],
  directed: true,
};

export const dataStructureName = 'Current Bucket';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">What is Dial's Algorithm?</h3>
  <p>
    Dial's algorithm is an optimized version of Dijkstra's algorithm for finding the single-source shortest paths. It is particularly efficient when edge weights are small integers, with a maximum weight of <strong>W</strong>.
  </p>
  <p>
    Instead of a priority queue, Dial's algorithm uses an array of buckets (or lists), where each bucket <code>B[i]</code> stores vertices whose current shortest distance from the source is <code>i</code>. The algorithm processes buckets in increasing order of distance. When a node's distance is updated, it's moved to the appropriate new bucket. This avoids the overhead of a priority queue when the range of edge weights is small.
  </p>
`;

export const generateSteps = (graph: GraphData, startNode: string = 'A'): Step[] => {
  const steps: Step[] = [];
  const distances: Record<string, number | '∞'> = {};
  const maxWeight = Math.max(...graph.edges!.map(e => e.weight));
  const numVertices = graph.nodes.length;
  const maxDist = (numVertices - 1) * maxWeight;
  const buckets: string[][] = Array.from({ length: maxDist + 1 }, () => []);

  graph.nodes.forEach(node => { distances[node.id] = '∞'; });
  distances[startNode] = 0;
  buckets[0].push(startNode);

  const copyBuckets = (b: string[][]) => b.map(bucket => [...bucket]);

  steps.push({
    description: `Initialize distances. Add start node ${startNode} to bucket 0.`,
    currentNode: startNode,
    distances: { ...distances },
    buckets: copyBuckets(buckets),
    currentBucket: 0,
  });

  let currentBucketIndex = 0;
  while(currentBucketIndex <= maxDist) {
    if (buckets[currentBucketIndex].length === 0) {
      currentBucketIndex++;
      continue;
    }

    const u = buckets[currentBucketIndex].shift()!;
    steps.push({
      description: `Processing node ${u} from bucket ${currentBucketIndex}.`,
      currentNode: u,
      distances: { ...distances },
      buckets: copyBuckets(buckets),
      currentBucket: currentBucketIndex,
    });

    for (const v of graph.adj[u] || []) {
      const edge = graph.edges!.find(e => e.from === u && e.to === v)!;
      const weight = edge.weight;
      const oldDistV = distances[v];
      const newDistV = (distances[u] as number) + weight;

      if (oldDistV === '∞' || newDistV < oldDistV) {
        if (oldDistV !== '∞') {
          // Remove from old bucket
          const oldBucket = buckets[oldDistV as number];
          buckets[oldDistV as number] = oldBucket.filter(node => node !== v);
        }
        
        distances[v] = newDistV;
        buckets[newDistV].push(v);

        steps.push({
          description: `Updated distance of ${v} to ${newDistV}. Moved it to bucket ${newDistV}.`,
          currentNode: u,
          neighbor: v,
          distances: { ...distances },
          highlightedEdge: edge,
          buckets: copyBuckets(buckets),
          currentBucket: currentBucketIndex,
        });
      }
    }
  }

  steps.push({
    description: "Algorithm complete. All buckets are empty.",
    currentNode: null,
    distances: { ...distances },
    buckets: copyBuckets(buckets),
  });
  
  return steps;
};
