# The Mind Vault

> *"Some minds are worth unlocking."*

A single-page, mobile-first interactive puzzle vault built for an engineering mind that values precision, discipline, and quiet depth.

---

## Features

- **Navy & Cyan Aesthetics**: Deep navy visual field (`#050B1F` to `#0B1F4D`), ice-white typography, electric-cyan circuits, and soft-gold accents.
- **Dynamic Particle Canvas**: Ambient cyber dust, confetti celebration bursts, and an animated particle finale that coalesces into a glowing letter **"M"**.
- **Three Calibration Games**:
  1. **Cipher Crack** (Seal I): Shift cipher with interactive letter dials, visible hints, auto-hint assistance, and skip fallback. Unlocks the *"A Researchful Mind"* trait.
  2. **Memory Matrix** (Seal II): 3×3 matrix sequence with 4 forgiving rounds and synthesized WebAudio pentatonic notes. Unlocks the *"Quiet Maturity"* trait.
  3. **Logic Gates Lab** (Seal III): Circuit schematic with live animated electric traces and an incandescent filament bulb. Unlocks the *"Calm Under Pressure"* trait.
- **Surprises & Easter Eggs**:
  - **Audit Alert**: A high-tech "Security Alert" that diagnoses cognitive integrity and humility as a sincere compliment.
  - **MindOS Cyber Terminal**: Conversational terminal with typed commands and quick mobile chips (`scan`, `specs`, `traits`, `coffee`, `sudo`, `reset`).
  - **3 Hidden Easter Eggs**:
    - *The Vault Tapper*: Tap the center keyhole 5 times.
    - *Handshake Protocol*: Type or enter `"hello"` in the terminal or on the keyboard.
    - *Hawk Eye*: Tap the subtle micro-rivet in the corner.
- **Master Key**: Disengaging all seals unlocks the vault and reveals the certified master key: **`MINDFORGE`**.
- **Audio & Haptics**: Pure client-side WebAudio synthesizer with mute toggle and mobile vibration feedback.
- **Persistence**: All progress and achievements persist in `localStorage` with a safe reset option.

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
This produces an optimized production bundle in the `dist/` directory with relative asset paths ready for static hosting.

---

## Deploying to GitHub Pages (Automated)

This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) that builds and deploys the app automatically on every push.

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new) and create a new repository (e.g. `the-mind-vault`).

### Step 2: Push Code to GitHub
In your local project folder, run:
```bash
git init
git add .
git commit -m "feat: initial release of The Mind Vault"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 3: Enable GitHub Pages in Repository Settings
1. In your GitHub repository, click on **Settings** (gear icon).
2. On the left sidebar, click on **Pages** (under *Code and automation*).
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. That's it! GitHub will automatically trigger the workflow and publish your site at:
   ```
   https://<your-username>.github.io/<your-repo-name>/
   ```

---

## Alternative Static Hosting Platforms

Because this is a completely static, standalone client-side application with zero backend requirements:

- **Vercel**: Import the GitHub repository, set framework preset to *Vite*, and deploy.
- **Netlify**: Connect repository, build command: `npm run build`, publish directory: `dist`.
- **Cloudflare Pages**: Connect repository, build command: `npm run build`, output directory: `dist`.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Sound**: WebAudio API (Zero external audio assets)
- **Animation**: HTML5 Canvas + Motion
