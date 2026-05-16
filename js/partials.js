// Shared header / footer / breadcrumb injection so each page stays in sync.
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';

  const navItems = [
    { href: 'index.html', label: 'Overview' },
    { href: 'agenda.html', label: 'Agenda' },
    { href: 'themes.html', label: 'Themes' },
    { href: 'partners.html', label: 'Partners' },
    { href: 'communities.html', label: 'Communities of Practice' },
    { href: 'logistics.html', label: 'Logistics', gated: true }
  ];

  const navHtml = navItems.map(n => {
    const active = n.href === path ? ' active' : '';
    const cls = n.gated ? 'gated' : '';
    const lock = n.gated ? ' \u{1F512}' : '';
    return `<a href="${n.href}" class="${cls}${active}">${n.label}${lock}</a>`;
  }).join('');

  const header = `
    <header class="wb-header">
      <div class="wb-header-inner">
        <a class="wb-logo" href="index.html">
          THE WORLD BANK
          <span class="wb-logo-sub">EAP Energy Knowledge Forum &middot; Bali 2026</span>
        </a>
        <nav class="wb-nav">${navHtml}</nav>
      </div>
    </header>`;

  const pageTitle = document.title.split('|')[0].trim();
  const crumb = path === 'index.html'
    ? '<a href="index.html">Home</a>'
    : `<a href="index.html">Home</a><span class="sep">&rsaquo;</span><a href="#">Events</a><span class="sep">&rsaquo;</span><span>${pageTitle}</span>`;

  const breadcrumb = `
    <div class="breadcrumb">
      <div class="breadcrumb-inner">${crumb}</div>
    </div>`;

  const footer = `
    <footer class="wb-footer">
      <div class="wb-footer-inner">
        <div>
          <h4>About the Forum</h4>
          <p>The EAP Energy Knowledge and Learning Forum is convened by the World Bank Group, with support from ESMAP and partners including IEA, IRENA, and Berkeley National Laboratory. Held in Bali, Indonesia, June 3&ndash;5, 2026.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
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
            <li>EAP Energy Team</li>
            <li>The World Bank</li>
            <li>1818 H Street NW</li>
            <li>Washington, DC 20433</li>
          </ul>
        </div>
      </div>
      <div class="wb-footer-bottom">
        <span class="official">OFFICIAL USE ONLY</span>
        &nbsp;&middot;&nbsp; This is a temporary microsite for the EAP Energy Knowledge and Learning Forum, Bali 2026.
        &nbsp;&middot;&nbsp; &copy; The World Bank Group. All rights reserved.
      </div>
    </footer>`;

  document.body.insertAdjacentHTML('afterbegin', header + breadcrumb);
  document.body.insertAdjacentHTML('beforeend', footer);
})();
