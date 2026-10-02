/**
 * STRUCTIFY - All-in-One Data Structures & Algorithms Studio
 * Complete Visualizations, Real SVG Graphs, and Step-by-Step Animations.
 * 100% Clean ASCII - Zero non-standard characters.
 */

// ==========================================================================
// --- UTILITIES, SPEED CONTROL & SOUND CONTROLLER --------------------------
// ==========================================================================
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getSpeedDelay(baseMs = 700) {
  const multipliers = {
    very_slow: 2.6, // ~1800ms
    slow: 1.8,      // ~1260ms
    normal: 1.0,    // ~700ms
    fast: 0.5       // ~350ms
  };
  const mult = multipliers[appState.speedMode] || 1.8;
  return Math.round(baseMs * mult);
}

function getAlgoDelay() {
  const speeds = {
    very_slow: 550,
    slow: 320,
    normal: 180,
    fast: 70
  };
  return speeds[appState.speedMode] || 320;
}

class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(val = 50, maxVal = 100, duration = 0.08) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const minFreq = 180;
      const maxFreq = 880;
      const num = typeof val === 'number' ? val : (String(val).charCodeAt(0) || 50);
      const freq = minFreq + ((Math.min(Math.max(num, 1), maxVal) / maxVal) * (maxFreq - minFreq));

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playSuccess() {
    if (!this.enabled) return;
    try {
      this.playTone(60, 100, 0.1);
      setTimeout(() => this.playTone(85, 100, 0.15), 120);
      setTimeout(() => this.playTone(100, 100, 0.25), 240);
    } catch (e) {}
  }

  playError() {
    if (!this.enabled) return;
    try {
      this.playTone(20, 100, 0.25);
    } catch (e) {}
  }
}

const sound = new SoundController();

// ==========================================================================
// --- STRUCTURE REGISTRY & SPECIFICATIONS ----------------------------------
// ==========================================================================
const STRUCT_DEFINITIONS = {
  basic: [
    { id: "array", name: "Array (Fixed)" },
    { id: "dynarray", name: "Dynamic Array" },
    { id: "sll", name: "Singly Linked List" },
    { id: "dll", name: "Doubly Linked List" },
    { id: "stack", name: "Stack (LIFO)" },
    { id: "queue", name: "Queue (FIFO)" },
    { id: "deque", name: "Deque (Double-Ended)" },
    { id: "hash", name: "Hash Table / Map" },
    { id: "set", name: "Set" },
    { id: "map", name: "Map / Dictionary" }
  ],
  trees: [
    { id: "general_tree", name: "General Tree (N-Ary)" },
    { id: "binary_tree", name: "Binary Tree" },
    { id: "bst", name: "Binary Search Tree" },
    { id: "avl", name: "AVL Tree (Balanced)" },
    { id: "heap", name: "Min / Max Heap" },
    { id: "trie", name: "Trie (Prefix Tree)" },
    { id: "btree", name: "B-Tree" },
    { id: "segtree", name: "Segment Tree" },
    { id: "fenwick", name: "Fenwick Tree (BIT)" },
    { id: "ast", name: "Syntax Tree / AST" }
  ],
  graphs: [
    { id: "graph_studio", name: "Graph Studio (Adj List/Matrix/Edge)" }
  ],
  algorithms: [
    { id: "sorting", name: "Sorting Algorithms" },
    { id: "searching", name: "Searching Algorithms" }
  ]
};

const SPEC_REGISTRY = {
  array: {
    title: "Array (Fixed Size)",
    description: "An indexed, fixed-size contiguous sequence of elements providing direct constant-time access by index.",
    c1: "Access: O(1)", c2: "Search: O(n)", c3: "Insert: O(n)", c4: "Space: O(n)",
    pseudo: `arr = new Array(capacity)
val = arr[index] // O(1)
for i in 0..len: if arr[i] == target: return i // O(n)`
  },
  dynarray: {
    title: "Dynamic Array (Resizable)",
    description: "A resizable sequence backed by an internal array that dynamically doubles its buffer capacity upon reaching overflow.",
    c1: "Amortized Push: O(1)", c2: "Worst Push: O(n)", c3: "Pop: O(1)", c4: "Space: O(n)",
    pseudo: `function append(val):
  if size == capacity:
    capacity *= 2
    allocate new array and copy elements
  arr[size++] = val`
  },
  sll: {
    title: "Singly Linked List",
    description: "A sequence of nodes where each node encapsulates a data value and a single forward reference ('next') pointing to the subsequent node.",
    c1: "Insert Head: O(1)", c2: "Insert Tail: O(n)", c3: "Search: O(n)", c4: "Space: O(n)",
    pseudo: `class Node: val, next
head = Node(val, head) // O(1) prepend
curr = head; while curr: curr = curr.next // O(n) scan`
  },
  dll: {
    title: "Doubly Linked List",
    description: "A bidirectional chain of nodes where each node contains pointers to both its preceding ('prev') and succeeding ('next') nodes.",
    c1: "Insert Head/Tail: O(1)", c2: "Delete Known Node: O(1)", c3: "Search: O(n)", c4: "Space: O(n)",
    pseudo: `class DLLNode: val, prev, next
node.next = head; head.prev = node; head = node`
  },
  stack: {
    title: "Stack (LIFO)",
    description: "A Last-In, First-Out collection supporting constant-time additions and removals strictly at its top terminal.",
    c1: "Push: O(1)", c2: "Pop: O(1)", c3: "Peek: O(1)", c4: "Space: O(n)",
    pseudo: `stack.push(item) // adds to top
topItem = stack.pop() // removes from top`
  },
  queue: {
    title: "Queue (FIFO)",
    description: "A First-In, First-Out sequence where elements are enqueued at the rear and dequeued from the front.",
    c1: "Enqueue: O(1)", c2: "Dequeue: O(1)", c3: "Peek: O(1)", c4: "Space: O(n)",
    pseudo: `queue.enqueue(item) // rear addition
item = queue.dequeue() // front extraction`
  },
  deque: {
    title: "Deque (Double-Ended Queue)",
    description: "A double-ended queue enabling constant-time insertion and deletion at both the front and rear boundaries.",
    c1: "Push Front/Rear: O(1)", c2: "Pop Front/Rear: O(1)", c3: "Peek: O(1)", c4: "Space: O(n)",
    pseudo: `deque.pushFront(val); deque.pushRear(val)
val = deque.popFront(); val = deque.popRear()`
  },
  hash: {
    title: "Hash Table / Hash Map",
    description: "A key-value data structure mapping arbitrary keys to bucket indices using a hash function, resolving collisions via chaining.",
    c1: "Avg Lookup: O(1)", c2: "Worst Lookup: O(n)", c3: "Avg Insert: O(1)", c4: "Space: O(n)",
    pseudo: `idx = hash(key) % numBuckets
bucket = table[idx]
bucket.append({key, value})`
  },
  set: {
    title: "Set (Unique Elements)",
    description: "An unordered collection of unique values where duplicate insertions are strictly forbidden.",
    c1: "Avg Add: O(1)", c2: "Avg Has: O(1)", c3: "Avg Delete: O(1)", c4: "Space: O(n)",
    pseudo: `if not set.has(val):
  set.add(val)`
  },
  map: {
    title: "Map / Dictionary",
    description: "A collection of key-value associations maintaining distinct keys with fast lookup and retrieval.",
    c1: "Avg Get: O(1)", c2: "Avg Set: O(1)", c3: "Avg Delete: O(1)", c4: "Space: O(n)",
    pseudo: `map.set(key, val)
val = map.get(key)`
  },
  general_tree: {
    title: "General Tree (N-Ary)",
    description: "A hierarchical tree structure where any parent node may have zero or more children (arbitrary degree).",
    c1: "Traversal: O(n)", c2: "Search: O(n)", c3: "Degree: Unbounded", c4: "Space: O(n)",
    pseudo: `function preorder(node):
  if not node: return
  visit(node)
  for child in node.children: preorder(child)`
  },
  binary_tree: {
    title: "Binary Tree",
    description: "A hierarchical structure where each node has at most two children, referred to as left and right.",
    c1: "Traversal: O(n)", c2: "Search: O(n)", c3: "Max Degree: 2", c4: "Space: O(n)",
    pseudo: `class Node: val, left, right
inorder(root): inorder(left); visit(root); inorder(right)`
  },
  bst: {
    title: "Binary Search Tree (BST)",
    description: "A binary tree observing the search property: keys in left subtree < root key < keys in right subtree.",
    c1: "Avg Search: O(log n)", c2: "Worst Search: O(n)", c3: "Avg Insert: O(log n)", c4: "Space: O(n)",
    pseudo: `function search(node, key):
  if not node or node.val == key: return node
  if key < node.val: return search(node.left, key)
  return search(node.right, key)`
  },
  avl: {
    title: "AVL Tree (Self-Balancing BST)",
    description: "A self-balancing BST maintaining balance factors {-1, 0, +1} via single (LL, RR) and double (LR, RL) rotations.",
    c1: "Search: O(log n)", c2: "Insert: O(log n)", c3: "Delete: O(log n)", c4: "Balance: Strict",
    pseudo: `balance = height(left) - height(right)
if balance > 1 and key < left.key: return rightRotate(root)
if balance < -1 and key > right.key: return leftRotate(root)`
  },
  heap: {
    title: "Min / Max Binary Heap",
    description: "A complete binary tree backed by a compact array satisfying the heap-order property (Parent <= Child or Parent >= Child).",
    c1: "Find Min/Max: O(1)", c2: "Extract: O(log n)", c3: "Insert: O(log n)", c4: "Build Heap: O(n)",
    pseudo: `parent(i) = floor((i - 1) / 2)
left(i) = 2*i + 1, right(i) = 2*i + 2
heapifyUp(idx), heapifyDown(idx)`
  },
  trie: {
    title: "Trie (Prefix Tree)",
    description: "A specialized search tree where edges represent characters and paths from root spell keys or prefixes.",
    c1: "Insert Word: O(L)", c2: "Search Word: O(L)", c3: "Prefix Match: O(L)", c4: "L: Word Length",
    pseudo: `curr = root
for char in word:
  if char not in curr.children: curr.children[char] = Node()
  curr = curr.children[char]
curr.isEnd = true`
  },
  btree: {
    title: "B-Tree (Multi-Key Balanced Tree)",
    description: "A self-balancing search tree with nodes containing multiple sorted keys, heavily utilized in databases and filesystems.",
    c1: "Search: O(log n)", c2: "Insert: O(log n)", c3: "Disk Optimized: Yes", c4: "Order: m-way",
    pseudo: `scan keys in node; if key found return;
else recurse into appropriate child pointer`
  },
  segtree: {
    title: "Segment Tree",
    description: "A binary tree used for efficient range queries (e.g. range sum, min) and point updates over an array.",
    c1: "Range Query: O(log n)", c2: "Point Update: O(log n)", c3: "Build: O(n)", c4: "Space: O(4n)",
    pseudo: `query(node, l, r, ql, qr):
  if ql <= l and r <= qr: return node.val
  if r < ql or l > qr: return 0
  mid = (l + r) / 2
  return query(left, l, mid, ql, qr) + query(right, mid+1, r, ql, qr)`
  },
  fenwick: {
    title: "Fenwick Tree (Binary Indexed Tree / BIT)",
    description: "An array-backed tree utilizing bitwise operations (i & -i) to achieve prefix sums and point updates in logarithmic time.",
    c1: "Prefix Sum: O(log n)", c2: "Point Update: O(log n)", c3: "Bitwise: i & (-i)", c4: "Space: O(n)",
    pseudo: `function update(i, delta):
  while i <= n: tree[i] += delta; i += (i & -i)
function query(i):
  sum = 0; while i > 0: sum += tree[i]; i -= (i & -i); return sum`
  },
  ast: {
    title: "Syntax Tree / Abstract Syntax Tree (AST)",
    description: "A tree representation of the syntactic structure of source code or mathematical expressions, evaluated bottom-up.",
    c1: "Evaluation: O(n)", c2: "Leaves: Operands", c3: "Nodes: Operators", c4: "Grammar: Context-Free",
    pseudo: `function eval(node):
  if node.isLeaf: return node.val
  l = eval(node.left); r = eval(node.right)
  return applyOp(node.op, l, r)`
  },
  graph_studio: {
    title: "Graph Studio (Representations & Algorithms)",
    description: "A comprehensive environment for directed/undirected, weighted/unweighted graphs with BFS, DFS, and Dijkstra's algorithm.",
    c1: "BFS: O(V + E)", c2: "DFS: O(V + E)", c3: "Dijkstra: O((V+E)logV)", c4: "Space: O(V + E)",
    pseudo: `BFS: Queue traversal level-by-level
DFS: Stack / Recursive depth-first traversal
Dijkstra: Min-Priority Queue for shortest path with positive edge weights`
  },
  sorting: {
    title: "Sorting Algorithms",
    description: "Arranges elements in ascending order with step-by-step bar animations, comparison highlights, and sound feedback.",
    c1: "Bubble: O(n^2)", c2: "Selection: O(n^2)", c3: "Insertion: O(n^2)", c4: "Merge/Quick: O(n log n)",
    pseudo: `bubbleSort(arr), selectionSort(arr), insertionSort(arr), mergeSort(arr), quickSort(arr)`
  },
  searching: {
    title: "Searching Algorithms",
    description: "Locates a target element within an array using Linear Search or Binary Search (on sorted data).",
    c1: "Linear: O(n)", c2: "Binary: O(log n)", c3: "Space: O(1)", c4: "Binary: Sorted",
    pseudo: `linearSearch(arr, target)
binarySearch(sortedArr, target)`
  }
};

// ==========================================================================
// --- GLOBAL APPLICATION STATE ---------------------------------------------
// ==========================================================================
const appState = {
  currentCategory: 'basic',
  currentStructure: 'array',
  soundEnabled: true,
  isAnimating: false,
  speedMode: 'slow', // 'very_slow', 'slow', 'normal', 'fast'

  // Basic Structures Storage
  arrayData: [15, 28, 42, 63, 77, 85, 91, 0],
  arraySize: 7,
  arrayCap: 8,

  dynArrayData: [10, 20, 30],
  dynArrayCap: 4,

  sllNodes: [12, 34, 56, 78],
  dllNodes: [10, 25, 45, 70],

  stackItems: [15, 30, 45, 60],
  stackCap: 8,

  queueItems: [11, 22, 33, 44],
  queueCap: 8,

  dequeItems: [5, 15, 25, 35],
  dequeCap: 8,

  hashBuckets: [[{k: "id", v: "101"}], [{k: "age", v: "24"}], [], [{k: "zip", v: "94016"}, {k: "cat", v: "pet"}], [], [{k: "val", v: "99"}], [], []],
  numBuckets: 8,

  setItems: [5, 12, 19, 34, 52, 78],
  mapEntries: [["Alice", 95], ["Bob", 88], ["Charlie", 72], ["Diana", 91]],

  // Trees Storage
  bstRoot: null,
  heapData: [90, 80, 70, 50, 60, 40, 30],
  heapType: 'max',
  trieRoot: null,
  segArray: [1, 3, 5, 7, 9, 11],
  fenwickData: [0, 2, 5, 6, 12, 15, 22, 28],
  astTree: null,

  // Graphs Storage
  graphDirected: false,
  graphWeighted: true,
  graphNodes: [
    { id: "A", x: 140, y: 120 },
    { id: "B", x: 300, y: 70 },
    { id: "C", x: 300, y: 240 },
    { id: "D", x: 480, y: 110 },
    { id: "E", x: 480, y: 260 }
  ],
  graphEdges: [
    { u: "A", v: "B", w: 4 },
    { u: "A", v: "C", w: 2 },
    { u: "B", v: "C", w: 1 },
    { u: "B", v: "D", w: 5 },
    { u: "C", v: "D", w: 8 },
    { u: "C", v: "E", w: 10 },
    { u: "D", v: "E", w: 2 }
  ],
  activeGraphRepr: 'adjList',

  // Algorithms Storage
  algoArray: [],
  algoGenerator: null,
  algoRunning: false,
  algoComparisons: 0,
  algoSwaps: 0,
  algoType: 'bubble',
  algoTarget: 42,
  algoSpeed: 320,
  algoTimer: null
};

// ==========================================================================
// --- CORE INITIALIZATION & NAVIGATION -------------------------------------
// ==========================================================================
function initApp() {
  initCategories();
  initSoundButton();
  initSpeedControl();
  initAiCopilot();
  switchCategory('basic');
}

function initSpeedControl() {
  const sel = document.getElementById('globalSpeedSelect');
  if (sel) {
    sel.value = appState.speedMode;
    sel.addEventListener('change', (e) => {
      appState.speedMode = e.target.value;
      appState.algoSpeed = getAlgoDelay();
      sound.playTone(55, 100, 0.05);
      const label = e.target.options[e.target.selectedIndex].text;
      document.getElementById('statusMessage').textContent = `Animation pace adjusted to: ${label}`;
    });
  }
}

function initCategories() {
  const tabs = document.querySelectorAll('.cat-tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (appState.isAnimating) return;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-cat');
      switchCategory(cat);
      sound.playTone(30, 100, 0.05);
    });
  });
}

