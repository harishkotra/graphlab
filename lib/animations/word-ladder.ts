import type { GraphData, Step } from './types';

const startWord = "HIT";
const endWord = "COG";
const wordList = ["HOT", "DOT", "DOG", "LOT", "LOG", "COG", "HIT"];

// Pre-build the graph for visualization
const buildGraph = () => {
  const nodes = wordList.map((word, i) => ({
    id: word,
    x: 100 + (i % 3) * 220 + (Math.floor(i / 3) % 2 * 110),
    y: 100 + Math.floor(i / 3) * 120,
  }));
  const adj: Record<string, string[]> = {};
  wordList.forEach(word => adj[word] = []);

  for (let i = 0; i < wordList.length; i++) {
    for (let j = i + 1; j < wordList.length; j++) {
      const w1 = wordList[i];
      const w2 = wordList[j];
      let diff = 0;
      for (let k = 0; k < w1.length; k++) {
        if (w1[k] !== w2[k]) diff++;
      }
      if (diff === 1) {
        adj[w1].push(w2);
        adj[w2].push(w1);
      }
    }
  }
  return { nodes, adj };
}

export const graphData: GraphData = buildGraph();

export const dataStructureName = 'Queue of Paths';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Word Ladder Problem</h3>
  <p>
    Given a start word, an end word, and a dictionary, the goal is to find the shortest sequence of transformations from the start to the end word. Each transformation can only change one letter, and every intermediate word must exist in the dictionary.
  </p>
  <p>
    This problem can be modeled as finding the shortest path in an unweighted graph, where words are nodes and an edge exists between two words if they differ by a single letter. <strong>Breadth-First Search (BFS)</strong> is the perfect algorithm for this. We explore paths level by level, guaranteeing that the first time we reach the end word, it will be via a shortest path.
  </p>
`;

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  const queue: string[][] = [[startWord]];
  const visited = new Set<string>([startWord]);

  const createStep = (desc: string, currentPath: string[] = [], neighbor: string | null = null) => {
    steps.push({
      description: desc,
      currentNode: currentPath[currentPath.length - 1] || null,
      neighbor: neighbor,
      visited: new Set(visited),
      dataStructure: queue.map(p => `[${p.join('→')}]`),
      highlightedPath: currentPath,
    });
  };

  createStep(`Start BFS from "${startWord}". Add the initial path to the queue.`, [startWord]);

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const currentWord = currentPath[currentPath.length - 1];
    
    createStep(`Dequeue path [${currentPath.join('→')}]. Current word is "${currentWord}".`, currentPath);

    if (currentWord === endWord) {
      createStep(`Found the end word "${endWord}"! Shortest path is [${currentPath.join('→')}].`, currentPath);
      return steps;
    }

    for (const neighbor of graphData.adj[currentWord]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        const newPath = [...currentPath, neighbor];
        queue.push(newPath);
        createStep(`Explore neighbor "${neighbor}". Add new path [${newPath.join('→')}] to queue.`, newPath, neighbor);
      }
    }
  }

  createStep(`Queue is empty, but end word was not found. No path exists.`, []);
  return steps;
};
