import type { GraphData, Step } from './types';

const strings = ["AB", "BC", "CA"];

const buildGraph = () => {
    const nodesSet = new Set<string>();
    strings.forEach(s => {
        nodesSet.add(s[0]);
        nodesSet.add(s[s.length - 1]);
    });

    const nodes = Array.from(nodesSet).map((char, i) => ({
        id: char,
        x: 325 + 150 * Math.cos(2 * Math.PI * i / nodesSet.size),
        y: 200 + 150 * Math.sin(2 * Math.PI * i / nodesSet.size),
    }));

    const adj: Record<string, string[]> = {};
    nodes.forEach(n => adj[n.id] = []);
    const edges = strings.map(s => {
        const from = s[0];
        const to = s[s.length - 1];
        adj[from].push(to);
        return { from, to, weight: 1 };
    });

    return { nodes, adj, edges };
}

export const graphData: GraphData = buildGraph();

export const dataStructureName = 'In-Degree == Out-Degree?';

export const description = `
  <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Chained Strings to Form a Circle</h3>
  <p>
    Given an array of strings, can they be chained together to form a circle? A circle is formed if the last character of a string is the same as the first character of the next string, and the last character of the last string is the same as the first of the first.
  </p>
  <p>
    This problem can be modeled as finding an <strong>Eulerian Circuit in a directed graph</strong>. We can think of the first and last characters of the strings as vertices. Each string represents a directed edge from its first character to its last character.
  </p>
  <p>A circle can be formed if and only if the constructed graph has an Eulerian circuit, which means every vertex must have an equal in-degree and out-degree (and be strongly connected).</p>
`;

export const generateSteps = (): Step[] => {
  const steps: Step[] = [];
  
  steps.push({
    description: `Given strings: [${strings.join(', ')}]. Construct a graph.`,
    currentNode: null,
    dataStructure: strings,
  });

  steps.push({
    description: "Vertices are the first/last characters. Edges are the strings.",
    currentNode: null,
    dataStructure: strings,
  });

  const inDegree: Record<string, number> = {};
  const outDegree: Record<string, number> = {};
  graphData.nodes.forEach(n => {
    inDegree[n.id] = 0;
    outDegree[n.id] = (graphData.adj[n.id] || []).length;
  });
  graphData.edges!.forEach(e => { inDegree[e.to]++; });

  let allMatch = true;
  for (const node of graphData.nodes) {
    if (inDegree[node.id] !== outDegree[node.id]) {
      allMatch = false;
      break;
    }
  }

  const degreeData = graphData.nodes.map(n => `${n.id}: In(${inDegree[n.id]}), Out(${outDegree[n.id]})`);

  steps.push({
    description: "Check if in-degree equals out-degree for all vertices.",
    currentNode: null,
    dataStructure: degreeData,
  });

  if (allMatch) {
    steps.push({
      description: "Condition met! The strings can form a circle.",
      currentNode: null,
      dataStructure: ["Yes"],
      highlightedPath: ['A', 'B', 'C', 'A'], // Show the cycle
    });
  } else {
    steps.push({
      description: "Degrees do not match. The strings cannot form a circle.",
      currentNode: null,
      dataStructure: ["No"],
    });
  }

  return steps;
};