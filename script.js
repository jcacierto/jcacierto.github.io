
  (function () {
    // Populate the three star layers: 30 + 26 + 20 = 76 stars, each with
    // a random position, size (mostly 1px, some 2px, a few 3px), twinkle
    // duration (2.8-5.8s), and a negative delay so no two stars pulse together.
    [['.layer-specks3', 30], ['.layer-specks', 26], ['.layer-specks2', 20]].forEach(function (cfg) {
      var host = document.querySelector(cfg[0]);
      if (!host) return;
      for (var i = 0; i < cfg[1]; i++) {
        var s = document.createElement('span');
        s.className = 'star';
        var _r = Math.random(); var size = _r < 0.7 ? 1 : (_r < 0.93 ? 2 : 3);
        s.style.width = size + 'px';
        s.style.height = size + 'px';
        s.style.left = (Math.random() * 100).toFixed(2) + '%';
        s.style.top = (Math.random() * 100).toFixed(2) + '%';
        s.style.animationDuration = (2.8 + Math.random() * 3).toFixed(2) + 's';
        s.style.animationDelay = (-Math.random() * 6).toFixed(2) + 's';
        host.appendChild(s);
      }
    });

    // Mobile menu: the hamburger button toggles the nav links, which are
    // hidden on small screens (see the max-width:640px rules in style.css).
    // Placed before the reduced-motion early return so the menu works
    // for everyone, including reduced-motion users.
    var burger = document.querySelector('.burger');
    var navLinks = document.querySelector('.nav-links');
    if (burger && navLinks) {
      burger.addEventListener('click', function () {
        var open = navLinks.classList.toggle('open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      navLinks.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          navLinks.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    var layers = Array.prototype.slice.call(document.querySelectorAll('[data-depth]'));
    var tx = 0, ty = 0, cx = 0, cy = 0, t = 0;

    // Mouse drives the target; on touch devices a slow automatic drift takes over.
    window.addEventListener('mousemove', function (e) {
      tx = (e.clientX / window.innerWidth  - 0.5) * 2;   // -1 .. 1
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    function frame() {
      t += 0.008;
      // Gentle idle drift so phones (no mouse) still see movement.
      var idleX = Math.sin(t) * 0.18, idleY = Math.cos(t * 0.8) * 0.12;
      var goalX = tx + idleX, goalY = ty + idleY;

      cx += (goalX - cx) * 0.055;   // lerp = the smooth, floaty feel
      cy += (goalY - cy) * 0.055;
      var scroll = window.scrollY || 0;

      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-depth'));
        var x = -cx * d;
        var y = -cy * d - scroll * d * 0.012;   // scroll parallax, scaled by depth
        el.style.transform = 'translate3d(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px,0)';
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  })();
