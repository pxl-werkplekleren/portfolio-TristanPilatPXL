'use strict';

(function () {
    const lb       = document.getElementById('lightbox');
    const lbImg    = document.getElementById('lightbox-img');
    const lbClose  = document.getElementById('lightbox-close');
    const lbBack   = document.getElementById('lightbox-backdrop');
    if (!lb) return;

    function open(src, alt) {
        lbImg.src = src;
        lbImg.alt = alt || '';
        lb.hidden = false;
        document.body.style.overflow = 'hidden';
        lbClose.focus();
    }

    function close() {
        lb.hidden = true;
        lbImg.src = '';
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.project-img-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const img = btn.querySelector('img');
            if (img) open(img.src, img.alt);
        });
    });

    lbClose.addEventListener('click', close);
    lbBack.addEventListener('click', close);

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && !lb.hidden) close();
    });
})();