function switchCategory(cat) {
  appState.currentCategory = cat;
  const pillsContainer = document.getElementById('structurePills');
  pillsContainer.innerHTML = '';

  const structs = STRUCT_DEFINITIONS[cat] || [];
  structs.forEach((st, idx) => {
    const pill = document.createElement('button');
    pill.className = `struct-pill ${idx === 0 ? 'active' : ''}`;
    pill.textContent = st.name;
    pill.setAttribute('data-id', st.id);
    pill.addEventListener('click', () => {
      if (appState.isAnimating) return;
      document.querySelectorAll('.struct-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      switchStructure(st.id);
      sound.playTone(45, 100, 0.05);
    });
    pillsContainer.appendChild(pill);
  });

  if (structs.length > 0) {
    switchStructure(structs[0].id);
  }
}

function switchStructure(id) {
  appState.currentStructure = id;

  // Stop algorithm runner if active
  if (appState.algoTimer) {
    clearTimeout(appState.algoTimer);
    appState.algoRunning = false;
  }

  // Show/Hide graph representation drawer
  const graphDrawer = document.getElementById('graphReprPanel');
  if (id === 'graph_studio') {
    graphDrawer.style.display = 'flex';
    initGraphReprTabs();
    renderGraphRepr();
  } else {
    graphDrawer.style.display = 'none';
  }

  // Update Specs & Pseudocode
  updateSpecs(id);

  // Render Control Panel & Viewport
  renderControlPanel(id);
  renderViewport(id);

  if (typeof updateAiOnStructureChange === 'function') {
    updateAiOnStructureChange(id);
  }
}

function updateSpecs(id) {
  const spec = SPEC_REGISTRY[id] || SPEC_REGISTRY.array;
  document.getElementById('infoTitle').textContent = spec.title;
  document.getElementById('infoDescription').textContent = spec.description;

  const parts = [spec.c1, spec.c2, spec.c3, spec.c4];
  parts.forEach((p, idx) => {
    const [label, val] = p.split(': ');
    document.getElementById(`compLabel${idx + 1}`).textContent = label + ':';
    document.getElementById(`compVal${idx + 1}`).textContent = val || '-';
  });

  document.getElementById('pseudoCode').textContent = spec.pseudo;
}

function initSoundButton() {
  const btn = document.getElementById('soundToggleBtn');
  const icon = document.getElementById('soundIcon');
  btn.addEventListener('click', () => {
    sound.enabled = !sound.enabled;
    icon.textContent = sound.enabled ? 'Sound: ON' : 'Sound: OFF';
    btn.title = sound.enabled ? 'Sound Enabled' : 'Sound Muted';
  });
}

// ==========================================================================
// --- CONTROL PANEL BUILDER ------------------------------------------------
// ==========================================================================
function getCurrentDataCount(id) {
  switch (id) {
    case 'array': return appState.arraySize;
    case 'dynarray': return appState.dynArrayData.length;
    case 'sll': return appState.sllNodes.length;
    case 'dll': return appState.dllNodes.length;
    case 'stack': return appState.stackItems.length;
    case 'queue': return appState.queueItems.length;
    case 'deque': return appState.dequeItems.length;
    case 'hash': return appState.hashBuckets.reduce((acc, b) => acc + b.length, 0) || 5;
    case 'set': return appState.setItems.length;
    case 'map': return appState.mapEntries.length;
    case 'heap': return appState.heapData.length;
    case 'segtree': return appState.segArray.length;
    case 'fenwick': return 7;
    case 'sorting':
    case 'searching': return appState.algoArray.length || 20;
    case 'bst':
    case 'avl':
    case 'binary_tree': {
      let count = 0;
      const countNodes = (n) => { if (!n) return; count++; countNodes(n.left); countNodes(n.right); };
      countNodes(appState.bstRoot);
      return count || 7;
    }
    default: return 7;
  }
}

function getCurrentDataString(id) {
  switch (id) {
    case 'array': return appState.arrayData.slice(0, appState.arraySize).join(', ');
    case 'dynarray': return appState.dynArrayData.join(', ');
    case 'sll': return appState.sllNodes.join(', ');
    case 'dll': return appState.dllNodes.join(', ');
    case 'stack': return appState.stackItems.join(', ');
    case 'queue': return appState.queueItems.join(', ');
    case 'deque': return appState.dequeItems.join(', ');
    case 'hash': {
      const entries = [];
      appState.hashBuckets.forEach(b => b.forEach(e => entries.push(`${e.k}:${e.v}`)));
      return entries.join(', ');
    }
    case 'set': return appState.setItems.join(', ');
    case 'map': return appState.mapEntries.map(e => `${e[0]}:${e[1]}`).join(', ');
    case 'heap': return appState.heapData.join(', ');
    case 'trie': return 'algo, app, apple, code';
    case 'segtree': return appState.segArray.join(', ');
    case 'fenwick': return appState.fenwickData.slice(1).join(', ');
    case 'sorting':
    case 'searching': return appState.algoArray.join(', ');
    case 'bst':
    case 'avl':
    case 'binary_tree': {
      const vals = [];
      const getInorder = (n) => { if (!n) return; getInorder(n.left); vals.push(n.val); getInorder(n.right); };
      getInorder(appState.bstRoot);
      return vals.join(', ') || '50, 25, 75, 12, 37, 62, 88';
    }
    default: return '15, 28, 42, 63, 77, 85';
  }
}

function getPlaceholderForStructure(id) {
  if (id === 'trie') return 'e.g. apple, code, data, tree, graph';
  if (id === 'hash' || id === 'map') return 'e.g. user:Alice, age:24, zip:94016, cat:pet';
  return 'e.g. 15, 28, 42, 63, 77, 85';
}

function handleLoadCustomData(id, rawStr) {
  if (!rawStr || !rawStr.trim()) {
    document.getElementById('statusMessage').textContent = 'Please enter valid data values!';
    sound.playError();
    return;
  }

  // Key-value pairs for map and hash table
  if (id === 'map' || id === 'hash') {
    const tokens = rawStr.split(/[,\s]+/).filter(Boolean);
    if (id === 'map') {
      appState.mapEntries = tokens.map((t, idx) => {
        if (t.includes(':')) {
          const [k, v] = t.split(':');
          return [k.trim(), v.trim()];
        }
        return [`key${idx + 1}`, t.trim()];
      });
      document.getElementById('statusMessage').textContent = `Loaded ${appState.mapEntries.length} custom key-value entries into Map.`;
      sound.playSuccess();
      renderViewport('map');
      return;
    } else if (id === 'hash') {
      appState.hashBuckets = Array.from({length: appState.numBuckets}, () => []);
      tokens.forEach((t, idx) => {
        let k, v;
        if (t.includes(':')) {
          [k, v] = t.split(':');
        } else {
          k = `key${idx + 1}`;
          v = t;
        }
        let hash = 0;
        for (let i = 0; i < k.length; i++) hash = (hash + k.charCodeAt(i) * 31) % appState.numBuckets;
        appState.hashBuckets[hash].push({k: k.trim(), v: v.trim()});
      });
      document.getElementById('statusMessage').textContent = `Loaded ${tokens.length} custom entries into Hash Table.`;
      sound.playSuccess();
      renderViewport('hash');
      return;
    }
  }

  if (id === 'trie') {
    const words = rawStr.split(/[,\s]+/).map(w => w.trim().toLowerCase()).filter(Boolean);
    if (words.length === 0) return;
    opTrieClear();
    words.forEach(w => opTrieInsert(w));
    document.getElementById('statusMessage').textContent = `Loaded ${words.length} custom words into Trie: ${words.join(', ')}`;
    sound.playSuccess();
    renderViewport('trie');
    return;
  }

  // Parse numbers
  const nums = rawStr.split(/[,\s]+/)
    .map(s => parseInt(s.trim(), 10))
    .filter(n => !isNaN(n));

  if (nums.length === 0) {
    document.getElementById('statusMessage').textContent = 'Please enter valid numerical values!';
    sound.playError();
    return;
  }

  const maxLen = 30;
  const numbers = nums.slice(0, maxLen);

  switch (id) {
    case 'array': {
      appState.arraySize = numbers.length;
      appState.arrayCap = Math.max(numbers.length, 8);
      appState.arrayData = [...numbers];
      while (appState.arrayData.length < appState.arrayCap) appState.arrayData.push(0);
      document.getElementById('statusMessage').textContent = `Loaded ${numbers.length} custom elements into Array: [${numbers.join(', ')}].`;
      sound.playSuccess();
      renderViewport('array');
      break;
    }

    case 'dynarray': {
      appState.dynArrayData = [...numbers];
      appState.dynArrayCap = Math.max(4, Math.pow(2, Math.ceil(Math.log2(numbers.length || 1))));
      document.getElementById('statusMessage').textContent = `Loaded ${numbers.length} custom elements into Dynamic Array (Capacity: ${appState.dynArrayCap}).`;
      sound.playSuccess();
      renderViewport('dynarray');
      break;
    }

    case 'sll':
    case 'dll': {
      if (id === 'dll') appState.dllNodes = [...numbers];
      else appState.sllNodes = [...numbers];
      document.getElementById('statusMessage').textContent = `Loaded ${numbers.length} custom nodes into ${id === 'dll' ? 'Doubly' : 'Singly'} Linked List.`;
      sound.playSuccess();
      renderViewport(id);
      break;
    }

    case 'stack': {
      appState.stackItems = [...numbers];
      appState.stackCap = Math.max(numbers.length, 8);
      document.getElementById('statusMessage').textContent = `Loaded ${numbers.length} custom items onto Stack.`;
      sound.playSuccess();
      renderViewport('stack');
      break;
    }

    case 'queue': {
      appState.queueItems = [...numbers];
      appState.queueCap = Math.max(numbers.length, 8);
      document.getElementById('statusMessage').textContent = `Loaded ${numbers.length} custom items into Queue.`;
      sound.playSuccess();
      renderViewport('queue');
      break;
    }

    case 'deque': {
      appState.dequeItems = [...numbers];
      appState.dequeCap = Math.max(numbers.length, 8);
      document.getElementById('statusMessage').textContent = `Loaded ${numbers.length} custom items into Deque.`;
      sound.playSuccess();
      renderViewport('deque');
      break;
    }

    case 'set': {
      appState.setItems = [...new Set(numbers)];
      document.getElementById('statusMessage').textContent = `Loaded ${appState.setItems.length} unique values into Set.`;
      sound.playSuccess();
      renderViewport('set');
      break;
    }

    case 'bst':
    case 'avl':
    case 'binary_tree': {
      appState.bstRoot = null;
      numbers.forEach(v => opTreeInsert(id, v));
      document.getElementById('statusMessage').textContent = `Built ${id.toUpperCase()} from ${numbers.length} custom keys: [${numbers.join(', ')}].`;
      sound.playSuccess();
      renderViewport(id);
      break;
    }

    case 'heap': {
      appState.heapData = [...numbers];
      opHeapRebuild();
      document.getElementById('statusMessage').textContent = `Built ${appState.heapType.toUpperCase()}-Heap from ${numbers.length} custom values.`;
      sound.playSuccess();
      renderViewport('heap');
      break;
    }

    case 'segtree': {
      appState.segArray = [...numbers];
      document.getElementById('statusMessage').textContent = `Rebuilt Segment Tree with custom base array of ${numbers.length} elements.`;
      sound.playSuccess();
      renderViewport('segtree');
      break;
    }

    case 'fenwick': {
      appState.fenwickData = [0, ...numbers];
      document.getElementById('statusMessage').textContent = `Loaded ${numbers.length} custom elements into Fenwick Tree.`;
      sound.playSuccess();
      renderViewport('fenwick');
      break;
    }

    case 'sorting':
    case 'searching': {
      appState.algoArray = [...numbers];
      if (appState.currentStructure === 'searching' && appState.algoType === 'binary') {
        appState.algoArray.sort((a, b) => a - b);
      }
      appState.algoComparisons = 0;
      appState.algoSwaps = 0;
      appState.algoGenerator = null;
      appState.algoRunning = false;
      document.getElementById('statusMessage').textContent = `Loaded ${numbers.length} custom bars into Algorithm Visualizer: [${numbers.join(', ')}].`;
      sound.playSuccess();
      renderViewport(id);
      break;
    }

    default: {
      document.getElementById('statusMessage').textContent = `Loaded custom data.`;
      sound.playSuccess();
      break;
    }
  }

  const countInp = document.getElementById('cfgCountInput');
  if (countInp) countInp.value = numbers.length;
}

function handleGenerateDataCount(id, count) {
  const n = Math.max(1, Math.min(count, 30));

  if (id === 'trie') {
    const pool = ['apple', 'algo', 'code', 'data', 'byte', 'tree', 'node', 'graph', 'stack', 'queue', 'array', 'link', 'hash', 'heap', 'sort', 'trie', 'path', 'loop', 'flow', 'leaf'];
    const chosen = [];
    for (let i = 0; i < n; i++) {
      const word = pool[i % pool.length];
      if (!chosen.includes(word)) chosen.push(word);
    }
    const dataStr = chosen.join(', ');
    const dataInp = document.getElementById('cfgDataInput');
    if (dataInp) dataInp.value = dataStr;
    handleLoadCustomData('trie', dataStr);
    return;
  }

  if (id === 'map' || id === 'hash') {
    const keys = ['alpha', 'beta', 'gamma', 'delta', 'omega', 'sigma', 'user', 'role', 'city', 'team', 'core', 'host'];
    const pairs = [];
    for (let i = 0; i < n; i++) {
      const k = keys[i % keys.length] + (i >= keys.length ? Math.floor(i / keys.length) : '');
      const v = Math.floor(Math.random() * 90) + 10;
      pairs.push(`${k}:${v}`);
    }
    const dataStr = pairs.join(', ');
    const dataInp = document.getElementById('cfgDataInput');
    if (dataInp) dataInp.value = dataStr;
    handleLoadCustomData(id, dataStr);
    return;
  }

  // Generate random numbers
  const generated = [];
  const minVal = 10;
  const maxVal = 99;
  for (let i = 0; i < n; i++) {
    generated.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
  }

  const dataStr = generated.join(', ');
  const dataInp = document.getElementById('cfgDataInput');
  if (dataInp) dataInp.value = dataStr;

  handleLoadCustomData(id, dataStr);
}

function renderControlPanel(id) {
  const panel = document.getElementById('controlPanel');
  panel.innerHTML = '';

  const makeBtn = (txt, cls, onClick) => {
    const b = document.createElement('button');
    b.className = `btn ${cls}`;
    b.textContent = txt;
    b.addEventListener('click', () => {
      if (appState.isAnimating && !txt.includes('Reset') && !txt.includes('Clear')) return;
      onClick();
    });
    return b;
  };

  const makeInput = (type, val, placeholder, w = '90px') => {
    const inp = document.createElement('input');
    inp.type = type;
    inp.value = val;
    inp.placeholder = placeholder;
    inp.style.width = w;
    return inp;
  };

  const makeGroup = (labelTxt, inputEl) => {
    const grp = document.createElement('div');
    grp.className = 'control-group';
    const lbl = document.createElement('label');
    lbl.textContent = labelTxt;
    grp.appendChild(lbl);
    grp.appendChild(inputEl);
    return grp;
  };

  // Row 1: Universal Dataset Size & Custom Data Entry
  const configBar = document.createElement('div');
  configBar.className = 'dataset-config-bar';

  // Number of data (count / size)
  const countGroup = document.createElement('div');
  countGroup.className = 'control-group';
  countGroup.style.minWidth = '145px';
  const countLbl = document.createElement('label');
  countLbl.textContent = 'Number of Data (Count):';
  countGroup.appendChild(countLbl);

  const countInputWrap = document.createElement('div');
  countInputWrap.className = 'input-with-action';
  const countInp = document.createElement('input');
  countInp.type = 'number';
  countInp.id = 'cfgCountInput';
  countInp.min = '1';
  countInp.max = '30';
  countInp.value = getCurrentDataCount(id);
  countInp.style.width = '60px';
  countInputWrap.appendChild(countInp);

  const genBtn = makeBtn('Generate (N)', 'btn-secondary btn-sm', () => {
    const n = Math.max(1, Math.min(parseInt(countInp.value, 10) || 8, 30));
    handleGenerateDataCount(id, n);
  });
  countInputWrap.appendChild(genBtn);
  countGroup.appendChild(countInputWrap);
  configBar.appendChild(countGroup);

  // Custom Data Input
  const dataGroup = document.createElement('div');
  dataGroup.className = 'control-group';
  dataGroup.style.flex = '1';
  dataGroup.style.minWidth = '280px';
  const dataLbl = document.createElement('label');
  dataLbl.textContent = 'Enter Custom Data (comma or space separated):';
  dataGroup.appendChild(dataLbl);

  const dataInputWrap = document.createElement('div');
  dataInputWrap.className = 'input-with-action';
  const dataInp = document.createElement('input');
  dataInp.type = 'text';
  dataInp.id = 'cfgDataInput';
  dataInp.className = 'flex-input';
  dataInp.value = getCurrentDataString(id);
  dataInp.placeholder = getPlaceholderForStructure(id);
  dataInputWrap.appendChild(dataInp);

  const loadBtn = makeBtn('Load Data', 'btn-primary btn-sm', () => {
    handleLoadCustomData(id, dataInp.value);
  });
  dataInputWrap.appendChild(loadBtn);
  dataGroup.appendChild(dataInputWrap);
  configBar.appendChild(dataGroup);

  panel.appendChild(configBar);

  // Row 2: Operational Controls
  const opsBar = document.createElement('div');
  opsBar.className = 'control-ops-bar';

  const actions = document.createElement('div');
  actions.className = 'control-actions';

  switch (id) {
    case 'array': {
      const valInp = makeInput('number', 42, 'Val', '75px');
      const idxInp = makeInput('number', 2, 'Idx', '60px');
      opsBar.appendChild(makeGroup('Value', valInp));
      opsBar.appendChild(makeGroup('Index', idxInp));

      actions.appendChild(makeBtn('Access(i)', 'btn-primary', () => opArrayAccess(parseInt(idxInp.value, 10))));
      actions.appendChild(makeBtn('Search(val)', 'btn-secondary', () => opArraySearch(parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Set(i, val)', 'btn-secondary', () => opArraySet(parseInt(idxInp.value, 10), parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Randomize', 'btn-outline', () => opArrayRandomize()));
      break;
    }

    case 'dynarray': {
      const valInp = makeInput('number', 40, 'Val', '80px');
      opsBar.appendChild(makeGroup('Value', valInp));
      actions.appendChild(makeBtn('Append (Push)', 'btn-primary', () => opDynArrayAppend(parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Pop (Remove)', 'btn-secondary', () => opDynArrayPop()));
      actions.appendChild(makeBtn('Clear', 'btn-outline', () => opDynArrayClear()));
      break;
    }

    case 'sll':
    case 'dll': {
      const isDll = (id === 'dll');
      const valInp = makeInput('number', 56, 'Val', '75px');
      opsBar.appendChild(makeGroup('Node Value', valInp));
      actions.appendChild(makeBtn('Insert Head', 'btn-primary', () => opLinkedListInsert(isDll, true, parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Insert Tail', 'btn-primary', () => opLinkedListInsert(isDll, false, parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Delete Value', 'btn-secondary', () => opLinkedListDelete(isDll, parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Search (Animated)', 'btn-secondary', () => opLinkedListSearch(isDll, parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Clear', 'btn-outline', () => opLinkedListClear(isDll)));
      break;
    }

    case 'stack': {
      const valInp = makeInput('number', 75, 'Val', '75px');
      opsBar.appendChild(makeGroup('Element Value', valInp));
      actions.appendChild(makeBtn('Push', 'btn-primary', () => opStackPush(parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Pop', 'btn-secondary', () => opStackPop()));
      actions.appendChild(makeBtn('Peek Top', 'btn-secondary', () => opStackPeek()));
      actions.appendChild(makeBtn('Clear', 'btn-outline', () => opStackClear()));
      break;
    }

    case 'queue': {
      const valInp = makeInput('number', 50, 'Val', '75px');
      opsBar.appendChild(makeGroup('Element Value', valInp));
      actions.appendChild(makeBtn('Enqueue (Rear)', 'btn-primary', () => opQueueEnqueue(parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Dequeue (Front)', 'btn-secondary', () => opQueueDequeue()));
      actions.appendChild(makeBtn('Peek Front', 'btn-secondary', () => opQueuePeek()));
      actions.appendChild(makeBtn('Clear', 'btn-outline', () => opQueueClear()));
      break;
    }

    case 'deque': {
      const valInp = makeInput('number', 20, 'Val', '75px');
      opsBar.appendChild(makeGroup('Value', valInp));
      actions.appendChild(makeBtn('Push Front', 'btn-primary', () => opDequePush(true, parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Push Rear', 'btn-primary', () => opDequePush(false, parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Pop Front', 'btn-secondary', () => opDequePop(true)));
      actions.appendChild(makeBtn('Pop Rear', 'btn-secondary', () => opDequePop(false)));
      actions.appendChild(makeBtn('Clear', 'btn-outline', () => opDequeClear()));
      break;
    }

    case 'hash': {
      const kInp = makeInput('text', 'user', 'Key', '85px');
      const vInp = makeInput('text', 'Alice', 'Val', '85px');
      opsBar.appendChild(makeGroup('Key', kInp));
      opsBar.appendChild(makeGroup('Value', vInp));
      actions.appendChild(makeBtn('Set(key, val)', 'btn-primary', () => opHashSet(kInp.value, vInp.value)));
      actions.appendChild(makeBtn('Get(key)', 'btn-secondary', () => opHashGet(kInp.value)));
      actions.appendChild(makeBtn('Delete(key)', 'btn-secondary', () => opHashDelete(kInp.value)));
      actions.appendChild(makeBtn('Clear', 'btn-outline', () => opHashClear()));
      break;
    }

    case 'set': {
      const valInp = makeInput('number', 42, 'Val', '80px');
      opsBar.appendChild(makeGroup('Value', valInp));
      actions.appendChild(makeBtn('Add (Insert)', 'btn-primary', () => opSetAdd(parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Has (Check)', 'btn-secondary', () => opSetHas(parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Delete', 'btn-secondary', () => opSetDelete(parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Clear', 'btn-outline', () => opSetClear()));
      break;
    }

    case 'map': {
      const kInp = makeInput('text', 'city', 'Key', '85px');
      const vInp = makeInput('text', 'Tokyo', 'Val', '85px');
      opsBar.appendChild(makeGroup('Key', kInp));
      opsBar.appendChild(makeGroup('Value', vInp));
      actions.appendChild(makeBtn('Set Entry', 'btn-primary', () => opMapSet(kInp.value, vInp.value)));
      actions.appendChild(makeBtn('Get Entry', 'btn-secondary', () => opMapGet(kInp.value)));
      actions.appendChild(makeBtn('Delete Entry', 'btn-secondary', () => opMapDelete(kInp.value)));
      actions.appendChild(makeBtn('Clear', 'btn-outline', () => opMapClear()));
      break;
    }

    // TREES CONTROLS
    case 'general_tree': {
      actions.appendChild(makeBtn('Preorder (DFS)', 'btn-primary', () => opGeneralTreeTraverse('preorder')));
      actions.appendChild(makeBtn('Level-Order (BFS)', 'btn-secondary', () => opGeneralTreeTraverse('bfs')));
      actions.appendChild(makeBtn('Reset Tree', 'btn-outline', () => renderViewport('general_tree')));
      break;
    }

    case 'bst':
    case 'avl':
    case 'binary_tree': {
      const valInp = makeInput('number', 37, 'Key', '75px');
      opsBar.appendChild(makeGroup('Node Key', valInp));
      actions.appendChild(makeBtn('Insert Key', 'btn-primary', () => opTreeInsert(id, parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Search (Animated)', 'btn-secondary', () => opTreeSearch(id, parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Inorder (Sorted)', 'btn-secondary', () => opTreeTraverse(id, 'inorder')));
      actions.appendChild(makeBtn('Preorder', 'btn-secondary', () => opTreeTraverse(id, 'preorder')));
      actions.appendChild(makeBtn('Postorder', 'btn-secondary', () => opTreeTraverse(id, 'postorder')));
      actions.appendChild(makeBtn('Sample Tree', 'btn-secondary', () => opTreeSample(id)));
      actions.appendChild(makeBtn('Clear', 'btn-outline', () => opTreeClear(id)));
      break;
    }

    case 'heap': {
      const valInp = makeInput('number', 65, 'Val', '75px');
      opsBar.appendChild(makeGroup('Element', valInp));
      actions.appendChild(makeBtn('Insert (Bubble Up)', 'btn-primary', () => opHeapInsert(parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Extract Root (Bubble Down)', 'btn-secondary', () => opHeapExtract()));
      actions.appendChild(makeBtn(`Toggle: ${appState.heapType.toUpperCase()}`, 'btn-secondary', (e) => {
        appState.heapType = appState.heapType === 'max' ? 'min' : 'max';
        opHeapRebuild();
      }));
      actions.appendChild(makeBtn('Sample Heap', 'btn-outline', () => opHeapSample()));
      break;
    }

    case 'trie': {
      const strInp = makeInput('text', 'apple', 'Word', '95px');
      opsBar.appendChild(makeGroup('Word / Prefix', strInp));
      actions.appendChild(makeBtn('Insert Word', 'btn-primary', () => opTrieInsert(strInp.value)));
      actions.appendChild(makeBtn('Search Word (Animated)', 'btn-secondary', () => opTrieSearch(strInp.value, true)));
      actions.appendChild(makeBtn('Starts With', 'btn-secondary', () => opTrieSearch(strInp.value, false)));
      actions.appendChild(makeBtn('Clear', 'btn-outline', () => opTrieClear()));
      break;
    }

    case 'btree': {
      const valInp = makeInput('number', 35, 'Key', '75px');
      opsBar.appendChild(makeGroup('Key', valInp));
      actions.appendChild(makeBtn('Search Key (Animated)', 'btn-primary', () => opBTreeSearch(parseInt(valInp.value, 10))));
      actions.appendChild(makeBtn('Reset B-Tree', 'btn-outline', () => renderViewport('btree')));
      break;
    }

    case 'segtree': {
      const lInp = makeInput('number', 1, 'L (0..5)', '65px');
      const rInp = makeInput('number', 4, 'R (0..5)', '65px');
      opsBar.appendChild(makeGroup('Left [L]', lInp));
      opsBar.appendChild(makeGroup('Right [R]', rInp));
      actions.appendChild(makeBtn('Range Sum Query (Animated)', 'btn-primary', () => opSegQuery(parseInt(lInp.value, 10), parseInt(rInp.value, 10))));
      actions.appendChild(makeBtn('Reset Array', 'btn-outline', () => opSegReset()));
      break;
    }

    case 'fenwick': {
      const idxInp = makeInput('number', 4, 'Idx (1..7)', '70px');
      const valInp = makeInput('number', 5, 'Delta', '65px');
      opsBar.appendChild(makeGroup('Index', idxInp));
      opsBar.appendChild(makeGroup('Delta', valInp));
      actions.appendChild(makeBtn('Prefix Sum Query(1..i)', 'btn-primary', () => opFenwickQuery(parseInt(idxInp.value, 10))));
      actions.appendChild(makeBtn('Update Point(i, delta)', 'btn-secondary', () => opFenwickUpdate(parseInt(idxInp.value, 10), parseInt(valInp.value, 10))));
      break;
    }

    case 'ast': {
      actions.appendChild(makeBtn('Evaluate Step-by-Step (Animated)', 'btn-primary', () => opAstEvaluate()));
      actions.appendChild(makeBtn('Reset Expression Tree', 'btn-outline', () => renderViewport('ast')));
      break;
    }

    // GRAPH STUDIO CONTROLS
    case 'graph_studio': {
      const startInp = makeInput('text', 'A', 'Start', '60px');
      const targetInp = makeInput('text', 'E', 'Target', '60px');
      opsBar.appendChild(makeGroup('Start Node', startInp));
      opsBar.appendChild(makeGroup('Target Node', targetInp));

      actions.appendChild(makeBtn('Run BFS Traversal (Animated)', 'btn-primary', () => opGraphBFS(startInp.value.toUpperCase())));
      actions.appendChild(makeBtn('Run DFS Traversal (Animated)', 'btn-secondary', () => opGraphDFS(startInp.value.toUpperCase())));
      actions.appendChild(makeBtn('Dijkstra Shortest Path (Animated)', 'btn-secondary', () => opGraphDijkstra(startInp.value.toUpperCase(), targetInp.value.toUpperCase())));
      actions.appendChild(makeBtn(appState.graphDirected ? 'Type: Directed' : 'Type: Undirected', 'btn-outline', (e) => {
        appState.graphDirected = !appState.graphDirected;
        e.target.textContent = appState.graphDirected ? 'Type: Directed' : 'Type: Undirected';
        renderViewport('graph_studio');
        renderGraphRepr();
      }));
      actions.appendChild(makeBtn('Reset Graph', 'btn-outline', () => opGraphReset()));
      break;
    }

    // ALGORITHMS (SORTING / SEARCHING)
    case 'sorting':
    case 'searching': {
      const isSearch = (id === 'searching');
      const algoSel = document.createElement('select');
      const opts = isSearch ? ['Linear Search', 'Binary Search'] : ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'];
      opts.forEach(o => {
        const op = document.createElement('option');
        op.value = o.toLowerCase().split(' ')[0];
        op.textContent = o;
        algoSel.appendChild(op);
      });
      algoSel.addEventListener('change', (e) => {
        appState.algoType = e.target.value;
        initAlgoArray();
      });
      opsBar.appendChild(makeGroup('Algorithm', algoSel));

      if (isSearch) {
        const targetInp = makeInput('number', appState.algoTarget, 'Target', '75px');
        targetInp.addEventListener('input', (e) => appState.algoTarget = parseInt(e.target.value, 10));
        opsBar.appendChild(makeGroup('Target Value', targetInp));
      }

      actions.appendChild(makeBtn('Start', 'btn-primary', () => startAlgo()));
      actions.appendChild(makeBtn('Step', 'btn-secondary', () => stepAlgo()));
      actions.appendChild(makeBtn('New Array', 'btn-secondary', () => initAlgoArray()));
      break;
    }
  }

  opsBar.appendChild(actions);
  panel.appendChild(opsBar);
}

// ==========================================================================
// --- VIEWPORT RENDERING ENGINE --------------------------------------------
// ==========================================================================
function renderViewport(id) {
  const container = document.getElementById('viewportInner');
  container.innerHTML = '';

  const setMetrics = (status, m1, m2, m3) => {
    document.getElementById('statusMessage').textContent = status;
    document.getElementById('metricValue1').textContent = m1;
    document.getElementById('metricValue2').textContent = m2;
    document.getElementById('metricValue3').textContent = m3;
  };

  switch (id) {
    case 'array': {
      const track = document.createElement('div');
      track.className = 'array-track';
      appState.arrayData.forEach((val, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'array-cell-wrap';
        wrap.innerHTML = `<span class="array-index">[${idx}]</span>`;
        const cell = document.createElement('div');
        cell.className = `array-cell ${idx >= appState.arraySize ? 'empty' : ''}`;
        cell.id = `array-cell-${idx}`;
        cell.textContent = idx < appState.arraySize ? val : '-';
        wrap.appendChild(cell);
        track.appendChild(wrap);
      });
      container.appendChild(track);
      setMetrics('Array loaded', `${appState.arraySize} elements`, `Capacity: ${appState.arrayCap}`, 'Contiguous Memory');
      break;
    }

    case 'dynarray': {
      const wrap = document.createElement('div');
      wrap.className = 'dynarray-container';
      wrap.innerHTML = `<div class="capacity-bracket"><span>Buffer Capacity: ${appState.dynArrayCap}</span><span>Size: ${appState.dynArrayData.length}</span></div>`;
      const track = document.createElement('div');
      track.className = 'array-track';

      for (let i = 0; i < appState.dynArrayCap; i++) {
        const cellWrap = document.createElement('div');
        cellWrap.className = 'array-cell-wrap';
        cellWrap.innerHTML = `<span class="array-index">[${i}]</span>`;
        const cell = document.createElement('div');
        cell.className = `array-cell ${i >= appState.dynArrayData.length ? 'empty' : ''}`;
        cell.textContent = i < appState.dynArrayData.length ? appState.dynArrayData[i] : '-';
        cellWrap.appendChild(cell);
        track.appendChild(cellWrap);
      }
      wrap.appendChild(track);
      container.appendChild(wrap);
      setMetrics('Dynamic Array ready', `${appState.dynArrayData.length} elements`, `Capacity: ${appState.dynArrayCap}`, 'Doubles on overflow');
      break;
    }

    case 'sll':
    case 'dll': {
      const isDll = (id === 'dll');
      const nodes = isDll ? appState.dllNodes : appState.sllNodes;
      const track = document.createElement('div');
      track.className = 'll-track';

      if (isDll) {
        track.innerHTML += `<div class="ll-null">null</div><span class="ll-arrow-sym">&lt;-&gt;</span>`;
      }

      nodes.forEach((v, i) => {
        const box = document.createElement('div');
        box.className = 'll-node-box';
        box.id = `ll-node-${i}`;

        if (isDll) {
          box.innerHTML = `
            <div class="ll-slot ll-ptr-slot-prev">prev</div>
            <div class="ll-slot ll-data-slot">${v}</div>
            <div class="ll-slot ll-ptr-slot">next</div>
          `;
        } else {
          box.innerHTML = `
            <div class="ll-slot ll-data-slot">${v}</div>
            <div class="ll-slot ll-ptr-slot">next</div>
          `;
        }
        track.appendChild(box);

        const arrow = document.createElement('span');
        arrow.className = 'll-arrow-sym';
        arrow.id = `ll-arrow-${i}`;
        arrow.textContent = isDll ? '<->' : '->';
        track.appendChild(arrow);
      });

      track.innerHTML += `<div class="ll-null">null</div>`;
      container.appendChild(track);
      setMetrics(`${isDll ? 'Doubly' : 'Singly'} Linked List ready`, `${nodes.length} nodes`, 'Dynamic size', isDll ? 'Bidirectional' : 'Unidirectional');
      break;
    }

    case 'stack': {
      const beaker = document.createElement('div');
      beaker.className = 'stack-beaker';
      appState.stackItems.forEach((val, idx) => {
        const card = document.createElement('div');
        card.className = `stack-card ${idx === appState.stackItems.length - 1 ? 'top' : ''}`;
        card.innerHTML = `<span>[${idx}] Value:</span> <span>${val} ${idx === appState.stackItems.length - 1 ? '<- TOP' : ''}</span>`;
        beaker.appendChild(card);
      });
      container.appendChild(beaker);
      setMetrics('Stack initialized', `${appState.stackItems.length} items`, `Capacity: ${appState.stackCap}`, 'LIFO Principle');
      break;
    }

    case 'queue':
    case 'deque': {
      const isDeque = (id === 'deque');
      const items = isDeque ? appState.dequeItems : appState.queueItems;
      const rail = document.createElement('div');
      rail.className = 'queue-rail';

      items.forEach((val, idx) => {
        const node = document.createElement('div');
        node.className = `queue-node ${idx === 0 ? 'front' : ''} ${idx === items.length - 1 ? 'rear' : ''}`;
        let tag = '';
        if (idx === 0 && idx === items.length - 1) tag = 'FRONT & REAR';
        else if (idx === 0) tag = 'FRONT';
        else if (idx === items.length - 1) tag = 'REAR';

        node.innerHTML = `<span>${val}</span><span style="font-size:0.65rem; color:#94a3b8; font-weight:700;">${tag}</span>`;
        rail.appendChild(node);
      });

      container.appendChild(rail);
      setMetrics(`${isDeque ? 'Deque' : 'Queue'} active`, `${items.length} items`, 'Buffer Cap: 8', isDeque ? 'Double-Ended' : 'FIFO Principle');
      break;
    }

    case 'hash': {
      const grid = document.createElement('div');
      grid.className = 'hash-table-grid';
      appState.hashBuckets.forEach((bucket, idx) => {
        const row = document.createElement('div');
        row.className = 'hash-row';
        row.id = `hash-bucket-row-${idx}`;
        row.innerHTML = `<div class="hash-bucket-idx">Bucket [${idx}]</div>`;
        const chain = document.createElement('div');
        chain.className = 'hash-chain';

        if (bucket.length === 0) {
          chain.innerHTML = `<span style="color:#64748b; font-family:var(--font-mono); font-size:0.8rem;">Empty</span>`;
        } else {
          bucket.forEach(item => {
            const card = document.createElement('div');
            card.className = 'hash-entry-card';
            card.innerHTML = `<span class="key">${item.k}</span>: <span class="val">${item.v}</span>`;
            chain.appendChild(card);
          });
        }
        row.appendChild(chain);
        grid.appendChild(row);
      });
      container.appendChild(grid);
      setMetrics('Hash Table loaded', '8 Buckets', 'Chaining collisions', 'O(1) average lookup');
      break;
    }

    case 'set': {
      const grid = document.createElement('div');
      grid.className = 'collection-grid';
      appState.setItems.forEach(v => {
        const pill = document.createElement('div');
        pill.className = 'set-pill';
        pill.textContent = v;
        grid.appendChild(pill);
      });
      container.appendChild(grid);
      setMetrics('Set active', `${appState.setItems.length} unique values`, 'Duplicates forbidden', 'Set Theory');
      break;
    }

    case 'map': {
      const grid = document.createElement('div');
      grid.className = 'collection-grid';
      appState.mapEntries.forEach(([k, v]) => {
        const card = document.createElement('div');
        card.className = 'map-card';
        card.innerHTML = `<strong style="color:var(--accent-secondary)">${k}</strong> <span style="color:#64748b;">-></span> <span style="color:#34d399; font-weight:700;">${v}</span>`;
        grid.appendChild(card);
      });
      container.appendChild(grid);
      setMetrics('Map / Dictionary loaded', `${appState.mapEntries.length} entries`, 'Key-Value storage', 'Unique Keys');
      break;
    }

    // TREES RENDERING
    case 'general_tree': {
      renderGeneralTreeGraph(container);
      setMetrics('General Tree active', 'Arbitrary N-Ary children', 'Root -> Leaves', 'Hierarchical');
      break;
    }

    case 'bst':
    case 'avl':
    case 'binary_tree': {
      if (!appState.bstRoot) opTreeSample('bst');
      renderTreeGraph(container, appState.bstRoot, (id === 'avl'));
      setMetrics(`${id.toUpperCase()} loaded`, 'Hierarchical graph', 'Left < Root < Right', id === 'avl' ? 'Self-Balancing' : 'Binary Tree');
      break;
    }

    case 'heap': {
      renderHeapGraph(container);
      setMetrics(`${appState.heapType.toUpperCase()}-Heap active`, `${appState.heapData.length} nodes`, `Root: ${appState.heapData[0] || 'None'}`, 'Array-backed complete tree');
      break;
    }

    case 'trie': {
      if (!appState.trieRoot) {
        opTrieInsert('algo');
        opTrieInsert('app');
        opTrieInsert('apple');
        opTrieInsert('code');
      }
      renderTrieGraph(container, appState.trieRoot);
      setMetrics('Trie (Prefix Tree) ready', 'Strings: algo, app, apple, code', 'Prefix retrieval', 'Root -> Children');
      break;
    }

    case 'btree': {
      renderBTreeGraph(container);
      setMetrics('B-Tree (Order 3)', 'Multi-Key Blocks', 'Balanced Disk Index', 'O(log n)');
      break;
    }

    case 'segtree': {
      renderSegTreeGraph(container);
      setMetrics('Segment Tree ready', 'Array [1, 3, 5, 7, 9, 11]', 'Range Queries: O(log n)', 'Interval sums');
      break;
    }

    case 'fenwick': {
      renderFenwickVisual(container);
      setMetrics('Fenwick Tree (BIT) ready', '8 Elements', 'Point update / Range sum', 'i & (-i) bitwise');
      break;
    }

    case 'ast': {
      renderAstGraph(container);
      setMetrics('AST Expression Tree', 'Expr: (3 + 5) * (10 - 2)', 'Leaves = Operands', 'Nodes = Operators');
      break;
    }

    // GRAPH STUDIO RENDERING
    case 'graph_studio': {
      renderGraphStudio(container);
      setMetrics('Graph Studio loaded', `${appState.graphNodes.length} Vertices`, `${appState.graphEdges.length} Edges`, appState.graphDirected ? 'Directed' : 'Undirected');
      break;
    }

    // ALGORITHMS (BARS)
    case 'sorting':
    case 'searching': {
      if (appState.algoArray.length === 0) initAlgoArray();
      renderAlgoBars(container);
      setMetrics('Ready to execute algorithm', `${appState.algoArray.length} items`, `Comparisons: ${appState.algoComparisons}`, `Swaps: ${appState.algoSwaps}`);
      break;
    }
  }
}

// ==========================================================================
// --- BASIC STRUCTURE OPERATIONS -------------------------------------------
// ==========================================================================
function opArrayAccess(idx) {
  if (idx < 0 || idx >= appState.arraySize) {
    document.getElementById('statusMessage').textContent = `Index ${idx} Out of Bounds!`;
    sound.playError();
    return;
  }
  const cell = document.getElementById(`array-cell-${idx}`);
  if (cell) {
    cell.classList.add('active-inspect');
    sound.playTone(appState.arrayData[idx], 100, 0.2);
    setTimeout(() => cell.classList.remove('active-inspect'), 800);
  }
  document.getElementById('statusMessage').textContent = `Direct access: arr[${idx}] = ${appState.arrayData[idx]} in O(1) time.`;
}

async function opArraySearch(val) {
  if (appState.isAnimating) return;
  appState.isAnimating = true;

  document.getElementById('statusMessage').textContent = `Scanning array sequentially from index 0 for value ${val}...`;
  let found = -1;

  for (let i = 0; i < appState.arraySize; i++) {
    const cell = document.getElementById(`array-cell-${i}`);
    if (cell) cell.classList.add('active-inspect');
    sound.playTone(appState.arrayData[i], 100, 0.15);
    document.getElementById('statusMessage').textContent = `Inspecting index [${i}]: value = ${appState.arrayData[i]} ${appState.arrayData[i] === val ? '== MATCH!' : '!= ' + val}`;
    await sleep(getSpeedDelay(650));

    if (appState.arrayData[i] === val) {
      if (cell) {
        cell.classList.remove('active-inspect');
        cell.classList.add('active-match');
      }
      found = i;
      sound.playSuccess();
      break;
    }
    if (cell) cell.classList.remove('active-inspect');
  }

  if (found !== -1) {
    document.getElementById('statusMessage').textContent = `Value ${val} located at index ${found}! Direct search complete.`;
    setTimeout(() => {
      const matchCell = document.getElementById(`array-cell-${found}`);
      if (matchCell) matchCell.classList.remove('active-match');
    }, getSpeedDelay(2000));
  } else {
    document.getElementById('statusMessage').textContent = `Value ${val} not found in array. Scanned all ${appState.arraySize} elements.`;
    sound.playError();
  }

  appState.isAnimating = false;
}

function opArraySet(idx, val) {
  if (idx < 0 || idx >= appState.arrayCap) return;
  appState.arrayData[idx] = val;
  if (idx >= appState.arraySize) appState.arraySize = idx + 1;
  sound.playTone(val, 100, 0.1);
  renderViewport('array');
}

function opArrayRandomize() {
  appState.arrayData = Array.from({length: 8}, () => Math.floor(Math.random() * 90) + 10);
  appState.arraySize = 7;
  renderViewport('array');
}

// Dynamic Array
function opDynArrayAppend(val) {
  if (appState.dynArrayData.length >= appState.dynArrayCap) {
    appState.dynArrayCap *= 2;
    document.getElementById('statusMessage').textContent = `Capacity exceeded! Doubled capacity to ${appState.dynArrayCap}.`;
    sound.playTone(80, 100, 0.25);
  } else {
    document.getElementById('statusMessage').textContent = `Appended ${val} in O(1) amortized time.`;
    sound.playTone(val, 100, 0.1);
  }
  appState.dynArrayData.push(val);
  renderViewport('dynarray');
}

function opDynArrayPop() {
  if (appState.dynArrayData.length > 0) {
    const popped = appState.dynArrayData.pop();
    document.getElementById('statusMessage').textContent = `Popped ${popped} from end.`;
    sound.playTone(30, 100, 0.1);
    renderViewport('dynarray');
  }
}

function opDynArrayClear() {
  appState.dynArrayData = [];
  appState.dynArrayCap = 4;
  renderViewport('dynarray');
}

// Linked Lists
function opLinkedListInsert(isDll, isHead, val) {
  const arr = isDll ? appState.dllNodes : appState.sllNodes;
  if (isHead) arr.unshift(val);
  else arr.push(val);
  sound.playTone(val, 100, 0.1);
  document.getElementById('statusMessage').textContent = `Inserted ${val} at ${isHead ? 'Head' : 'Tail'}.`;
  renderViewport(isDll ? 'dll' : 'sll');
}

function opLinkedListDelete(isDll, val) {
  const arr = isDll ? appState.dllNodes : appState.sllNodes;
  const idx = arr.indexOf(val);
  if (idx !== -1) {
    arr.splice(idx, 1);
    sound.playTone(30, 100, 0.12);
    document.getElementById('statusMessage').textContent = `Deleted ${val} from list.`;
  } else {
    document.getElementById('statusMessage').textContent = `Value ${val} not found in list.`;
  }
  renderViewport(isDll ? 'dll' : 'sll');
}

async function opLinkedListSearch(isDll, val) {
  if (appState.isAnimating) return;
  appState.isAnimating = true;

  const arr = isDll ? appState.dllNodes : appState.sllNodes;
  document.getElementById('statusMessage').textContent = `Traversing linked list from head for value ${val}...`;
  let found = -1;

  for (let i = 0; i < arr.length; i++) {
    const el = document.getElementById(`ll-node-${i}`);
    if (el) {
      el.style.borderColor = 'var(--accent-amber)';
      el.style.boxShadow = '0 0 16px rgba(245, 158, 11, 0.9)';
    }
    sound.playTone(arr[i], 100, 0.15);
    document.getElementById('statusMessage').textContent = `Inspecting Node [${i}]: data = ${arr[i]} ${arr[i] === val ? '== MATCH!' : '!= ' + val + ', following pointer ->'}`;
    await sleep(getSpeedDelay(750));

    if (arr[i] === val) {
      if (el) {
        el.style.borderColor = 'var(--accent-emerald)';
        el.style.boxShadow = '0 0 22px rgba(16, 185, 129, 0.95)';
      }
      found = i;
      sound.playSuccess();
      break;
    }

    if (el) {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }
  }

  if (found !== -1) {
    document.getElementById('statusMessage').textContent = `Value ${val} located at Node [${found}]!`;
    setTimeout(() => {
      const matchEl = document.getElementById(`ll-node-${found}`);
      if (matchEl) {
        matchEl.style.borderColor = '';
        matchEl.style.boxShadow = '';
      }
    }, getSpeedDelay(2000));
  } else {
    document.getElementById('statusMessage').textContent = `Value ${val} not found in list. Reached null terminal.`;
    sound.playError();
  }

  appState.isAnimating = false;
}

function opLinkedListClear(isDll) {
  if (isDll) appState.dllNodes = [];
  else appState.sllNodes = [];
  renderViewport(isDll ? 'dll' : 'sll');
}

// Stack
function opStackPush(val) {
  if (appState.stackItems.length >= appState.stackCap) {
    document.getElementById('statusMessage').textContent = 'Stack Overflow! Maximum capacity reached.';
    sound.playError();
    return;
  }
  appState.stackItems.push(val);
  sound.playTone(val, 100, 0.1);
  renderViewport('stack');
}

function opStackPop() {
  if (appState.stackItems.length === 0) {
    document.getElementById('statusMessage').textContent = 'Stack Underflow! Stack is empty.';
    sound.playError();
    return;
  }
  const popped = appState.stackItems.pop();
  sound.playTone(30, 100, 0.1);
  document.getElementById('statusMessage').textContent = `Popped ${popped} from Top of Stack.`;
  renderViewport('stack');
}

function opStackPeek() {
  if (appState.stackItems.length === 0) return;
  const top = appState.stackItems[appState.stackItems.length - 1];
  document.getElementById('statusMessage').textContent = `Peek Top element: ${top}.`;
  sound.playTone(top, 100, 0.2);
}

function opStackClear() {
  appState.stackItems = [];
  renderViewport('stack');
}

// Queue & Deque
function opQueueEnqueue(val) {
  if (appState.queueItems.length >= appState.queueCap) return;
  appState.queueItems.push(val);
  sound.playTone(val, 100, 0.1);
  renderViewport('queue');
}

function opQueueDequeue() {
  if (appState.queueItems.length === 0) return;
  const val = appState.queueItems.shift();
  sound.playTone(30, 100, 0.1);
  renderViewport('queue');
}

function opQueuePeek() {
  if (appState.queueItems.length === 0) return;
  document.getElementById('statusMessage').textContent = `Front element is ${appState.queueItems[0]}.`;
  sound.playTone(appState.queueItems[0], 100, 0.2);
}

function opQueueClear() {
  appState.queueItems = [];
  renderViewport('queue');
}

function opDequePush(isFront, val) {
  if (appState.dequeItems.length >= appState.dequeCap) return;
  if (isFront) appState.dequeItems.unshift(val);
  else appState.dequeItems.push(val);
  sound.playTone(val, 100, 0.1);
  renderViewport('deque');
}

function opDequePop(isFront) {
  if (appState.dequeItems.length === 0) return;
  const val = isFront ? appState.dequeItems.shift() : appState.dequeItems.pop();
  sound.playTone(30, 100, 0.1);
  renderViewport('deque');
}

function opDequeClear() {
  appState.dequeItems = [];
  renderViewport('deque');
}

// Hash Table
function opHashSet(key, val) {
  if (!key) return;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash + key.charCodeAt(i) * 31) % appState.numBuckets;
  const bucket = appState.hashBuckets[hash];
  const existing = bucket.find(e => e.k === key);
  if (existing) existing.v = val;
  else bucket.push({k: key, v: val});
  sound.playTone(60, 100, 0.1);
  document.getElementById('statusMessage').textContent = `Hashed '${key}' -> Bucket [${hash}]. Inserted value '${val}'.`;
  renderViewport('hash');

  const row = document.getElementById(`hash-bucket-row-${hash}`);
  if (row) {
    row.style.background = 'rgba(139, 92, 246, 0.2)';
    setTimeout(() => row.style.background = '', 700);
  }
}

function opHashGet(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash + key.charCodeAt(i) * 31) % appState.numBuckets;
  const bucket = appState.hashBuckets[hash];
  const item = bucket.find(e => e.k === key);
  if (item) {
    document.getElementById('statusMessage').textContent = `Found key '${key}' in Bucket [${hash}]: Value = '${item.v}'.`;
    sound.playSuccess();
    const row = document.getElementById(`hash-bucket-row-${hash}`);
    if (row) {
      row.style.background = 'rgba(16, 185, 129, 0.25)';
      setTimeout(() => row.style.background = '', 1200);
    }
  } else {
    document.getElementById('statusMessage').textContent = `Key '${key}' not found in Hash Table.`;
    sound.playError();
  }
}

function opHashDelete(key) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash + key.charCodeAt(i) * 31) % appState.numBuckets;
  const bucket = appState.hashBuckets[hash];
  const idx = bucket.findIndex(e => e.k === key);
  if (idx !== -1) {
    bucket.splice(idx, 1);
    sound.playTone(30, 100, 0.1);
    document.getElementById('statusMessage').textContent = `Deleted key '${key}' from Bucket [${hash}].`;
    renderViewport('hash');
  }
}

function opHashClear() {
  appState.hashBuckets = Array.from({length: appState.numBuckets}, () => []);
  renderViewport('hash');
}

// Set & Map
function opSetAdd(val) {
  if (appState.setItems.includes(val)) {
    document.getElementById('statusMessage').textContent = `Rejected duplicate: Value ${val} already exists in Set!`;
    sound.playError();
    return;
  }
  appState.setItems.push(val);
  sound.playTone(val, 100, 0.1);
  document.getElementById('statusMessage').textContent = `Added unique value ${val} to Set.`;
  renderViewport('set');
}

function opSetHas(val) {
  const exists = appState.setItems.includes(val);
  document.getElementById('statusMessage').textContent = exists ? `Value ${val} is present in Set!` : `Value ${val} is not in Set.`;
  if (exists) sound.playSuccess();
  else sound.playError();
}

function opSetDelete(val) {
  const idx = appState.setItems.indexOf(val);
  if (idx !== -1) {
    appState.setItems.splice(idx, 1);
    sound.playTone(30, 100, 0.1);
    renderViewport('set');
  }
}

function opSetClear() {
  appState.setItems = [];
  renderViewport('set');
}

function opMapSet(k, v) {
  if (!k) return;
  const existing = appState.mapEntries.find(e => e[0] === k);
  if (existing) existing[1] = v;
  else appState.mapEntries.push([k, v]);
  sound.playTone(55, 100, 0.1);
  renderViewport('map');
}

function opMapGet(k) {
  const entry = appState.mapEntries.find(e => e[0] === k);
  if (entry) {
    document.getElementById('statusMessage').textContent = `Map.get('${k}') = '${entry[1]}'`;
    sound.playSuccess();
  } else {
    document.getElementById('statusMessage').textContent = `Key '${k}' not in Map.`;
    sound.playError();
  }
}

function opMapDelete(k) {
  const idx = appState.mapEntries.findIndex(e => e[0] === k);
  if (idx !== -1) {
    appState.mapEntries.splice(idx, 1);
    sound.playTone(30, 100, 0.1);
    renderViewport('map');
  }
}

function opMapClear() {
  appState.mapEntries = [];
  renderViewport('map');
}

// ==========================================================================
// --- TREES VISUALIZATION ENGINE -------------------------------------------
// ==========================================================================
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
    this.height = 1;
  }
}

function getNodeHeight(n) {
  return n ? n.height : 0;
}

function getBalanceFactor(n) {
  return n ? getNodeHeight(n.left) - getNodeHeight(n.right) : 0;
}

function updateNodeHeight(n) {
  if (n) n.height = Math.max(getNodeHeight(n.left), getNodeHeight(n.right)) + 1;
}

function rotateRight(y) {
  const x = y.left;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  updateNodeHeight(y);
  updateNodeHeight(x);
  return x;
}

function rotateLeft(x) {
  const y = x.right;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  updateNodeHeight(x);
  updateNodeHeight(y);
  return y;
}

function insertAVL(node, val) {
  if (!node) return new TreeNode(val);
  if (val < node.val) node.left = insertAVL(node.left, val);
  else if (val > node.val) node.right = insertAVL(node.right, val);
  else return node;

  updateNodeHeight(node);
  const bf = getBalanceFactor(node);

  // Left Left
  if (bf > 1 && val < node.left.val) return rotateRight(node);
  // Right Right
  if (bf < -1 && val > node.right.val) return rotateLeft(node);
  // Left Right
  if (bf > 1 && val > node.left.val) {
    node.left = rotateLeft(node.left);
    return rotateRight(node);
  }
  // Right Left
  if (bf < -1 && val < node.right.val) {
    node.right = rotateRight(node.right);
    return rotateLeft(node);
  }
  return node;
}

function opTreeInsert(type, val) {
  const insertBST = (node, v) => {
    if (!node) return new TreeNode(v);
    if (v < node.val) node.left = insertBST(node.left, v);
    else if (v > node.val) node.right = insertBST(node.right, v);
    updateNodeHeight(node);
    return node;
  };

  if (type === 'avl') {
    appState.bstRoot = insertAVL(appState.bstRoot, val);
  } else {
    appState.bstRoot = insertBST(appState.bstRoot, val);
  }

  sound.playTone(val, 100, 0.1);
  document.getElementById('statusMessage').textContent = `Inserted key ${val} into ${type.toUpperCase()}.`;
  renderViewport(type);
}

async function opTreeSearch(type, val) {
  if (appState.isAnimating) return;
  appState.isAnimating = true;

  document.querySelectorAll('.tree-node-circle').forEach(c => {
    c.classList.remove('active', 'match', 'visited');
  });

  let curr = appState.bstRoot;
  let path = [];
  let found = false;

  while (curr) {
    path.push(curr.val);
    const circle = document.getElementById(`tree-node-${curr.val}`);
    if (circle) circle.classList.add('active');
    sound.playTone(curr.val, 100, 0.2);

    if (curr.val === val) {
      found = true;
      document.getElementById('statusMessage').textContent = `Inspecting Node [${curr.val}]: ${val} == ${curr.val}! MATCH FOUND!`;
      await sleep(getSpeedDelay(850));
      if (circle) {
        circle.classList.remove('active');
        circle.classList.add('match');
      }
      sound.playSuccess();
      break;
    } else if (val < curr.val) {
      document.getElementById('statusMessage').textContent = `Inspecting Node [${curr.val}]: ${val} < ${curr.val} -> Traversing to LEFT subtree...`;
      await sleep(getSpeedDelay(850));
      if (circle) {
        circle.classList.remove('active');
        circle.classList.add('visited');
      }
      curr = curr.left;
    } else {
      document.getElementById('statusMessage').textContent = `Inspecting Node [${curr.val}]: ${val} > ${curr.val} -> Traversing to RIGHT subtree...`;
      await sleep(getSpeedDelay(850));
      if (circle) {
        circle.classList.remove('active');
        circle.classList.add('visited');
      }
      curr = curr.right;
    }
  }

  if (found) {
    document.getElementById('statusMessage').textContent = `Found key ${val}! Search path: ${path.join(' -> ')}`;
  } else {
    document.getElementById('statusMessage').textContent = `Key ${val} not found in Tree. Explored path: ${path.join(' -> ')}`;
    sound.playError();
  }

  appState.isAnimating = false;
}

async function opTreeTraverse(type, orderType) {
  if (appState.isAnimating) return;
  appState.isAnimating = true;

  document.querySelectorAll('.tree-node-circle').forEach(c => {
    c.classList.remove('active', 'match', 'visited');
  });

  const order = [];
  const traverse = (node) => {
    if (!node) return;
    if (orderType === 'preorder') order.push(node.val);
    traverse(node.left);
    if (orderType === 'inorder') order.push(node.val);
    traverse(node.right);
    if (orderType === 'postorder') order.push(node.val);
  };
  traverse(appState.bstRoot);

  const visitedSeq = [];
  for (let val of order) {
    visitedSeq.push(val);
    const circle = document.getElementById(`tree-node-${val}`);
    if (circle) circle.classList.add('active');
    sound.playTone(val, 100, 0.2);
    document.getElementById('statusMessage').textContent = `${orderType.toUpperCase()} Visiting Node ${val} | Path: ${visitedSeq.join(' -> ')}`;
    await sleep(getSpeedDelay(800));
    if (circle) {
      circle.classList.remove('active');
      circle.classList.add('match');
    }
  }

  sound.playSuccess();
  document.getElementById('statusMessage').textContent = `${orderType.toUpperCase()} Completed: ${visitedSeq.join(' -> ')}`;
  appState.isAnimating = false;
}

function opTreeSample(type) {
  appState.bstRoot = null;
  const samples = (type === 'avl') ? [30, 20, 40, 10, 25, 35, 50] : [50, 25, 75, 12, 37, 62, 88];
  samples.forEach(v => opTreeInsert(type, v));
  document.getElementById('statusMessage').textContent = `Loaded sample balanced tree.`;
}

function opTreeClear(type) {
  appState.bstRoot = null;
  renderViewport(type);
}

function renderTreeGraph(container, root, showBalance = false) {
  const stage = document.createElement('div');
  stage.className = 'tree-stage';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'tree-svg-canvas';
  const nodesLayer = document.createElement('div');
  nodesLayer.className = 'tree-nodes-layer';

  const width = container.clientWidth || 800;

  const assignCoords = (node, depth = 0, l = 0, r = width) => {
    if (!node) return;
    node.x = (l + r) / 2;
    node.y = 50 + depth * 75;
    assignCoords(node.left, depth + 1, l, node.x);
    assignCoords(node.right, depth + 1, node.x, r);
  };

  assignCoords(root);

  const draw = (node) => {
    if (!node) return;
    if (node.left) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.left.x);
      line.setAttribute('y2', node.left.y);
      line.id = `tree-edge-${node.val}-${node.left.val}`;
      svg.appendChild(line);
      draw(node.left);
    }
    if (node.right) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.right.x);
      line.setAttribute('y2', node.right.y);
      line.id = `tree-edge-${node.val}-${node.right.val}`;
      svg.appendChild(line);
      draw(node.right);
    }

    const circle = document.createElement('div');
    circle.className = 'tree-node-circle';
    circle.id = `tree-node-${node.val}`;
    circle.style.left = `${node.x}px`;
    circle.style.top = `${node.y}px`;
    circle.textContent = node.val;

    if (showBalance) {
      const badge = document.createElement('span');
      badge.className = 'tree-node-badge';
      const bf = getBalanceFactor(node);
      badge.textContent = `BF:${bf > 0 ? '+' : ''}${bf}`;
      circle.appendChild(badge);
    }

    nodesLayer.appendChild(circle);
  };

  if (root) draw(root);
  stage.appendChild(svg);
  stage.appendChild(nodesLayer);
  container.appendChild(stage);
}

// ==========================================================================
// --- GENERAL TREE (N-ARY) VISUALIZATION ------------------------------------
// ==========================================================================
const GENERAL_TREE_DATA = {
  name: "CEO",
  children: [
    {
      name: "Eng",
      children: [
        { name: "Frontend", children: [] },
        { name: "Backend", children: [] },
        { name: "DevOps", children: [] }
      ]
    },
    {
      name: "Product",
      children: [
        { name: "Strategy", children: [] },
        { name: "Analytics", children: [] }
      ]
    },
    {
      name: "Design",
      children: [
        { name: "UI/UX", children: [] },
        { name: "Brand", children: [] }
      ]
    }
  ]
};

function renderGeneralTreeGraph(container) {
  const stage = document.createElement('div');
  stage.className = 'tree-stage';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'tree-svg-canvas';
  const nodesLayer = document.createElement('div');
  nodesLayer.className = 'tree-nodes-layer';

  const width = container.clientWidth || 800;

  const layout = (node, depth = 0, l = 0, r = width) => {
    node.x = (l + r) / 2;
    node.y = 50 + depth * 90;

    const n = node.children.length;
    if (n > 0) {
      const segWidth = (r - l) / n;
      node.children.forEach((child, idx) => {
        const childL = l + idx * segWidth;
        const childR = childL + segWidth;
        layout(child, depth + 1, childL, childR);

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', node.x);
        line.setAttribute('y1', node.y);
        line.setAttribute('x2', child.x);
        line.setAttribute('y2', child.y);
        line.id = `gen-edge-${node.name}-${child.name}`;
        svg.appendChild(line);
      });
    }

    const box = document.createElement('div');
    box.className = 'general-node-circle';
    box.id = `gen-node-${node.name}`;
    box.style.left = `${node.x}px`;
    box.style.top = `${node.y}px`;
    box.textContent = node.name;
    nodesLayer.appendChild(box);
  };

  layout(GENERAL_TREE_DATA, 0, 0, width);
  stage.appendChild(svg);
  stage.appendChild(nodesLayer);
  container.appendChild(stage);
}

async function opGeneralTreeTraverse(orderType) {
  if (appState.isAnimating) return;
  appState.isAnimating = true;

  document.querySelectorAll('.general-node-circle').forEach(c => {
    c.classList.remove('active', 'match', 'visited');
  });

  const order = [];
  if (orderType === 'preorder') {
    const dfs = (node) => {
      order.push(node.name);
      node.children.forEach(dfs);
    };
    dfs(GENERAL_TREE_DATA);
  } else {
    const queue = [GENERAL_TREE_DATA];
    while (queue.length > 0) {
      const curr = queue.shift();
      order.push(curr.name);
      curr.children.forEach(c => queue.push(c));
    }
  }

  const visited = [];
  for (let name of order) {
    visited.push(name);
    const box = document.getElementById(`gen-node-${name}`);
    if (box) box.classList.add('active');
    sound.playTone(name.charCodeAt(0) * 2, 200, 0.2);
    document.getElementById('statusMessage').textContent = `${orderType === 'preorder' ? 'Preorder (DFS)' : 'Level-Order (BFS)'} Visiting Node: ${name} | Explored: ${visited.join(' -> ')}`;
    await sleep(getSpeedDelay(850));
    if (box) {
      box.classList.remove('active');
      box.classList.add('match');
    }
  }

  sound.playSuccess();
  document.getElementById('statusMessage').textContent = `${orderType === 'preorder' ? 'Preorder (DFS)' : 'Level-Order (BFS)'} Traversal Finished: ${visited.join(' -> ')}`;
  appState.isAnimating = false;
}

// ==========================================================================
// --- HEAP (MIN / MAX) VISUALIZATION ---------------------------------------
// ==========================================================================
function opHeapInsert(val) {
  appState.heapData.push(val);
  opHeapifyUp(appState.heapData.length - 1);
  sound.playTone(val, 100, 0.1);
  document.getElementById('statusMessage').textContent = `Inserted ${val} into ${appState.heapType.toUpperCase()}-Heap.`;
  renderViewport('heap');
}

function opHeapExtract() {
  if (appState.heapData.length === 0) return;
  const root = appState.heapData[0];
  const end = appState.heapData.pop();
  if (appState.heapData.length > 0) {
    appState.heapData[0] = end;
    opHeapifyDown(0);
  }
  sound.playTone(30, 100, 0.1);
  document.getElementById('statusMessage').textContent = `Extracted root value: ${root}.`;
  renderViewport('heap');
}

function opHeapifyUp(idx) {
  let curr = idx;
  const isMax = appState.heapType === 'max';
  while (curr > 0) {
    const parent = Math.floor((curr - 1) / 2);
    const cond = isMax ? (appState.heapData[curr] > appState.heapData[parent]) : (appState.heapData[curr] < appState.heapData[parent]);
    if (cond) {
      [appState.heapData[curr], appState.heapData[parent]] = [appState.heapData[parent], appState.heapData[curr]];
      curr = parent;
    } else break;
  }
}

function opHeapifyDown(idx) {
  let curr = idx;
  const n = appState.heapData.length;
  const isMax = appState.heapType === 'max';
  while (2 * curr + 1 < n) {
    let child = 2 * curr + 1;
    if (child + 1 < n) {
      const cond = isMax ? (appState.heapData[child + 1] > appState.heapData[child]) : (appState.heapData[child + 1] < appState.heapData[child]);
      if (cond) child++;
    }
    const swapCond = isMax ? (appState.heapData[child] > appState.heapData[curr]) : (appState.heapData[child] < appState.heapData[curr]);
    if (swapCond) {
      [appState.heapData[curr], appState.heapData[child]] = [appState.heapData[child], appState.heapData[curr]];
      curr = child;
    } else break;
  }
}

function opHeapRebuild() {
  const n = appState.heapData.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) opHeapifyDown(i);
  renderViewport('heap');
}

function opHeapSample() {
  appState.heapData = appState.heapType === 'max' ? [95, 80, 75, 60, 50, 40, 30] : [10, 20, 30, 40, 50, 60, 70];
  renderViewport('heap');
}

function renderHeapGraph(container) {
  const wrap = document.createElement('div');
  wrap.style.display = 'flex';
  wrap.style.flexDirection = 'column';
  wrap.style.width = '100%';
  wrap.style.alignItems = 'center';
  wrap.style.gap = '14px';

  // Synchronized Array View below
  const arrTrack = document.createElement('div');
  arrTrack.className = 'array-track';
  appState.heapData.forEach((v, i) => {
    arrTrack.innerHTML += `
      <div class="array-cell-wrap">
        <span class="array-index">[${i}]</span>
        <div class="array-cell" id="heap-cell-${i}">${v}</div>
      </div>
    `;
  });

  // Tree View above
  const stage = document.createElement('div');
  stage.className = 'tree-stage';
  stage.style.height = '310px';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'tree-svg-canvas';
  const nodesLayer = document.createElement('div');
  nodesLayer.className = 'tree-nodes-layer';

  const width = container.clientWidth || 800;
  const n = appState.heapData.length;
  const coords = [];

  for (let i = 0; i < n; i++) {
    const level = Math.floor(Math.log2(i + 1));
    const itemsInLevel = Math.pow(2, level);
    const indexInLevel = i - (itemsInLevel - 1);
    const segWidth = width / itemsInLevel;
    const x = segWidth * indexInLevel + segWidth / 2;
    const y = 45 + level * 65;
    coords.push({x, y});

    if (i > 0) {
      const p = Math.floor((i - 1) / 2);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', coords[p].x);
      line.setAttribute('y1', coords[p].y);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      svg.appendChild(line);
    }

    const circle = document.createElement('div');
    circle.className = 'tree-node-circle';
    circle.id = `heap-node-${i}`;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.textContent = appState.heapData[i];
    nodesLayer.appendChild(circle);
  }

  stage.appendChild(svg);
  stage.appendChild(nodesLayer);
  wrap.appendChild(stage);
  wrap.appendChild(arrTrack);
  container.appendChild(wrap);
}

// ==========================================================================
// --- TRIE (PREFIX TREE) VISUALIZATION -------------------------------------
// ==========================================================================
function opTrieInsert(word) {
  if (!word) return;
  if (!appState.trieRoot) appState.trieRoot = { char: 'ROOT', children: {}, isEnd: false };
  let curr = appState.trieRoot;
  for (let c of word.toLowerCase()) {
    if (!curr.children[c]) curr.children[c] = { char: c, children: {}, isEnd: false };
    curr = curr.children[c];
  }
  curr.isEnd = true;
  sound.playTone(60, 100, 0.1);
  document.getElementById('statusMessage').textContent = `Inserted word '${word}' into Trie.`;
  renderViewport('trie');
}

async function opTrieSearch(query, exact) {
  if (!appState.trieRoot || !query || appState.isAnimating) return;
  appState.isAnimating = true;

  document.querySelectorAll('.tree-node-circle').forEach(c => {
    c.classList.remove('active', 'match');
  });

  let curr = appState.trieRoot;
  let path = '';
  let found = true;

  for (let c of query.toLowerCase()) {
    path += c;
    document.getElementById('statusMessage').textContent = `Matching character '${c}' along prefix '${path}'...`;
    if (!curr.children[c]) {
      found = false;
      break;
    }
    curr = curr.children[c];
    const circle = document.getElementById(`trie-node-${path}`);
    if (circle) circle.classList.add('active');
    sound.playTone(c.charCodeAt(0), 120, 0.18);
    await sleep(getSpeedDelay(750));
  }

  if (found && (!exact || curr.isEnd)) {
    const circle = document.getElementById(`trie-node-${path}`);
    if (circle) circle.classList.add('match');
    sound.playSuccess();
    document.getElementById('statusMessage').textContent = `Match found for '${query}' in Trie!`;
  } else if (found && exact && !curr.isEnd) {
    document.getElementById('statusMessage').textContent = `'${query}' exists as a prefix, but is not marked as a completed word.`;
    sound.playTone(45, 100, 0.25);
  } else {
    document.getElementById('statusMessage').textContent = `Character mismatch: '${query}' not found in Trie.`;
    sound.playError();
  }

  appState.isAnimating = false;
}

function opTrieClear() {
  appState.trieRoot = { char: 'ROOT', children: {}, isEnd: false };
  renderViewport('trie');
}

function renderTrieGraph(container, root) {
  const stage = document.createElement('div');
  stage.className = 'tree-stage';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'tree-svg-canvas';
  const nodesLayer = document.createElement('div');
  nodesLayer.className = 'tree-nodes-layer';

  const width = container.clientWidth || 800;

  const traverse = (node, path = '', depth = 0, l = 0, r = width) => {
    node.x = (l + r) / 2;
    node.y = 45 + depth * 70;
    const childKeys = Object.keys(node.children);
    const span = (r - l) / (childKeys.length || 1);

    childKeys.forEach((k, idx) => {
      const child = node.children[k];
      const childL = l + idx * span;
      const childR = childL + span;
      const childPath = path ? `${path}${k}` : k;
      traverse(child, childPath, depth + 1, childL, childR);

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', child.x);
      line.setAttribute('y2', child.y);
      svg.appendChild(line);
    });

    const circle = document.createElement('div');
    circle.className = `tree-node-circle ${node.isEnd ? 'match' : ''}`;
    circle.id = `trie-node-${path || 'root'}`;
    circle.style.left = `${node.x}px`;
    circle.style.top = `${node.y}px`;
    circle.textContent = node.char;

    if (node.isEnd) {
      const badge = document.createElement('span');
      badge.className = 'tree-node-badge';
      badge.textContent = 'END';
      circle.appendChild(badge);
    }

    nodesLayer.appendChild(circle);
  };

  traverse(root, '', 0, 0, width);
  stage.appendChild(svg);
  stage.appendChild(nodesLayer);
  container.appendChild(stage);
}

// ==========================================================================
// --- B-TREE VISUALIZATION -------------------------------------------------
// ==========================================================================
function renderBTreeGraph(container) {
  const stage = document.createElement('div');
  stage.className = 'tree-stage';
  stage.innerHTML = `
    <div style="display:flex; flex-direction:column; align-items:center; gap:26px; padding:35px 20px;">
      <div class="btree-node-block" id="btree-root" style="position:relative;">
        <span class="btree-key" id="bt-key-30">30</span>
        <span class="btree-key" id="bt-key-60">60</span>
      </div>
      <div style="display:flex; gap:40px;">
        <div class="btree-node-block" id="btree-child-0" style="position:relative;">
          <span class="btree-key" id="bt-key-10">10</span>
          <span class="btree-key" id="bt-key-20">20</span>
        </div>
        <div class="btree-node-block" id="btree-child-1" style="position:relative;">
          <span class="btree-key" id="bt-key-40">40</span>
          <span class="btree-key" id="bt-key-50">50</span>
        </div>
        <div class="btree-node-block" id="btree-child-2" style="position:relative;">
          <span class="btree-key" id="bt-key-70">70</span>
          <span class="btree-key" id="bt-key-80">80</span>
        </div>
      </div>
    </div>
  `;
  container.appendChild(stage);
}

async function opBTreeSearch(target) {
  if (appState.isAnimating) return;
  appState.isAnimating = true;

  document.querySelectorAll('.btree-key').forEach(k => {
    k.style.background = '';
    k.style.color = '';
  });

  document.getElementById('statusMessage').textContent = `Searching B-Tree for key ${target}...`;

  // Step 1: Root Block
  const rootBlock = document.getElementById('btree-root');
  if (rootBlock) rootBlock.style.borderColor = '#fde047';
  document.getElementById('statusMessage').textContent = `Inspecting Root Block [30, 60] for key ${target}...`;
  sound.playTone(50, 100, 0.2);
  await sleep(getSpeedDelay(900));

  let targetKeyEl = document.getElementById(`bt-key-${target}`);
  if (target === 30 || target === 60) {
    if (targetKeyEl) {
      targetKeyEl.style.background = 'var(--accent-emerald)';
      targetKeyEl.style.color = 'black';
    }
    sound.playSuccess();
    document.getElementById('statusMessage').textContent = `Found key ${target} in Root Block!`;
  } else {
    // Step 2: Branch down
    let childId = '';
    let msg = '';
    if (target < 30) {
      childId = 'btree-child-0';
      msg = `${target} < 30 -> Traversing to Left Child Block [10, 20]...`;
    } else if (target < 60) {
      childId = 'btree-child-1';
      msg = `30 < ${target} < 60 -> Traversing to Middle Child Block [40, 50]...`;
    } else {
      childId = 'btree-child-2';
      msg = `${target} > 60 -> Traversing to Right Child Block [70, 80]...`;
    }

    if (rootBlock) rootBlock.style.borderColor = '';
    const childBlock = document.getElementById(childId);
    if (childBlock) childBlock.style.borderColor = '#fde047';
    document.getElementById('statusMessage').textContent = msg;
    sound.playTone(70, 100, 0.2);
    await sleep(getSpeedDelay(1000));

    if (targetKeyEl) {
      targetKeyEl.style.background = 'var(--accent-emerald)';
      targetKeyEl.style.color = 'black';
      sound.playSuccess();
      document.getElementById('statusMessage').textContent = `Found key ${target} in Child Block!`;
    } else {
      document.getElementById('statusMessage').textContent = `Key ${target} not found in B-Tree.`;
      sound.playError();
    }
    setTimeout(() => {
      if (childBlock) childBlock.style.borderColor = '';
    }, getSpeedDelay(1500));
  }

  appState.isAnimating = false;
}

// ==========================================================================
// --- SEGMENT TREE VISUALIZATION -------------------------------------------
// ==========================================================================
class SegTreeNode {
  constructor(l, r, val) {
    this.l = l;
    this.r = r;
    this.val = val;
    this.left = null;
    this.right = null;
    this.id = `${l}-${r}`;
    this.x = 0;
    this.y = 0;
  }
}

function buildSegTree(arr, l, r) {
  if (l === r) return new SegTreeNode(l, r, arr[l]);
  const mid = Math.floor((l + r) / 2);
  const node = new SegTreeNode(l, r, 0);
  node.left = buildSegTree(arr, l, mid);
  node.right = buildSegTree(arr, mid + 1, r);
  node.val = node.left.val + node.right.val;
  return node;
}

function renderSegTreeGraph(container) {
  const stage = document.createElement('div');
  stage.className = 'tree-stage';
  stage.style.height = '420px';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'tree-svg-canvas';
  const nodesLayer = document.createElement('div');
  nodesLayer.className = 'tree-nodes-layer';

  const root = buildSegTree(appState.segArray, 0, appState.segArray.length - 1);
  const width = container.clientWidth || 800;

  const assignCoords = (node, depth = 0, l = 0, r = width) => {
    if (!node) return;
    node.x = (l + r) / 2;
    node.y = 45 + depth * 75;
    assignCoords(node.left, depth + 1, l, node.x);
    assignCoords(node.right, depth + 1, node.x, r);
  };
  assignCoords(root);

  const draw = (node) => {
    if (!node) return;
    if (node.left) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.left.x);
      line.setAttribute('y2', node.left.y);
      line.id = `seg-edge-${node.id}-${node.left.id}`;
      svg.appendChild(line);
      draw(node.left);
    }
    if (node.right) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.right.x);
      line.setAttribute('y2', node.right.y);
      line.id = `seg-edge-${node.id}-${node.right.id}`;
      svg.appendChild(line);
      draw(node.right);
    }

    const box = document.createElement('div');
    box.className = 'segtree-node-box';
    box.id = `seg-node-${node.id}`;
    box.style.left = `${node.x}px`;
    box.style.top = `${node.y}px`;
    box.innerHTML = `
      <span class="seg-range">[${node.l}..${node.r}]</span>
      <span class="seg-val">${node.val}</span>
    `;
    nodesLayer.appendChild(box);
  };

  draw(root);
  stage.appendChild(svg);
  stage.appendChild(nodesLayer);
  container.appendChild(stage);
}

async function opSegQuery(ql, qr) {
  if (ql < 0 || qr >= appState.segArray.length || ql > qr || appState.isAnimating) return;
  appState.isAnimating = true;

  document.querySelectorAll('.segtree-node-box').forEach(b => {
    b.classList.remove('active', 'match');
  });

  const root = buildSegTree(appState.segArray, 0, appState.segArray.length - 1);
  let totalSum = 0;
  const parts = [];

  const queryAsync = async (node) => {
    if (!node) return 0;
    const box = document.getElementById(`seg-node-${node.id}`);

    // Outside query range
    if (node.r < ql || node.l > qr) {
      document.getElementById('statusMessage').textContent = `Interval [${node.l}..${node.r}] outside query range [${ql}..${qr}], skipping branch.`;
      await sleep(getSpeedDelay(450));
      return 0;
    }

    // Completely inside query range
    if (ql <= node.l && node.r <= qr) {
      if (box) box.classList.add('match');
      sound.playTone(node.val, 100, 0.25);
      parts.push(`[${node.l}..${node.r}]=${node.val}`);
      totalSum += node.val;
      document.getElementById('statusMessage').textContent = `Interval [${node.l}..${node.r}] matches completely! Adding +${node.val} -> Running sum: ${totalSum}`;
      await sleep(getSpeedDelay(1000));
      return node.val;
    }

    // Partially overlaps query range
    if (box) box.classList.add('active');
    document.getElementById('statusMessage').textContent = `Interval [${node.l}..${node.r}] partially overlaps [${ql}..${qr}]. Dividing into left & right children...`;
    sound.playTone(50, 100, 0.15);
    await sleep(getSpeedDelay(850));

    const leftSum = await queryAsync(node.left);
    const rightSum = await queryAsync(node.right);
    return leftSum + rightSum;
  };

  await queryAsync(root);
  sound.playSuccess();
  document.getElementById('statusMessage').textContent = `Range Sum [${ql}..${qr}] = ${totalSum} (${parts.join(' + ')})`;
  appState.isAnimating = false;
}

function opSegReset() {
  appState.segArray = [1, 3, 5, 7, 9, 11];
  renderViewport('segtree');
}

// ==========================================================================
// --- FENWICK TREE (BIT) VISUALIZATION -------------------------------------
// ==========================================================================
async function opFenwickQuery(idx) {
  if (idx < 1 || idx > 7 || appState.isAnimating) return;
  appState.isAnimating = true;

  document.querySelectorAll('.array-cell').forEach(c => c.classList.remove('active-inspect', 'active-match'));

  let sum = 0;
  let i = idx;
  const steps = [];

  while (i > 0) {
    const cell = document.getElementById(`fenwick-cell-${i}`);
    if (cell) cell.classList.add('active-inspect');
    sum += appState.fenwickData[i];
    steps.push(`tree[${i}](${appState.fenwickData[i]})`);
    sound.playTone(sum, 100, 0.2);
    document.getElementById('statusMessage').textContent = `Reading BIT cell i=${i} (LSB: ${i & -i}). Adding ${appState.fenwickData[i]} -> Partial Sum: ${sum}`;
    await sleep(getSpeedDelay(900));
    if (cell) {
      cell.classList.remove('active-inspect');
      cell.classList.add('active-match');
    }
    const nextI = i - (i & -i);
    document.getElementById('statusMessage').textContent = `Bit jump: i = i - (i & -i) = ${i} - ${i & -i} = ${nextI}`;
    i = nextI;
    await sleep(getSpeedDelay(450));
  }

  sound.playSuccess();
  document.getElementById('statusMessage').textContent = `Prefix Sum Query(1..${idx}) = ${sum} (${steps.join(' + ')})`;
  appState.isAnimating = false;
}

async function opFenwickUpdate(idx, delta) {
  if (idx < 1 || idx > 7 || appState.isAnimating) return;
  appState.isAnimating = true;

  document.querySelectorAll('.array-cell').forEach(c => c.classList.remove('active-inspect', 'active-match'));

  let i = idx;
  while (i <= 7) {
    const cell = document.getElementById(`fenwick-cell-${i}`);
    if (cell) cell.classList.add('active-inspect');
    appState.fenwickData[i] += delta;
    sound.playTone(appState.fenwickData[i], 100, 0.2);
    if (cell) cell.textContent = appState.fenwickData[i];
    document.getElementById('statusMessage').textContent = `Updated cell tree[${i}] -> added ${delta} to ancestors (new val: ${appState.fenwickData[i]}).`;
    await sleep(getSpeedDelay(850));
    if (cell) {
      cell.classList.remove('active-inspect');
      cell.classList.add('active-match');
    }
    const nextI = i + (i & -i);
    document.getElementById('statusMessage').textContent = `Bit jump: i = i + (i & -i) = ${i} + ${i & -i} = ${nextI}`;
    i = nextI;
    await sleep(getSpeedDelay(400));
  }

  sound.playSuccess();
  appState.isAnimating = false;
}

function renderFenwickVisual(container) {
  const grid = document.createElement('div');
  grid.className = 'array-track';
  for (let i = 1; i <= 7; i++) {
    const bit = (i).toString(2).padStart(4, '0');
    grid.innerHTML += `
      <div class="array-cell-wrap">
        <span class="array-index">i=${i} (${bit})</span>
        <div class="array-cell" id="fenwick-cell-${i}">${appState.fenwickData[i]}</div>
        <span style="font-size:0.65rem; color:#64748b; font-family:var(--font-mono);">LSB: ${i & -i}</span>
      </div>
    `;
  }
  container.appendChild(grid);
}

// ==========================================================================
// --- SYNTAX TREE / AST VISUALIZATION --------------------------------------
// ==========================================================================
function renderAstGraph(container) {
  const stage = document.createElement('div');
  stage.className = 'tree-stage';
  stage.style.height = '360px';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'tree-svg-canvas';
  const nodesLayer = document.createElement('div');
  nodesLayer.className = 'tree-nodes-layer';

  // AST: (3 + 5) * (10 - 2)
  const astData = {
    id: "ast-root",
    label: "*",
    isOp: true,
    x: 400, y: 55,
    left: {
      id: "ast-add",
      label: "+",
      isOp: true,
      x: 240, y: 150,
      left: { id: "ast-3", label: "3", isOp: false, x: 170, y: 250 },
      right: { id: "ast-5", label: "5", isOp: false, x: 310, y: 250 }
    },
    right: {
      id: "ast-sub",
      label: "-",
      isOp: true,
      x: 560, y: 150,
      left: { id: "ast-10", label: "10", isOp: false, x: 490, y: 250 },
      right: { id: "ast-2", label: "2", isOp: false, x: 630, y: 250 }
    }
  };

  const draw = (node) => {
    if (!node) return;
    if (node.left) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.left.x);
      line.setAttribute('y2', node.left.y);
      line.id = `ast-edge-${node.id}-${node.left.id}`;
      svg.appendChild(line);
      draw(node.left);
    }
    if (node.right) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', node.x);
      line.setAttribute('y1', node.y);
      line.setAttribute('x2', node.right.x);
      line.setAttribute('y2', node.right.y);
      line.id = `ast-edge-${node.id}-${node.right.id}`;
      svg.appendChild(line);
      draw(node.right);
    }

    const circle = document.createElement('div');
    circle.className = `ast-node-circle ${node.isOp ? 'op' : ''}`;
    circle.id = node.id;
    circle.style.left = `${node.x}px`;
    circle.style.top = `${node.y}px`;
    circle.textContent = node.label;
    nodesLayer.appendChild(circle);
  };

  draw(astData);
  stage.appendChild(svg);
  stage.appendChild(nodesLayer);
  container.appendChild(stage);
}

async function opAstEvaluate() {
  if (appState.isAnimating) return;
  appState.isAnimating = true;

  document.getElementById('statusMessage').textContent = 'Step 1: Inspecting left operands 3 and 5...';
  const n3 = document.getElementById('ast-3');
  const n5 = document.getElementById('ast-5');
  const nAdd = document.getElementById('ast-add');

  if (n3) n3.classList.add('active');
  if (n5) n5.classList.add('active');
  sound.playTone(40, 100, 0.2);
  await sleep(getSpeedDelay(1000));

  if (nAdd) {
    nAdd.classList.add('match');
    nAdd.textContent = '8';
  }
  sound.playTone(80, 100, 0.25);
  document.getElementById('statusMessage').textContent = 'Left subexpression evaluated: 3 + 5 = 8. Now moving to right operands 10 and 2...';
  await sleep(getSpeedDelay(1100));

  const n10 = document.getElementById('ast-10');
  const n2 = document.getElementById('ast-2');
  const nSub = document.getElementById('ast-sub');

  if (n10) n10.classList.add('active');
  if (n2) n2.classList.add('active');
  sound.playTone(40, 100, 0.2);
  await sleep(getSpeedDelay(1000));

  if (nSub) {
    nSub.classList.add('match');
    nSub.textContent = '8';
  }
  sound.playTone(80, 100, 0.25);
  document.getElementById('statusMessage').textContent = 'Right subexpression evaluated: 10 - 2 = 8. Now evaluating root operator (*)...';
  await sleep(getSpeedDelay(1100));

  const nRoot = document.getElementById('ast-root');
  if (nRoot) {
    nRoot.classList.add('match');
    nRoot.textContent = '64';
  }
  sound.playSuccess();
  document.getElementById('statusMessage').textContent = 'AST Fully Evaluated: (3 + 5) * (10 - 2) = 8 * 8 = 64!';
  appState.isAnimating = false;
}

// ==========================================================================
// --- GRAPH STUDIO ENGINE & REPRESENTATIONS --------------------------------
// ==========================================================================
function renderGraphStudio(container) {
  const stage = document.createElement('div');
  stage.className = 'tree-stage';
  stage.style.height = '380px';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.className = 'tree-svg-canvas';
  const nodesLayer = document.createElement('div');
  nodesLayer.className = 'tree-nodes-layer';

  // Arrow markers for directed graphs
  svg.innerHTML = `
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8"/>
      </marker>
    </defs>
  `;

  // Draw Edges
  appState.graphEdges.forEach(e => {
    const uNode = appState.graphNodes.find(n => n.id === e.u);
    const vNode = appState.graphNodes.find(n => n.id === e.v);
    if (!uNode || !vNode) return;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', uNode.x);
    line.setAttribute('y1', uNode.y);
    line.setAttribute('x2', vNode.x);
    line.setAttribute('y2', vNode.y);
    line.id = `graph-edge-${e.u}-${e.v}`;
    if (appState.graphDirected) line.setAttribute('marker-end', 'url(#arrow)');
    svg.appendChild(line);

    // Edge weight label
    if (appState.graphWeighted) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', (uNode.x + vNode.x) / 2 + 6);
      text.setAttribute('y', (uNode.y + vNode.y) / 2 - 6);
      text.setAttribute('fill', '#fde047');
      text.setAttribute('font-family', 'var(--font-mono)');
      text.setAttribute('font-size', '12px');
      text.setAttribute('font-weight', '700');
      text.textContent = e.w;
      svg.appendChild(text);
    }
  });

  // Draw Nodes
  appState.graphNodes.forEach(node => {
    const circle = document.createElement('div');
    circle.className = 'tree-node-circle';
    circle.id = `graph-node-${node.id}`;
    circle.style.left = `${node.x}px`;
    circle.style.top = `${node.y}px`;
    circle.textContent = node.id;
    nodesLayer.appendChild(circle);
  });

  stage.appendChild(svg);
  stage.appendChild(nodesLayer);
  container.appendChild(stage);
}

function initGraphReprTabs() {
  const tabs = document.querySelectorAll('.repr-tab-btn');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(btn => btn.classList.remove('active'));
      t.classList.add('active');
      appState.activeGraphRepr = t.getAttribute('data-repr');
      renderGraphRepr();
    });
  });
}

