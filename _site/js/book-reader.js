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
	}

	/**
	 * Initialize language switcher buttons
	 */
	function initLanguageSwitcher() {
		var langButtons = document.querySelectorAll('.book-lang-btn');
		
		if (langButtons.length === 0) return;

		langButtons.forEach(function(btn) {
			btn.addEventListener('click', function() {
				var lang = this.dataset.lang;
				
				// Update active button
				langButtons.forEach(function(b) {
					b.classList.remove('active');
				});
				this.classList.add('active');
				
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
			});
		});
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
		var observerOptions = {
			root: null,
			rootMargin: '-20% 0px -60% 0px',
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
					var target = document.querySelector(href);
					if (target) {
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

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
