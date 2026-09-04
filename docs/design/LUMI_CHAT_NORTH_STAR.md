# LUMI Chat North Star

## Canonical inputs

- **Official North Star:** `docs/design/lumi-chat-north-star.png`
- **Pre-D.3 baseline:** `docs/design/lumi-chat-current.png`
- **Official LUMI asset:** `src/assets/lumi/lumi-avatar.png`

The North Star is a composition and interaction reference, not a background image or a literal implementation specification. The React interface must reconstruct its useful hierarchy with truthful product functionality.

## Mandatory principles

- LUMI is the visual protagonist, with a recognizable official identity rather than a generic bot icon.
- The conversation remains the dominant workspace.
- Voice is a first-class interaction with replayable LUMI responses and a coherent waveform language.
- Deep navy and near-black surfaces use cyan, teal, and ORBI green as controlled accents.
- Surfaces are layered by purpose: environment, workspace, conversational surfaces, then controls.
- Atmospheric depth supports focus without reducing readability.
- Diagnostics stay accessible but outside the main experience.
- Desktop, medium, and mobile layouts remain usable without horizontal overflow.
- Every visible control maps to real current functionality.

## Prioritized visual gaps

1. **LUMI prominence:** the baseline uses a small generic icon and text-heavy rail; the North Star establishes an immediate character focal point with an orb, halo, identity, and readiness state.
2. **Atmospheric depth:** the baseline is mostly one flat navy field; the target layers a dark environment with localized teal/cyan light and restrained green energy.
3. **Surface hierarchy:** baseline rail, message area, chips, and composer use similar borders and opacity; the target gives each level distinct elevation, inner light, and shadow.
4. **Header and status hierarchy:** the target makes identity, local model, voice, and readiness legible at a glance while keeping detailed diagnostics elsewhere.
5. **Intentional empty space:** the current conversation leaves a large uniform void; the target uses visual anchors, message rhythm, and ambient light to make space feel deliberate.
6. **Message hierarchy:** LUMI and user messages need stronger identity separation and richer voice/grounding composition.
7. **Voice language:** the current compact replay is functional but not yet the expressive waveform player shown by the North Star.
8. **Composer presence:** the target presents listening as an immersive state rather than a small status attached to a generic input.
9. **Suggestions:** the target uses deliberate, readable suggestion modules rather than toolbar-like chips.
10. **Responsive implication:** the identity rail should collapse before the conversation loses usable width; diagnostics should behave as an overlay.

## Visual foundation

The canonical foundation uses these semantic roles:

- `surface-base`: deep environment layer.
- `surface-raised`: dominant conversation workspace.
- `surface-glass`: rail, status, and overlay surfaces.
- `accent-cyan`: conversation and intelligence signal.
- `accent-teal`: LUMI identity and voice energy.
- `accent-green`: readiness and grounded ORBI state.
- `text-primary`: high-contrast conversational content.
- `text-secondary`: metadata and supporting copy.
- `border-subtle`: low-noise separation.
- `glow-soft`: atmospheric depth.
- `glow-active`: bounded live/voice emphasis.

## Truthful scope

Conceptual elements in the North Star are not automatically product capabilities. Do not implement carbon counters, environmental metrics, fake project tracking, calls, likes, sharing, bookmarks, or attachments unless those functions actually exist. The flagship appearance must not misrepresent the current sandbox product.

## Part 2 direction

Part 2 may complete message cards, the waveform player, voice-first composer, welcome composition, status modules, and final motion polish on top of this foundation. It must preserve runtime-only audio, local voice boundaries, and existing conversation continuity.
