// Shared password gate for the logistics page. One code for all participants.
// To rotate, change the password and update PASSWORD_HASH below to its SHA-256.
//
// NOTE: This is client-side obscurity, not real authentication — anyone who
// views source can see the hash and brute-force a short password. Appropriate
// for non-confidential logistics only.

// Plaintext password is kept out of the repo. Store it in your password manager
// and share with participants via email. To rotate, see README.md.
const PASSWORD_HASH = "54b134339a41eec6b7ac8d6f2a8c6d55aa67b97893c896b9daa0bf153b8f9f8e";

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
    if (h === PASSWORD_HASH) {
      unlock("");
      gateEl.style.display = "none";
      contentEl.style.display = "block";
    } else {
      err.textContent = "Password not recognized. Please check the password in your email or contact the EAP Energy team.";
      input.select();
    }
  });

  input.focus();
});