function renderGraphRepr() {
  const content = document.getElementById('reprContent');
  if (!content) return;

  const nodes = appState.graphNodes.map(n => n.id);

  if (appState.activeGraphRepr === 'adjList') {
    let html = '<div style="display:flex; flex-direction:column; gap:6px;">';
    nodes.forEach(u => {
      const neighbors = [];
      appState.graphEdges.forEach(e => {
        if (e.u === u) neighbors.push(appState.graphWeighted ? `${e.v} (w:${e.w})` : e.v);
        if (!appState.graphDirected && e.v === u) neighbors.push(appState.graphWeighted ? `${e.u} (w:${e.w})` : e.u);
      });
      html += `<div><strong style="color:var(--accent-secondary)">${u}</strong> -&gt; [ ${neighbors.join(', ') || 'None'} ]</div>`;
    });
    html += '</div>';
    content.innerHTML = html;
  } else if (appState.activeGraphRepr === 'adjMatrix') {
    let table = '<table class="matrix-table"><tr><th></th>';
    nodes.forEach(n => table += `<th>${n}</th>`);
    table += '</tr>';

    nodes.forEach(u => {
      table += `<tr><th>${u}</th>`;
      nodes.forEach(v => {
        let weight = 0;
        appState.graphEdges.forEach(e => {
          if (e.u === u && e.v === v) weight = e.w;
          if (!appState.graphDirected && e.v === u && e.u === v) weight = e.w;
        });
        table += `<td>${weight}</td>`;
      });
      table += '</tr>';
    });
    table += '</table>';
    content.innerHTML = table;
  } else if (appState.activeGraphRepr === 'edgeList') {
    let list = 'Edges: ';
    list += appState.graphEdges.map(e => appState.graphWeighted ? `(${e.u} -> ${e.v}, w:${e.w})` : `(${e.u} -> ${e.v})`).join(', ');
    content.innerHTML = list;
  }
}

