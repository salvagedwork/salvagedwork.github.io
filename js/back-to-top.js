/**
 * Back to top: a floating affordance that appears once the reader is well
 * down a long page. Site-wide, but only on pages tall enough to need it.
 */
(function() {
	'use strict';

	var SHOW_AFTER = 900;

	// Shared with book-reader.js: one fixed cluster holds every floating control
	function floatingControls() {
		var el = document.getElementById('floating-controls');
		if (!el) {
			el = document.createElement('div');
			el.id = 'floating-controls';
			el.className = 'floating-controls';
			document.body.appendChild(el);
		}
		return el;
	}

	function init() {
		if (document.documentElement.scrollHeight < window.innerHeight * 3) return;

		var btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'back-to-top';
		btn.setAttribute('aria-label', 'Back to top');
		btn.innerHTML = '<span class="back-to-top-zag" aria-hidden="true"></span><span class="back-to-top-label">Top</span>';
		floatingControls().appendChild(btn);

		var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		btn.addEventListener('click', function() {
			window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
		});

		var ticking = false;
		function update() {
			ticking = false;
			btn.classList.toggle('visible', window.scrollY > SHOW_AFTER);
		}

		window.addEventListener('scroll', function() {
			if (!ticking) {
				ticking = true;
				window.requestAnimationFrame(update);
			}
		}, { passive: true });

		update();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
