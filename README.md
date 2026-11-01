# Sangeet Manjari Kala Kendra

Website for Sangeet Manjari Kala Kendra – https://sangeetmanjari.me
Plain HTML/CSS/JS on GitHub Pages (no build step).

## Editing content – admin panel

Open **https://sangeetmanjari.me/admin.html**

- Switch sections, courses, photos, videos, reviews and the popup on or off
- Edit contact details, social links, fees, numbers and the main paragraphs
- **Preview** shows your changes before anyone else sees them
- **Publish** saves `content.json` to this repository; the live site updates in about a minute

Publishing needs a GitHub fine-grained token (once per device):
GitHub → Settings → Developer settings → Fine-grained tokens → only this repository →
Repository permissions → **Contents: Read and write**. The token is stored only in that browser.

## Files

- `content.json` – everything the admin panel edits
- `index.html`, `styles.css`, `script.js` – the site
- `admin.html` – the admin panel
- `assets/` – logo, photos, reels

## Preview locally

```
python3 -m http.server 8000
```
then open http://localhost:8000 (and /admin.html)
