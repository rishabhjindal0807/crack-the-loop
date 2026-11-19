// Data-structure helpers injected into every solution's scope (like LeetCode does).
export class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

export class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

// LeetCode 138 (Copy List with Random Pointer) calls it `_Node`; `Node` is provided too.
export class RandomNode {
  constructor(val = 0, next = null, random = null) {
    this.val = val;
    this.next = next ?? null;
    this.random = random ?? null;
  }
}

export const H = {
  // [[val, randomIndex | null], …] -> head of a list of RandomNode
  randomList(pairs) {
    const nodes = pairs.map(([v]) => new RandomNode(v));
    nodes.forEach((n, i) => {
      n.next = nodes[i + 1] || null;
      const r = pairs[i][1];
      n.random = r === null || r === undefined ? null : nodes[r];
    });
    return nodes[0] || null;
  },
  // head -> [[val, randomIndex | null], …]; a random pointer outside the list shows as '?'
  randomArr(head) {
    const nodes = [];
    for (let p = head; p && nodes.length < 10000; p = p.next) nodes.push(p);
    const idx = new Map(nodes.map((n, i) => [n, i]));
    return nodes.map((n) => [n.val, n.random ? (idx.has(n.random) ? idx.get(n.random) : '?') : null]);
  },
  // [1,2,3] -> 1 -> 2 -> 3
  list(arr) {
    const dummy = new ListNode();
    let cur = dummy;
    for (const v of arr) cur = cur.next = new ListNode(v);
    return dummy.next;
  },
  arr(head) {
    const out = [];
    let guard = 0;
    while (head && guard++ < 10000) {
      out.push(head.val);
      head = head.next;
    }
    return out;
  },
  // LeetCode level-order: [3,9,20,null,null,15,7]
  tree(arr) {
    if (!arr.length || arr[0] === null) return null;
    const root = new TreeNode(arr[0]);
    const q = [root];
    let i = 1;
    while (q.length && i < arr.length) {
      const node = q.shift();
      if (i < arr.length && arr[i] !== null) q.push((node.left = new TreeNode(arr[i])));
      i++;
      if (i < arr.length && arr[i] !== null) q.push((node.right = new TreeNode(arr[i])));
      i++;
    }
    return root;
  },
  level(root) {
    const out = [];
    const q = [root];
    while (q.length) {
      const n = q.shift();
      if (n) {
        out.push(n.val);
        q.push(n.left, n.right);
      } else out.push(null);
    }
    while (out.length && out[out.length - 1] === null) out.pop();
    return out;
  },
  find(root, val) {
    if (!root) return null;
    if (root.val === val) return root;
    return H.find(root.left, val) || H.find(root.right, val);
  },
};
