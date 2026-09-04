/**
 * Removes presentation-only markup from the text sent to local speech
 * synthesis. It deliberately leaves the visible conversation text unchanged.
 */
export const normalizeTextForSpeech = (value: string): string => value
  .normalize("NFC")
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200D\uFEFF]/g, "")
  .replace(/\[([^\]]+)\]\([^\s)]+(?:\s+[^)]*)?\)/g, "$1")
  .replace(/&(?:nbsp|amp|lt|gt|quot);/gi, (entity) => ({ "&nbsp;": " ", "&amp;": " y ", "&lt;": " ", "&gt;": " ", "&quot;": "" }[entity.toLowerCase()] ?? ""))
  .replace(/^\s{0,3}#{1,6}\s+/gm, "")
  .replace(/^\s{0,3}>\s?/gm, "")
  .replace(/^\s*[-*+]\s+/gm, ". ")
  .replace(/(\*\*|__|`)/g, "")
  .replace(/(?<!\w)[~^]+(?!\w)/g, "")
  .replace(/([!?])\1{1,}/g, "$1")
  .replace(/[ \t]{2,}/g, " ")
  .replace(/\s+([,.;:!?])/g, "$1")
  .trim();
