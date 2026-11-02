---
pubDatetime: 2026-11-02T15:00:00.000Z
modDatetime: 2026-11-02T15:00:00.000Z
title: "You Are Now a Fleet Manager"
slug: you-are-now-a-fleet-manager
featured: false
tags:
  - ai
  - agents
  - software engineering
  - developer workflow
  - garrison
description: "When coding agents work in parallel, the developer's job shifts from typing every change to assigning work, watching progress, and reviewing what comes back."
ogImage: "https://cdn.enginyyr.com/garrison-agent-squadrons-battlefield.png"
draft: false
---

![Three small coding-agent squadrons deploying from a command base across a sci-fi battlefield toward bug-fix, feature, and test objectives.](https://cdn.enginyyr.com/garrison-agent-squadrons-battlefield.png)

The first coding agent feels like a faster editor. The second changes the shape of the day.

With one agent, you trade messages: give it a task, answer questions, inspect the diff. With several, you have a queue. One agent is exploring a bug. Another is implementing a small feature in its own worktree. A third is waiting for you to clarify an acceptance criterion. The keyboard is no longer the center of the work. Your attention is.

That is the job [Garrison](https://garrison.enginyyr.com) is built around: you become a fleet manager. Its canvas puts posts, task runs, and review status in view so you can decide where your attention goes next.

## Table of contents

## The bottleneck moves

The phrase “fleet manager” can sound like a pitch for running as many agents as possible. That misses the hard part. An agent is useful only when its work can be described, isolated, checked, and brought back into the project. Starting another run is easy. Knowing whether it should exist, and whether its result is safe to keep, is the work.

Recent research is beginning to describe that work directly. In a September 2026 study, Yeon Su Park and colleagues observed 19 experienced developers and mapped agent supervision into stages: plan, monitor, wait, review, teach, fix manually, and update reusable assets. The loop is familiar to anyone who has used agents for real work. The agent takes a turn; the developer decides what that turn means and what should happen next. ([The Work Behind Delegation](https://arxiv.org/abs/2609.24234))

That means more code produced per hour does not automatically mean more work shipped per hour. If agents finish faster than you can review, the queue of unverified changes grows. Review becomes the constraint. A fleet manager has to size the fleet to the available runway: your time, your test coverage, and the number of changes that can safely be in flight.

## Assign work that can travel on its own

Parallel work helps when tasks are actually separable. Google Research tested 180 agent configurations and found that multi-agent coordination improved results on some parallelizable tasks, while hurting performance on tasks with strict sequential dependencies. Their result is a useful warning against treating agent count as a productivity setting. ([Google Research, “Towards a science of scaling agent systems,” January 2026](https://research.google/blog/towards-a-science-of-scaling-agent-systems-when-and-why-agent-systems-work/))

“Add a CSV export” and “investigate why exports fail for large accounts” might be independent. “Redesign the export pipeline” and “change the API that the pipeline depends on” probably are not. Put the second pair in motion together and you have two agents guessing at a moving interface, followed by a human untangling their assumptions.

Good assignments have a destination and a boundary. Say which behavior should change, what should stay stable, and how you will recognize success. Give each task its own worktree when concurrent edits could collide. Keep dependent work in sequence or make the dependency explicit. If an agent has to invent the product decision, the task is not ready to delegate.

The manager's first job is not to keep every agent busy. It is to keep agents from doing work that cannot yet be joined up.

## Watch for state, not motion

An agent can produce a stream of tool calls without moving the task forward. It can also spend several minutes reading code and then make the right small change. Activity is a poor progress metric.

Watch for useful state changes: a clear plan, a test that reproduces the bug, a narrowed hypothesis, a proposed diff, a failing check that identifies a regression. If the state has not changed, intervene. Ask for a checkpoint, steer it toward a smaller test, or stop the run and reset the assignment.

Garrison treats a task as Working while its agent is running and Ready when the run stops. Ready is a handoff to you, not a synonym for done. You can inspect the result, send a follow-up, retry, or leave it aside. That distinction matters when several runs complete near one another: the queue does not decide what ships. You do.

Cursor’s account of running hundreds of agents on a large project describes some of the same coordination problems at a larger scale. Their early flat system left agents avoiding hard tasks and churning; adding roles helped, but excessive structure introduced new bottlenecks. The lesson for a small team is not to copy a giant swarm. It is to give each task enough ownership and coordination to finish without building a bureaucracy around it. ([Cursor, “Scaling long-running autonomous coding,” January 2026](https://cursor.com/blog/scaling-agents))

## Review the result you got

When coding by hand, you know what you changed because you made the changes. When agents write the code, you inherit an explanation and a diff. Neither is the code itself.

Read the diff. Run the relevant checks. Compare the implementation with the acceptance criteria, not just the agent's summary. An agent can report success after running the wrong tests, or make a correct local change that breaks a neighboring path. Keep review proportional to the consequence: a copy edit is not a schema migration, and an isolated experiment is not production behavior.

Then teach the system once. If you corrected a naming rule, a test command, or a recurring product constraint, put it in the repository instructions or the task's knowledge base. Repeating the same correction in five sessions is a management failure. The Park study names this part explicitly: developers turn recurring guidance into reusable assets. The point is not to write a giant prompt. It is to make the next assignment less ambiguous.

## Your attention is the scarce resource

Fleet management is a useful way to think about coding agents because it makes the tradeoff visible. Every new run can save implementation time, but it also asks for a task brief, a place to work, monitoring, and review. If several agents need the same architectural decision, starting all of them at once multiplies the interruptions without multiplying progress.

So start with a few assignments that can finish independently. Keep their work visible. Review completed tasks before the next wave piles up. When the work depends on a decision only you can make, make that decision first.

The craft of software engineering still includes code. It now includes deciding which work can move without you, and staying close enough to catch the moment it needs you again.
