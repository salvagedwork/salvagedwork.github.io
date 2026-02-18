/**
 * Article Table of Contents
 * - Auto-builds TOC from h2/h3 headings in the article body
 * - Highlights the active section using IntersectionObserver
 * - Mobile: collapsible box at the top of the article
 * - Desktop: sticky left-column navigation
 */

(function () {
	'use strict';

	var HEADING_SELECTOR = '.article-body h2, .article-body h3';
	var MIN_HEADINGS = 2; // Don't render TOC for very short articles

	function init() {
		var articleBody = document.querySelector('.article-body');
		var tocList     = document.getElementById('toc-list');
		var tocNav      = document.getElementById('article-toc');

		if (!articleBody || !tocList || !tocNav) return;

		var headings = Array.from(articleBody.querySelectorAll('h2, h3'));

		// Only show TOC if there are enough headings to be useful
		if (headings.length < MIN_HEADINGS) {
			tocNav.style.display = 'none';
			return;
		}

		// Ensure each heading has a usable id
		headings.forEach(function (heading, index) {
			if (!heading.id) {
				heading.id = 'section-' + (index + 1);
			}
		});

		// Build the list
		var fragment = document.createDocumentFragment();
		headings.forEach(function (heading) {
			var li = document.createElement('li');
			li.classList.add('toc-item');
			if (heading.tagName === 'H3') {
				li.classList.add('toc-item--sub');
			}

			var a = document.createElement('a');
			a.href = '#' + heading.id;
			a.textContent = heading.textContent.trim();
			a.classList.add('toc-link');
			a.setAttribute('data-target', heading.id);

			// Smooth-scroll and close mobile TOC on click
			a.addEventListener('click', function (e) {
				e.preventDefault();
				var target = document.getElementById(heading.id);
				if (target) {
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
					// Offset for any sticky header
					setTimeout(function () {
						window.scrollBy(0, -80);
					}, 300);
				}
				// Collapse mobile TOC after navigation
				collapseMobileToc();
			});

			li.appendChild(a);
			fragment.appendChild(li);
		});
		tocList.appendChild(fragment);

		// Active-section highlighting via IntersectionObserver
		initHighlighting(headings, tocList);

		// Mobile toggle
		initMobileToggle();

		// Show the TOC (it starts hidden via CSS until JS confirms headings exist)
		tocNav.classList.add('toc-ready');
	}

	// -------------------------------------------------------------------------
	// Active highlighting
	// -------------------------------------------------------------------------

	function initHighlighting(headings, tocList) {
		var activeId = null;

		// Keep a map from id → link for fast lookup
		var linkMap = {};
		tocList.querySelectorAll('.toc-link').forEach(function (link) {
			linkMap[link.dataset.target] = link;
		});

		function setActive(id) {
			if (id === activeId) return;
			if (activeId && linkMap[activeId]) {
				linkMap[activeId].classList.remove('toc-link--active');
			}
			activeId = id;
			if (id && linkMap[id]) {
				linkMap[id].classList.add('toc-link--active');
			}
		}

		// Use IntersectionObserver to track which heading is at the top of the viewport
		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						setActive(entry.target.id);
					}
				});
			},
			{
				rootMargin: '-10% 0px -80% 0px', // trigger when heading is near top
				threshold: 0
			}
		);

		headings.forEach(function (heading) {
			observer.observe(heading);
		});

		// Fallback: on scroll, find the last heading above the viewport midpoint
		window.addEventListener('scroll', function () {
			var mid = window.scrollY + window.innerHeight * 0.3;
			var best = null;
			headings.forEach(function (heading) {
				if (heading.offsetTop <= mid) {
					best = heading.id;
				}
			});
			if (best) setActive(best);
		}, { passive: true });
	}

	// -------------------------------------------------------------------------
	// Mobile toggle
	// -------------------------------------------------------------------------

	function initMobileToggle() {
		var toggle  = document.getElementById('toc-toggle');
		var wrapper = document.getElementById('toc-list-wrapper');
		if (!toggle || !wrapper) return;

		toggle.addEventListener('click', function () {
			var isOpen = wrapper.classList.toggle('toc-list-wrapper--open');
			toggle.setAttribute('aria-expanded', String(isOpen));
			toggle.textContent = isOpen ? '▴' : '▾';
		});
	}

	function collapseMobileToc() {
		var wrapper = document.getElementById('toc-list-wrapper');
		var toggle  = document.getElementById('toc-toggle');
		if (!wrapper || !toggle) return;
		// Only collapse on mobile (wrapper uses display:none via CSS on desktop)
		if (window.getComputedStyle(toggle).display !== 'none') {
			wrapper.classList.remove('toc-list-wrapper--open');
			toggle.setAttribute('aria-expanded', 'false');
			toggle.textContent = '▾';
		}
	}

	// Run after DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})();
