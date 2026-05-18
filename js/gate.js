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
  { hash: "75a6e1074246e2a4aa70da5c20b6390ad47d28afb92bceb419727ef3ad5e9958", note: "Priyank Lathwal" },
  { hash: "f75daa2e432a06b69658cad0c74cc20c47ddbbb153e42a734e8129bd7e59ee01", note: "Yussuf Uwamahoro" },
  { hash: "8e673517a5c527f47411c1de77f5d130b67a6e7a599acfc1869b49f8b03094f1", note: "Ashu Apuruv Agarwal" },
  { hash: "5d91a2fe9f29e933933cf776daf1738be269ae2f29a10e4bc92ebb031f1cca1b", note: "Byambasuren Chuluunbat" },
  { hash: "54fd95ec64b6e2037e2be3219c9bbe22be3b6b4070ff91970114199fda3932e8", note: "Yuge Ma" },
  { hash: "d54d8d724f954ce3cb57063c8bf46cde85c7bece94ada778647fc69146414a42", note: "Julian Jose Palma Diaz" },
  { hash: "9593bc074c0439cea4774ba983d354ab068780f7c8c5e8c8b8b6c83de5d30f48", note: "Yasminnuha Jauharini" },
  { hash: "c5f47288e780377476c8eab568b4817ce74ca5d71c6347017e6944ecb281b211", note: "Claudia Vasquez" },
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
