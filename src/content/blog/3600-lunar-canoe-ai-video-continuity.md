---
pubDatetime: 2026-09-11T15:00:00.000Z
modDatetime: 2026-09-11T15:00:00.000Z
title: "Lunar Canoe: AI Video Has a Continuity Problem"
slug: lunar-canoe-ai-video-continuity
featured: true
tags:
  - ai
  - video
  - architecture
  - product
  - agents
  - engineering
description: "Lunar Canoe treats AI video as a continuity, revision, and spend-control problem: authored seams make short generated clips behave like a film."
ogImage: /assets/lunar-canoe-harbour.png
draft: false
---

![A rain-slicked harbor at dawn, with fishing boats reflected in dark blue water and warm streetlights along the quay.](/assets/lunar-canoe-harbour.png)

## Table of contents

Text-to-video demos have a peculiar way of hiding the actual product problem.

One beautiful five-second clip looks like the future. Ask for a two-minute film, though, and the work changes shape immediately. The character's jacket drifts between shots. A camera move lands somewhere unusable. A good scene gets regenerated, and suddenly the next three no longer match it. The ambient sound hard-cuts every few seconds. Then there is the small matter that each retry takes a minute and costs real money.

The hard problem is not getting a model to emit a clip. It is letting a person make a sequence of clips that still behaves like a film.

I've been building **[Lunar Canoe](https://lunarcanoe.com)** around that premise: a web-first storyboard for composing longer videos from short AI-generated shots. It has a director agent, but it is not trying to replace the director. Its job is to make the expensive, irreversible-looking parts of AI video deliberate, inspectable, and recoverable.

The design has led to a useful conclusion: continuity should not be an emergent property of generations. It needs its own data model.

## A movie is not a prompt with a duration slider

Today's video models are very good at a bounded task: take a prompt and perhaps some images, then generate a short clip. That is a remarkable capability. But a film asks for different guarantees:

- the person in shot 12 is recognizably the person in shot 2;
- a shot can end where the next shot begins;
- changing one shot does not silently destroy an hour of earlier work;
- the creator, not an autonomous loop, decides when to spend money rendering;
- the final sequence can be reviewed as an ordered story rather than a folder full of variants.

Those are authoring-system requirements. A better model will help, but it will not supply them by itself.

The first temptation is to chain clips together: render scene three, extract its final frame, feed that frame into scene four, and repeat. It sounds almost inevitable. It is also a trap.

Generated final frames are often poor handoff material: motion-blurred, compressed, or just compositionally awkward. More importantly, that approach makes the project a dependency cascade. Regenerate scene three and you have changed the input to scene four; regenerate four and you have changed five. The creator has not improved one shot. They have opened a new branch of the whole movie.

That is fine for a one-off experiment. It is terrible for an editing workflow.

## Make the seam an authored thing

Lunar Canoe reverses the relationship. The boundary image between two shots is created or chosen first, then pinned as an immutable asset. It is the last-frame target for the first scene and the first-frame source for the next one.

In simplified form:

```text
scene 3  ──> [ authored boundary still ] <──  scene 4
             last-frame target              first-frame source
```

Both scenes point to the same still. The seam is no longer an accidental output of scene three; it is an input to both scenes.

That change sounds small, but it changes the economics of revision. Re-rendering scene three changes the motion inside scene three while preserving the agreed landing frame. Scene four remains valid. Replacing the boundary is a conscious edit, and it invalidates exactly the two scenes touching it. The dependency graph matches the creative intent.

This is how non-AI editing already works. A cut is a decision. A match cut is a decision. A continuity error is something a human notices and fixes. Generative tools should preserve those decisions rather than turn them into stochastic side effects.

Lunar Canoe calls a sequence of these frame-locked shots a **contiguous run**. It is deliberately not a general graph editor. A film storyboard is ordered; its most important relationship is what comes next. The UI is therefore a strip of scenes, with group spans for shared style and visible seams for continuity—not a canvas of ports and wires asking creators to become workflow engineers.

## We tested the seam instead of assuming it

The architecture only matters if the providers honor it. “First and last frame” is easy to list in a capability table; it is much more useful to know whether the generated video actually starts and ends on the supplied images.

So I ran a small fidelity matrix on real reference photos: a plush bear in distinct poses, with a meaningful visual difference between the two endpoint stills. The test compared extracted video frames against those authored stills using mean absolute pixel difference and a difference hash. The control pair—the two different poses—measured 16.6% mean absolute difference and a dHash distance of 16.

