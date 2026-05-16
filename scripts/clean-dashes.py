#!/usr/bin/env python3
"""Remove em-dashes from the site and make speaker names consistently bold.

Rules (applied in order):
  1. <strong>NAME</strong> &mdash; TITLE  →  <strong>NAME</strong>, TITLE
  2. <li>Mr./Ms./Dr./Bu HONORIFIC NAME &mdash; TITLE  →
     <li><strong>Mr./Ms./Dr. NAME</strong>, TITLE
  3. <li>Minister of Energy &mdash; COUNTRY  →
     <li>Minister of Energy, <strong>COUNTRY</strong>
  4. <p>HONORIFIC NAME &mdash; TITLE  →  <p><strong>HONORIFIC NAME</strong>, TITLE
  5. Any remaining " &mdash; " inside text  →  ", "
  6. Section-title em-dashes "Day N &mdash; subtitle"  →  "Day N: subtitle"
  7. Cleanup double spaces, double commas, comma-period sequences.
"""

import re
import sys
from pathlib import Path

HONORIFICS = r"(?:Mr\.|Ms\.|Mrs\.|Dr\.|Bu|Pak|Ibu|H\.E\.)"

# A "name" is the honorific plus 1-5 capitalized words.
NAME_CORE = r"(?:[A-Z][\wÁÉÍÓÚÀÈÌÒÙÄËÏÖÜÂÊÎÔÛÑÇŞĞáéíóúàèìòùäëïöüâêîôûñçşğ\.\-\']*\s+){1,5}[A-Z][\wÁÉÍÓÚÀÈÌÒÙÄËÏÖÜÂÊÎÔÛÑÇŞĞáéíóúàèìòùäëïöüâêîôûñçşğ\.\-\']*"
WORD_FOLLOWUP = r"(?:\s+(?:&[\w#]+;|of|the|de|del|do|von|y|al|bin|ibn|van|der|den|des|du)\s+|\s+)"
NAME = rf"{HONORIFICS}\s+{NAME_CORE}"

def transform(html: str) -> str:
    # Rule 1: bolded name followed by em-dash → comma
    html = re.sub(r"(<strong>[^<]+</strong>)\s*&mdash;\s*", r"\1, ", html)

    # Rule 2 + 4: an unbolded honorific name followed by em-dash → bold the name, comma
    pattern = re.compile(rf"(?<![>\w])({NAME})\s*&mdash;\s*")
    html = pattern.sub(lambda m: f"<strong>{m.group(1).strip()}</strong>, ", html)

    # Bareword names (e.g. "Yuge Ma — title", "Jose Andres Detomasi — ...") preceded by tag/start
    # Match: two or more capitalized words followed by em-dash
    bare_pattern = re.compile(
        r"(?P<pre>(?:<p>|<li>|<dd>|<div[^>]*>|\)\s|\.\s))"
        rf"(?P<name>(?:[A-Z][\wÁÉÍÓÚÀÈÌÒÙÄËÏÖÜÂÊÎÔÛÑÇŞĞáéíóúàèìòùäëïöüâêîôûñçşğ\.\-\']+\s+){{1,4}}[A-Z][\wÁÉÍÓÚÀÈÌÒÙÄËÏÖÜÂÊÎÔÛÑÇŞĞáéíóúàèìòùäëïöüâêîôûñçşğ\.\-\']+)\s*&mdash;\s*"
    )
    html = bare_pattern.sub(lambda m: f"{m.group('pre')}<strong>{m.group('name').strip()}</strong>, ", html)

    # Rule 3: "Minister of Energy &mdash; Country"  → bold country
    html = re.sub(
        r"(<li>)((?:Minister|Deputy Minister)[^&<]+?)\s*&mdash;\s*([^<]+?)(</li>)",
        lambda m: f"{m.group(1)}{m.group(2).strip()}, <strong>{m.group(3).strip()}</strong>{m.group(4)}",
        html,
    )

    # Rule 6: "Day N &mdash; subtitle" → "Day N: subtitle"
    html = re.sub(r"(Day \d)\s*&mdash;\s*", r"\1: ", html)

    # Rule 5: remaining " &mdash; " → ", " (default fallback)
    html = html.replace(" &mdash; ", ", ")
    html = html.replace("&mdash;", ",")

    # Section-title patterns that became awkward
    html = re.sub(r":\s*</h3>", "</h3>", html)
    html = re.sub(r":\s*</div>", "</div>", html)

    # Cleanup commas
    html = re.sub(r",\s*,", ",", html)
    html = re.sub(r",\s*\.", ".", html)
    html = re.sub(r" {2,}", " ", html)

    return html

def main(paths):
    for p in paths:
        p = Path(p)
        src = p.read_text()
        out = transform(src)
        if out != src:
            p.write_text(out)
            before = src.count("&mdash;")
            after = out.count("&mdash;")
            print(f"{p.name}: {before} → {after} em-dashes remaining")
        else:
            print(f"{p.name}: no change")

if __name__ == "__main__":
    main(sys.argv[1:])
