
# GraphLab: An Interactive Journey into Graph Theory

![alt text](https://img.shields.io/badge/Made%20with-Gemini-blue.svg)
![alt text](https://img.shields.io/badge/License-Apache%202.0-blue.svg)
![alt text](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

GraphLab is an interactive web application designed to make learning graph theory and algorithms intuitive and engaging. It provides step-by-step visualizations for a wide range of algorithms, from basic traversals to advanced topics like maximum flow and minimum spanning trees. For concepts without a custom animation, it leverages the **Google Gemini API** to generate clear, concise explanations, complete with real-world analogies and code examples.

Whether you're a student, a self-taught developer, or a seasoned engineer looking to refresh your knowledge, GraphLab provides the visual and conceptual tools you need to master graph theory.

<img width="1636" height="3165" alt="screencapture-localhost-3000-2025-11-09-20_46_41" src="https://github.com/user-attachments/assets/aea744d3-6957-46e7-a0a1-caf5a5cd79e1" />
<img width="1925" height="1261" alt="Screenshot at Nov 09 20-48-10" src="https://github.com/user-attachments/assets/f0f9885b-1853-4663-8e68-85659f08ac41" />

https://github.com/user-attachments/assets/8a8c9541-1899-4c82-84a1-60c27c4e73c6



## ✨ Key Features

-   **Interactive Visualizations:** Watch algorithms unfold step-by-step with intuitive animations. Control the pace with play, pause, next, and previous buttons.
-   **Side-by-Side Comparisons:** Understand the nuanced differences between related algorithms like BFS vs. DFS and Prim's vs. Kruskal's with synchronized, side-by-side animations.  
-   **Gemini-Powered Explanations:** For topics without a dedicated animation, the Gemini API generates high-quality, easy-to-understand explanations covering the "what," "why," and "how," including complexity analysis and code examples.
-   **Wide Range of Topics:** Covers over 70 topics across basics, traversals, cycle detection, shortest paths, MST, topological sorting, connectivity, and maximum flow.
-   **Responsive Design:** Learn on the go with a mobile-friendly interface that works great on any device.
-   **Client-Side & Serverless:** The entire application runs in your browser. No backend required!
    

## 📚 Topics Covered

GraphLab provides animations and explanations for a wide array of topics, including:

-   **Basics:** Graph Representations
-   **BFS & DFS:** Traversals, Number of Islands, Bipartite Check, Word Ladder, and more.
-   **Cycles:** Cycle detection in directed and undirected graphs, Bellman-Ford for negative cycles.
-   **Shortest Path:** Dijkstra's, Bellman-Ford, Floyd-Warshall, 0-1 BFS, and algorithms for DAGs.
-   **Minimum Spanning Tree (MST):** Prim's, Kruskal's, Borůvka's, and various applications.
-   **Topological Sorting:** Kahn's Algorithm, DFS-based sorting, and applications like finding an itinerary.
-   **Connectivity:** Articulation Points, Bridges, Strongly Connected Components (Kosaraju's & Tarjan's). 
-   **Maximum Flow:** Ford-Fulkerson, Dinic's Algorithm, Push-Relabel, and applications like Bipartite Matching.
    

...and many more!

## 🛠️ Technology Stack

-   **Frontend:**  [React](https://react.dev) with [TypeScript](https://www.typescriptlang.org)
-   **Styling:**  [Tailwind CSS](https://tailwindcss.com)
-   **AI Model:**  [Google Gemini API](https://ai.google.dev) (@google/genai)
-   **Build Tool:** Vite (or similar modern bundler)

## 🚀 Getting Started

You can run your own instance of GraphLab locally.

### Prerequisites

-   [Node.js](https://nodejs.org) (v18 or later)
-   A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    

### Installation

1.  **Clone the repository:**
    
    codeBash
    
    ```
    git clone https://github.com/google-gemini/generative-ai-samples.git
    cd generative-ai-samples/graph-theory-visualizer
    ```
    
2.  **Install dependencies:**
    
    codeBash
    
    ```
    npm install
    ```
    
3.  **Set up your API Key:**  
    Create a file named .env in the root of the project and add your Gemini API key:
    
    codeCode
    
    ```
    API_KEY=YOUR_GEMINI_API_KEY
    ```
    
4.  **Run the development server:**
    
    codeBash
    
    ```
    npm start
    ```
    
    The application should now be running on http://localhost:5173.
    

## 🤖 How It Works

GraphLab uses a hybrid approach to content delivery:

1.  **Pre-built Animations:** For core algorithms, the application uses pre-defined generateSteps functions (found in /lib/animations). Each function takes a graph as input and outputs a deterministic array of Step objects. The UI then iterates through this array to render the animation, ensuring consistent and accurate visualizations.
    
2.  **Dynamic Explanations with Gemini:** When a user selects a topic that doesn't have a pre-built animation, the app makes a call to the Gemini API. It uses a structured prompt (in /services/geminiService.ts) to request an explanation formatted in Markdown, which includes a simple definition, a real-world analogy, complexity analysis, and a code example. This allows the project to have comprehensive coverage without needing to manually create content for every single topic.
    

## 🤝 Contributing

Contributions are welcome! Whether you want to add a new algorithm visualization, fix a bug, improve the UI, or enhance an explanation, please feel free to fork the repository and submit a pull request.
