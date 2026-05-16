# EAP Energy Knowledge and Learning Forum — Bali 2026 microsite

Temporary microsite for the World Bank-convened EAP Energy Knowledge and Learning Forum
on the Sustainable Energy Transition · Bali, Indonesia · June 3–5, 2026.

Static HTML/CSS/JS — no build step. Designed for GitHub Pages.

## Structure

```
bali-energy-forum/
├── index.html              Overview (public)
├── agenda.html             Three-day agenda with day tabs (public)
├── themes.html             The six core themes (public)
├── partners.html           Convening partners (public)
├── communities.html        Communities of Practice (public)
├── logistics.html          Participant logistics (PASSWORD-GATED)
├── css/styles.css          WBG Infrastructure-style theme
├── js/partials.js          Shared header / nav / footer / breadcrumb
├── js/gate.js              Client-side password gate (SHA-256 hash)
├── downloads/              PDFs served from the site
│   └── EAP-Energy-Forum-Agenda-Draft.pdf
└── images/                 Optional hero / asset images
```

## Local preview

Open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Per-person access codes for the logistics page

Each invitee has their own unique access code. Codes are stored as SHA-256
hashes in `js/gate.js`; the plaintext codes exist only in the email you send
each person.

Current invitees (regenerate codes any time by running the script below):

| Name | Email |
| ---- | ----- |
| Priyank Lathwal | plathwal@worldbank.org |
| Yussuf Uwamahoro | yuwamahoro@worldbank.org |
| Ashu Apuruv Agarwal | aagarwal15@worldbank.org |
| Byambasuren Chuluunbat | bchuluunbat1@worldbank.org |
| Yuge Ma | yma1@worldbank.org |
| Julian Jose Palma Diaz | jpalmadiaz@worldbank.org |
| Yasminnuha Jauharini | yjauharini@worldbank.org |
| Claudia Vasquez | cvasquez@worldbank.org |

### To add, remove, or rotate codes

```bash
# Edit the RECIPIENTS list at the top of scripts/generate-codes.py, then:
python3 scripts/generate-codes.py
```

The script prints:
1. Each person's plaintext code (email these privately to each invitee).
2. A `CODE_HASHES = [...]` JavaScript array — paste it into `js/gate.js`
   replacing the existing array.

To revoke one person's access without rotating everyone, delete that person's
entry from `CODE_HASHES` and redeploy.

### Security caveat

The gate runs client-side. Anyone who views page source can see the hashes and
attempt to brute-force the codes. Codes are short and human-friendly, so a
determined attacker could crack one given hours-to-days of compute.

This is appropriate for non-confidential logistics that you want to keep off the
public web. For truly sensitive content, put the site behind
[Cloudflare Access](https://www.cloudflare.com/zero-trust/products/access/) or
similar — both let you authenticate by Google/Microsoft/SSO email and need no
backend code.

## Adding PDFs

Drop new PDFs into `downloads/` and the logistics page links will pick them up:

| File | Expected path |
| ---- | ------------- |
| Draft agenda | `downloads/EAP-Energy-Forum-Agenda-Draft.pdf` ✅ already in place |
| Logistics note | `downloads/Logistics-Note.pdf` (to add) |
| Visa guidance | `downloads/Visa-Guidance.pdf` (to add) |

## Adding a hero image

For the homepage hero, drop a Bali landscape image at `images/bali-hero.jpg`.
The CSS gradient overlay means the image just needs to look good — no specific
crop required. A horizontal 16:9 image around 1600×900 works well.

## Deploy to GitHub Pages

1. Create a new repo on GitHub (private or public; if public, the gate is your
   only barrier to the logistics page).
2. From this folder:

   ```bash
   git init
   git add .
   git commit -m "Initial Bali Forum microsite"
   git branch -M main
   git remote add origin git@github.com:<your-user>/bali-energy-forum.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
4. The site will be available at `https://<your-user>.github.io/bali-energy-forum/`.

For a custom domain (e.g. `eap-energy-forum-2026.org`), point a CNAME record at
`<your-user>.github.io` and add a `CNAME` file in this folder.

## Style notes

- Palette: WB navy `#002244`, blue `#009FDA`, red `#EF4123`, gold `#FDB813`.
- Typography: system stack falling back to Open Sans, with Georgia for headings —
  mirrors the WB events template (no external font load, so the page is fast
  and works offline-first).
- Layout: 1180px content max, side-panel sidebar (320px), responsive at 880px.

## Pending content to integrate

- `downloads/Logistics-Note.pdf` (awaiting from WB Jakarta / EO)
- `downloads/Visa-Guidance.pdf` (awaiting final WB Jakarta version)
- Bali hero image at `images/bali-hero.jpg` (currently the gradient fallback shows)
- Confirm Master of Ceremony names for Day 1 and Day 2 once finalized
- Photo / bio of keynote speakers (optional — currently text-only per the Tokyo template)
