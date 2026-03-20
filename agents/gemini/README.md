# Gemini Agents for fBanner

This directory provides a predefined **Skill** and **Workflow** for the Gemini CLI, enabling AI agents to interact with the running **fBanner** macOS application through its local REST API.

## Requirements
- You must have the [Gemini CLI](https://github.com/google/gemini-cli) installed.
- The `fBanner` app must be running on your machine.
- The API server must be enabled inside the `fBanner` application settings (default runs on `localhost:3011`).

## Installation

### 1. Install the `fbanner-api` Skill

The skill allows the Gemini CLI to understand the fBanner API endpoints and how to call them. You can install it locally to your project workspace or globally to your user profile.

To install it for your user profile, run the following from your terminal:

```bash
# Assuming you are at the project root:
gemini skills install ./_public/agents/gemini/skills/fbanner-api --scope user
```

*(Note: In older versions of Gemini CLI, you may need to package it into a `.skill` file using the `skill-creator` first. However, the directory path installation is supported on newer CLI versions.)*

**Important:** After installation, you must start a Gemini CLI session and reload your skills:
```bash
> /skills reload
```

### 2. Install the `fbanner-control` Workflow

Workflows teach Gemini the exact step-by-step logic to achieve a goal safely. 

To use this workflow, copy the markdown file to your Gemini CLI `workflows` directory.

**For global installation:**
```bash
mkdir -p ~/.gemini/workflows
cp ./_public/agents/gemini/workflows/fbanner-control.md ~/.gemini/workflows/
```

**For local workspace installation:**
```bash
mkdir -p ./.agent/workflows
cp ./_public/agents/gemini/workflows/fbanner-control.md ./.agent/workflows/
```

## How to Use

Once the skill and workflow are installed and reloaded, you can ask Gemini to manipulate the fBanner app in your prompt.

**Example Prompts:**
- *"Check the current status of fBanner."*
- *"Use the fbanner-control workflow to load `/Users/me/Documents/banner.png` into fBanner and export it to my Desktop."*

Gemini will automatically utilize `curl` and follow the workflow steps to automate the application.