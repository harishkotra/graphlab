// A simple Priority Queue implementation for Dijkstra's algorithm.
export class PriorityQueue<T> {
  private elements: { element: T; priority: number }[];

  constructor() {
    this.elements = [];
  }

  enqueue(element: T, priority: number) {
    this.elements.push({ element, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): { element: T; priority: number } | undefined {
    return this.elements.shift();
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }

  toStringArray(): string[] {
      return this.elements.map(item => `${item.element}(${item.priority})`);
  }
}

// A Disjoint Set Union (DSU) or Union-Find implementation for Kruskal's algorithm.
export class DisjointSet {
  private parent: Record<string, string>;

  constructor(elements: string[]) {
    this.parent = {};
    elements.forEach(e => (this.parent[e] = e));
  }

  // Find the root of the set containing element 'i' with path compression.
  // FIX: Modify find to accept an optional path array for visualization.
  find(i: string, path?: string[]): string {
    if (path) path.push(i);
    if (this.parent[i] === i) {
      return i;
    }
    const root = this.find(this.parent[i], path); // Path compression
    this.parent[i] = root;
    return root;
  }

  // Union of two sets.
  union(i: string, j: string) {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootJ] = rootI;
    }
  }

  getSets(): Record<string, string> {
      const sets: Record<string, string> = {};
      for(const key in this.parent) {
          sets[key] = this.find(key);
      }
      return sets;
  }
  
  // FIX: Add getRawParent to expose parent mapping for visualization.
  getRawParent(): Record<string, string> {
      return this.parent;
  }
}