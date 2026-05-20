# EAP Energy Knowledge and Learning Forum — Bali 2026 microsite

Temporary microsite for the World Bank-convened EAP Energy Knowledge and Learning Forum
on the Sustainable Energy Transition · Bali, Indonesia · June 3–5, 2026.

Static HTML/CSS/JS — no build step. Hosted on GitHub Pages.

- **Live site:** <https://priyanklathwal.github.io/EAP-Energy-Forum-2026/>
- **Repo:** <https://github.com/priyanklathwal/EAP-Energy-Forum-2026>

## Structure

```
EAP-Energy-Forum-2026/
├── index.html              Overview (public)
├── agenda.html             Three-day agenda with day tabs (public)
├── themes.html             The six core themes (public)
├── partners.html           Convening partners (public)
├── communities.html        Communities of Practice (public)
├── logistics.html          Participant logistics (password-gated)
├── css/styles.css          WBG Infrastructure-style theme
├── js/partials.js          Shared header / nav / footer / breadcrumb
├── js/gate.js              Client-side shared-password gate (SHA-256 hash)
├── downloads/              PDFs linked from the site
└── images/                 Hero gallery and other assets
```

## Local preview

Open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Shared password for the logistics page

All participants use one shared password to unlock `logistics.html`. The current
password is stored as a SHA-256 hash in [js/gate.js](js/gate.js); the plaintext
is included as an inline comment for the maintainer's reference.

### To rotate the password

1. Pick a new password.
2. Compute its SHA-256:

   ```bash
   printf '%s' 'new-password-here' | shasum -a 256
   ```
3. Replace `PASSWORD_HASH` in [js/gate.js](js/gate.js) with the new hash and
   update the trailing comment with the new plaintext.
4. Commit and push — GitHub Pages will redeploy automatically.
5. Email the new password to participants.

### Security caveat

The gate runs client-side. Anyone who views page source can see the hash and
attempt to brute-force a short password. This is appropriate for
non-confidential logistics that you want to keep off the public web —
"obscurity, not security." For truly sensitive content, put the site behind
[Cloudflare Access](https://www.cloudflare.com/zero-trust/products/access/) or
similar.

## Deploying changes

The site is already wired to GitHub Pages from the `main` branch root. Any
`git push` to `main` redeploys within a minute or two.

## Style notes

- Palette: WB navy `#002244`, blue `#009FDA`, red `#EF4123`, gold `#FDB813`.
- Typography: system stack falling back to Open Sans, with Georgia for headings —
  mirrors the WB events template (no external font load, so the page is fast
  and works offline-first).
- Layout: 1180px content max, side-panel sidebar (320px), responsive at 880px.
