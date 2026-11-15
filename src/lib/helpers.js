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

export const H = {
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
