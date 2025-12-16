# ORIGAMI CIPHER ENGINE
**Version 3.2.0**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build: Vite](https://img.shields.io/badge/Build-Vite-646CFF.svg)](https://vitejs.dev/)
[![React: 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![UI: Tailwind](https://img.shields.io/badge/UI-Tailwind_CSS-38B2AC.svg)](https://tailwindcss.com/)

---

## System Overview
The **Origami Cipher Engine** is a specialized cryptographic visualizer that implements a spatial-folding algorithm. By mapping plaintext into a dynamic matrix, the engine simulates physical paper mechanics to execute layered character summation and transformation.

## Core Architecture

### 1. Matrix Initialization
Data is injected into an $N \times M$ grid density. This matrix serves as the foundation for all subsequent spatial operations. The grid width is user-configurable to alter the initial distribution of the plaintext.

### 2. Folding Mechanics
The engine supports two primary transformation types:
* **Horizontal Fold (H-Axis)**: Rows are overlaid based on a central axis, summing Unicode values.
* **Vertical Fold (V-Axis)**: Columns are collapsed laterally, reducing matrix width while increasing character depth.

### 3. Mathematical Summation
Encryption is achieved through **Modulo 26 Summation**:

$$C \equiv (P_1 + P_2) \pmod{26}$$

Where $P_1$ represents the surface character value and $P_2$ represents the character value from the overlapping folded layer.

## Key Capabilities
* **Process Telemetry**: Real-time terminal output tracking matrix state changes and execution timestamps.
* **3D Depth Simulation**: Visual rendering of character "depth" using CSS transforms to represent folded layers.
* **Encryption Reports**: One-click generation of PDF documentation containing the plaintext, fold-key sequence, and final ciphertext.

## Technical Specifications

| Module | Technology |
| :--- | :--- |
| **Logic Engine** | React 18 / Hooks |
| **Vector Assets** | Lucide React |
| **Styling** | Tailwind CSS JIT Engine |
| **Export Utility** | jsPDF |
| **Bundler** | Vite 4.x |

## Deployment & Development
To initialize the development environment:

```bash
# Clone the repository
git clone [https://github.com/greedism/origami-cipher.git](https://github.com/greedism/origami-cipher.git)

# Install dependencies
npm install

# Execute development build
npm run dev
```
Developed for educational exploration in modern cryptography and spatial data visualization.
---

### 2. How to "Download" it to GitHub
Once you save that file, run these commands in your terminal to "upload/download" it to your live GitHub repository:

```bash
git add README.md
git commit -m "docs: add professional technical readme"
git push origin main
