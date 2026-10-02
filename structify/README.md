# Structify - Complete Interactive Data Structures & Algorithms Studio

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](#)
[![HTML5](https://img.shields.io/badge/HTML5-Modern_Semantic-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-Obsidian_Glass-1572B6?logo=css3&logoColor=white)](#)
[![Dependencies](https://img.shields.io/badge/Dependencies-Zero_External-brightgreen)](#)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#)

Structify is an all-in-one interactive platform providing real-time graphical visualizations, step-by-step paced animations, multi-sensory sound feedback, and an embedded AI Copilot for every major computer science data structure and algorithm.

Built with pure vanilla HTML5, CSS3, and JavaScript, Structify runs 100% client-side with zero external build tools, zero dependencies, and instant startup right off disk.

---

## Key Highlights

- **Complete Data Structure Catalog**: 10 Basic Structures, 10 Trees & Hierarchies, Network Graphs with multiple representations, and classic Sorting & Searching algorithms.
- **Embedded AI Copilot & Algorithmic Assistant**:
  - Natural language commands (*"Insert 25, 50, 75"*, *"Search 42"*, *"Run BFS from A"*, *"Run QuickSort"*).
  - Real-time architectural telemetry (memory consumption, tree height, balance factor, graph density, inversion counter).
  - Dynamic interactive DSA quizzes with instant answer feedback and pedagogical explanations.
  - Multi-language code generator for Python, C++, Java, and JavaScript with 1-click clipboard copy.
- **Multi-Sensory Audio Synthesis**: Dynamic sound feedback powered by the Web Audio API with pitch modulated by element values.
- **Paced Animation Engine**: Global speed controls (`0.25x Very Slow`, `0.5x Slow (Recommended)`, `1.0x Normal`, `1.5x Fast`).
- **Universal Dataset Configuration**: Adjust data size and load custom comma/whitespace-separated datasets across every structure.
- **Cyber-Aurora Obsidian Glass Aesthetic**: Modern high-contrast dark theme with glowing state highlights (comparing, swapping, sorted, visited).

---

## Comprehensive Structure Catalog

### 1. Basic Structures
- **Array (Fixed)**: Indexed contiguous memory sequence. Direct O(1) index access, linear search, and element insertion/deletion.
- **Dynamic Array**: Resizable sequence (Python list / JS array model) with automatic capacity doubling (4 -> 8 -> 16), size tracking, and amortized O(1) appends.
- **Singly Linked List**: Linear node chain with `[ data | next ]` pointers. O(1) head/tail insertions and sequential traversal.
- **Doubly Linked List**: Bidirectional node chain `<- [ prev | data | next ] ->` with constant-time deletions.
- **Stack (LIFO)**: Vertical beaker visualization enforcing Last-In, First-Out operations (`Push`, `Pop`, `Peek`, `Clear`).
- **Queue (FIFO)**: Horizontal conveyor track enforcing First-In, First-Out operations (`Enqueue`, `Dequeue`, `Front`, `Rear`).
- **Deque (Double-Ended Queue)**: High-performance generalized queue supporting insertions and removals at both ends (`Push Front`, `Push Rear`, `Pop Front`, `Pop Rear`).
- **Hash Table / Hash Map**: Direct key-value lookup using hash function distribution across buckets with visual linked-list collision chaining.
- **Set**: Collection of unique values enforcing set theory and rejecting duplicates with visual warning highlights.
- **Map / Dictionary**: Key-value associative array for structured entity lookups.

### 2. Trees & Hierarchical Structures
- **General Tree (N-Ary)**: Arbitrary tree structure where parent nodes can have variable counts of children.
- **Binary Tree**: Tree where every node has at most two children (`left`, `right`). Traversal support for Preorder, Inorder, and Postorder.
- **Binary Search Tree (BST)**: Ordered binary tree where left < node < right. Dynamic insertion, search path highlighting, and key deletion.
- **Self-Balancing Search Tree (AVL)**: Real-time balance factor tracking with automatic single and double rotations (LL, RR, LR, RL).
- **Heap (Min / Max)**: Complete binary tree stored inside an array with visual bubble-up / bubble-down heapify and synchronized flat array representation.
- **Trie (Prefix Tree)**: Character-based retrieval tree for dictionary words with prefix branch sharing and terminal word markers.
- **B-Tree**: Multi-key balanced tree blocks (order M=3) designed for database indexing.
- **Segment Tree**: Binary tree built over intervals for O(log n) range sum queries and point updates.
- **Fenwick Tree (Binary Indexed Tree / BIT)**: 1D array prefix sum structure powered by bitwise `i & (-i)` manipulation.
- **Syntax Tree / Abstract Syntax Tree (AST)**: Visualizes parsing and evaluation of expressions from leaf operands up to operator roots.

### 3. Graphs & Network Topologies
- **Graph Modes**:
  - Directed vs. Undirected toggle (with directional SVG arrowheads).
  - Weighted vs. Unweighted toggle (with numerical edge weights).
- **Synchronized Graph Representations**:
  - **Adjacency List**
  - **Adjacency Matrix** (interactive table grid)
  - **Edge List**
- **Graph Algorithms**:
  - **BFS (Breadth-First Search)**: Queue-driven level-order traversal.
  - **DFS (Depth-First Search)**: Stack-driven recursive depth traversal.
  - **Dijkstra's Algorithm**: Single-source shortest path calculation with live cost table and path readout.

### 4. Algorithms Suite
- **Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort with real-time bar animations, comparison highlights, and swap counters.
- **Searching Algorithms**: Linear Search (unordered arrays) and Binary Search (sorted arrays with boundary halving highlights).

---

## Structify AI Copilot

The embedded **Structify AI Copilot** acts as a personal tutor and automation engine:

1. **Text-to-DSA Natural Language Execution**:
   - `Insert 15, 30, 45, 60` -> Parses and injects elements into the active structure.
   - `Search 42` -> Triggers visual step-by-step search path.
   - `Pop element` -> Executes top removal on Stack or front on Queue.
   - `Run QuickSort` / `Run MergeSort` -> Switches to sorting studio and executes the algorithm.
   - `Run BFS from A` -> Executes Breadth-First Search on the graph.
   - `Switch to AVL Tree` -> Navigates between categories and structures instantly.
2. **Real-Time Architectural Telemetry**:
   - Computes node counts, memory byte approximations, tree height vs. theoretical ideal, graph density, and sorting inversions.
3. **Interactive DSA Quiz**:
   - Generates contextual questions based on the active structure with instant validation and explanations.
4. **Production Code Generator**:
   - Ready-to-run implementations in Python, C++, Java, and JavaScript with 1-click clipboard copy.

---

## Quick Start / How to Run

Structify requires **zero installations, zero build steps, and zero dependencies**.

### Option 1: 1-Click Windows Launcher
Double-click `run.bat` in the project root to open Structify immediately in your default browser.

### Option 2: Direct File Open (Any OS)
Simply double-click `index.html` or open it directly in any modern browser:
```text
file:///path/to/structify/index.html
```

### Option 3: Local HTTP Server (Optional)
Run the included PowerShell server script:
```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```
Then navigate to:
```text
http://localhost:5000/
```

### Option 4: Python HTTP Server (Optional)
```bash
python -m http.server 5000
```

---

## Project Structure

```text
structify/
|-- index.html        # Semantic HTML5 application shell & viewports
|-- styles.css        # Cyber-Aurora Obsidian Glass theme & responsive layout
|-- app.js            # Core visualization engine, SVG rendering, and AI Copilot
|-- run.bat           # 1-Click Windows launcher script
|-- serve.ps1         # Resilient, non-blocking local HTTP server
\-- README.md         # Comprehensive project documentation
```

---

## Tech Stack & Architecture

- **Markup**: Pure Semantic HTML5 with SVG integration for vector graph lines, tree edges, and directional markers.
- **Styling**: Modern CSS3 using Flexbox, CSS Grid, custom properties (variables), backdrop filters, and CSS keyframe animations.
- **Scripting**: Pure Vanilla JavaScript (ES6+) utilizing asynchronous generator loops for stepping, promises for sleep pacing, and regular expressions for natural language parsing.
- **Audio**: Web Audio API oscillator synthesis generating tones dynamically modulated by numeric values.

---

## Browser Compatibility

Compatible with all modern browsers supporting ES6+ and Web Audio API:
- Google Chrome (Desktop & Android)
- Microsoft Edge
- Mozilla Firefox
- Safari (macOS & iOS)
- Brave / Opera

---

## License

This project is licensed under the MIT License - feel free to use, modify, and distribute for personal, educational, or commercial projects.
