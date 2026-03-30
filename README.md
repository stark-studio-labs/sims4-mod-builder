<div align="center">

<img src="https://raw.githubusercontent.com/stark-studio-labs/.github/main/assets/stark-labs-banner.svg" alt="Stark Studio Labs" width="100%">

# sims4-mod-builder

**Build Sims 4 mods visually. No XML required.**

[![Status](https://img.shields.io/badge/status-in%20development-orange)](https://github.com/stark-studio-labs/sims4-mod-builder)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Made by Stark Studio Labs](https://img.shields.io/badge/made%20by-Stark%20Studio%20Labs-blueviolet)](https://github.com/stark-studio-labs)

*Built by [Stark Studio Labs](https://github.com/stark-studio-labs)*

</div>

---

## 🌐 Stark Labs Ecosystem

> Everything we build for The Sims 4 modding community — open source, interconnected, and community-driven.

| Repo | What It Does | Status |
|------|-------------|--------|
| 📚 **[awesome-sims4-mods](https://github.com/stark-studio-labs/awesome-sims4-mods)** | Curated mod directory with compatibility tracking | ![Active](https://img.shields.io/badge/-active-brightgreen) |
| 🧱 **[sims4-stark-framework](https://github.com/stark-studio-labs/sims4-stark-framework)** | Modern typed modding framework (replaces S4CL patterns) | ![Active](https://img.shields.io/badge/-active-brightgreen) |
| 🔧 **[sims4-stark-devkit](https://github.com/stark-studio-labs/sims4-stark-devkit)** | CLI toolkit — decompile, package, scaffold, test | ![Active](https://img.shields.io/badge/-active-brightgreen) |
| 📦 **[sims4-mod-manager](https://github.com/stark-studio-labs/sims4-mod-manager)** | Scan, organize, and detect conflicts in your mod collection | ![Alpha](https://img.shields.io/badge/-alpha-orange) |
| 🎨 **[sims4-mod-builder](https://github.com/stark-studio-labs/sims4-mod-builder)** | Visual mod creation tool — no XML knowledge needed | ![In Dev](https://img.shields.io/badge/-in%20dev-yellow) |
| 🔬 **[sims4-mod-revival](https://github.com/stark-studio-labs/sims4-mod-revival)** | Decompile and revive abandoned community mods | ![Active](https://img.shields.io/badge/-active-brightgreen) |
| 💰 **[sims4-economy-sim](https://github.com/stark-studio-labs/sims4-economy-sim)** | Banking, bills, jobs, and stock market overhaul mod | ![Pre-Alpha](https://img.shields.io/badge/-pre--alpha-red) |

---

## 📖 Table of Contents

- [🎨 What Is This?](#-what-is-this)
- [😤 The Problem It Solves](#-the-problem-it-solves)
- [👻 What Happened to Mod Constructor?](#-what-happened-to-mod-constructor)
- [⚖️ How It Compares](#%EF%B8%8F-how-it-compares)
- [✨ Features (Coming)](#-features-coming)
  - [🖼️ Visual Tuning Editor](#%EF%B8%8F-visual-tuning-editor)
  - [📝 Mod Templates](#-mod-templates)
  - [🐍 Python Scripting (Intermediate)](#-python-scripting-intermediate)
  - [📦 Packaging & Distribution](#-packaging--distribution)
  - [📂 Project Management](#-project-management)
- [👥 Who This Is For](#-who-this-is-for)
- [⚙️ Technical Approach](#%EF%B8%8F-technical-approach)
- [🗺️ Roadmap](#%EF%B8%8F-roadmap)
- [🚀 Getting Started](#-getting-started)
- [🔗 Related Projects](#-related-projects)

---

## 🎨 What Is This?

**sims4-mod-builder** is a visual mod creation tool for The Sims 4. You describe what you want your mod to do — using a property editor, not raw XML — and the builder generates the correct tuning files and packages the mod for you.

The goal: a first-time mod creator should be able to build and install a functional mod in under 30 minutes, with zero knowledge of how `.package` files work or what XML tuning syntax looks like.

---

## 😤 The Problem It Solves

Making Sims 4 mods today requires knowing three separate things at once:

1. **Where to find what you want to change** — The game has hundreds of tuning files spread across different resource types. Finding the right file to modify requires knowing what you're looking for before you can search.
2. **How to write correct XML** — Sims 4 tuning is verbose and strict. One malformed attribute breaks the entire mod silently.
3. **How to package the result** — `.package` files are binary containers. Creating one requires Sims 4 Studio or a scripting library, not just saving a file.

Tools like Sims 4 Studio (S4S) exist and are excellent — but they're oriented toward experienced modders who already know what they're editing. The learning curve for a beginner is steep.

---

## 👻 What Happened to Mod Constructor?

Zerbu's **Mod Constructor** was the last serious attempt at a visual mod creation tool for Sims 4. It covered careers, clubs, traits, and aspirations via a form-based interface. It was last updated around 2022 and has been functionally abandoned — it doesn't support current game structures and has no active development.

The community has been without a maintained beginner-friendly creation tool since then. sims4-mod-builder picks up where Mod Constructor left off, with a broader scope and a modern development foundation.

---

## ⚖️ How It Compares

| Tool | Approach | Skill Level | XML Required | Python Required | Status |
|------|----------|-------------|--------------|-----------------|--------|
| **Sims 4 Studio** | Direct asset editing, CAS/B&B items, recolors | Intermediate–Advanced | Yes | No | ✅ Actively maintained |
| **S4TK** | Node.js library for scripting .package creation | Developer | Programmatic | No (JavaScript) | ✅ Actively maintained |
| **Mod Constructor (Zerbu)** | Visual form editor for careers/traits/aspirations | Beginner | No | No | ⚠️ Abandoned ~2022 |
| **s4pe** | Low-level binary .package editor | Advanced | Yes | No | ⚠️ Legacy |
| **XML Injector** | Simple XML tuning mods without scripting | Beginner | Yes | No | ✅ Actively maintained |
| **sims4-mod-builder** | Visual property editor for tuning + built-in script IDE | Beginner–Intermediate | No | Optional | 🔨 In Development |

### What sims4-mod-builder Does NOT Do

Being honest about scope matters. This tool will not replace:

- **Sims 4 Studio** for CAS items, meshes, recolors, or Build/Buy assets — we don't touch 3D assets
- **S4TK** for programmatic .package manipulation at scale — devs who want code control should use S4TK
- **Blender + S4 plugins** for any 3D modeling work

sims4-mod-builder is focused on **behavior mods**: tuning overrides, new traits, interactions, careers, skills, buffs, and Python script mods. If you need to change how something *looks*, use S4S.

---

## ✨ Features (Coming)

### 🖼️ Visual Tuning Editor
- **Property browser** — navigate game tuning categories (interactions, traits, skills, careers, needs, whims, emotions) without touching XML
- **Value editor** — modify numeric ranges, string lists, enum selections, and boolean flags via form controls; the tool writes the XML
- **Live preview** — see the human-readable effect of your change ("Sims will now max the Cooking skill 30% faster") before packaging
- **Default diff view** — compare your changes against the base game tuning to see exactly what your mod overrides

### 📝 Mod Templates
- **Trait creator** — define a new trait: name, description, gameplay effects, compatible aspirations, CAS category, and buff associations
- **Career builder** — create a new career with branches, levels, performance metrics, work schedules, and daily tasks
- **Skill creator** — add a new skill with level descriptions and unlock gates
- **Interaction injector** — add new social or object interactions to existing Sims or objects using XML Injector as the injection layer
- **Buff creator** — define new moodlets with associated emotions, durations, and triggered behaviors

### 🐍 Python Scripting (Intermediate)
- **Script IDE** — built-in editor with Sims 4 Python API autocomplete and type hints
- **Boilerplate generation** — generate the correct Python scaffolding for common patterns (service registration, event listeners, cheat commands, custom interactions)
- **One-click compile** — compile `.py` to `.pyc` and package into `.ts4script` without manual toolchain setup
- **Error highlighting** — surface common Sims 4 scripting mistakes before packaging (wrong base class, missing `@classproperty`, incorrect resource key format)

### 📦 Packaging & Distribution
- **One-click package** — combine all tuning files and scripts into a correctly structured `.package` file
- **Mod metadata** — attach creator name, version, game version requirement, and description that surfaces in Better Exceptions and future tooling
- **Direct install** — push the packaged mod directly to your `Mods/` folder from the builder
- **Export to sims4-mod-manager** — publish the mod to your local mod manager install for tracked updates

### 📂 Project Management
- **Project files** — save your mod as an editable `.s4project` file (version-controllable source format)
- **Multi-file mods** — manage complex mods with multiple tuning files, a Python script, and a dependency list in one project
- **Git integration** — optional source control for your mod project

---

## 👥 Who This Is For

**Beginner creators** who want to make their first mod without reading 10 tutorials first. Start with a template, adjust properties, click Build, install. That's the target experience.

**Intermediate creators** who know what they want to change but don't want to manually manage XML files and package builds. Use the property editor for tuning, the script IDE for Python, and let the builder handle the rest.

**Experienced creators** looking for a faster workflow for repetitive tasks. The template system and direct-to-Mods install make iteration faster than the manual toolchain.

---

## ⚙️ Technical Approach

- **Platform:** Electron + React (cross-platform desktop: Windows, Mac)
- **Tuning parsing:** Built on S4TK for `.package` file read/write
- **Game data:** Ships with a curated index of base game tuning resource keys to power the property browser — updated after each major EA patch
- **Python toolchain:** Bundles a Python 3.7 environment and the correct Sims 4 stubs for autocomplete and compilation
- **Project format:** JSON-based `.s4project` files (human-readable, version-controllable)

---

## 🗺️ Roadmap

### Core Engine
| Feature | Status | Notes |
|---------|--------|-------|
| Project file format (.s4project) | 🔨 In Progress | JSON, version-controllable source format |
| DBPF .package read/write | 🔨 In Progress | Via S4TK integration |
| Base game tuning index | 📋 Planned | Curated resource key index for property browser |
| EA patch update pipeline | 📋 Planned | Keep tuning index current after EA updates |

### Visual Tuning Editor
| Feature | Status | Notes |
|---------|--------|-------|
| Property browser | 📋 Planned | Navigate tuning categories without XML |
| Value editor — numbers/strings/enums/booleans | 📋 Planned | Form controls that write XML |
| Live preview (human-readable effect description) | 📋 Planned | "Sims will max Cooking 30% faster" |
| Default diff view | 📋 Planned | Compare changes against base game tuning |

### Mod Templates
| Feature | Status | Notes |
|---------|--------|-------|
| Trait creator | 📋 Planned | Name, description, effects, CAS category, buffs |
| Career builder | 📋 Planned | Branches, levels, schedules, performance metrics |
| Interaction injector | 📋 Planned | New social/object interactions via XML Injector |
| Buff creator | 📋 Planned | Moodlets with emotions, durations, behaviors |
| Skill creator | 📋 Planned | New skills with level descriptions |

### Python Scripting IDE
| Feature | Status | Notes |
|---------|--------|-------|
| Built-in editor | 📋 Planned | Monaco-based with Python support |
| EA API autocomplete | 📋 Planned | Type stubs from sims4-stark-devkit |
| Boilerplate generation | 📋 Planned | Scaffolds for common patterns |
| One-click compile | 📋 Planned | .py → .pyc → .ts4script |
| Error highlighting | 📋 Planned | Common Sims 4 scripting mistakes flagged |

### Packaging & Distribution
| Feature | Status | Notes |
|---------|--------|-------|
| One-click package | 📋 Planned | Combine tuning + scripts into .package |
| Mod metadata | 📋 Planned | Creator, version, game version requirement |
| Direct Mods/ install | 📋 Planned | Push directly to EA Mods folder |
| Export to sims4-mod-manager | 📋 Planned | Tracked updates via mod manager |

### Platform
| Feature | Status | Notes |
|---------|--------|-------|
| Windows | 📋 Planned | Primary target |
| Mac | 📋 Planned | Secondary target |
| Linux | ❌ Out of Scope | EA doesn't support Linux; no Mods folder |
| Web-based | ❌ Out of Scope | Requires local file system access |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/stark-studio-labs/sims4-mod-builder.git
cd sims4-mod-builder

# Open in your browser (no build step required)
open index.html
```

The prototype is a static web app — no Node.js, no build tools, no dependencies. Just HTML, CSS, and JavaScript.

### What You Can Do Now

1. **Trait Builder** — Define traits with buffs, conflicts, icons, and age restrictions. See real-time XML preview.
2. **Career Builder** — Create multi-level careers with salaries, required skills, and schedules.
3. **Interaction Builder** — Add social/object interactions with outcome effects and XML Injector snippets.
4. **Export** — Download generated XML tuning files. (Full `.package` export coming in v0.2.)

### Project Structure

```
sims4-mod-builder/
├── index.html              # Main application
├── css/
│   ├── style.css           # Core layout, sidebar, theme
│   ├── components.css      # Buttons, inputs, cards, tooltips
│   └── builders.css        # Builder forms, preview panels
├── js/
│   ├── app.js              # View management, form logic, export
│   └── generators.js       # XML generation for traits, careers, interactions
└── README.md
```

---

## 🔗 Related Projects

| Repo | Description |
|------|-------------|
| 📚 [awesome-sims4-mods](https://github.com/stark-studio-labs/awesome-sims4-mods) | Curated mod directory with compatibility tracking |
| 🧱 [sims4-stark-framework](https://github.com/stark-studio-labs/sims4-stark-framework) | Modern typed modding framework (replaces S4CL patterns) |
| 🔧 [sims4-stark-devkit](https://github.com/stark-studio-labs/sims4-stark-devkit) | CLI toolkit — decompile, package, scaffold, test |
| 📦 [sims4-mod-manager](https://github.com/stark-studio-labs/sims4-mod-manager) | Scan, organize, and detect conflicts in your mod collection |
| 🔬 [sims4-mod-revival](https://github.com/stark-studio-labs/sims4-mod-revival) | Decompile and revive abandoned community mods |
| 💰 [sims4-economy-sim](https://github.com/stark-studio-labs/sims4-economy-sim) | Banking, bills, jobs, and stock market overhaul mod |

---

<div align="center">

**Built with 💚 by [Stark Studio Labs](https://github.com/stark-studio-labs)**

</div>
