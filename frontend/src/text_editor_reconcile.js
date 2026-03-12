const syncClassName = (el, className) => {
  if (el.className !== className) el.className = className;
};

const toSegmentKind = (token) => {
  if (token.kind === "comment") return "comment";
  return "move";
};

const syncDataset = (el, dataset) => {
  const next = dataset || {};
  Object.keys(el.dataset).forEach((key) => {
    if (!(key in next)) delete el.dataset[key];
  });
  Object.entries(next).forEach(([key, value]) => {
    const normalized = String(value);
    if (el.dataset[key] !== normalized) el.dataset[key] = normalized;
  });
};

const createInlineEl = (token) => {
  const span = document.createElement("span");
  syncInlineEl(span, token);
  return span;
};

const syncInlineEl = (el, token) => {
  syncClassName(el, token.className || "");
  syncDataset(el, {
    kind: toSegmentKind(token),
    tokenType: token.tokenType,
    tokenKey: token.key,
    ...(token.dataset || {}),
  });
  if (el.textContent !== token.text) el.textContent = token.text;
};

const createCommentEl = (token, options) => {
  const span = document.createElement("span");
  syncCommentEl(span, token, options);
  return span;
};

const syncCommentEl = (el, token, options) => {
  syncClassName(el, "text-editor-comment-block text-editor-comment");
  syncDataset(el, {
    kind: "comment",
    tokenType: "comment",
    tokenKey: token.key,
    commentId: token.commentId,
    segmentIndex: token.segmentIndex,
  });
  el.contentEditable = "true";
  el.spellcheck = false;
  el.onclick = null;
  if (el.textContent !== token.text) el.textContent = token.text;
  if (options?.onCommentEdit) {
    el.onblur = () => {
      const nextValue = el.textContent ?? "";
      if (nextValue === token.text) return;
      options.onCommentEdit(token.commentId, nextValue);
    };
  } else {
    el.onblur = null;
  }
};

const createTokenEl = (token, options) => (token.kind === "comment" ? createCommentEl(token, options) : createInlineEl(token));

const syncTokenEl = (el, token, options) => {
  if (token.kind === "comment") syncCommentEl(el, token, options);
  else syncInlineEl(el, token);
};

const createAnchorEl = (anchorId) => {
  const anchor = document.createElement("span");
  anchor.className = "text-editor-anchor";
  syncDataset(anchor, {
    kind: "anchor",
    anchorId,
  });
  return anchor;
};

const syncAnchorEl = (el, anchorId) => {
  syncClassName(el, "text-editor-anchor");
  syncDataset(el, {
    kind: "anchor",
    anchorId,
  });
  el.textContent = "";
};

const reconcileTokenChildren = (blockEl, tokens, blockKey, options) => {
  const desired = [];
  for (let idx = 0; idx <= tokens.length; idx += 1) {
    desired.push({ kind: "anchor", anchorId: `${blockKey}:${idx}` });
    if (idx < tokens.length) desired.push({ kind: "token", token: tokens[idx] });
  }
  const children = Array.from(blockEl.children);
  desired.forEach((entry, idx) => {
    let child = children[idx];
    if (!child) {
      child = entry.kind === "anchor" ? createAnchorEl(entry.anchorId) : createTokenEl(entry.token, options);
      blockEl.appendChild(child);
      return;
    }
    if (entry.kind === "anchor") {
      if (child.dataset.kind !== "anchor") {
        const replacement = createAnchorEl(entry.anchorId);
        blockEl.replaceChild(replacement, child);
      } else {
        syncAnchorEl(child, entry.anchorId);
      }
    } else {
      const hasCommentKind = child.dataset.kind === "comment";
      const needsCommentKind = entry.token.kind === "comment";
      if (hasCommentKind !== needsCommentKind || child.dataset.kind === "anchor") {
        const replacement = createTokenEl(entry.token, options);
        blockEl.replaceChild(replacement, child);
        return;
      }
      syncTokenEl(child, entry.token, options);
    }
  });
  for (let idx = children.length - 1; idx >= desired.length; idx -= 1) {
    children[idx].remove();
  }
};

const createBlockEl = (block, options) => {
  const el = document.createElement("div");
  el.className = "text-editor-block";
  el.dataset.blockKey = block.key;
  reconcileTokenChildren(el, block.tokens, block.key, options);
  return el;
};

const syncBlockEl = (el, block, options) => {
  if (el.className !== "text-editor-block") el.className = "text-editor-block";
  syncDataset(el, { blockKey: block.key });
  reconcileTokenChildren(el, block.tokens, block.key, options);
};

export const reconcileTextEditor = (container, blocks, options = {}) => {
  const currentBlocks = Array.from(container.children);
  blocks.forEach((block, idx) => {
    let blockEl = currentBlocks[idx];
    if (!blockEl) {
      blockEl = createBlockEl(block, options);
      container.appendChild(blockEl);
      return;
    }
    if (blockEl.dataset.blockKey !== block.key) {
      const found = currentBlocks.find((candidate, candidateIdx) => candidateIdx > idx && candidate.dataset.blockKey === block.key);
      if (found) {
        container.insertBefore(found, blockEl);
        blockEl = found;
      } else {
        const created = createBlockEl(block, options);
        container.insertBefore(created, blockEl);
        blockEl = created;
      }
    }
    syncBlockEl(blockEl, block, options);
  });
  const latestBlocks = Array.from(container.children);
  for (let idx = latestBlocks.length - 1; idx >= blocks.length; idx -= 1) {
    latestBlocks[idx].remove();
  }
};
