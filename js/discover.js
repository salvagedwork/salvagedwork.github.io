/**
 * Discovery: "open a drawer" — random items from the archive.
 * - Any element with [data-random-drawer] navigates to a random article on click.
 * - On the 404 page, #not-found-drawers is topped up with three random items.
 * Reads /search.json (already generated for header search).
 */
(function() {
	'use strict';

	var cache = null;

	function getIndex() {
		if (cache) return Promise.resolve(cache);
		return fetch('/search.json')
			.then(function(r) { return r.json(); })
			.then(function(data) {
				cache = data.filter(function(item) { return item && item.url; });
				return cache;
			});
	}

	function randomItem(items, exceptUrl) {
		var pool = items.filter(function(i) { return i.url !== exceptUrl; });
		if (!pool.length) pool = items;
		return pool[Math.floor(Math.random() * pool.length)];
	}

	function initDrawers() {
		document.addEventListener('click', function(e) {
			var trigger = e.target.closest('[data-random-drawer]');
			if (!trigger) return;
			e.preventDefault();
			getIndex().then(function(items) {
				var item = randomItem(items, window.location.pathname);
				if (item) window.location.href = item.url;
			}).catch(function() {
				// search.json unavailable: follow the link's ordinary href
				window.location.href = trigger.getAttribute('href') || '/articles/';
			});
		});
	}

	function initNotFound() {
		var list = document.getElementById('not-found-drawers');
		if (!list) return;
		getIndex().then(function(items) {
			var used = [];
			for (var n = 0; n < 3 && n < items.length; n++) {
				var item;
				do { item = randomItem(items, null); } while (used.indexOf(item.url) !== -1 && used.length < items.length);
				used.push(item.url);
				var li = document.createElement('li');
				var a = document.createElement('a');
				a.href = item.url;
				// item.title comes from search.json pre-escaped for HTML
				// insertion (Liquid's `escape` filter, e.g. an apostrophe
				// becomes &#39;). innerHTML correctly parses that back into
				// the real character; textContent would print the literal
				// entity text instead. This matches how the header search
				// dropdown already renders the same field, via a template
				// string inserted as HTML.
				a.innerHTML = item.title;
				li.appendChild(a);
				list.insertBefore(li, list.firstChild);
			}
		}).catch(function() {});
	}

	function init() {
		initDrawers();
		initNotFound();
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
