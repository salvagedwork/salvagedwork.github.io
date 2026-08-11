/**
 * Collection sorting: a-z, publication year, newest additions.
 * Sorts direct children of [data-sortable] by data-title / data-published /
 * data-added. Buttons live in [data-sort-controls].
 */
(function() {
	'use strict';

	function init() {
		var controls = document.querySelector('[data-sort-controls]');
		var list = document.querySelector('[data-sortable]');
		if (!controls || !list) return;

		controls.addEventListener('click', function(e) {
			var btn = e.target.closest('button[data-sort]');
			if (!btn) return;

			var key = btn.getAttribute('data-sort');
			var dir = btn.getAttribute('data-dir') === 'desc' ? -1 : 1;
			var items = Array.prototype.slice.call(list.children);

			items.sort(function(a, b) {
				var av = a.getAttribute('data-' + key) || '';
				var bv = b.getAttribute('data-' + key) || '';
				// Numeric when both values are numbers (years, timestamps),
				// alphabetical otherwise (names, titles).
				var an = parseFloat(av);
				var bn = parseFloat(bv);
				if (av !== '' && bv !== '' && !isNaN(an) && !isNaN(bn) &&
					String(an) === av.trim() && String(bn) === bv.trim()) {
					return (an - bn) * dir;
				}
				return av.localeCompare(bv) * dir;
			});

			items.forEach(function(item) { list.appendChild(item); });

			controls.querySelectorAll('button').forEach(function(b) {
				b.classList.toggle('active', b === btn);
			});
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