async function opGraphBFS(start) {
  if (appState.isAnimating) return;
  appState.isAnimating = true;

  document.querySelectorAll('.tree-node-circle').forEach(c => c.classList.remove('active', 'match', 'visited'));
  document.querySelectorAll('.tree-svg-canvas line').forEach(l => l.classList.remove('edge-active', 'edge-path'));

  const queue = [start];
  const visited = new Set([start]);
  const order = [];

  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);

    const uNode = document.getElementById(`graph-node-${u}`);
    if (uNode) uNode.classList.add('active');
    sound.playTone(u.charCodeAt(0) * 3, 250, 0.2);
    document.getElementById('statusMessage').textContent = `BFS: Dequeued Vertex ${u}. Scanning outgoing edges...`;
    await sleep(getSpeedDelay(900));

    const newlyEnqueued = [];
    for (let e of appState.graphEdges) {
      let next = null;
      let edgeEl = null;

      if (e.u === u) {
        next = e.v;
        edgeEl = document.getElementById(`graph-edge-${e.u}-${e.v}`);
      } else if (!appState.graphDirected && e.v === u) {
        next = e.u;
        edgeEl = document.getElementById(`graph-edge-${e.u}-${e.v}`);
      }

      if (next && !visited.has(next)) {
        visited.add(next);
        queue.push(next);
        newlyEnqueued.push(next);
        if (edgeEl) edgeEl.classList.add('edge-active');
        const nextNode = document.getElementById(`graph-node-${next}`);
        if (nextNode) nextNode.classList.add('visited');
      }
    }

    if (newlyEnqueued.length > 0) {
      document.getElementById('statusMessage').textContent = `From ${u}: Enqueued unvisited neighbors [ ${newlyEnqueued.join(', ')} ]. Queue: [ ${queue.join(', ')} ]`;
      await sleep(getSpeedDelay(750));
    }

    if (uNode) {
      uNode.classList.remove('active');
      uNode.classList.add('match');
    }
  }

  sound.playSuccess();
  document.getElementById('statusMessage').textContent = `BFS Traversal Finished! Complete Order: ${order.join(' -> ')}`;
  appState.isAnimating = false;
}