The result was encouraging:

| Configuration | Endpoint result | Cost / clip | What it means |
|---|---:|---:|---|
| Veo 3.1 Fast, first + last frame, 8 s | 1.0–1.5% difference; dHash 0 | $0.64 | A viable mute, lower-cost seam option |
| Veo 3.1, first + last frame, 4 s | 5.3–5.7%; dHash 4–5 | $0.80 | Not reliable enough to treat as a locked seam |
| Gemini Omni Flash, first + last frame, 5 s | 0.8%; dHash 1 | $0.51 | Strong endpoint fidelity |
| Gemini Omni Flash, first + last + 3 references, 5 s | 0.7%; dHash 0 | $0.52 | The strongest measured continuity-plus-identity combination |

These are not universal benchmarks, and they should not be read as a provider shootout. They are a product constraint backed by a concrete test: both adapters could keep an authored endpoint far closer than the actual pose change they were meant to bridge. Omni Flash also accepted identity references alongside first-and-last-frame conditioning, a combination Veo rejected in this test.

That turns a design idea into a usable rule. For a pinned seam, Lunar Canoe can steer creators toward the configurations that held up: at least five seconds with Omni, or eight seconds with Veo. A four-second Veo shot may be cheaper, but it is not allowed to pretend it offers the same guarantee.

The broader lesson is simple: model capabilities are not checkboxes. They are constraints with failure modes, latency, price, and interactions. The authoring interface should know the difference.

## The agent can make the plan, not the purchase

The other failure mode in AI video is financial rather than visual. A reasonable-looking agent loop can decide to generate several versions of every scene, evaluate them, revise the prompts, and do it again while its owner is making coffee. That is a powerful workflow in a lab. It is also a very effective way to create a surprise bill.

Lunar Canoe's director agent has a deliberately narrow authority. It can turn a brief into structured scene intent, propose scenes, reorder a sequence, assign references, form style groups, and flag scenes as ready. Its proposed changes appear as a diff and are committed through the same command layer as direct manipulation.

It cannot render.

This is not a confirmation-dialog problem. If an agent has a generation tool, a confirmation step is just a conversational obstacle it may eventually persuade a click-fatigued person to clear. The more reliable boundary is to never give the agent that capability. Image and video generation remain user-initiated, scene by scene or in a deliberate batch.

The rule makes the system less magical in a way I like. The agent is useful where language is useful: filling in structured prompts, keeping a style bible coherent, noticing that a proposed shot conflicts with an adjacent boundary. The human is useful where judgment and budget matter: deciding that this is the shot worth paying to see.

## Treat a storyboard like source code, not a chat transcript

An agent editing a creative project also needs an undo button. In Lunar Canoe, every storyboard mutation is a named command with a defined inverse: insert a scene, reorder scenes, set an intent, create a style group, pin a boundary, mark scenes ready. The command log supports undo and makes agent proposals reviewable.

That is slightly more ceremony than raw CRUD, but it buys several things at once:

- dragging a scene and asking the director to move it use the same write path;
- a proposed change can be shown as a diff before it takes effect;
- undo has clear semantics instead of being a vague attempt to restore a previous JSON blob;
- concurrent edits can be checked against a project revision instead of silently overwriting one another.

The same principle governs rendering. A scene has an input snapshot—the structured intent, provider parameters, and asset hashes that produced an attempt. If those inputs change, the system computes a new content hash and marks the scene stale. If they do not, it can reuse the existing ready output rather than charging the creator for an identical render.

This is build-system thinking applied to a creative tool: know the inputs, make dependencies explicit, and rebuild only what changed. It is the opposite of treating every “try again” as an amnesiac model call.

## The goal is a calmer kind of generative tool

Lunar Canoe is still early, and the model layer will keep moving underneath it. But I do not think the durable value is “we picked the right video model.” The durable value is a workflow that remains legible when models change: authored seams, explicit provider constraints, immutable inputs, bounded agent authority, visible cost, and edits that do not turn a two-minute film into a chain reaction.

Generative video will get longer, cheaper, and more coherent. That is good news. It will not eliminate the need for a creator to decide what the movie is, where one shot ends, and whether the next attempt is worth the money.

That is the canoe in Lunar Canoe: a small craft for crossing an uncertain surface, with enough structure that you can choose where you are going.

If you are building with generative video—or have learned a different lesson about continuity—I would genuinely like to compare notes. [Lunar Canoe is here](https://lunarcanoe.com).
