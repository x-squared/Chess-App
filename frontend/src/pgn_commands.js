import { parseCommentRuns } from "./pgn_model";

const cloneModel = (model) => JSON.parse(JSON.stringify(model));

const visitVariation = (variation, visitMove, visitComment) => {
  for (const entry of variation.entries) {
    if (entry.type === "move") {
      visitMove(entry);
      entry.commentsBefore.forEach((comment) => visitComment(comment));
      entry.commentsAfter.forEach((comment) => visitComment(comment));
      if (Array.isArray(entry.postItems)) {
        entry.postItems.forEach((item) => {
          if (item.type === "comment" && item.comment) visitComment(item.comment);
          if (item.type === "rav" && item.rav) visitVariation(item.rav, visitMove, visitComment);
        });
      } else {
        entry.ravs.forEach((child) => visitVariation(child, visitMove, visitComment));
      }
    } else if (entry.type === "variation") {
      visitVariation(entry, visitMove, visitComment);
    }
  }
  variation.trailingComments.forEach((comment) => visitComment(comment));
};

export const findCommentById = (model, commentId) => {
  let found = null;
  visitVariation(
    model.root,
    () => {},
    (comment) => {
      if (found || comment.id !== commentId) return;
      found = comment;
    },
  );
  return found;
};

export const setCommentTextById = (model, commentId, rawText) => {
  const next = cloneModel(model);
  let updated = false;
  visitVariation(
    next.root,
    () => {},
    (comment) => {
      if (updated || comment.id !== commentId) return;
      comment.raw = rawText;
      comment.runs = parseCommentRuns(rawText);
      updated = true;
    },
  );
  return next;
};
