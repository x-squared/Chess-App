const serializeComment = (comment) => `{ ${comment.raw} }`;

const serializeVariation = (variation) => {
  const parts = [];
  variation.entries.forEach((entry) => {
    if (entry.type === "move_number" || entry.type === "result" || entry.type === "nag") {
      parts.push(entry.text);
      return;
    }
    if (entry.type === "variation") {
      parts.push(`(${serializeVariation(entry)})`);
      return;
    }
    if (entry.type !== "move") return;

    entry.commentsBefore.forEach((comment) => parts.push(serializeComment(comment)));
    parts.push(entry.san);
    entry.nags.forEach((nag) => parts.push(nag));
    if (Array.isArray(entry.postItems) && entry.postItems.length > 0) {
      entry.postItems.forEach((item) => {
        if (item.type === "comment" && item.comment) {
          parts.push(serializeComment(item.comment));
          return;
        }
        if (item.type === "rav" && item.rav) {
          parts.push(`(${serializeVariation(item.rav)})`);
        }
      });
    } else {
      entry.commentsAfter.forEach((comment) => parts.push(serializeComment(comment)));
      entry.ravs.forEach((child) => parts.push(`(${serializeVariation(child)})`));
    }
  });
  variation.trailingComments.forEach((comment) => parts.push(serializeComment(comment)));
  return parts.join(" ").replace(/\s+/g, " ").trim();
};

export const serializeModelToPgn = (model) => {
  const headerLines = model.headers.map((header) => `[${header.key} "${header.value}"]`);
  const moveText = serializeVariation(model.root);
  if (headerLines.length === 0) return moveText;
  return `${headerLines.join("\n")}\n\n${moveText}`.trim();
};
