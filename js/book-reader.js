/**
 * Book Reader Component
 * Handles:
 * - TOC generation from content headings
 * - Language switching
 * - Mobile collapsible chapters
 * - Expand/collapse all functionality
 * - Desktop TOC active state highlighting
 * - Smooth scrolling to sections
 */

(function() {
	'use strict';

	// Only initialize if book reader exists on page
	function init() {
		var bookReader = document.querySelector('.book-reader');
		if (!bookReader) return;

		initLanguageSwitcher();
		generateToc();
		initCollapsibles();
		initExpandCollapseAll();
		initTocHighlighting();
		initSmoothScroll();
		initFootnoteScroll();
	}

	/**
	 * Initialize language switcher buttons
	 */
	function initLanguageSwitcher() {
		var langButtons = document.querySelectorAll('.book-lang-btn');
		
		if (langButtons.length === 0) return;

		// Check URL for language parameter and apply it
		var urlParams = new URLSearchParams(window.location.search);
		var urlLang = urlParams.get('lang');
		if (urlLang) {
			var matchingContent = document.querySelector('.book-text[data-lang="' + urlLang + '"]');
			if (matchingContent) {
				switchLanguage(urlLang, langButtons);
			}
		}

		langButtons.forEach(function(btn) {
			btn.addEventListener('click', function() {
				var lang = this.dataset.lang;
				switchLanguage(lang, langButtons);

				// Update URL parameter without reloading
				var url = new URL(window.location);
				url.searchParams.set('lang', lang);
				history.replaceState(null, '', url);
			});
		});
	}

	/**
	 * Switch visible language content and update UI
	 */
	function switchLanguage(lang, langButtons) {
		// Update active button
		langButtons.forEach(function(b) {
			if (b.dataset.lang === lang) {
				b.classList.add('active');
			} else {
				b.classList.remove('active');
			}
		});
		
		// Show/hide content
		var allContent = document.querySelectorAll('.book-text');
		allContent.forEach(function(content) {
			if (content.dataset.lang === lang) {
				content.removeAttribute('hidden');
			} else {
				content.setAttribute('hidden', '');
			}
		});
		
		// Regenerate TOC for new language
		generateToc();
	}

	/**
	 * Generate TOC from headings in visible content
	 */
	function generateToc() {
		var tocList = document.getElementById('book-toc-list');
		if (!tocList) return;

		// Find the visible book-text content
		var visibleContent = document.querySelector('.book-text:not([hidden])');
		if (!visibleContent) {
			tocList.innerHTML = '<li class="book-toc-empty">No content available</li>';
			return;
		}

		// Find all headings (h2, h3, h4)
		var headings = visibleContent.querySelectorAll('h2, h3, h4');
		
		if (headings.length === 0) {
			tocList.innerHTML = '<li class="book-toc-empty">No sections found</li>';
			return;
		}

		// Clear existing TOC
		tocList.innerHTML = '';

		// Generate TOC items
		headings.forEach(function(heading, index) {
			// Ensure heading has an ID for linking
			if (!heading.id) {
				heading.id = 'section-' + index;
			}

			var li = document.createElement('li');
			li.className = 'book-toc-item book-toc-' + heading.tagName.toLowerCase();

			var link = document.createElement('a');
			link.href = '#' + heading.id;
			link.className = 'book-toc-link';
			link.textContent = heading.textContent;

			li.appendChild(link);
			tocList.appendChild(li);
		});

		// Re-initialize smooth scroll for new links
		initSmoothScroll();
		
		// Re-initialize TOC highlighting
		initTocHighlighting();
	}

	/**
	 * Initialize chapter collapsibles (mobile behavior)
	 */
	function initCollapsibles() {
		var toggles = document.querySelectorAll('.book-chapter-toggle');

		toggles.forEach(function(toggle) {
			toggle.addEventListener('click', function() {
				var expanded = this.getAttribute('aria-expanded') === 'true';
				var contentId = this.getAttribute('aria-controls');
				var content = document.getElementById(contentId);

				if (expanded) {
					collapseChapter(this, content);
				} else {
					expandChapter(this, content);
				}
			});
		});
	}

	/**
	 * Expand a chapter
	 */
	function expandChapter(toggle, content) {
		toggle.setAttribute('aria-expanded', 'true');
		toggle.classList.add('active');
		content.style.maxHeight = content.scrollHeight + 'px';
		content.classList.add('expanded');
		
		// Update max-height after transition to allow for dynamic content
		setTimeout(function() {
			if (content.classList.contains('expanded')) {
				content.style.maxHeight = 'none';
			}
		}, 300);
	}

	/**
	 * Collapse a chapter
	 */
	function collapseChapter(toggle, content) {
		// Set explicit height first for smooth animation
		content.style.maxHeight = content.scrollHeight + 'px';
		content.offsetHeight; // Force reflow
		
		toggle.setAttribute('aria-expanded', 'false');
		toggle.classList.remove('active');
		content.style.maxHeight = '0';
		content.classList.remove('expanded');
	}

	/**
	 * Initialize expand/collapse all buttons
	 */
	function initExpandCollapseAll() {
		var expandAllBtn = document.getElementById('book-expand-all');
		var collapseAllBtn = document.getElementById('book-collapse-all');

		if (expandAllBtn) {
			expandAllBtn.addEventListener('click', function() {
				var toggles = document.querySelectorAll('.book-chapter-toggle');
				toggles.forEach(function(toggle) {
					var contentId = toggle.getAttribute('aria-controls');
					var content = document.getElementById(contentId);
					expandChapter(toggle, content);
				});
			});
		}

		if (collapseAllBtn) {
			collapseAllBtn.addEventListener('click', function() {
				var toggles = document.querySelectorAll('.book-chapter-toggle');
				toggles.forEach(function(toggle) {
					var contentId = toggle.getAttribute('aria-controls');
					var content = document.getElementById(contentId);
					collapseChapter(toggle, content);
				});
			});
		}
	}

	/**
	 * Highlight current section in TOC while scrolling (desktop)
	 */
	function initTocHighlighting() {
		var tocLinks = document.querySelectorAll('.book-toc a');
		
		if (tocLinks.length === 0) return;

		// Find all headings with IDs in the visible content
		var visibleContent = document.querySelector('.book-text:not([hidden])');
		if (!visibleContent) return;

		var headings = visibleContent.querySelectorAll('h2[id], h3[id], h4[id]');
		if (headings.length === 0) return;

		// Use Intersection Observer for performance
		// Observation zone covers the top ~15% of the viewport,
		// matching where headings land after smooth-scrolling
		var observerOptions = {
			root: null,
			rootMargin: '0px 0px -85% 0px',
			threshold: 0
		};

		var observer = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					var id = entry.target.getAttribute('id');
					updateActiveTocLink(id);
				}
			});
		}, observerOptions);

		headings.forEach(function(heading) {
			observer.observe(heading);
		});
	}

	/**
	 * Update which TOC link is marked as active
	 */
	function updateActiveTocLink(activeId) {
		var tocLinks = document.querySelectorAll('.book-toc a');
		
		tocLinks.forEach(function(link) {
			var href = link.getAttribute('href');
			if (href === '#' + activeId) {
				link.classList.add('active');
			} else {
				link.classList.remove('active');
			}
		});
	}

	/**
	 * Smooth scroll when clicking TOC links
	 */
	function initSmoothScroll() {
		var tocLinks = document.querySelectorAll('.book-toc a');

		tocLinks.forEach(function(link) {
			link.addEventListener('click', function(e) {
				var href = this.getAttribute('href');
				if (href.startsWith('#')) {
					e.preventDefault();
					var targetId = href.substring(1);
					var target = document.getElementById(targetId);
					if (target) {
						// Immediately highlight the clicked link
						updateActiveTocLink(targetId);

						// Account for any fixed headers
						var offset = 20;
						var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
						
						window.scrollTo({
							top: targetPosition,
							behavior: 'smooth'
						});

						// Update URL without jumping
						history.pushState(null, null, href);
					}
				}
			});
		});
	}

	/**
	 * Smooth scroll when clicking Kramdown footnote links.
	 * Uses event delegation and an attribute selector (not querySelector('#fn:1'))
	 * because the colon in IDs like "fn:1" breaks CSS selector syntax.
	 * Searches within the visible language div only, to avoid hitting duplicate
	 * IDs in hidden language divs (which have getBoundingClientRect().top = 0
	 * and would cause a spurious upward scroll).
	 */
	function initFootnoteScroll() {
		document.addEventListener('click', function(e) {
			var link = e.target.closest('a');
			if (!link) return;

			var href = link.getAttribute('href');
			if (!href || !href.startsWith('#')) return;

			var targetId = href.substring(1);
			// Only intercept Kramdown footnote IDs (fn:N and fnref:N)
			if (!targetId.startsWith('fn:') && !targetId.startsWith('fnref:')) return;

			// Search within the visible language div to avoid duplicate IDs in hidden divs.
			// querySelector('[id="fn:1"]') handles colons; querySelector('#fn:1') would fail.
			var target = null;
			var visibleContent = document.querySelector('.book-text:not([hidden])');
			if (visibleContent) {
				target = visibleContent.querySelector('[id="' + targetId + '"]');
			}
			// Fallback for single-language pages with no hidden divs
			if (!target) {
				target = document.getElementById(targetId);
			}

			if (!target) return;

			e.preventDefault();

			var offset = 20;
			var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
			window.scrollTo({
				top: targetPosition,
				behavior: 'smooth'
			});
			// Preserve any existing query params (e.g. ?lang=en) in the URL
			history.pushState(null, null, href);
		});
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();

/**
 * Page apparatus (2026 redesign):
 * - Transforms [p. N] markers in the pure-Markdown book texts into anchored
 *   margin apparatus at render time (the source files stay untouched).
 * - Deep links: #de-p123 / #en-p123 switch language and scroll; #p123 uses
 *   the active language.
 * - Reading progress: the zag drawing across the viewport top.
 */
(function() {
	'use strict';

	var MARKER_RE = /\[p\.\s*([0-9IVXLCivxlc]+|unnumbered)\]/g;

	function transformMarkers() {
		var texts = document.querySelectorAll('.book-text');
		texts.forEach(function(text) {
			var lang = text.getAttribute('data-lang') || 'x';
			var unnumbered = 0;
			var walker = document.createTreeWalker(text, NodeFilter.SHOW_TEXT, null);
			var nodes = [];
			while (walker.nextNode()) {
				if (MARKER_RE.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
				MARKER_RE.lastIndex = 0;
			}
			nodes.forEach(function(node) {
				var frag = document.createDocumentFragment();
				var value = node.nodeValue;
				var lastIndex = 0;
				var match;
				MARKER_RE.lastIndex = 0;
				while ((match = MARKER_RE.exec(value)) !== null) {
					frag.appendChild(document.createTextNode(value.slice(lastIndex, match.index)));
					var num = match[1];
					if (num === 'unnumbered') {
						unnumbered += 1;
						num = 'un' + unnumbered;
					}
					var a = document.createElement('a');
					a.className = 'page-marker';
					a.id = lang + '-p' + num;
					a.href = '#' + lang + '-p' + num;
					a.title = 'Page ' + match[1];
					a.textContent = match[1] === 'unnumbered' ? '·' : match[1];
					frag.appendChild(a);
					lastIndex = MARKER_RE.lastIndex;
				}
				frag.appendChild(document.createTextNode(value.slice(lastIndex)));
				node.parentNode.replaceChild(frag, node);
			});
		});
	}

	function jumpToHash() {
		var hash = window.location.hash;
		if (!hash) return;
		var m = hash.match(/^#(?:([a-z]{2})-)?p([0-9IVXLCivxlc]+|un\d+)$/);
		if (!m) return;
		var lang = m[1];
		if (lang) {
			var btn = document.querySelector('.book-lang-btn[data-lang="' + lang + '"]');
			var content = document.querySelector('.book-text[data-lang="' + lang + '"]');
			if (btn && content && content.hidden) btn.click();
		}
		var target = lang
			? document.getElementById(lang + '-p' + m[2])
			: document.querySelector('.book-text:not([hidden]) [id$="-p' + m[2] + '"]');
		if (target) {
			setTimeout(function() {
				target.scrollIntoView({ block: 'center' });
			}, 50);
		}
	}

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

	function initProgress() {
		var bar = document.querySelector('.book-progress');
		if (!bar) return;

		var track = bar.querySelector('.book-progress-track');
		var fill = bar.querySelector('.book-progress-fill');
		var label = bar.querySelector('.book-progress-label');

		// join the floating cluster so progress and Top read as one control
		floatingControls().insertBefore(bar, floatingControls().firstChild);
		bar.hidden = false;

		function maxScroll() {
			return document.documentElement.scrollHeight - window.innerHeight;
		}

		var ticking = false;
		var scrubbing = false;

		function update() {
			ticking = false;
			if (scrubbing) return;
			var max = maxScroll();
			var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
			pct = Math.min(100, Math.max(0, pct));
			paint(pct);
		}

		function paint(pct) {
			if (fill) fill.style.width = pct + '%';
			if (label) label.textContent = Math.round(pct) + '%';
			if (track) track.setAttribute('aria-valuenow', Math.round(pct));
		}

		// Scrubbing. Setting scrollY to fraction * maxScroll places the
		// content at that fraction of the document in the centre of the
		// viewport, so clicking the middle of the bar lands mid-text.
		function seekTo(pct, smooth) {
			pct = Math.min(100, Math.max(0, pct));
			paint(pct);
			window.scrollTo({
				top: (pct / 100) * maxScroll(),
				behavior: smooth ? 'smooth' : 'auto'
			});
		}

		// Measured against the track, but the whole pill is the hit area, so
		// the 10px rule does not have to be hit exactly.
		function pctFromEvent(e) {
			var rect = track.getBoundingClientRect();
			return ((e.clientX - rect.left) / rect.width) * 100;
		}

		if (track) {
			bar.addEventListener('pointerdown', function(e) {
				e.preventDefault();
				scrubbing = true;
				bar.setPointerCapture(e.pointerId);
				seekTo(pctFromEvent(e), false);
			});

			bar.addEventListener('pointermove', function(e) {
				if (!scrubbing) return;
				seekTo(pctFromEvent(e), false);
			});

			function endScrub(e) {
				if (!scrubbing) return;
				scrubbing = false;
				if (bar.hasPointerCapture && bar.hasPointerCapture(e.pointerId)) {
					bar.releasePointerCapture(e.pointerId);
				}
				update();
			}

			bar.addEventListener('pointerup', endScrub);
			bar.addEventListener('pointercancel', endScrub);

			track.addEventListener('keydown', function(e) {
				var max = maxScroll();
				var current = max > 0 ? (window.scrollY / max) * 100 : 0;
				var step = e.shiftKey ? 10 : 2;
				var next = null;

				if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = current + step;
				else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = current - step;
				else if (e.key === 'Home') next = 0;
				else if (e.key === 'End') next = 100;

				if (next !== null) {
					e.preventDefault();
					seekTo(next, true);
				}
			});
		}

		window.addEventListener('scroll', function() {
			if (!ticking) {
				ticking = true;
				window.requestAnimationFrame(update);
			}
		}, { passive: true });

		update();
	}

	function initApparatus() {
		if (!document.querySelector('.book-reader')) return;
		transformMarkers();
		jumpToHash();
		initProgress();
		window.addEventListener('hashchange', jumpToHash);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initApparatus);
	} else {
		initApparatus();
	}
})();