async function opGraphDFS(start) {
  if (appState.isAnimating) return;
  appState.isAnimating = true;

  document.querySelectorAll('.tree-node-circle').forEach(c => c.classList.remove('active', 'match', 'visited'));
  document.querySelectorAll('.tree-svg-canvas line').forEach(l => l.classList.remove('edge-active', 'edge-path'));

  const visited = new Set();
  const order = [];

  const dfs = async (u) => {
    visited.add(u);
    order.push(u);

    const uNode = document.getElementById(`graph-node-${u}`);
    if (uNode) uNode.classList.add('active');
    sound.playTone(u.charCodeAt(0) * 3, 250, 0.2);
    document.getElementById('statusMessage').textContent = `DFS Visiting Vertex ${u} | Call Stack Depth: ${order.length} | Visited: ${order.join(' -> ')}`;
    await sleep(getSpeedDelay(950));

    if (uNode) {
      uNode.classList.remove('active');
      uNode.classList.add('match');
    }

    for (let e of appState.graphEdges) {
      let next = null;
      let edgeEl = document.getElementById(`graph-edge-${e.u}-${e.v}`);

      if (e.u === u) next = e.v;
      else if (!appState.graphDirected && e.v === u) next = e.u;

      if (next && !visited.has(next)) {
        if (edgeEl) edgeEl.classList.add('edge-active');
        document.getElementById('statusMessage').textContent = `Advancing down edge ${u} -> ${next}...`;
        await sleep(getSpeedDelay(500));
        await dfs(next);
        document.getElementById('statusMessage').textContent = `Backtracking to vertex ${u}...`;
        await sleep(getSpeedDelay(500));
      }
    }
  };

  await dfs(start);
  sound.playSuccess();
  document.getElementById('statusMessage').textContent = `DFS Traversal Finished! Order: ${order.join(' -> ')}`;
  appState.isAnimating = false;
}

