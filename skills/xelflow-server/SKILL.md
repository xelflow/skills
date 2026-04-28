---
name: xelflow-server
description: "High-level orchestrator skill for developing with the Xelflow Server, routing tasks to table, flow, authentication, frontend, and SSE sub-skills."
version: 1.0.0
license: MIT
---

# Xelflow Server Skill

The **Xelflow Server Skill** is the central orchestrator for all Xelflow-related development tasks.  
It understands the full Xelflow architecture and delegates work to the appropriate sub-skills:

- `xelflow-tables`
- `xelflow-flows`
- `xelflow-authentications`
- `xelflow-frontend`
- `xelflow-sse-debug`

This skill does **not** implement the rules itself — instead, it interprets user intent and routes the request to the correct specialized skill.

---

## 🧠 What this skill does

- Understands the full Xelflow development workflow
- Determines which sub-skill should handle the request
- Provides high-level explanations of Xelflow concepts
- Helps developers follow the correct sequence:
    1. Tables
    2. Migrations
    3. Authentications
    4. Flows
    5. Frontend
    6. Syncing

It acts as the **entry point** for developers working with Xelflow.

---

## 🧩 When this skill is used

This skill activates when the user asks broad questions such as:
How do I add new functionality to Xelflow?
What steps do I follow to update the schema and flows?
Explain how Xelflow Server works.
Help me debug my Xelflow integration.
I want to build a new feature. What do I do first?


The skill then routes the request to the correct sub-skill.

---

## 🔀 Routing Logic

This skill determines intent based on keywords and context:

| Intent                                | Routed To                 |
|---------------------------------------|---------------------------|
| Table definitions, schema, migrations | `xelflow-tables`          |
| Flow definitions, events, triggers    | `xelflow-flows`           |
| External services authentications     | `xelflow-authentications` |
| Frontend development                  | `xelflow-frontend`        |
| SSE debugging                         | `xelflow-sse-debug`       |

If the request spans multiple areas, this skill coordinates the sequence.

---

## 📥 Input examples

Add a new field to the devices table and update the flow that processes device updates.
Create a new feature that lets users upload documents and triggers a flow.
Explain how to sync tables and flows to the server.
My SSE stream is not updating. What should I check?

---

## 📤 Output behavior

This skill returns:

- High-level explanations
- Correct routing to sub-skills
- Step-by-step workflows
- Architectural guidance
- Development best practices

It does **not** generate table/flow/auth JSON itself — that is delegated.

---

## 🏗️ Architecture Knowledge

This skill understands:

- Event-driven architecture
- Xelflow Flow Engine
- Table definitions and migrations
- Authentication definitions
- Angular 21 frontend standards
- SSE debugging
- Syncing flows and tables
- Project directory structure

---

## 🧩 Recommended Installation

Install this orchestrator skill:

npx skills add xelflow/skills/xelflow-server

Code

Then install the sub-skills:

npx skills add xelflow/skills/xelflow-tables
npx skills add xelflow/skills/xelflow-flows
npx skills add xelflow/skills/xelflow-authentications

## ✔️ Summary

This is the **top-level Xelflow skill** that:

- Understands the whole system
- Routes tasks to the correct sub-skill
- Guides developers through the Xelflow workflow
- Keeps the skill suite modular, clean, and maintainable  