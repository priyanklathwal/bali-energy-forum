#!/usr/bin/env python3
"""Generate a dotted world map SVG.

Approach: define continents as polygon outlines in a 1000x540 canvas,
then place a dot on a 14px grid wherever the point falls inside a
continent. Background dots fill the rest in very pale gray.
"""

from pathlib import Path

W, H = 1000, 540
SPACING = 13          # grid pitch
DOT_R = 4.0           # land-dot radius
BG_DOT_R = 1.8        # ocean / background dot radius
LAND_COLOR = "#91302F"
BG_COLOR   = "#E5EDF1"

# Bali is at approximately (115E, 8S) — landing near our Indonesia polygon.
BALI = (905, 348)

# Continent polygons. Coordinates are approximate, hand-tuned to a
# Mercator-style world map cropped 60N to 50S, 170W to 170E.
CONTINENTS = [
    # ---- NORTH AMERICA ----
    [(60,80),(110,65),(165,60),(220,65),(265,80),(285,100),(295,135),
     (270,165),(245,200),(225,230),(200,255),(170,265),(135,260),
     (105,235),(80,200),(55,160),(45,115)],
    # Alaska tail
    [(35,90),(70,85),(85,105),(60,120)],
    # ---- CENTRAL AMERICA ----
    [(195,265),(215,275),(238,295),(252,318),(245,335),(225,330),(210,310),(198,290)],
    # ---- SOUTH AMERICA ----
    [(225,320),(265,318),(300,330),(325,358),(335,400),(330,445),(310,480),
     (282,495),(258,498),(238,478),(225,440),(218,395),(220,355)],
    # ---- GREENLAND ----
    [(320,55),(355,52),(378,75),(380,108),(360,118),(330,108),(318,82)],
    # ---- UK / IRELAND ----
    [(420,120),(442,118),(448,142),(440,160),(420,160),(415,138)],
    # ---- SCANDINAVIA ----
    [(478,85),(510,82),(522,110),(515,135),(490,138),(478,118)],
    # ---- EUROPE (continental) ----
    [(450,135),(495,128),(540,130),(572,142),(580,168),(560,182),
     (520,188),(478,182),(458,165)],
    # ---- AFRICA ----
    [(478,200),(528,195),(570,202),(602,220),(620,250),(625,290),
     (618,325),(598,360),(572,395),(540,415),(508,418),(478,402),
     (462,370),(456,328),(455,280),(462,235)],
    # ---- MADAGASCAR ----
    [(628,360),(642,365),(648,390),(640,408),(628,400),(625,375)],
    # ---- MIDDLE EAST / ARABIA ----
    [(548,182),(595,180),(630,195),(648,222),(636,250),(605,258),
     (572,248),(552,225),(545,200)],
    # ---- RUSSIA / NORTHERN EURASIA ----
    [(540,82),(620,72),(710,68),(800,72),(870,82),(905,98),(910,118),
     (885,138),(820,142),(740,140),(660,135),(592,128),(548,115)],
    # ---- SOUTH ASIA / INDIA ----
    [(648,195),(685,192),(715,202),(725,230),(710,262),(688,275),
     (665,265),(650,235),(645,215)],
    # ---- CHINA / EAST ASIA ----
    [(725,145),(790,142),(845,150),(880,170),(890,205),(872,232),
     (835,242),(795,235),(760,218),(738,192),(728,168)],
    # ---- KOREAN PENINSULA ----
    [(862,170),(880,170),(885,198),(875,212),(862,210)],
    # ---- JAPAN ----
    [(900,170),(918,180),(925,200),(922,220),(905,222),(895,200)],
    # ---- SOUTHEAST ASIA (mainland) ----
    [(790,235),(830,238),(852,255),(860,278),(845,295),(815,295),(795,275),(788,255)],
    # ---- INDONESIA / NEW GUINEA chain ----
    [(815,318),(870,322),(915,332),(945,340),(950,358),(920,365),
     (875,362),(835,355),(818,340)],
    # ---- BORNEO ----
    [(862,295),(895,295),(905,318),(890,330),(862,325),(855,308)],
    # ---- PHILIPPINES ----
    [(888,260),(908,262),(913,288),(900,300),(890,295),(885,275)],
    # ---- AUSTRALIA ----
    [(855,388),(905,378),(945,388),(965,412),(955,440),(920,455),
     (878,452),(852,432),(845,408)],
    # ---- TASMANIA ----
    [(905,470),(920,470),(923,485),(910,485)],
    # ---- NEW ZEALAND (N + S islands) ----
    [(965,440),(978,445),(982,465),(970,468)],
    [(978,470),(990,475),(990,495),(978,495)],
]

