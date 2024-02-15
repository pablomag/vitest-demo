class TreeNode {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
}

export function isProperBinaryTree(nodePairs) {
  const nodes = new Map();

  // Constructing the tree
  for (const [child, parent] of nodePairs) {
    if (!nodes.has(child)) {
      nodes.set(child, new TreeNode(child));
    }
    if (!nodes.has(parent)) {
      nodes.set(parent, new TreeNode(parent));
    }
    // If a node already has two children, it's not a proper binary tree
    if (nodes.get(parent).children.length === 2) {
      return false;
    }
    nodes.get(parent).children.push(nodes.get(child));
  }

  // Check for multiple roots
  let roots = 0;
  for (const [, node] of nodes) {
    if (!nodePairs.some((pair) => pair[0] === node.value)) {
      roots++;
    }
    if (roots > 1) {
      return false; // Multiple roots found
    }
  }

  // Check for cycles using DFS
  const visited = new Set();
  function hasCycle(node) {
    if (visited.has(node)) {
      return true; // Cycle detected
    }
    visited.add(node);
    for (const child of node.children) {
      if (hasCycle(child)) {
        return true;
      }
    }
    visited.delete(node);
    return false;
  }

  for (const [, node] of nodes) {
    if (hasCycle(node)) {
      return false; // Cycle found
    }
  }

  return true; // No issues found, proper binary tree
}
