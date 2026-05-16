// Shared chrome: WBG-style white top bar + event sub-nav + footer.
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const isHome = path === 'index.html' || path === '';

  const lockSVG = `<svg class="lock-ico" viewBox="0 0 20 20" width="11" height="11" fill="currentColor" aria-hidden="true"><path d="M10 1.6c-2.32 0-4.2 1.88-4.2 4.2v2.4H4.6c-.66 0-1.2.54-1.2 1.2v7.4c0 .66.54 1.2 1.2 1.2h10.8c.66 0 1.2-.54 1.2-1.2V9.4c0-.66-.54-1.2-1.2-1.2h-1.2V5.8c0-2.32-1.88-4.2-4.2-4.2zm0 1.6c1.43 0 2.6 1.17 2.6 2.6v2.4H7.4V5.8c0-1.43 1.17-2.6 2.6-2.6z"/></svg>`;

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
    const lock = n.gated ? lockSVG : '';
    return `<a href="${n.href}" class="${cls}${active}">${n.label}${lock}</a>`;
  }).join('');

  const topBar = `
    <div class="wb-topbar">
      <div class="wb-topbar-inner">
        <a class="wb-brand" href="index.html" aria-label="World Bank Group">
          <img class="wb-brand-logo" src="images/wbg-logo.svg" alt="">
        </a>
        <nav class="wb-topnav" aria-label="World Bank Group">
          <a href="https://www.worldbank.org/en/about/what-we-do" target="_blank" rel="noopener">Our Priorities</a>
          <a href="https://www.worldbank.org/en/who-we-are" target="_blank" rel="noopener">Who We Are</a>
          <a href="https://www.worldbank.org/en/what-we-do" target="_blank" rel="noopener">What We Do</a>
          <a href="https://www.worldbank.org/en/where-we-work" target="_blank" rel="noopener">Where We Work</a>
          <a href="https://www.worldbank.org/en/work-with-us" target="_blank" rel="noopener">Work With Us</a>
        </nav>
      </div>
    </div>`;

  const eventNav = isHome ? '' : `
    <div class="wb-eventnav">
      <div class="wb-eventnav-inner">
        <a class="wb-eventnav-title" href="index.html">EAP Energy Knowledge Forum &middot; Bali 2026</a>
        <nav class="wb-eventnav-links" aria-label="Forum sections">${subnav}</nav>
      </div>
    </div>`;

  const footer = `
    <footer class="wb-footer">
      <div class="wb-footer-inner">
        <div>
          <h4>About the Forum</h4>
          <p>The East Asia and Pacific Energy Knowledge and Learning Forum is convened by the World Bank Group with support from ESMAP and partners including the IEA, IRENA, and Lawrence Berkeley National Laboratory.</p>
          <p>Bali, Indonesia &middot; June 3 to 5, 2026.</p>
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

  document.body.insertAdjacentHTML('afterbegin', topBar + eventNav);
  document.body.insertAdjacentHTML('beforeend', footer);
})();
