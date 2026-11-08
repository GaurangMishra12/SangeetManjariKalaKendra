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
Repository permissions → **Contents: Read and write**. On first use you also choose an **admin password**;
the token is saved in that browser encrypted with it, and the panel asks for the password every time it opens.
Forgot it? Use “Reset this device” on the login screen and connect again with the token.

## Files

- `content.json` – everything the admin panel edits
- `index.html`, `styles.css`, `script.js` – the site
- `admin.html` – the admin panel
- `riyaz.html` + `riyaz.js` – Virtual Riyaz Room (taal player, synthesised tabla/tanpura, tatkar guide)
- `terms.html`, `privacy.html` – Terms of use (copyright & trademark) and Privacy policy
- `events.html` – Performances & Events page (same header/footer as `index.html`; keep both in sync when editing the menu or footer)
- `assets/` – logo, photos, reels

## Preview locally

```
python3 -m http.server 8000
```
then open http://localhost:8000 (and /admin.html)
