import type { GraphData, Step } from './types';

const startWord = "CAT";
const endWord = "DOG";
const wordList = ["CAT", "COT", "COG", "DOG", "CAG", "DAG"];

const buildGraph = () => {
  const uniqueWords = Array.from(new Set([startWord, endWord, ...wordList]));
  const nodes = uniqueWords.map((word, i) => ({
    id: word,
    x: 100 + (i % 3) * 220 + (Math.floor(i / 3) % 2 * 110),
    y: 100 + Math.floor(i / 3) * 120,
  }));
  const adj: Record<string, string[]> = {};
  uniqueWords.forEach(word => adj[word] = []);

  for (let i = 0; i < uniqueWords.length; i++) {
    for (let j = i + 1; j < uniqueWords.length; j++) {
      const w1 = uniqueWords[i];
      const w2 = uniqueWords[j];
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

export const dataStructureName = 'Queue of Chains';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Shortest Chain to Reach Target Word</h3>
  <p>
    Given a starting word and a target word, the objective is to find the shortest "chain" of words to transform the start into the target. In each step of the chain, only one letter can be changed, and every word in the chain must be a valid word from a given dictionary.
  </p>
  <p>
    This problem is a perfect example of a shortest path problem on an unweighted graph. We can imagine each word as a node in a graph, with an edge connecting two words if they differ by just one letter. The solution is then found using a <strong>Breadth-First Search (BFS)</strong>, which guarantees finding the path with the fewest steps.
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

  createStep(`Start BFS from "${startWord}". Add the initial chain to the queue.`, [startWord]);

  while (queue.length > 0) {
    const currentPath = queue.shift()!;
    const currentWord = currentPath[currentPath.length - 1];
    
    createStep(`Dequeue chain [${currentPath.join('→')}]. Current word is "${currentWord}".`, currentPath);

    if (currentWord === endWord) {
      createStep(`Found the target word "${endWord}"! Shortest chain: [${currentPath.join('→')}].`, currentPath);
      return steps;
    }

    for (const neighbor of graphData.adj[currentWord]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        const newPath = [...currentPath, neighbor];
        queue.push(newPath);
        createStep(`Explore neighbor "${neighbor}". Add new chain [${newPath.join('→')}] to queue.`, newPath, neighbor);
      }
    }
  }

  createStep(`Queue is empty, but target word was not found. No such chain exists.`, []);
  return steps;
};