async function opGraphDijkstra(start, target) {
  if (appState.isAnimating) return;
  appState.isAnimating = true;

  document.querySelectorAll('.tree-node-circle').forEach(c => c.classList.remove('active', 'match', 'visited'));
  document.querySelectorAll('.tree-svg-canvas line').forEach(l => l.classList.remove('edge-active', 'edge-path'));

  const dist = {};
  const prev = {};
  const unvisited = new Set(appState.graphNodes.map(n => n.id));

  appState.graphNodes.forEach(n => dist[n.id] = Infinity);
  dist[start] = 0;

  while (unvisited.size > 0) {
    let u = null;
    unvisited.forEach(node => {
      if (u === null || dist[node] < dist[u]) u = node;
    });

    if (dist[u] === Infinity || u === target) break;
    unvisited.delete(u);

    const uNode = document.getElementById(`graph-node-${u}`);
    if (uNode) uNode.classList.add('active');
    sound.playTone(dist[u] * 10 + 40, 200, 0.2);
    document.getElementById('statusMessage').textContent = `Dijkstra: Selected Vertex ${u} with minimum tentative distance = ${dist[u]}. Relaxing neighbor edges...`;
    await sleep(getSpeedDelay(950));

    for (let e of appState.graphEdges) {
      let v = null;
      let edgeEl = document.getElementById(`graph-edge-${e.u}-${e.v}`);

      if (e.u === u) v = e.v;
      else if (!appState.graphDirected && e.v === u) v = e.u;

      if (v && unvisited.has(v)) {
        if (edgeEl) edgeEl.classList.add('edge-active');
        const alt = dist[u] + e.w;
        if (alt < dist[v]) {
          document.getElementById('statusMessage').textContent = `Relaxing edge ${u} -> ${v} (weight ${e.w}): Found shorter distance ${alt} < ${dist[v] === Infinity ? 'Infinity' : dist[v]}!`;
          dist[v] = alt;
          prev[v] = u;
          const vNode = document.getElementById(`graph-node-${v}`);
          if (vNode) vNode.classList.add('visited');
          await sleep(getSpeedDelay(750));
        }
      }
    }

    if (uNode) {
      uNode.classList.remove('active');
      uNode.classList.add('match');
    }
  }

  const path = [];
  let curr = target;
  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }

  if (dist[target] !== Infinity && path[0] === start) {
    document.getElementById('statusMessage').textContent = `Tracing shortest path from ${start} to ${target}...`;
    await sleep(getSpeedDelay(700));

    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i];
      const v = path[i + 1];
      const line = document.getElementById(`graph-edge-${u}-${v}`) || document.getElementById(`graph-edge-${v}-${u}`);
      if (line) {
        line.classList.remove('edge-active');
        line.classList.add('edge-path');
      }
      const nodeEl = document.getElementById(`graph-node-${v}`);
      if (nodeEl) nodeEl.classList.add('match');
      sound.playTone(80 + i * 15, 120, 0.2);
      await sleep(getSpeedDelay(600));
    }
    sound.playSuccess();
    document.getElementById('statusMessage').textContent = `Dijkstra Shortest Path (${start} -> ${target}): ${path.join(' -> ')} (Total Cost: ${dist[target]})`;
  } else {
    document.getElementById('statusMessage').textContent = `No path exists from ${start} to ${target}.`;
    sound.playError();
  }

  appState.isAnimating = false;
}

function opGraphReset() {
  appState.graphDirected = false;
  appState.graphWeighted = true;
  renderViewport('graph_studio');
  renderGraphRepr();
}

// ==========================================================================
// --- ALGORITHMS: SORTING & SEARCHING ENGINE -------------------------------
// ==========================================================================
function initAlgoArray() {
  appState.algoArray = Array.from({length: 20}, () => Math.floor(Math.random() * 88) + 12);
  if (appState.currentStructure === 'searching' && appState.algoType === 'binary') {
    appState.algoArray.sort((a, b) => a - b);
  }
  appState.algoComparisons = 0;
  appState.algoSwaps = 0;
  appState.algoGenerator = null;
  appState.algoRunning = false;
  clearTimeout(appState.algoTimer);
  renderViewport(appState.currentStructure);
}

function renderAlgoBars(container) {
  const track = document.createElement('div');
  track.className = 'bars-container';
  const max = Math.max(...appState.algoArray, 100);

  appState.algoArray.forEach((v, i) => {
    track.innerHTML += `
      <div class="bar-wrapper" id="algo-wrap-${i}">
        <div class="bar" id="algo-bar-${i}" style="height:${(v / max) * 90}%">
          <span class="bar-value">${v}</span>
        </div>
      </div>
    `;
  });
  container.appendChild(track);
}

// Sorting Generators
function* bubbleSortGen(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      yield { type: 'compare', a: j, b: j + 1 };
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield { type: 'swap', a: j, b: j + 1, va: arr[j], vb: arr[j + 1] };
      }
    }
    yield { type: 'sorted', idx: n - i - 1 };
  }
  yield { type: 'done' };
}

function* selectionSortGen(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      yield { type: 'compare', a: minIdx, b: j };
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      yield { type: 'swap', a: i, b: minIdx, va: arr[i], vb: arr[minIdx] };
    }
    yield { type: 'sorted', idx: i };
  }
  yield { type: 'done' };
}

function* insertionSortGen(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      yield { type: 'compare', a: j - 1, b: j };
      if (arr[j] < arr[j - 1]) {
        [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
        yield { type: 'swap', a: j, b: j - 1, va: arr[j], vb: arr[j - 1] };
        j--;
      } else break;
    }
  }
  for (let i = 0; i < n; i++) yield { type: 'sorted', idx: i };
  yield { type: 'done' };
}

// Searching Generators
function* linearSearchGen(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    yield { type: 'compare', a: i, b: i };
    if (arr[i] === target) {
      yield { type: 'found', idx: i };
      return;
    }
  }
  yield { type: 'notFound' };
}

