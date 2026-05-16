// Per-person access gate for the logistics page.
// Each person has a unique SHA-256-hashed code. To revoke someone, delete their
// entry from CODE_HASHES and redeploy.
//
// To add or rotate codes, edit scripts/generate-codes.py and re-run it, then
// paste the new array below.
//
// NOTE: This is client-side. Anyone who views source can see the hashes. A
// determined attacker could brute-force short codes. This is appropriate for
// non-confidential logistics; it is not a substitute for real authentication.
// For sensitive content, put the site behind Cloudflare Access or similar.

const CODE_HASHES = [
  { hash: "5f4b02e7b30ba3c31bb31b11133fa2cb87bf7caeb6e5f4270ea3caff15dbd31f", note: "Priyank Lathwal" },
  { hash: "fc9cfece0198cb65dadf0d2954d74b3accb38f8aa348f07fa548298bc63344eb", note: "Yussuf Uwamahoro" },
  { hash: "fc11b91ae9b2a32bc50e1906960d0cd5f0b7c94f0e817eb91a4da41af1ca857f", note: "Ashu Apuruv Agarwal" },
  { hash: "3dc82413ab96cee908e6c767fe023988ac4a7509e235222e1c5c103fd83dc11b", note: "Byambasuren Chuluunbat" },
  { hash: "28beadcc151df42ba0c1a681245b94431ebf8c98235cc65c81b1a3a1a8e89a79", note: "Yuge Ma" },
  { hash: "daa518d964f523bf29c4cdc6bdaaaf75c7c55d5bd2bc5f66ac2d24f34d8f682a", note: "Julian Jose Palma Diaz" },
  { hash: "748abef9babcbff2ef75e740df6897e941f99ea601ac60a13d84a3da4e485487", note: "Yasminnuha Jauharini" },
  { hash: "2cb7b1150ac733f208f89878bf2ac582a0ddd09b64b328197e1f0d55b71a2d63", note: "Claudia Vasquez" },
];

const STORAGE_KEY = "eapForumGateUnlocked";
const SESSION_HOURS = 12;

async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function isUnlocked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const obj = JSON.parse(raw);
    if (!obj.ts) return false;
    const ageHours = (Date.now() - obj.ts) / (1000 * 60 * 60);
    return ageHours < SESSION_HOURS;
  } catch (e) { return false; }
}

function unlock(note) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ts: Date.now(), who: note || "" }));
}

window.addEventListener("DOMContentLoaded", async () => {
  const gateEl = document.getElementById("gate");
  const contentEl = document.getElementById("gated-content");

  if (isUnlocked()) {
    gateEl.style.display = "none";
    contentEl.style.display = "block";
    return;
  }

  gateEl.style.display = "block";
  contentEl.style.display = "none";

  const form = document.getElementById("gate-form");
  const input = document.getElementById("gate-pwd");
  const err = document.getElementById("gate-err");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    err.textContent = "";
    const code = input.value.trim().toLowerCase();
    if (!code) { err.textContent = "Please enter your access code."; return; }
    const h = await sha256(code);
    const match = CODE_HASHES.find(c => c.hash === h);
    if (match) {
      unlock(match.note);
      gateEl.style.display = "none";
      contentEl.style.display = "block";
    } else {
      err.textContent = "Code not recognized. Please check the access code in your email or contact the EAP Energy team.";
      input.select();
    }
  });

  input.focus();
});
