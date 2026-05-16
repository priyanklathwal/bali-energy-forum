#!/usr/bin/env python3
"""Generate per-person access codes and their SHA-256 hashes for the logistics gate.

Edit the RECIPIENTS list to add/remove people. Re-run this script and paste the
resulting JS array into js/gate.js (CODE_HASHES). Share each code with the matching
person via email.

Code format: <2-letter initial>-<color>-<4 digits>  — readable, unambiguous.
"""

import hashlib
import random
import string

RECIPIENTS = [
    # (display_name, email)
    ("Priyank Lathwal",           "plathwal@worldbank.org"),
    ("Yussuf Uwamahoro",          "yuwamahoro@worldbank.org"),
    ("Ashu Apuruv Agarwal",       "aagarwal15@worldbank.org"),
    ("Byambasuren Chuluunbat",    "bchuluunbat1@worldbank.org"),
    ("Yuge Ma",                   "yma1@worldbank.org"),
    ("Julian Jose Palma Diaz",    "jpalmadiaz@worldbank.org"),
    ("Yasminnuha Jauharini",      "yjauharini@worldbank.org"),
    ("Claudia Vasquez",           "cvasquez@worldbank.org"),
]

COLORS = ["amber", "azure", "coral", "ember", "flint", "ivory",
          "jade", "noble", "ocean", "opal", "river", "saffron",
          "tide", "umber", "vivid", "wave"]

def initials(name):
    parts = [p for p in name.split() if p]
    return (parts[0][0] + parts[-1][0]).lower()

def make_code(name, used):
    while True:
        color = random.choice(COLORS)
        digits = "".join(random.choices(string.digits, k=4))
        code = f"{initials(name)}-{color}-{digits}"
        if code not in used:
            used.add(code)
            return code

def sha256(s):
    return hashlib.sha256(s.encode("utf-8")).hexdigest()

def main():
    random.seed()  # truly random
    used = set()
    rows = []
    for name, email in RECIPIENTS:
        code = make_code(name, used)
        rows.append((name, email, code, sha256(code)))

    print("=" * 78)
    print("PERSONAL ACCESS CODES — share each privately with the matching person")
    print("=" * 78)
    for name, email, code, _ in rows:
        print(f"  {name:30s}  {email:35s}  →  {code}")
    print()
    print("=" * 78)
    print("Paste this array into js/gate.js as the value of CODE_HASHES:")
    print("=" * 78)
    print("const CODE_HASHES = [")
    for name, _, _, h in rows:
        print(f'  {{ hash: "{h}", note: "{name}" }},')
    print("];")
    print()

if __name__ == "__main__":
    main()
