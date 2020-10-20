import { a } from '../dom.js';

let lastPos = 0;
let bottom = 0;
let ticking = false;

const btn = a('javascript:void(0)', '', { id: 'scrollUp' });
btn.addEventListener('click', (ev) => {
    ev.preventDefault();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});
document.body.appendChild(btn);

window.addEventListener('scroll', function (e) {
    if (!ticking) {
        window.requestAnimationFrame(function () {
            const currentPos = window.scrollY;
            const delta = lastPos - currentPos;
            if (getScroll() > 64) {
                bottom += delta;
                if (delta > 0 && bottom > 32) {
                    bottom = 32;
                } else if (delta < 0 && bottom < -64) {
                    bottom = -64;
                }
            } else if (bottom > -64) {
                bottom = -64;
            }
            btn.style.bottom = bottom + 'px';

            lastPos = currentPos;
            ticking = false;
        });

        ticking = true;
    }
});

function getScroll() {
    return document.body.scrollTop || document.documentElement.scrollTop || 0;
}