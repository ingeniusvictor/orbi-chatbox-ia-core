import { existsSync, readFileSync } from "node:fs";

const assert = (value: unknown, message: string): void => { if (!value) throw new Error(message); };
const resolve = (path: string) => new URL(path, import.meta.url);
const read = (path: string) => readFileSync(resolve(path), "utf8");

try {
  assert(existsSync(resolve("../../docs/design/lumi-chat-current.png")), "Current visual reference is required.");
  assert(existsSync(resolve("../../docs/design/lumi-chat-north-star.png")), "North Star visual reference is required.");
  assert(existsSync(resolve("../../src/assets/lumi/lumi-avatar.png")), "Official LUMI asset is required.");
  const note = read("../../docs/design/LUMI_CHAT_NORTH_STAR.md");
  const identity = read("../../src/components/chat/LumiVisualIdentity.tsx");
  const rail = read("../../src/components/chat/LumiPresenceRail.tsx");
  const workspace = read("../../src/components/workspaces/ChatStudioWorkspace.tsx");
  const css = read("../../src/index.css");
  assert(note.includes("Official North Star") && note.includes("Truthful scope") && note.includes("Part 2 direction"), "Canonical design note is incomplete.");
  assert(identity.includes('lumi-avatar.png') && identity.includes("lumi-avatar-orb") && rail.includes("LumiVisualIdentity"), "Official LUMI identity must be rendered in the presence rail.");
  assert(workspace.includes("lumi-atmosphere") && workspace.includes("lumi-surface-raised"), "Workspace atmospheric hierarchy is required.");
  for (const token of ["--lumi-surface-base", "--lumi-surface-raised", "--lumi-surface-glass", "--lumi-accent-cyan", "--lumi-accent-teal", "--lumi-accent-green", "--lumi-text-primary", "--lumi-text-secondary", "--lumi-border-subtle", "--lumi-glow-soft", "--lumi-glow-active"]) assert(css.includes(token), `Missing visual token ${token}.`);
  assert(css.includes("prefers-reduced-motion") && rail.includes("lg:flex") && workspace.includes("min-w-0"), "Responsive and reduced-motion safety is required.");
  console.info("LUMI North Star Foundation QA: PASS");
} catch (error) { console.error(error); process.exit(1); }
