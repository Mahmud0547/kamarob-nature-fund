# 🌿 Kamarob Nature Fund

> Nature conservation website for a Tajik environmental NGO operating in the Kamarob Gorge, Rasht Valley — a confirmed snow leopard habitat and one of 8 protected reserves in Tajikistan.

**Live site → [mahmud0547.github.io/kamarob-nature-fund](https://mahmud0547.github.io/kamarob-nature-fund/)**

---

## Features

- **Multilingual UI** — English, Russian, German, Tajik (full i18n with live switching, no page reload)
- **Dynamic project & expedition pages** — slug-based routing (`/project.html?slug=...`), data loaded from Supabase on the fly
- **Supabase backend** — PostgreSQL with Row Level Security; only `published=true` rows are public
- **Dark nature-themed design** — custom CSS variables, Playfair Display + Inter typography, smooth scroll animations
- **Contact form** — submissions saved to Supabase `contact_submissions` table
- **Fully static hosting** — no server needed; deployed on GitHub Pages

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| Database | Supabase (PostgreSQL + RLS) |
| Fonts | Google Fonts — Playfair Display, Inter |
| Hosting | GitHub Pages |
| i18n | Custom dictionary (`js/i18n.js`) with `data-i18n` attributes |

## Project Structure

```
kamarob-nature-fund/
├── index.html          # Landing page (mission, programs, expeditions, contact)
├── project.html        # Dynamic project detail page (reads ?slug= param)
├── expedition.html     # Dynamic expedition detail page
├── css/
│   ├── main.css        # Global styles, design system
│   └── detail.css      # Styles for project/expedition pages
├── js/
│   └── i18n.js         # Translation dictionary (EN/RU/DE/TJ)
└── images/             # Static assets
```

## How slug routing works

```js
// project.html reads the URL parameter and fetches from Supabase
const slug = new URLSearchParams(window.location.search).get('slug');

const { data } = await supabase
  .from('projects')
  .select('*')
  .eq('slug', slug)
  .eq('published', true)
  .single();
```

No framework, no build step — just clean vanilla JS with dynamic ES Module imports.

## Running locally

Because the project uses ES Modules and fetches from Supabase, it needs to be served over HTTP (not `file://`).

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Then open `http://localhost:8000`.

---

Built by [Mahmud](https://github.com/Mahmud0547)
