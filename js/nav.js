document.addEventListener('DOMContentLoaded', function () {
    var hamburger = document.querySelector('.hamburger');
    var navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            var open = navMenu.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', String(open));
            hamburger.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
        });
    }

    document.querySelectorAll('.dropdown-toggle').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            var thisDropdown = btn.closest('.dropdown');
            var isOpen = thisDropdown.classList.contains('open');

            document.querySelectorAll('.dropdown.open').forEach(function (d) {
                if (d !== thisDropdown) {
                    d.classList.remove('open');
                    var b = d.querySelector('.dropdown-toggle');
                    if (b) b.setAttribute('aria-expanded', 'false');
                }
            });

            thisDropdown.classList.toggle('open', !isOpen);
            btn.setAttribute('aria-expanded', String(!isOpen));
        });
    });

    document.addEventListener('click', function () {
        document.querySelectorAll('.dropdown.open').forEach(function (d) {
            d.classList.remove('open');
            var b = d.querySelector('.dropdown-toggle');
            if (b) b.setAttribute('aria-expanded', 'false');
        });
    });

    if (navMenu) {
        navMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('open');
                if (hamburger) {
                    hamburger.setAttribute('aria-expanded', 'false');
                    hamburger.setAttribute('aria-label', 'Menu openen');
                }
            });
        });
    }
});