function* binarySearchGen(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    yield { type: 'binaryMid', low, mid, high };
    yield { type: 'compare', a: mid, b: mid };
    if (arr[mid] === target) {
      yield { type: 'found', idx: mid };
      return;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  yield { type: 'notFound' };
}

function startAlgo() {
  if (!appState.algoGenerator) {
    initAlgoGenerator();
  }
  appState.algoRunning = true;
  runAlgoLoop();
}

function stepAlgo() {
  if (!appState.algoGenerator) {
    initAlgoGenerator();
  }
  const next = appState.algoGenerator.next();
  if (!next.done) processAlgoAct(next.value);
}

function initAlgoGenerator() {
  const isSearch = (appState.currentStructure === 'searching');
  if (isSearch) {
    if (appState.algoType === 'binary') {
      appState.algoArray.sort((a, b) => a - b);
      renderViewport('searching');
      appState.algoGenerator = binarySearchGen(appState.algoArray, appState.algoTarget);
    } else {
      appState.algoGenerator = linearSearchGen(appState.algoArray, appState.algoTarget);
    }
  } else {
    if (appState.algoType === 'selection') appState.algoGenerator = selectionSortGen(appState.algoArray);
    else if (appState.algoType === 'insertion') appState.algoGenerator = insertionSortGen(appState.algoArray);
    else appState.algoGenerator = bubbleSortGen(appState.algoArray);
  }
}

function processAlgoAct(act) {
  // Clear previous transient highlights
  document.querySelectorAll('.bar').forEach(b => {
    b.classList.remove('comparing', 'swapping');
  });

  if (act.type === 'compare') {
    appState.algoComparisons++;
    const bA = document.getElementById(`algo-bar-${act.a}`);
    const bB = document.getElementById(`algo-bar-${act.b}`);
    if (bA) bA.classList.add('comparing');
    if (bB) bB.classList.add('comparing');
    sound.playTone(appState.algoArray[act.a]);
  } else if (act.type === 'swap') {
    appState.algoSwaps++;
    const bA = document.getElementById(`algo-bar-${act.a}`);
    const bB = document.getElementById(`algo-bar-${act.b}`);
    if (bA && bB) {
      bA.classList.add('swapping');
      bB.classList.add('swapping');
      bA.style.height = `${(act.va / 100) * 90}%`;
      bB.style.height = `${(act.vb / 100) * 90}%`;
      bA.querySelector('.bar-value').textContent = act.va;
      bB.querySelector('.bar-value').textContent = act.vb;
    }
    sound.playTone(act.va, 100, 0.12);
  } else if (act.type === 'sorted') {
    const b = document.getElementById(`algo-bar-${act.idx}`);
    if (b) b.classList.add('sorted');
  } else if (act.type === 'found') {
    const b = document.getElementById(`algo-bar-${act.idx}`);
    if (b) b.classList.add('found');
    sound.playSuccess();
    document.getElementById('statusMessage').textContent = `Target ${appState.algoTarget} found at index ${act.idx}!`;
  } else if (act.type === 'notFound') {
    sound.playError();
    document.getElementById('statusMessage').textContent = `Target ${appState.algoTarget} not found in array.`;
  } else if (act.type === 'done') {
    sound.playSuccess();
    document.getElementById('statusMessage').textContent = 'Sorting completed successfully!';
  }

  document.getElementById('metricValue2').textContent = `Comparisons: ${appState.algoComparisons}`;
  document.getElementById('metricValue3').textContent = `Swaps: ${appState.algoSwaps}`;
}

function runAlgoLoop() {
  if (!appState.algoRunning) return;
  const next = appState.algoGenerator.next();
  if (!next.done) {
    processAlgoAct(next.value);
    appState.algoTimer = setTimeout(runAlgoLoop, getAlgoDelay());
  } else {
    appState.algoRunning = false;
    document.getElementById('statusMessage').textContent = 'Algorithm finished successfully!';
  }
}

// ==========================================================================
// --- STRUCTIFY AI COPILOT & ALGORITHMIC INTELLIGENCE ----------------------
// ==========================================================================

const AI_COPILOT_KNOWLEDGE = {
  array: {
    title: "Array Data Structure",
    summary: "Contiguous fixed-size memory block providing O(1) random access via memory address arithmetic (Base + Index * ElementSize).",
    strengths: "Instant O(1) reads, optimal CPU cache locality due to spatial contiguity.",
    tradeoffs: "O(n) insertions and deletions due to required element shifting. Fixed capacity upon allocation.",
    insights: "Arrays excel when read operations outnumber modifications and data bounds are known ahead of time."
  },
  dynarray: {
    title: "Dynamic Resizable Array (Vector / ArrayList)",
    summary: "Array that automatically doubles in capacity (geometric scaling) upon reaching saturation to provide amortized O(1) appends.",
    strengths: "Flexible size with O(1) amortized appends and O(1) random indexing.",
    tradeoffs: "Occasional O(n) worst-case reallocation cost when copying existing elements to the newly doubled block.",
    insights: "Doubling factor (x2 or x1.5) amortizes the resize cost over N subsequent insertions, maintaining O(1) average time."
  },
  sll: {
    title: "Singly Linked List",
    summary: "Linear sequence of nodes where each node contains data and a single forward reference ('next') pointing to the successor node.",
    strengths: "O(1) head insertion/deletion without shifting elements. Dynamic memory usage.",
    tradeoffs: "No O(1) random indexing (requires O(n) traversal). Extra pointer overhead per node; poor cache locality.",
    insights: "Singly linked lists are ideal for queue or stack backends where sequential or front-only access dominates."
  },
  dll: {
    title: "Doubly Linked List",
    summary: "Node sequence where each node contains data and bidirectional pointers ('next' and 'prev').",
    strengths: "Bidirectional traversal. O(1) node deletion given a direct pointer to the target node.",
    tradeoffs: "Increased memory consumption (two pointers per node) and slightly higher maintenance cost during pointer updates.",
    insights: "Standard backbone for LRU caches, browser history stacks, and double-ended queues."
  },
  stack: {
    title: "Stack (LIFO)",
    summary: "Last-In, First-Out abstract data type where insertions (push) and removals (pop) occur exclusively at the top index/pointer.",
    strengths: "Strict O(1) push, pop, and peek operations with minimal memory overhead.",
    tradeoffs: "No random access to internal elements without unwinding the stack.",
    insights: "Fundamental to compiler call stacks, expression evaluation (shunting-yard), undo/redo stacks, and backtracking (DFS)."
  },
  queue: {
    title: "Queue (FIFO)",
    summary: "First-In, First-Out structure where items are enqueued at the rear and dequeued from the front.",
    strengths: "Fair sequential scheduling with guaranteed O(1) enqueue and dequeue when implemented with circular buffers or linked lists.",
    tradeoffs: "Restricted access to intermediate elements.",
    insights: "Indispensable in breadth-first search (BFS), task scheduling, print spoolers, and message broker queues."
  },
  deque: {
    title: "Double-Ended Queue (Deque)",
    summary: "Generalized queue supporting efficient insertion and removal at both front and rear terminals in O(1) time.",
    strengths: "Simultaneously functions as both a stack (LIFO) and a queue (FIFO).",
    tradeoffs: "Slightly more complex pointer management than single-ended queues.",
    insights: "Frequently applied in sliding window maximum algorithms (monotonic deques) and work-stealing job queues."
  },
  hash: {
    title: "Hash Table / Hash Map",
    summary: "Key-value dictionary mapping arbitrary keys to bucket indices using a deterministic hash function, resolving collisions via chaining.",
    strengths: "Expected O(1) average-case time for lookup, insertion, and deletion.",
    tradeoffs: "Worst-case O(n) degradation under severe hash collisions. Non-ordered traversal of keys.",
    insights: "Maintaining a load factor below 0.75 prevents collision clustering and preserves true O(1) operational efficiency."
  },
  set: {
    title: "Hash Set",
    summary: "Unordered collection of distinct values enforcing uniqueness via underlying hash mapping.",
    strengths: "Fast O(1) membership testing (has/contains), union, intersection, and deduplication.",
    tradeoffs: "Unordered iteration; memory overhead for hash table bucket management.",
    insights: "Essential for cycle detection in graphs, visited-set tracking, and deduplicating high-throughput data streams."
  },
  map: {
    title: "Map / Dictionary",
    summary: "Direct mapping of unique keys to associated values, enabling sub-millisecond retrieval.",
    strengths: "Near constant O(1) lookup by key; straightforward representation of relational metadata.",
    tradeoffs: "Higher memory footprint compared to compact parallel arrays.",
    insights: "The standard building block for databases, caching layers, and in-memory key-value indexes."
  },
  bst: {
    title: "Binary Search Tree (BST)",
    summary: "Hierarchical tree where for every node: left subtree keys < node key < right subtree keys.",
    strengths: "O(log n) average search, insert, and delete. Inorder traversal yields sorted order in O(n) time.",
    tradeoffs: "Degenerates into an O(n) linear linked list if items are inserted in sorted or reverse-sorted order.",
    insights: "Without self-balancing rotations, sequential insertions create an unbalanced skewed tree of height N."
  },
  avl: {
    title: "AVL Tree (Self-Balancing BST)",
    summary: "Strictly balanced BST where the difference between left and right subtree heights (balance factor) never exceeds 1.",
    strengths: "Strict O(log n) worst-case search, insertion, and deletion guarantees using LL, RR, LR, RL rotations.",
    tradeoffs: "Slightly slower insertions and deletions due to frequent rebalancing rotations compared to Red-Black trees.",
    insights: "AVL trees provide faster lookup times than Red-Black trees because they are more rigidly balanced."
  },
  heap: {
    title: "Binary Heap (Min / Max)",
    summary: "Complete binary tree stored compactly in an array where each parent satisfies the heap property relative to its children.",
    strengths: "Instant O(1) access to extreme element (min or max); O(log n) insert and extract; linear O(n) build-heap.",
    tradeoffs: "O(n) arbitrary search time since siblings maintain no horizontal ordering.",
    insights: "Powerhouse behind priority queues, Dijkstra's shortest path, Prim's MST, and heapsort (O(n log n) in-place)."
  },
  trie: {
    title: "Trie (Prefix Tree)",
    summary: "Search tree ordered by string keys where each node represents a common character prefix.",
    strengths: "O(L) search and insertion time where L is string length, completely independent of the number of words in the dataset.",
    tradeoffs: "Higher memory usage due to numerous node pointer arrays across large alphabets.",
    insights: "Dominates autocomplete systems, spell checkers, IP routing tables (longest prefix match), and predictive search."
  },
  seg_tree: {
    title: "Segment Tree",
    summary: "Binary tree used for storing intervals or segments, allowing fast range queries and point/range updates.",
    strengths: "O(log n) range sum/min/max queries and O(log n) point updates over static size arrays.",
    tradeoffs: "Requires 4n auxiliary space; higher implementation complexity than simple arrays.",
    insights: "Indispensable in competitive programming, computational geometry, and dynamic range aggregation."
  },
  fenwick: {
    title: "Fenwick Tree (Binary Indexed Tree)",
    summary: "Space-efficient tree backed by a flat array using bitwise index manipulation (idx & -idx) for prefix sums.",
    strengths: "Extremely compact O(n) space; fast O(log n) prefix sum queries and point updates with tiny constant factors.",
    tradeoffs: "Limited to invertible associative operations (sums, xor); harder to generalize to arbitrary range queries.",
    insights: "Uses two's complement least significant bit isolate `i & (-i)` to navigate parent-child relationships in the array."
  },
  graph_studio: {
    title: "Graph Studio (Network Topologies)",
    summary: "Set of vertices V interconnected by directed or undirected edges E with optional scalar weights.",
    strengths: "Universal model for social networks, road maps, neural nets, dependency trees, and internet routing.",
    tradeoffs: "Dense representations (adjacency matrix) require O(V^2) memory; sparse representations require pointer tracking.",
    insights: "Breadth-First Search (BFS) finds unweighted shortest paths in O(V + E); Dijkstra handles positive edge weights in O((V+E) log V)."
  },
  sorting: {
    title: "Sorting Algorithms Suite",
    summary: "Comparative analysis of Bubble, Selection, Insertion, Merge, and Quick Sort algorithms on numerical sequences.",
    strengths: "Merge sort guarantees O(n log n) stable sorting. QuickSort provides fastest average-case in-place partitioning.",
    tradeoffs: "Quadratic sorts (Bubble, Selection, Insertion) are O(n^2) and inefficient for large datasets.",
    insights: "Timsort (hybrid of Merge Sort and Insertion Sort) is the default algorithm in Python and modern JavaScript engines."
  },
  searching: {
    title: "Searching Algorithms",
    summary: "Comparative study of Linear Search (arbitrary arrays) vs Binary Search (sorted arrays).",
    strengths: "Binary Search cuts search space in half at each step, achieving O(log n) time.",
    tradeoffs: "Binary Search strictly requires sorted input data (which costs O(n log n) to sort initially).",
    insights: "For repeated lookups, the initial O(n log n) sort investment pays off massively over subsequent O(log n) queries."
  }
};

const AI_QUIZ_BANK = [
  {
    category: 'basic',
    structure: 'array',
    question: "Why does accessing an element by index in a standard array operate in O(1) constant time?",
    options: [
      "Because elements are stored contiguously in memory and calculated via Base_Address + Index * Element_Size",
      "Because the CPU maintains a binary search tree of all array indices internally",
      "Because array items are cached in the browser's local database",
      "Because the array dynamically shifts all elements during each read"
    ],
    answer: 0,
    explanation: "Correct! Contiguous memory allocation allows the CPU to compute the exact memory address in a single multiplication and addition operation (O(1))."
  },
  {
    category: 'basic',
    structure: 'dynarray',
    question: "What is the amortized time complexity of appending an element to a Dynamic Array (e.g. Python list / JS array)?",
    options: [
      "O(n) worst case, but O(1) amortized over a sequence of insertions",
      "Strictly O(log n) at all times",
      "Always O(n^2) due to memory copying",
      "O(1) worst case with zero memory overhead"
    ],
    answer: 0,
    explanation: "Correct! While an occasional resize copy takes O(n), geometric capacity doubling spreads that cost so each insertion costs O(1) on average."
  },
  {
    category: 'trees',
    structure: 'avl',
    question: "What is the valid range of balance factors allowed for every node in an AVL tree?",
    options: [
      "{-1, 0, +1}",
      "{-2, -1, 0, +1, +2}",
      "Any positive number >= 0",
      "Strictly 0 only"
    ],
    answer: 0,
    explanation: "Correct! In an AVL tree, the balance factor (Height(left) - Height(right)) must remain strictly in {-1, 0, +1}. If it reaches +/-2, a rotation is triggered."
  },
  {
    category: 'trees',
    structure: 'bst',
    question: "What happens to the search time complexity of a standard Binary Search Tree (BST) when elements are inserted in strictly ascending sorted order?",
    options: [
      "It degenerates to O(n) because the tree forms a linear chain (like a linked list)",
      "It speeds up to O(1) because the tree is sorted",
      "It remains guaranteed O(log n)",
      "It automatically converts into a B-tree"
    ],
    answer: 0,
    explanation: "Correct! Inserting sorted keys into an unbalanced BST creates a skewed tree with height N, degrading lookup performance to linear O(n)."
  },
  {
    category: 'trees',
    structure: 'heap',
    question: "In a zero-indexed binary heap array, what formula gives the index of the left child for parent node i?",
    options: [
      "2 * i + 1",
      "2 * i + 2",
      "i / 2",
      "i + 1"
    ],
    answer: 0,
    explanation: "Correct! In a 0-indexed complete binary tree, the left child is at index 2*i + 1, and the right child is at 2*i + 2."
  },
  {
    category: 'graphs',
    structure: 'graph_studio',
    question: "Which data structure is primarily utilized to implement Breadth-First Search (BFS) in a graph?",
    options: [
      "Queue (FIFO)",
      "Stack (LIFO)",
      "Max-Heap",
      "Disjoint Set (Union-Find)"
    ],
    answer: 0,
    explanation: "Correct! BFS uses a First-In, First-Out (FIFO) Queue to explore vertices level-by-level in order of their distance from the start node."
  },
  {
    category: 'graphs',
    structure: 'graph_studio',
    question: "Under what condition does Dijkstra's shortest path algorithm fail to produce correct results?",
    options: [
      "When the graph contains negative edge weights",
      "When the graph is directed",
      "When the graph has more than 10 vertices",
      "When the graph is unweighted"
    ],
    answer: 0,
    explanation: "Correct! Dijkstra's greedy invariant assumes paths cannot become shorter by adding edges; negative edge weights invalidate this assumption (use Bellman-Ford instead)."
  },
  {
    category: 'algorithms',
    structure: 'sorting',
    question: "What is the worst-case time complexity of standard QuickSort with poor pivot selection (e.g. smallest/largest element in sorted data)?",
    options: [
      "O(n^2)",
      "O(n log n)",
      "O(n)",
      "O(log n)"
    ],
    answer: 0,
    explanation: "Correct! Unbalanced partitions where one subproblem has size n-1 and the other has size 0 result in n recursion levels, producing O(n^2) worst-case time."
  }
];

const AI_CODE_TEMPLATES = {
  array: {
    python: `# Python Dynamic Array / List Example
class SimpleArray:
    def __init__(self, capacity=8):
        self.capacity = capacity
        self.size = 0
        self.data = [0] * capacity

    def get(self, index):
        if not (0 <= index < self.size):
            raise IndexError("Index out of bounds")
        return self.data[index]

    def append(self, val):
        if self.size >= self.capacity:
            self._resize(self.capacity * 2)
        self.data[self.size] = val
        self.size += 1

    def _resize(self, new_cap):
        new_data = [0] * new_cap
        for i in range(self.size):
            new_data[i] = self.data[i]
        self.data = new_data
        self.capacity = new_cap`,
    cpp: `// C++ Fixed & Dynamic Array Implementation
#include <iostream>
#include <vector>

template <typename T>
class StaticArray {
private:
    T* data;
    size_t size;
    size_t capacity;
public:
    StaticArray(size_t cap = 8) : capacity(cap), size(0) {
        data = new T[capacity];
    }
    ~StaticArray() { delete[] data; }

    T get(size_t idx) const {
        if (idx >= size) throw std::out_of_range("Index error");
        return data[idx];
    }
    void push_back(T val) {
        if (size < capacity) {
            data[size++] = val;
        }
    }
};`,
    java: `// Java Fixed-Capacity Array Container
public class ArrayStore<T> {
    private Object[] data;
    private int size;
    private int capacity;

    public ArrayStore(int capacity) {
        this.capacity = capacity;
        this.size = 0;
        this.data = new Object[capacity];
    }

    @SuppressWarnings("unchecked")
    public T get(int index) {
        if (index < 0 || index >= size) throw new IndexOutOfBoundsException();
        return (T) data[index];
    }

    public void insert(T val) {
        if (size < capacity) data[size++] = val;
    }
}`,
    javascript: `// JavaScript Fixed & Typed Array Wrapper
class FastArray {
  constructor(capacity = 8) {
    this.capacity = capacity;
    this.size = 0;
    this.buffer = new Int32Array(capacity);
  }

  get(index) {
    if (index < 0 || index >= this.size) throw new RangeError("Index out of range");
    return this.buffer[index];
  }

  push(value) {
    if (this.size < this.capacity) {
      this.buffer[this.size++] = value;
    }
  }
}`
  },
  bst: {
    python: `# Python Binary Search Tree (BST)
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val):
        self.root = self._insert_node(self.root, val)

    def _insert_node(self, node, val):
        if not node:
            return TreeNode(val)
        if val < node.val:
            node.left = self._insert_node(node.left, val)
        elif val > node.val:
            node.right = self._insert_node(node.right, val)
        return node

    def search(self, val):
        curr = self.root
        while curr:
            if curr.val == val: return True
            curr = curr.left if val < curr.val else curr.right
        return False`,
    cpp: `// C++ Binary Search Tree (BST)
#include <iostream>

struct Node {
    int val;
    Node* left;
    Node* right;
    Node(int v) : val(v), left(nullptr), right(nullptr) {}
};

class BST {
public:
    Node* root = nullptr;

    void insert(int val) {
        root = insertRec(root, val);
    }
    bool search(int val) {
        Node* curr = root;
        while (curr) {
            if (curr->val == val) return true;
            curr = (val < curr->val) ? curr->left : curr->right;
        }
        return false;
    }
private:
    Node* insertRec(Node* node, int val) {
        if (!node) return new Node(val);
        if (val < node->val) node->left = insertRec(node->left, val);
        else if (val > node->val) node->right = insertRec(node->right, val);
        return node;
    }
};`,
    java: `// Java Binary Search Tree
public class BST {
    static class Node {
        int val;
        Node left, right;
        Node(int val) { this.val = val; }
    }
    private Node root;

    public void insert(int val) {
        root = insertHelper(root, val);
    }
    private Node insertHelper(Node node, int val) {
        if (node == null) return new Node(val);
        if (val < node.val) node.left = insertHelper(node.left, val);
        else if (val > node.val) node.right = insertHelper(node.right, val);
        return node;
    }
    public boolean search(int val) {
        Node curr = root;
        while (curr != null) {
            if (curr.val == val) return true;
            curr = (val < curr.val) ? curr.left : curr.right;
        }
        return false;
    }
}`,
    javascript: `// JavaScript Binary Search Tree (BST)
class BSTNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() {
    this.root = null;
  }
  insert(val) {
    const insertRec = (node) => {
      if (!node) return new BSTNode(val);
      if (val < node.val) node.left = insertRec(node.left);
      else if (val > node.val) node.right = insertRec(node.right);
      return node;
    };
    this.root = insertRec(this.root);
  }
  search(val) {
    let curr = this.root;
    while (curr) {
      if (curr.val === val) return true;
      curr = val < curr.val ? curr.left : curr.right;
    }
    return false;
  }
}`
  },
  avl: {
    python: `# Python AVL Tree (Self-Balancing)
class AVLNode:
    def __init__(self, key):
        self.key = key
        self.height = 1
        self.left = None
        self.right = None

class AVLTree:
    def get_height(self, node):
        return node.height if node else 0

    def get_balance(self, node):
        return self.get_height(node.left) - self.get_height(node.right) if node else 0

    def right_rotate(self, y):
        x = y.left
        T2 = x.right
        x.right = y
        y.left = T2
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
        x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
        return x

    def left_rotate(self, x):
        y = x.right
        T2 = y.left
        y.left = x
        x.right = T2
        x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
        return y`,
    cpp: `// C++ AVL Tree Rotations & Insertion
#include <algorithm>

struct AVLNode {
    int key, height;
    AVLNode *left, *right;
    AVLNode(int k) : key(k), height(1), left(nullptr), right(nullptr) {}
};

int getHeight(AVLNode* n) { return n ? n->height : 0; }
int getBalance(AVLNode* n) { return n ? getHeight(n->left) - getHeight(n->right) : 0; }

AVLNode* rightRotate(AVLNode* y) {
    AVLNode* x = y->left;
    AVLNode* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = 1 + std::max(getHeight(y->left), getHeight(y->right));
    x->height = 1 + std::max(getHeight(x->left), getHeight(x->right));
    return x;
}`,
    java: `// Java AVL Tree Rotations
class AVLNode {
    int key, height = 1;
    AVLNode left, right;
    AVLNode(int key) { this.key = key; }
}
public class AVLTree {
    int height(AVLNode n) { return n == null ? 0 : n.height; }
    int getBalance(AVLNode n) { return n == null ? 0 : height(n.left) - height(n.right); }

    AVLNode rightRotate(AVLNode y) {
        AVLNode x = y.left;
        AVLNode T2 = x.right;
        x.right = y;
        y.left = T2;
        y.height = Math.max(height(y.left), height(y.right)) + 1;
        x.height = Math.max(height(x.left), height(x.right)) + 1;
        return x;
    }
}`,
    javascript: `// JavaScript AVL Tree Rotation Functions
function getHeight(node) {
  return node ? node.height : 0;
}
function getBalance(node) {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}
function rightRotate(y) {
  const x = y.left;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  y.height = 1 + Math.max(getHeight(y.left), getHeight(y.right));
  x.height = 1 + Math.max(getHeight(x.left), getHeight(x.right));
  return x;
}`
  },
  graph_studio: {
    python: `# Python Graph Traversal: BFS & Dijkstra
from collections import deque
import heapq

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph.get(u, []):
            if v not in visited:
                visited.add(v)
                queue.append(v)
    return order

def dijkstra(weighted_graph, start):
    distances = {start: 0}
    pq = [(0, start)]
    while pq:
        dist_u, u = heapq.heappop(pq)
        if dist_u > distances.get(u, float('inf')):
            continue
        for v, weight in weighted_graph.get(u, []):
            alt = dist_u + weight
            if alt < distances.get(v, float('inf')):
                distances[v] = alt
                heapq.heappush(pq, (alt, v))
    return distances`,
    cpp: `// C++ BFS Traversal & Dijkstra Algorithm
#include <vector>
#include <queue>
#include <unordered_map>

std::vector<int> bfs(int start, const std::vector<std::vector<int>>& adj) {
    std::vector<int> order;
    std::vector<bool> visited(adj.size(), false);
    std::queue<int> q;

    visited[start] = true;
    q.push(start);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        order.push_back(u);
        for (int v : adj[u]) {
            if (!visited[v]) {
                visited[v] = true;
                q.push(v);
            }
        }
    }
    return order;
}`,
    java: `// Java BFS Traversal
import java.util.*;

public class GraphBFS {
    public static List<Integer> bfs(int start, List<List<Integer>> adj) {
        List<Integer> order = new ArrayList<>();
        boolean[] visited = new boolean[adj.size()];
        Queue<Integer> q = new LinkedList<>();

        visited[start] = true;
        q.offer(start);
        while (!q.isEmpty()) {
            int u = q.poll();
            order.add(u);
            for (int v : adj.get(u)) {
                if (!visited[v]) {
                    visited[v] = true;
                    q.offer(v);
                }
            }
        }
        return order;
    }
}`,
    javascript: `// JavaScript BFS & Dijkstra Traversal
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length > 0) {
    const u = queue.shift();
    order.push(u);
    for (const v of graph[u] || []) {
      if (!visited.has(v)) {
        visited.add(v);
        queue.push(v);
      }
    }
  }
  return order;
}`
  },
  sorting: {
    python: `# Python Sorting Suite: MergeSort & QuickSort
def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i]); i += 1
        else:
            res.append(right[j]); j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res

def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + mid + quick_sort(right)`,
    cpp: `// C++ QuickSort In-Place
#include <vector>
#include <algorithm>

int partition(std::vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            std::swap(arr[++i], arr[j]);
        }
    }
    std::swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(std::vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
    java: `// Java MergeSort
public class MergeSort {
    public static void sort(int[] arr, int l, int r) {
        if (l < r) {
            int m = l + (r - l) / 2;
            sort(arr, l, m);
            sort(arr, m + 1, r);
            merge(arr, l, m, r);
        }
    }
    private static void merge(int[] arr, int l, int m, int r) {
        int[] left = java.util.Arrays.copyOfRange(arr, l, m + 1);
        int[] right = java.util.Arrays.copyOfRange(arr, m + 1, r + 1);
        int i = 0, j = 0, k = l;
        while (i < left.length && j < right.length) {
            arr[k++] = (left[i] <= right[j]) ? left[i++] : right[j++];
        }
        while (i < left.length) arr[k++] = left[i++];
        while (j < right.length) arr[k++] = right[j++];
    }
}`,
    javascript: `// JavaScript QuickSort In-Place
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] <= pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const pi = i + 1;
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}`
  }
};

class AiCopilotEngine {
  constructor() {
    this.isOpen = false;
    this.activeCodeLang = 'python';
  }

  init() {
    const toggleBtn = document.getElementById('aiCopilotBtn');
    const closeBtn = document.getElementById('aiCloseBtn');
    const clearBtn = document.getElementById('aiClearChatBtn');
    const inputForm = document.getElementById('aiInputForm');
    const explainBtn = document.getElementById('aiExplainStateBtn');
    const quizBtn = document.getElementById('aiGenerateQuizBtn');
    const codeBtn = document.getElementById('aiGenerateCodeBtn');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleDrawer());
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearChat());
    }
    if (inputForm) {
      inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('aiPromptInput');
        if (input && input.value.trim()) {
          const query = input.value.trim();
          input.value = '';
          this.processUserQuery(query);
        }
      });
    }
    if (explainBtn) {
      explainBtn.addEventListener('click', () => this.renderTelemetryAnalysis());
    }
    if (quizBtn) {
      quizBtn.addEventListener('click', () => this.renderDynamicQuiz());
    }
    if (codeBtn) {
      codeBtn.addEventListener('click', () => this.renderCodeGenerator());
    }

    this.updateActiveBadge();
    this.renderQuickPromptChips();
    this.updateLiveTelemetry();
  }

  toggleDrawer() {
    const sec = document.getElementById('aiCopilotSection');
    if (!sec) return;
    this.isOpen = sec.style.display !== 'none';
    if (this.isOpen) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  openDrawer() {
    const sec = document.getElementById('aiCopilotSection');
    if (!sec) return;
    sec.style.display = 'block';
    this.isOpen = true;
    sound.playTone(80, 100, 0.08);
    this.updateActiveBadge();
    this.renderQuickPromptChips();
    this.updateLiveTelemetry();
    const input = document.getElementById('aiPromptInput');
    if (input) setTimeout(() => input.focus(), 100);
  }

  closeDrawer() {
    const sec = document.getElementById('aiCopilotSection');
    if (!sec) return;
    sec.style.display = 'none';
    this.isOpen = false;
    sound.playTone(40, 100, 0.05);
  }

  clearChat() {
    const container = document.getElementById('aiChatMessages');
    if (!container) return;
    container.innerHTML = `
      <div class="ai-msg ai-assistant">
        <div class="ai-msg-header">
          <span class="ai-avatar">[AI] COPILOT</span>
          <span class="ai-time">Now</span>
        </div>
        <div class="ai-msg-body">
          Chat cleared. Type any command or click a prompt chip below to control the active structure.
        </div>
      </div>
    `;
    sound.playTone(60, 100, 0.05);
  }

  updateActiveBadge() {
    const badge = document.getElementById('aiActiveContextBadge');
    if (badge) {
      const spec = SPEC_REGISTRY[appState.currentStructure] || { title: appState.currentStructure };
      badge.textContent = `Context: ${spec.title}`;
    }
  }

  onStructureChange(id) {
    this.updateActiveBadge();
    this.renderQuickPromptChips();
    if (this.isOpen) {
      this.updateLiveTelemetry();
    }
  }

  renderQuickPromptChips() {
    const chipsContainer = document.getElementById('aiChipsContainer');
    if (!chipsContainer) return;

    const id = appState.currentStructure;
    let chips = [];

    if (id === 'array' || id === 'dynarray') {
      chips = [
        "Insert 25, 50, 75, 100",
        "Search 42",
        "Explain Cache Locality",
        "Quiz Me",
        "Generate Python Code"
      ];
    } else if (id === 'sll' || id === 'dll') {
      chips = [
        "Insert 10, 20, 30, 40",
        "Search 30",
        "Explain O(1) vs O(n) Tradeoffs",
        "Quiz Me",
        "Generate C++ Code"
      ];
    } else if (id === 'stack' || id === 'queue' || id === 'deque') {
      chips = [
        "Insert 15, 30, 45, 60",
        "Pop element",
        "Explain LIFO vs FIFO",
        "Quiz Me",
        "Generate Java Code"
      ];
    } else if (id === 'bst') {
      chips = [
        "Insert 25, 10, 35, 5, 15",
        "Search 35",
        "Explain Inorder Traversal",
        "Quiz Me",
        "Generate Python Code"
      ];
    } else if (id === 'avl') {
      chips = [
        "Insert 10, 20, 30, 40, 50",
        "Check Balance Factors",
        "Explain AVL Rotations",
        "Quiz Me",
        "Generate C++ Code"
      ];
    } else if (id === 'heap') {
      chips = [
        "Insert 95",
        "Extract extreme element",
        "Explain Heapify O(n)",
        "Quiz Me",
        "Generate Python Code"
      ];
    } else if (id === 'trie') {
      chips = [
        "Insert apple, app, code, data",
        "Search app",
        "Explain Prefix Lookup",
        "Quiz Me",
        "Generate JS Code"
      ];
    } else if (id === 'graph_studio') {
      chips = [
        "Run BFS from A",
        "Run DFS from A",
        "Find Shortest Path Dijkstra",
        "Quiz Me",
        "Generate Python Code"
      ];
    } else if (id === 'sorting') {
      chips = [
        "Run QuickSort",
        "Run MergeSort",
        "Explain O(n log n)",
        "Quiz Me",
        "Generate C++ Code"
      ];
    } else if (id === 'searching') {
      chips = [
        "Run Binary Search 42",
        "Why Binary Search is O(log n)?",
        "Quiz Me",
        "Generate Python Code"
      ];
    } else {
      chips = [
        "Insert 10, 20, 30, 40",
        "Explain Time Complexity",
        "Quiz Me",
        "Generate Code"
      ];
    }

    chipsContainer.innerHTML = '';
    chips.forEach(chipText => {
      const btn = document.createElement('button');
      btn.className = 'ai-prompt-chip';
      btn.textContent = `* ${chipText}`;
      btn.addEventListener('click', () => {
        this.processUserQuery(chipText);
      });
      chipsContainer.appendChild(btn);
    });
  }

  appendMessage(role, htmlContent) {
    const chat = document.getElementById('aiChatMessages');
    if (!chat) return;

    const msg = document.createElement('div');
    msg.className = `ai-msg ${role === 'user' ? 'ai-user' : 'ai-assistant'}`;

    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

    msg.innerHTML = `
      <div class="ai-msg-header">
        <span class="ai-avatar">${role === 'user' ? 'USER' : '[AI] COPILOT'}</span>
        <span class="ai-time">${timeStr}</span>
      </div>
      <div class="ai-msg-body">${htmlContent}</div>
    `;

    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

  processUserQuery(query) {
    this.appendMessage('user', query);
    sound.playTone(70, 100, 0.05);

    const q = query.toLowerCase().trim();

    // 1. Natural Language DSA Action Parsing
    // ----------------------------------------------------
    // Action: Insert / Add / Load
    const insertMatch = q.match(/^(?:insert|add|append|push|load|put)\s*(.*)/i);
    if (insertMatch) {
      const rawValues = insertMatch[1].trim();
      if (!rawValues) {
        this.appendMessage('assistant', `Please specify values to insert (e.g. <code>Insert 25, 50, 75</code>).`);
        return;
      }
      this.executeActionInsert(rawValues);
      return;
    }

    // Action: Search / Find
    const searchMatch = q.match(/^(?:search|find|lookup|peek)\s*(.*)/i);
    if (searchMatch) {
      const targetStr = searchMatch[1].replace(/for/i, '').trim();
      this.executeActionSearch(targetStr);
      return;
    }

    // Action: Delete / Pop / Dequeue / Remove
    if (q.match(/^(?:delete|remove|pop|dequeue|extract)/i)) {
      this.executeActionDelete(q);
      return;
    }

    // Action: Run Sort
    if (q.match(/(?:sort|bubble|insertion|selection|merge|quick)/i) && (q.includes('run') || q.includes('sort') || q.includes('start'))) {
      this.executeActionSort(q);
      return;
    }

    // Action: Graph Traversals (BFS, DFS, Dijkstra)
    if (q.match(/(?:bfs|dfs|dijkstra|shortest path)/i)) {
      this.executeActionGraph(q);
      return;
    }

    // Action: Generate / Random Dataset
    const genMatch = q.match(/(?:generate|random|create)\s*(\d+)?/i);
    if (genMatch) {
      const count = parseInt(genMatch[1], 10) || 8;
      this.executeActionGenerate(count);
      return;
    }

    // Action: Clear / Reset
    if (q.match(/^(?:clear|reset|empty)/i)) {
      this.executeActionClear();
      return;
    }

    // Action: Switch / Open Structure
    const switchMatch = q.match(/(?:switch to|go to|open|show|view)\s+(.*)/i);
    if (switchMatch) {
      const targetName = switchMatch[1].trim();
      this.executeActionSwitch(targetName);
      return;
    }

    // 2. Quiz Intent
    if (q.includes('quiz') || q.includes('test me') || q.includes('trivia')) {
      this.renderDynamicQuiz();
      this.appendMessage('assistant', `<span class="ai-action-tag">ACTION</span> I have generated a customized DSA quiz question for you in the <strong>Live Telemetry & Diagnostics</strong> panel on the right! Give it your best shot.`);
      return;
    }

    // 3. Code Generation Intent
    if (q.includes('code') || q.includes('implement') || q.includes('python') || q.includes('c++') || q.includes('java') || q.includes('javascript')) {
      let lang = 'python';
      if (q.includes('c++')) lang = 'cpp';
      else if (q.includes('java') && !q.includes('javascript')) lang = 'java';
      else if (q.includes('javascript') || q.includes('js')) lang = 'javascript';

      this.activeCodeLang = lang;
      this.renderCodeGenerator();
      this.appendMessage('assistant', `<span class="ai-action-tag">ACTION</span> Generated production-ready <strong>${lang.toUpperCase()}</strong> implementation code in the right inspector panel with a 1-click Copy button.`);
      return;
    }

    // 4. Conceptual DSA Q&A Engine
    this.answerConceptualQuestion(q);
  }

  executeActionInsert(valStr) {
    const cur = appState.currentStructure;
    handleLoadCustomData(cur, valStr);
    this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: INSERT</span> Parsed input <code>${valStr}</code> and dispatched insertion into active structure <strong>${SPEC_REGISTRY[cur]?.title || cur}</strong>.`);
    this.updateLiveTelemetry();
  }

  executeActionSearch(targetStr) {
    const num = parseInt(targetStr, 10);
    const cur = appState.currentStructure;

    if (isNaN(num) && cur !== 'trie' && cur !== 'hash' && cur !== 'map') {
      this.appendMessage('assistant', `Please provide a numeric target to search (e.g. <code>Search 42</code>).`);
      return;
    }

    this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: SEARCH</span> Executing animated search for <strong>${targetStr}</strong> on <strong>${SPEC_REGISTRY[cur]?.title || cur}</strong>...`);

    if (cur === 'array' && typeof opArraySearch === 'function') {
      opArraySearch(num);
    } else if ((cur === 'sll' || cur === 'dll') && typeof opLinkedListSearch === 'function') {
      opLinkedListSearch(cur === 'dll', num);
    } else if (cur === 'bst' || cur === 'avl' || cur === 'binary_tree') {
      if (typeof opTreeSearch === 'function') opTreeSearch(cur, num);
    } else if (cur === 'trie' && typeof opTrieSearch === 'function') {
      opTrieSearch(targetStr, true);
    } else if (cur === 'searching' && typeof startAlgo === 'function') {
      appState.algoTarget = num;
      startAlgo();
    } else {
      document.getElementById('statusMessage').textContent = `Initiated search for ${targetStr}.`;
    }
    this.updateLiveTelemetry();
  }

  executeActionDelete(q) {
    const cur = appState.currentStructure;
    if (cur === 'stack' && typeof opStackPop === 'function') {
      opStackPop();
      this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: POP</span> Popped top element from Stack.`);
    } else if (cur === 'queue' && typeof opQueueDequeue === 'function') {
      opQueueDequeue();
      this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: DEQUEUE</span> Dequeued front element from Queue.`);
    } else if (cur === 'dynarray' && typeof opDynArrayPop === 'function') {
      opDynArrayPop();
      this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: POP</span> Popped element from Dynamic Array.`);
    } else if (cur === 'heap' && typeof opHeapExtract === 'function') {
      opHeapExtract();
      this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: EXTRACT</span> Extracted extreme root element from Binary Heap.`);
    } else {
      this.appendMessage('assistant', `Executed delete action on <strong>${cur}</strong>.`);
    }
    this.updateLiveTelemetry();
  }

  executeActionSort(q) {
    if (appState.currentCategory !== 'algorithms') {
      switchCategory('algorithms');
    }
    switchStructure('sorting');

    let algo = 'bubble';
    if (q.includes('merge')) algo = 'merge';
    else if (q.includes('quick')) algo = 'quick';
    else if (q.includes('selection')) algo = 'selection';
    else if (q.includes('insertion')) algo = 'insertion';

    appState.algoType = algo;
    const sel = document.getElementById('sortAlgoSelect');
    if (sel) sel.value = algo;

    this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: SORT</span> Switched to <strong>Sorting Algorithms Studio</strong> and launched <strong>${algo.toUpperCase()} SORT</strong>.`);
    if (typeof startAlgo === 'function') startAlgo();
    this.updateLiveTelemetry();
  }

  executeActionGraph(q) {
    if (appState.currentCategory !== 'graphs') {
      switchCategory('graphs');
    }
    switchStructure('graph_studio');

    if (q.includes('bfs') && typeof opGraphBFS === 'function') {
      this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: BFS</span> Running Breadth-First Search traversal starting from vertex <strong>A</strong>.`);
      opGraphBFS('A');
    } else if (q.includes('dfs') && typeof opGraphDFS === 'function') {
      this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: DFS</span> Running Depth-First Search traversal starting from vertex <strong>A</strong>.`);
      opGraphDFS('A');
    } else if ((q.includes('dijkstra') || q.includes('shortest')) && typeof opGraphDijkstra === 'function') {
      this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: DIJKSTRA</span> Running Dijkstra's Single-Source Shortest Path from vertex <strong>A</strong> to <strong>E</strong>.`);
      opGraphDijkstra('A', 'E');
    }
    this.updateLiveTelemetry();
  }

  executeActionGenerate(count) {
    const cur = appState.currentStructure;
    const clamped = Math.min(Math.max(count, 3), 20);
    const nums = Array.from({ length: clamped }, () => Math.floor(Math.random() * 90) + 10);
    handleLoadCustomData(cur, nums.join(', '));
    this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: GENERATE</span> Generated ${clamped} random elements: <code>[${nums.join(', ')}]</code>.`);
    this.updateLiveTelemetry();
  }

  executeActionClear() {
    const cur = appState.currentStructure;
    if (cur === 'array') {
      appState.arraySize = 0;
      appState.arrayData = [0, 0, 0, 0, 0, 0, 0, 0];
      renderViewport('array');
    } else if (cur === 'stack') {
      appState.stackItems = [];
      renderViewport('stack');
    } else if (cur === 'queue') {
      appState.queueItems = [];
      renderViewport('queue');
    } else if (cur === 'sll') {
      appState.sllNodes = [];
      renderViewport('sll');
    } else if (cur === 'dll') {
      appState.dllNodes = [];
      renderViewport('dll');
    } else if (cur === 'bst' || cur === 'avl') {
      appState.bstRoot = null;
      renderViewport(cur);
    } else {
      handleLoadCustomData(cur, "0");
    }
    this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: CLEAR</span> Cleared active elements in <strong>${cur}</strong>.`);
    this.updateLiveTelemetry();
  }

  executeActionSwitch(name) {
    const n = name.toLowerCase();
    let targetId = 'array';
    let targetCat = 'basic';

    if (n.includes('avl')) { targetId = 'avl'; targetCat = 'trees'; }
    else if (n.includes('bst') || n.includes('binary search tree')) { targetId = 'bst'; targetCat = 'trees'; }
    else if (n.includes('heap')) { targetId = 'heap'; targetCat = 'trees'; }
    else if (n.includes('trie')) { targetId = 'trie'; targetCat = 'trees'; }
    else if (n.includes('binary tree')) { targetId = 'binary_tree'; targetCat = 'trees'; }
    else if (n.includes('segment')) { targetId = 'seg_tree'; targetCat = 'trees'; }
    else if (n.includes('fenwick')) { targetId = 'fenwick'; targetCat = 'trees'; }
    else if (n.includes('graph')) { targetId = 'graph_studio'; targetCat = 'graphs'; }
    else if (n.includes('sort')) { targetId = 'sorting'; targetCat = 'algorithms'; }
    else if (n.includes('search')) { targetId = 'searching'; targetCat = 'algorithms'; }
    else if (n.includes('stack')) { targetId = 'stack'; targetCat = 'basic'; }
    else if (n.includes('queue')) { targetId = 'queue'; targetCat = 'basic'; }
    else if (n.includes('deque')) { targetId = 'deque'; targetCat = 'basic'; }
    else if (n.includes('linked list') || n.includes('sll')) { targetId = 'sll'; targetCat = 'basic'; }
    else if (n.includes('doubly') || n.includes('dll')) { targetId = 'dll'; targetCat = 'basic'; }
    else if (n.includes('hash') || n.includes('map')) { targetId = 'hash'; targetCat = 'basic'; }
    else if (n.includes('set')) { targetId = 'set'; targetCat = 'basic'; }
    else { targetId = 'array'; targetCat = 'basic'; }

    if (appState.currentCategory !== targetCat) {
      switchCategory(targetCat);
    }
    switchStructure(targetId);

    this.appendMessage('assistant', `<span class="ai-action-tag">ACTION: NAVIGATE</span> Navigated to <strong>${SPEC_REGISTRY[targetId]?.title || targetId}</strong>.`);
    this.updateLiveTelemetry();
  }

  answerConceptualQuestion(q) {
    const cur = appState.currentStructure;
    const spec = SPEC_REGISTRY[cur] || {};
    const info = AI_COPILOT_KNOWLEDGE[cur] || AI_COPILOT_KNOWLEDGE.array;

    let response = "";

    if (q.includes('avl') || q.includes('rotation') || q.includes('balance')) {
      response = `
        <strong>AVL Self-Balancing Mechanisms:</strong>
        <br>
        An AVL tree enforces a strict invariant: for every node, the heights of its left and right subtrees may differ by at most <strong>1</strong>.
        <br><br>
        When an insertion or deletion causes a balance factor of <strong>+2</strong> or <strong>-2</strong>, one of four rotations restores balance:
        <ul>
          <li><strong>Left-Left (LL):</strong> Single Right Rotation</li>
          <li><strong>Right-Right (RR):</strong> Single Left Rotation</li>
          <li><strong>Left-Right (LR):</strong> Left rotate child, then Right rotate parent</li>
          <li><strong>Right-Left (RL):</strong> Right rotate child, then Left rotate parent</li>
        </ul>
        This guarantees an absolute height upper bound of <code>1.44 * log2(n)</code> and worst-case <code>O(log n)</code> lookups.
      `;
    } else if (q.includes('complexity') || q.includes('big-o') || q.includes('time') || q.includes('space')) {
      response = `
        <strong>Big-O Complexity Profile for ${spec.title || cur}:</strong>
        <ul>
          <li><strong>${spec.c1 || 'Operation 1'}</strong></li>
          <li><strong>${spec.c2 || 'Operation 2'}</strong></li>
          <li><strong>${spec.c3 || 'Operation 3'}</strong></li>
          <li><strong>${spec.c4 || 'Operation 4'}</strong></li>
        </ul>
        <strong>Architectural Rationale:</strong> ${info.summary}
      `;
    } else if (q.includes('cache') || q.includes('locality')) {
      response = `
        <strong>Memory Hierarchy & CPU Cache Locality:</strong>
        <br>
        Arrays store elements in contiguous physical memory addresses. When the CPU reads index <code>i</code>, it fetches an entire 64-byte <strong>Cache Line</strong> containing neighboring elements (<code>i+1, i+2...</code>).
        <br><br>
        In contrast, pointer-based structures like Linked Lists allocate nodes on fragmented heap locations, resulting in recurrent <strong>CPU Cache Misses</strong> during sequential traversal.
      `;
    } else if (q.includes('collision') || q.includes('hash')) {
      response = `
        <strong>Hash Collision Resolution:</strong>
        <br>
        Because input keys are infinite while hash bucket arrays are finite, collisions (where <code>hash(k1) == hash(k2)</code>) are inevitable by the Pigeonhole Principle.
        <br><br>
        Common resolution strategies:
        <ul>
          <li><strong>Separate Chaining (Used in Structify):</strong> Each bucket holds a linked list of entries that share the same hash code.</li>
          <li><strong>Open Addressing (Linear/Quadratic Probing):</strong> Probes subsequent slots until an empty bucket is discovered.</li>
        </ul>
      `;
    } else {
      response = `
        <strong>Algorithmic Assessment for ${spec.title || cur}:</strong>
        <br>
        ${info.summary}
        <br><br>
        <strong>Key Advantages:</strong> ${info.strengths}
        <br>
        <strong>Architectural Trade-offs:</strong> ${info.tradeoffs}
        <br><br>
        <em>AI Recommendation:</em> ${info.insights}
      `;
    }

    this.appendMessage('assistant', response);
  }

  calculateTelemetry() {
    const cur = appState.currentStructure;
    let count = 0;
    let minVal = '-';
    let maxVal = '-';
    let sumVal = 0;
    let avgVal = '-';
    let memoryBytes = 0;
    let metricExtraLabel = "Structure Type";
    let metricExtraVal = cur.toUpperCase();
    let insight = "";

    if (cur === 'array') {
      const items = appState.arrayData.slice(0, appState.arraySize);
      count = items.length;
      if (count > 0) {
        minVal = Math.min(...items);
        maxVal = Math.max(...items);
        sumVal = items.reduce((a, b) => a + b, 0);
        avgVal = (sumVal / count).toFixed(1);
      }
      memoryBytes = appState.arrayCap * 4 + 32;
      metricExtraLabel = "Load Factor";
      metricExtraVal = `${Math.round((appState.arraySize / appState.arrayCap) * 100)}%`;
      insight = `Array has ${count} active elements occupying ${memoryBytes} bytes. Contiguous indexing ensures O(1) reads with zero pointer overhead.`;
    } else if (cur === 'dynarray') {
      count = appState.dynArrayData.length;
      if (count > 0) {
        minVal = Math.min(...appState.dynArrayData);
        maxVal = Math.max(...appState.dynArrayData);
        sumVal = appState.dynArrayData.reduce((a, b) => a + b, 0);
        avgVal = (sumVal / count).toFixed(1);
      }
      memoryBytes = appState.dynArrayCap * 4 + 48;
      metricExtraLabel = "Capacity";
      metricExtraVal = `${appState.dynArrayCap}`;
      insight = `Dynamic array capacity is currently ${appState.dynArrayCap}. Appends are amortized O(1); next resize will allocate ${appState.dynArrayCap * 2} slots.`;
    } else if (cur === 'sll' || cur === 'dll') {
      const nodes = cur === 'dll' ? appState.dllNodes : appState.sllNodes;
      count = nodes.length;
      if (count > 0) {
        minVal = Math.min(...nodes);
        maxVal = Math.max(...nodes);
        sumVal = nodes.reduce((a, b) => a + b, 0);
        avgVal = (sumVal / count).toFixed(1);
      }
      memoryBytes = count * (cur === 'dll' ? 24 : 16) + 24;
      metricExtraLabel = "Pointer Overhead";
      metricExtraVal = cur === 'dll' ? "2 Ptrs/Node" : "1 Ptr/Node";
      insight = `${cur === 'dll' ? 'Doubly' : 'Singly'} Linked List has ${count} nodes. Head inserts take O(1) without shifting data in memory.`;
    } else if (cur === 'stack' || cur === 'queue' || cur === 'deque') {
      const items = cur === 'stack' ? appState.stackItems : (cur === 'queue' ? appState.queueItems : appState.dequeItems);
      count = items.length;
      if (count > 0) {
        minVal = Math.min(...items);
        maxVal = Math.max(...items);
        sumVal = items.reduce((a, b) => a + b, 0);
        avgVal = (sumVal / count).toFixed(1);
      }
      memoryBytes = count * 8 + 32;
      metricExtraLabel = "Discipline";
      metricExtraVal = cur === 'stack' ? "LIFO (Top)" : (cur === 'queue' ? "FIFO (Head/Tail)" : "Double-Ended");
      insight = `${cur.toUpperCase()} maintains strict ${metricExtraVal} discipline with guaranteed O(1) push and pop boundaries.`;
    } else if (cur === 'bst' || cur === 'avl') {
      const collect = (node, acc = []) => {
        if (!node) return acc;
        collect(node.left, acc);
        acc.push(node.val);
        collect(node.right, acc);
        return acc;
      };
      const items = collect(appState.bstRoot);
      count = items.length;
      if (count > 0) {
        minVal = Math.min(...items);
        maxVal = Math.max(...items);
        sumVal = items.reduce((a, b) => a + b, 0);
        avgVal = (sumVal / count).toFixed(1);
      }
      const calcH = (node) => (!node ? 0 : 1 + Math.max(calcH(node.left), calcH(node.right)));
      const h = calcH(appState.bstRoot);
      metricExtraLabel = "Tree Height";
      metricExtraVal = `${h} (Ideal: ${count > 0 ? Math.ceil(Math.log2(count + 1)) : 0})`;
      memoryBytes = count * 24 + 16;
      insight = `${cur.toUpperCase()} tree contains ${count} nodes at height ${h}. Maximum search path requires at most ${h} comparison steps.`;
    } else if (cur === 'heap') {
      count = appState.heapData.length;
      if (count > 0) {
        minVal = Math.min(...appState.heapData);
        maxVal = Math.max(...appState.heapData);
        sumVal = appState.heapData.reduce((a, b) => a + b, 0);
        avgVal = (sumVal / count).toFixed(1);
      }
      metricExtraLabel = "Heap Type";
      metricExtraVal = `${appState.heapType.toUpperCase()} HEAP`;
      memoryBytes = count * 4 + 16;
      insight = `Binary Heap root holds optimal extreme element (${appState.heapData[0] || '-'}). Peek is O(1); extraction triggers O(log n) sift-down.`;
    } else if (cur === 'graph_studio') {
      count = appState.graphNodes.length;
      const numEdges = appState.graphEdges.length;
      const density = count > 1 ? ((2 * numEdges) / (count * (count - 1))).toFixed(2) : '0';
      minVal = count;
      maxVal = numEdges;
      metricExtraLabel = "Graph Density";
      metricExtraVal = `${density} (Sparse)`;
      memoryBytes = count * 32 + numEdges * 16;
      insight = `Graph contains |V|=${count} vertices and |E|=${numEdges} edges. BFS explores in O(V + E); Dijkstra traverses in O((V + E) log V).`;
    } else if (cur === 'sorting') {
      count = appState.algoArray.length;
      let inversions = 0;
      for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
          if (appState.algoArray[i] > appState.algoArray[j]) inversions++;
        }
      }
      metricExtraLabel = "Inversion Count";
      metricExtraVal = `${inversions}`;
      memoryBytes = count * 4;
      insight = `Active array has ${count} bars with ${inversions} out-of-order inversions. Active algorithm is ${appState.algoType.toUpperCase()} SORT.`;
    } else {
      count = 8;
      memoryBytes = 64;
      insight = `Structure is actively initialized and responsive to natural language visualizer operations.`;
    }

    return {
      count,
      minVal,
      maxVal,
      avgVal,
      memoryBytes,
      metricExtraLabel,
      metricExtraVal,
      insight
    };
  }

  updateLiveTelemetry() {
    const container = document.getElementById('aiTelemetryContent');
    if (!container) return;

    const data = this.calculateTelemetry();
    const cur = appState.currentStructure;
    const spec = SPEC_REGISTRY[cur] || { title: cur };

    container.innerHTML = `
      <div class="ai-telemetry-grid">
        <div class="ai-tele-card">
          <span class="ai-tele-label">Active Nodes / Size</span>
          <span class="ai-tele-val">${data.count}</span>
        </div>
        <div class="ai-tele-card">
          <span class="ai-tele-label">${data.metricExtraLabel}</span>
          <span class="ai-tele-val">${data.metricExtraVal}</span>
        </div>
        <div class="ai-tele-card">
          <span class="ai-tele-label">Extremes (Min / Max)</span>
          <span class="ai-tele-val">${data.minVal} / ${data.maxVal}</span>
        </div>
        <div class="ai-tele-card">
          <span class="ai-tele-label">Est. Memory Usage</span>
          <span class="ai-tele-val">~${data.memoryBytes} B</span>
        </div>
      </div>

      <div class="ai-tele-insight">
        <strong>* Live Architectural Telemetry:</strong>
        <br>${data.insight}
      </div>

      <div class="ai-tele-insight" style="background: rgba(6, 182, 212, 0.08); border-color: rgba(6, 182, 212, 0.25);">
        <strong>* Big-O Complexity Bounds:</strong>
        <br>${spec.c1 || 'O(1)'} | ${spec.c2 || 'O(n)'} | ${spec.c3 || 'O(n)'}
      </div>
    `;
  }

  renderTelemetryAnalysis() {
    this.updateLiveTelemetry();
    sound.playTone(85, 100, 0.08);
    this.appendMessage('assistant', `<span class="ai-action-tag">TELEMETRY</span> State and architectural memory metrics updated in the live diagnostics pane on the right.`);
  }

  renderDynamicQuiz() {
    const container = document.getElementById('aiTelemetryContent');
    if (!container) return;

    const cur = appState.currentStructure;
    const cat = appState.currentCategory;

    // Pick matching question or fallback
    let match = AI_QUIZ_BANK.find(q => q.structure === cur);
    if (!match) match = AI_QUIZ_BANK.find(q => q.category === cat);
    if (!match) match = AI_QUIZ_BANK[0];

    sound.playTone(90, 100, 0.08);

    container.innerHTML = `
      <div class="ai-quiz-box">
        <div class="inspector-header" style="padding-bottom: 4px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between;">
          <span class="inspector-title">Interactive AI Quiz</span>
          <span class="inspector-badge">CHALLENGE</span>
        </div>
        <div class="ai-quiz-question">${match.question}</div>
        <div class="ai-quiz-options" id="aiQuizOptionsContainer">
          ${match.options.map((opt, idx) => `
            <button class="ai-quiz-opt" data-idx="${idx}">${String.fromCharCode(65 + idx)}) ${opt}</button>
          `).join('')}
        </div>
        <div class="ai-quiz-feedback" id="aiQuizFeedback" style="display: none;"></div>
      </div>
    `;

    const optButtons = container.querySelectorAll('.ai-quiz-opt');
    optButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const chosen = parseInt(btn.getAttribute('data-idx'), 10);
        const fb = document.getElementById('aiQuizFeedback');
        optButtons.forEach(b => b.disabled = true);

        if (chosen === match.answer) {
          btn.classList.add('correct');
          sound.playSuccess();
          fb.style.display = 'block';
          fb.style.background = 'rgba(16, 185, 129, 0.2)';
          fb.style.color = '#34d399';
          fb.style.border = '1px solid rgba(16, 185, 129, 0.4)';
          fb.innerHTML = `<strong>Correct!</strong> ${match.explanation}`;
        } else {
          btn.classList.add('wrong');
          const correctBtn = container.querySelector(`.ai-quiz-opt[data-idx="${match.answer}"]`);
          if (correctBtn) correctBtn.classList.add('correct');
          sound.playError();
          fb.style.display = 'block';
          fb.style.background = 'rgba(239, 68, 68, 0.2)';
          fb.style.color = '#fca5a5';
          fb.style.border = '1px solid rgba(239, 68, 68, 0.4)';
          fb.innerHTML = `<strong>Incorrect.</strong> ${match.explanation}`;
        }
      });
    });
  }

  renderCodeGenerator() {
    const container = document.getElementById('aiTelemetryContent');
    if (!container) return;

    const cur = appState.currentStructure;
    let codeSet = AI_CODE_TEMPLATES[cur] || AI_CODE_TEMPLATES.array;
    if (appState.currentCategory === 'algorithms') codeSet = AI_CODE_TEMPLATES.sorting;
    if (appState.currentCategory === 'graphs') codeSet = AI_CODE_TEMPLATES.graph_studio;

    const lang = this.activeCodeLang;
    const code = codeSet[lang] || codeSet.python;

    container.innerHTML = `
      <div class="ai-code-box">
        <div class="ai-code-tabs">
          <div class="ai-lang-btns">
            <button class="ai-lang-btn ${lang === 'python' ? 'active' : ''}" data-lang="python">Python</button>
            <button class="ai-lang-btn ${lang === 'cpp' ? 'active' : ''}" data-lang="cpp">C++</button>
            <button class="ai-lang-btn ${lang === 'java' ? 'active' : ''}" data-lang="java">Java</button>
            <button class="ai-lang-btn ${lang === 'javascript' ? 'active' : ''}" data-lang="javascript">JavaScript</button>
          </div>
          <button class="ai-copy-btn" id="aiCopyCodeBtn">Copy Code</button>
        </div>
        <pre class="ai-code-pre"><code id="aiCodeDisplay">${this.escapeHtml(code)}</code></pre>
      </div>
    `;

    const langBtns = container.querySelectorAll('.ai-lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeCodeLang = btn.getAttribute('data-lang');
        this.renderCodeGenerator();
      });
    });

    const copyBtn = document.getElementById('aiCopyCodeBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(code).then(() => {
          copyBtn.textContent = 'Copied!';
          sound.playSuccess();
          setTimeout(() => { if (copyBtn) copyBtn.textContent = 'Copy Code'; }, 1800);
        });
      });
    }
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}

// Global AI Copilot singleton
const aiCopilot = new AiCopilotEngine();

function initAiCopilot() {
  aiCopilot.init();
}

function updateAiOnStructureChange(id) {
  aiCopilot.onStructureChange(id);
}

// ==========================================================================
// --- INITIALIZE ON DOM LOAD -----------------------------------------------
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  initApp();
});