# ---- Pacific Islands (small clusters, drawn as direct dots) ----
PACIFIC_DOTS = [
    (945, 380), (958, 395), (972, 408),
    (920, 372), (935, 390),
    (985, 415), (995, 430),
]

def point_in_polygon(x, y, poly):
    """Standard ray casting."""
    n = len(poly)
    inside = False
    j = n - 1
    for i in range(n):
        xi, yi = poly[i]
        xj, yj = poly[j]
        if ((yi > y) != (yj > y)) and (x < (xj - xi) * (y - yi) / (yj - yi + 1e-9) + xi):
            inside = not inside
        j = i
    return inside

def is_land(x, y):
    for poly in CONTINENTS:
        if point_in_polygon(x, y, poly):
            return True
    return False

def main():
    land_dots = []
    bg_dots = []

    # Generate grid offset to give a more natural feel.
    for row in range(int(H / SPACING) + 1):
        # Alternate-row offset would look honeycomb-y; keep aligned for a tech feel.
        y = row * SPACING + (SPACING / 2)
        for col in range(int(W / SPACING) + 1):
            x = col * SPACING + (SPACING / 2)
            if is_land(x, y):
                land_dots.append((x, y))
            else:
                bg_dots.append((x, y))

    # Manually add any explicit Pacific points
    for (px, py) in PACIFIC_DOTS:
        land_dots.append((px, py))

    # Find the closest land dot to Bali; we'll style it as the highlight.
    cx, cy = BALI
    bali_dot = min(land_dots, key=lambda p: (p[0]-cx)**2 + (p[1]-cy)**2)

    parts = []
    parts.append(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="World map highlighting Bali, Indonesia">')

    # Defs
    parts.append('  <defs>')
    parts.append('    <radialGradient id="bali-pulse" cx="50%" cy="50%" r="50%">')
    parts.append('      <stop offset="0%"  stop-color="#91302F" stop-opacity="0.55"/>')
    parts.append('      <stop offset="60%" stop-color="#91302F" stop-opacity="0.18"/>')
    parts.append('      <stop offset="100%" stop-color="#91302F" stop-opacity="0"/>')
    parts.append('    </radialGradient>')
    parts.append('  </defs>')

    # Background dots (light gray)
    parts.append(f'  <g fill="{BG_COLOR}">')
    for (x, y) in bg_dots:
        parts.append(f'    <circle cx="{x:.1f}" cy="{y:.1f}" r="{BG_DOT_R}"/>')
    parts.append('  </g>')

    # Land dots
    parts.append(f'  <g fill="{LAND_COLOR}">')
    for (x, y) in land_dots:
        if (x, y) == bali_dot:
            continue
        parts.append(f'    <circle cx="{x:.1f}" cy="{y:.1f}" r="{DOT_R}"/>')
    parts.append('  </g>')

    # Bali highlight (pulse + brighter dot)
    bx, by = bali_dot
    parts.append(f'  <g transform="translate({bx:.1f},{by:.1f})">')
    parts.append('    <circle r="34" fill="url(#bali-pulse)">')
    parts.append('      <animate attributeName="r" values="22;38;22" dur="2.6s" repeatCount="indefinite"/>')
    parts.append('      <animate attributeName="opacity" values="0.85;0.20;0.85" dur="2.6s" repeatCount="indefinite"/>')
    parts.append('    </circle>')
    parts.append(f'    <circle r="7" fill="#91302F" stroke="#ffffff" stroke-width="2.2"/>')
    parts.append('  </g>')

    parts.append('</svg>')

    out = Path(__file__).resolve().parent.parent / "images" / "world-dots.svg"
    out.write_text("\n".join(parts))
    print(f"Wrote {out}  ({len(land_dots)} land dots, {len(bg_dots)} bg dots)")

if __name__ == "__main__":
    main()
