# fBanner Gemini Agent

## Overview

The fBanner Gemini Agent provides an integrated development experience using Google's Gemini CLI. It consists of specific **Skills**, **Workflows**, and **Rules** designed to automate testing, build analysis, deployment, and documentation for the fBanner project.

## Components

- **Skills (`.agent/skills/`)**: Modular, self-contained packages extending Gemini CLI's capabilities. Examples include `build-doctor`, `capture`, `issue-manager`, etc.
- **Workflows (`.agent/workflows/`)**: Multi-step procedures guiding Gemini CLI to execute complex tasks like `/deploy`, `/qa-type-do`, `/lib-apply`.
- **Rules (`.agent/rules/`)**: Core constraints and coding guidelines (e.g., `snippet_rules.md`, `language-rules.md`).

## Installation

Gemini skills for this project are maintained in `.agent/skills`. You can install or symlink them to your local Gemini CLI environment depending on your setup.

```bash
# Example of installing a skill
gemini skills install .agent/skills/build-doctor --scope workspace
```

To reload skills in an active Gemini CLI session:
```
/skills reload
```

## Workflows and Skills

For more details on how to create or use Workflows and Skills, please refer to:
- [Workflows Guide](workflow.md)
- [Skills Guide](skill.md)
