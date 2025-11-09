export interface Node {
  id: string;
  x: number;
  y: number;
  row?: number; // For grid layouts
  col?: number; // For grid layouts
}

export interface Edge {
    from: string;
    to: string;
    weight: number;
    type?: 'snake' | 'ladder';
}

export interface GraphData {
  nodes: Node[];
  adj: Record<string, string[]>;
  edges?: Edge[]; // For weighted graphs
  directed?: boolean;
  layout?: 'force' | 'grid' | 'tree'; // Specify layout type
  grid?: (number | string)[][]; // For grid-based problems
}

export interface Step {
  dataStructure?: string[]; // Can be a queue, stack, priority queue, etc. Formatted as strings.
  visited?: Set<string>;
  currentNode: string | null;
  neighbor?: string | null; // A neighbor being explored from currentNode
  description: string;
  
  // For Shortest Path algorithms
  distances?: Record<string, number | '∞'>;
  
  // For MST algorithms
  highlightedEdge?: Edge | null;
  mstEdges?: Set<string>; // Key format: 'A-B' (sorted node ids)

  // For DSU-based algorithms (like Kruskal's or DSU visualization)
  nodeSets?: Record<string, string>; // Map node ID to its set's root ID

  // For All-Pairs Shortest Path (Floyd-Warshall)
  distanceMatrix?: (string | number)[][];
  matrixHighlights?: { k: number, i: number, j: number } | null;

  // For cycle detection and other state-based visualizations
  nodeColors?: Record<string, 'white' | 'gray' | 'black' | 'color1' | 'color2' | 'uncolored'>;
  highlightedPath?: string[]; // To show the current DFS path
  highlightedCycle?: string[]; // To highlight the detected cycle
  conflictingEdge?: { from: string, to: string } | null; // For bipartite check

  // For Grid-based problems
  cellColors?: Record<string, string>; // e.g., {'0-1': '#ff0000'}

  // For Transitive Closure
  reachabilityMatrix?: (0 | 1)[][];

  // For Clone Graph
  cloneMap?: [string, string][];

  // For Dial's Algorithm
  buckets?: string[][];
  currentBucket?: number;
  
  // For Flow Networks
  flows?: Record<string, number>; // Key format 'U-V'
  
  // For Push-Relabel
  nodeHeights?: Record<string, number>;
  excessFlows?: Record<string, number>;

  // For Min-Cut
  cutSetS?: Set<string>;

  // For dynamic graphs (Karger's)
  supernodes?: Record<string, string[]>; // Maps a representative node ID to the list of original nodes it contains
  graphData?: GraphData;

  // For Bridges, Articulation Points, Tarjan's
  discoveryTime?: Record<string, number>;
  lowLink?: Record<string, number>;

  // For "Maximum edges to add to DAG"
  addedEdges?: Set<string>; // Key format: 'A->B'
}


export interface AnimationData {
    description: string;
    graphData: GraphData;
    steps: Step[];
    dataStructureName: string;
    nodeIndexMap?: Record<string, number>; // Maps node ID to matrix index
}

export interface ComparisonAnimationData {
    bfs: AnimationData;
    dfs: AnimationData;
    description: string;
}

export interface MSTComparisonData {
    prims: AnimationData;
    kruskals: AnimationData;
    description: string;
}