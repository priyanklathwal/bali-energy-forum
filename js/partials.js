// Shared chrome: WBG-style white top bar + event sub-nav + footer.
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const isHome = path === 'index.html' || path === '';

  const subnav = [
    { href: 'index.html',       label: 'Overview' },
    { href: 'agenda.html',      label: 'Agenda' },
    { href: 'themes.html',      label: 'Themes' },
    { href: 'partners.html',    label: 'Partners' },
    { href: 'communities.html', label: 'Communities of Practice' },
    { href: 'logistics.html',   label: 'Logistics', gated: true }
  ].map(n => {
    const active = n.href === path ? ' active' : '';
    const cls = n.gated ? 'gated' : '';
    const lock = n.gated ? ' \u{1F512}' : '';
    return `<a href="${n.href}" class="${cls}${active}">${n.label}${lock}</a>`;
  }).join('');

  const wbGlobeSVG = `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <circle cx="32" cy="32" r="28" fill="#004972"/>
    <g fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round">
      <ellipse cx="32" cy="32" rx="28" ry="13"/>
      <ellipse cx="32" cy="32" rx="14" ry="28"/>
      <line x1="4" y1="32" x2="60" y2="32"/>
      <line x1="32" y1="4" x2="32" y2="60"/>
    </g>
  </svg>`;

  const topBar = `
    <div class="wb-topbar">
      <div class="wb-topbar-inner">
        <a class="wb-brand" href="index.html">
          <span class="wb-brand-mark">${wbGlobeSVG}</span>
          <span class="wb-brand-text">WORLD BANK GROUP</span>
        </a>
        <nav class="wb-topnav" aria-label="World Bank Group">
          <a href="https://www.worldbank.org/en/about/what-we-do" target="_blank">Our Priorities</a>
          <a href="https://www.worldbank.org/en/who-we-are" target="_blank">Who We Are</a>
          <a href="https://www.worldbank.org/en/what-we-do" target="_blank">What We Do</a>
          <a href="https://www.worldbank.org/en/where-we-work" target="_blank">Where We Work</a>
          <a href="https://www.worldbank.org/en/work-with-us" target="_blank">Work With Us</a>
        </nav>
      </div>
    </div>`;

  // Event sub-nav (only shown on inner pages — the landing page has the hero own the chrome)
  const eventNav = isHome ? '' : `
    <div class="wb-eventnav">
      <div class="wb-eventnav-inner">
        <a class="wb-eventnav-title" href="index.html">EAP Energy Knowledge Forum &middot; Bali 2026</a>
        <nav class="wb-eventnav-links" aria-label="Forum sections">${subnav}</nav>
      </div>
    </div>`;

  // Inner-page breadcrumb (the landing page renders its own inside the hero)
  const pageTitle = document.title.split('|')[0].trim();
  const breadcrumb = isHome ? '' : `
    <div class="breadcrumb">
      <div class="breadcrumb-inner">
        <a href="index.html"><svg class="bc-home" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 3 2 12h3v8h5v-5h4v5h5v-8h3z"/></svg></a>
        <span class="sep">&rsaquo;</span>
        <a href="#" aria-disabled="true">Events</a>
        <span class="sep">&rsaquo;</span>
        <span>${pageTitle}</span>
      </div>
    </div>`;

  const footer = `
    <footer class="wb-footer">
      <div class="wb-footer-inner">
        <div>
          <h4>About the Forum</h4>
          <p>The EAP Energy Knowledge and Learning Forum is convened by the World Bank Group, with support from ESMAP and partners including IEA, IRENA, and Lawrence Berkeley National Laboratory.</p>
          <p>Bali, Indonesia &middot; June 3&ndash;5, 2026.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="index.html">Overview</a></li>
            <li><a href="agenda.html">Agenda</a></li>
            <li><a href="themes.html">Themes</a></li>
            <li><a href="partners.html">Partners</a></li>
            <li><a href="communities.html">Communities of Practice</a></li>
            <li><a href="logistics.html">Logistics (participants)</a></li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:eap_energy_forum@worldbank.org">eap_energy_forum@worldbank.org</a></li>
            <li>EAP Energy Team &middot; The World Bank</li>
            <li>1818 H Street NW</li>
            <li>Washington, DC 20433</li>
          </ul>
        </div>
      </div>
      <div class="wb-footer-bottom">
        <span class="official">OFFICIAL USE ONLY</span>
        &nbsp;&middot;&nbsp; Temporary microsite for the EAP Energy Knowledge and Learning Forum, Bali 2026.
        &nbsp;&middot;&nbsp; &copy; The World Bank Group.
      </div>
    </footer>`;

  document.body.insertAdjacentHTML('afterbegin', topBar + eventNav + breadcrumb);
  document.body.insertAdjacentHTML('beforeend', footer);
})();
