# Skill: deadline-and-status

## Purpose
Use this skill when implementing AerisClaim claim lifecycle logic, deadlines, reminders, escalation timing, and workflow state transitions.

## Goals
- Make claim state transitions explicit
- Reduce deadline risk
- Surface next best action
- Support reminders and escalations

## Principles
1. Date math should be deterministic.
2. Statuses should be finite and explicit.
3. Every important state change should emit an event.
4. Deadlines should be visible, not hidden in notes.
5. Escalation logic should be structured and reviewable.

## Core state ideas
- draft
- ready
- submitted
- acknowledged
- denied
- appealed
- partial_paid
- paid
- closed
