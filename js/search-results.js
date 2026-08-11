/**
 * Full search results page (/search/?q=...). The header dropdown stays as
 * quick-access; this is what Enter goes to, and it shows a body-text
 * snippet around the match, similar to a search engine's result excerpt.
 */
(function() {
	'use strict';

	var SNIPPET_RADIUS = 90; // characters of context on each side of a match

	function getQuery() {
		var params = new URLSearchParams(window.location.search);
		return (params.get('q') || '').trim();
	}

	function escapeRegex(s) {
		return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	function escapeHtml(s) {
		var div = document.createElement('div');
		div.textContent = s;
		return div.innerHTML;
	}

	// Finds the first case-insensitive occurrence of query in text and
	// returns a snippet of plain text around it, with word-boundary
	// trimming and ellipses where the snippet doesn't reach the edge.
	// Returns null if the query isn't found in this text.
	function extractSnippet(text, query) {
		if (!text || !query) return null;
		var lower = text.toLowerCase();
		var idx = lower.indexOf(query.toLowerCase());
		if (idx === -1) return null;

		var start = Math.max(0, idx - SNIPPET_RADIUS);
		var end = Math.min(text.length, idx + query.length + SNIPPET_RADIUS);

		// Trim to the nearest word boundary so snippets don't open or close
		// mid-word.
		if (start > 0) {
			var nextSpace = text.indexOf(' ', start);
			if (nextSpace !== -1 && nextSpace < idx) start = nextSpace + 1;
		}
		if (end < text.length) {
			var prevSpace = text.lastIndexOf(' ', end);
			if (prevSpace !== -1 && prevSpace > idx + query.length) end = prevSpace;
		}

		var snippet = text.slice(start, end).trim();
		var prefix = start > 0 ? '\u2026' : '';
		var suffix = end < text.length ? '\u2026' : '';
		return prefix + snippet + suffix;
	}

	function highlight(text, query) {
		return escapeHtml(text).replace(
			new RegExp('(' + escapeRegex(escapeHtml(query)) + ')', 'gi'),
			'<mark class="search-highlight">$1</mark>'
		);
	}

	// Ranks and finds the best available snippet for one item against the
	// query. Returns null if the item doesn't match at all.
	function matchItem(item, query) {
		var q = query.toLowerCase();
		var titleMatch = (item.title || '').toLowerCase().indexOf(q) !== -1;
		var fieldMatch = ['creators', 'subjects', 'categories'].some(function(f) {
			return (item[f] || '').toLowerCase().indexOf(q) !== -1;
		});
		var bodySnippet = extractSnippet(item.body || '', query);
		var descSnippet = !bodySnippet ? extractSnippet(item.description || '', query) : null;

		if (!titleMatch && !fieldMatch && !bodySnippet && !descSnippet) return null;

		// Tier: 0 = title match (best), 1 = creator/subject/category match,
		// 2 = matched somewhere in the body text, 3 = fallback (shouldn't
		// normally happen since description is included in body already,
		// but kept as a safety net).
		var tier = titleMatch ? 0 : fieldMatch ? 1 : bodySnippet ? 2 : 3;

		var snippetSource = bodySnippet || descSnippet ||
			(item.description ? item.description.slice(0, SNIPPET_RADIUS * 2) + '\u2026' : '');

		return {
			item: item,
			tier: tier,
			snippetHtml: highlight(snippetSource, query)
		};
	}

	function metaLine(item) {
		var parts = [];
		if (item.creators) parts.push(item.creators);
		if (item.categories) parts.push(item.categories);
		if (item.published) parts.push(item.published);
		return parts.join(' \u00b7 ');
	}

	function renderResults(matches, query) {
		var container = document.getElementById('search-results-page');
		var emptyState = document.getElementById('search-empty-state');
		var title = document.getElementById('search-title');
		var intro = document.getElementById('search-intro');

		title.textContent = 'Search: \u201c' + query + '\u201d';

		if (matches.length === 0) {
			intro.textContent = 'No results.';
			container.hidden = true;
			emptyState.hidden = false;
			return;
		}

		intro.textContent = matches.length + ' result' + (matches.length !== 1 ? 's' : '') + '.';
		emptyState.hidden = true;
		container.hidden = false;

		var html = matches.map(function(m) {
			var item = m.item;
			var img = item.image
				? '<span class="catalogue-thumb"><img src="' + escapeHtml(item.image) + '" alt="" loading="lazy"></span>'
				: '';
			return (
				'<a class="catalogue-row" href="' + escapeHtml(item.url) + '">' +
					img +
					'<span class="catalogue-body">' +
						'<span class="catalogue-title">' + escapeHtml(item.title) + '</span>' +
						'<span class="catalogue-desc">' + m.snippetHtml + '</span>' +
						(metaLine(item) ? '<span class="search-result-meta">' + escapeHtml(metaLine(item)) + '</span>' : '') +
					'</span>' +
				'</a>'
			);
		}).join('');

		container.innerHTML = html;
	}

	function run() {
		var query = getQuery();
		var desktopInput = document.getElementById('header-search-input-desktop');
		var mobileInput = document.getElementById('header-search-input-mobile');
		if (desktopInput) desktopInput.value = query;
		if (mobileInput) mobileInput.value = query;

		if (!query) {
			document.getElementById('search-intro').textContent =
				'Type a search term into the box above and press Enter.';
			return;
		}

		fetch('/search-index.json')
			.then(function(r) { return r.json(); })
			.then(function(data) {
				var matches = data
					.map(function(item) { return matchItem(item, query); })
					.filter(Boolean)
					.sort(function(a, b) {
						if (a.tier !== b.tier) return a.tier - b.tier;
						return (a.item.title || '').localeCompare(b.item.title || '');
					});
				renderResults(matches, query);
			})
			.catch(function() {
				document.getElementById('search-intro').textContent =
					'Search is temporarily unavailable.';
			});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', run);
	} else {
		run();
	}
})();
