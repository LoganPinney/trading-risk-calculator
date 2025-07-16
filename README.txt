# Trading Risk Calculator App

A **desktop application** for active traders that instantly calculates optimal position size, risk‑reward scenarios, and potential profit/loss based on live user inputs. Built with **Electron + React** for a native‑feeling cross‑platform experience.

---

## 1. Key Features

* **Real‑time Sliders** – Adjust *Entry Price*, *Stop‑Loss*, *Capital Deployed*, and *Risk %* with smooth UI sliders.
* **Dynamic Risk Graph** – Black background with translucent lime‑green grid; a responsive line graph updates live. A red dot marks the current risk point.
* **Position‑Size Formula** – `shares = (capital × risk%) ÷ |entry – stopLoss|` rendered instantly.
* **Risk/Reward Read‑out** – Displays R\:R ratio and \$ P/L at 1 R, 2 R, 3 R.
* **Persisted Settings** – Automatically saves last‑used slider values to local storage.
* **Cross‑Platform** – Windows, macOS, Linux (x64/arm64).

---

## 2. Technology Stack

| Layer         | Tech                              |
| ------------- | --------------------------------- |
| UI            | React 18, TypeScript, TailwindCSS |
| Desktop Shell | Electron 29                       |
| Charting      | Recharts                          |
| State         | Redux Toolkit                     |
| Packaging     | electron‑builder                  |
| Lint/Test     | ESLint, Prettier, Vitest          |

---

## 3. Folder Structure

```
root/
 ├─ build/
 ├─ dist/
 ├─ node_modules/
 ├─ public/
 │   ├─ assets/
 │   │   └─ icon.png
 │   ├─ electron.js
 │   ├─ index.css
 │   ├─ index.html
 │   └─ preload.js
 ├─ src/
 │   ├─ main/
 │   │   └─ main.js
 │   ├─ renderer/
 │   │   └─ TradingRiskCalculator.jsx
 │   ├─ shared/
 │   │   └─ calculations.js
 │   ├─ App.js
 │   ├─ App.css
 │   ├─ index.js
 │   ├─ index.css
 │   └─ preload.js
 ├─ test/
 │   └─ test.mjs
 ├─ .gitignore
 ├─ AGENTS.md
 ├─ electron-builder.json
 ├─ forge.config.js
 ├─ package.json
 └─ package-lock.json
```

---

## 4. Prerequisites

* **Node.js ≥ 20** (LTS recommended)
* **Git**
* **Python 3** (for node‑gyp on Windows)
* **Windows Build Tools** or Xcode‑CLI for native addons

---

## 5. Quick Start

```bash
# 1. Clone
$ git clone https://github.com/your‑org/trading‑risk‑calculator.git
$ cd trading‑risk‑calculator

# 2. Install deps (root‑level workspace)
$ npm i

# 3. Launch in dev with hot‑reload
$ npm run dev          # spawns Vite + Electron concurrently
```

The app window opens automatically. Any change to React code hot‑reloads; Electron restarts when main‑process files change.

### Available Scripts

| Script           | Purpose                                   |
| ---------------- | ----------------------------------------- |
| `npm run dev`    | Start Vite + Electron in development      |
| `npm run dev:ui` | (UI only) start Vite web preview          |
| `npm run lint`   | Run ESLint + Prettier                     |
| `npm test`       | Unit tests via Vitest                     |
| `npm run build`  | Build production React + Electron bundles |
| `npm run dist`   | Create installers via electron‑builder    |

> **Note**: If `npm run dev` throws *Missing script*, ensure your `package.json` contains the scripts block from `template.package.json`.

---

## 6. Environment Variables

Create a `.env` file in the project root and copy these defaults:

```
# UI
VITE_APP_NAME="Risk Calculator"

# Electron
ELECTRON_DISABLE_SECURITY_WARNINGS=true
```

No external APIs are required, but you can add custom vars prefixed with `VITE_` to expose them to the UI.

---

## 7. Using the Calculator

1. **Set Entry Price** – drag or type.
2. **Set Stop‑Loss** – must differ from entry; negative values unsupported.
3. **Choose Capital** – amount willing to deploy on this trade.
4. **Set Risk %** – fraction of capital you accept to lose.
5. Read real‑time outputs and red dot on the chart.
6. Press **Copy Trade Plan** to clipboard (formatted for journaling).

Validation prevents impossible inputs (e.g., 0 or identical entry/stop).

---

## 8. Calculation Logic Explained

```
risk_amt   = capital × risk_percent
share_qty  = risk_amt / |entry – stop|
reward_one = |entry – stop|
ratio      = target_distance / risk_distance  # displayed live
```

All math is handled in *src/lib/calc.ts* with unit tests ensuring accuracy.

---

## 9. Theming & Customization

* **Grid Color** – tweak `--grid-color` in `tailwind.config.js`.
* **Accent Theme** – primary accent derives from Tailwind `emerald‑400` by default.
* **Persistence** – replace localStorage with electron‑store in `main/persist.ts` if you prefer encrypted disk storage.

---

## 10. Troubleshooting

| Symptom                            | Fix                                                                    |                 |
| ---------------------------------- | ---------------------------------------------------------------------- | --------------- |
| **Port 5173 in use**               | `npx kill-port 5173` or \`lsof -ti:5173                                | xargs kill -9\` |
| **blank window**                   | Check devtools, ensure `VITE_DEV_SERVER_URL` is set by Vite during dev |                 |
| **ELIFECYCLE exit 1**              | Delete `node_modules`, run `npm cache clean --force`, then `npm i`     |                 |
| **JSONPARSE Invalid package.json** | Remove comments from JSON; package.json must be valid JSON             |                 |

---

## 11. Roadmap

* [ ] Multi‑tab support for multiple concurrent trade ideas
* [ ] Dark‑/Light‑mode toggle
* [ ] Historical data import to backtest risk metrics
* [ ] Localization (i18n)

---

## 12. Contributing

Pull requests welcome! Please:

1. Fork the repo & create a new branch.
2. Run `npm run lint` & `npm test` before PR.
3. Follow **Conventional Commits** style.
4. Describe *why* the change is needed.

---

## 13. License

MIT © 2025 Logan Pinney. See **LICENSE** file for details.

---

## 14. Disclaimer

This tool is for **educational purposes** only. It *does not* constitute financial advice. Trading involves substantial risk; past performance is not indicative of future results. Use at your own discretion.
