/**
 * Book Reader Component
 * Handles:
 * - Auto-generating TOC from headers
 * - Language switching
 * - Active section highlighting while scrolling
 * - Smooth scrolling to sections
 */

(function() {
	'use strict';

	var activeLanguage = null;
	var observer = null;

	function init() {
		var bookReader = document.querySelector('.book-reader');
		if (!bookReader) return;

		// Get default language from the active button
		var activeBtn = document.querySelector('.book-lang-btn.active');
		activeLanguage = activeBtn ? activeBtn.dataset.lang : null;

		generateTOC();
		initLanguageSwitcher();
		initScrollHighlighting();
		initSmoothScroll();
	}

	/**
	 * Generate TOC from headers in the active language content
	 */
	function generateTOC() {
		var tocList = document.getElementById('book-toc-list');
		if (!tocList) return;

		var activeContent = document.querySelector('.book-text[data-lang="' + activeLanguage + '"]');
		if (!activeContent) return;

		// Find all headers (h2, h3, h4)
		var headers = activeContent.querySelectorAll('h2, h3, h4');
		
		// Clear existing TOC
		tocList.innerHTML = '';

		if (headers.length === 0) {
			tocList.innerHTML = '<li class="book-toc-empty">No sections found</li>';
			return;
		}

		// Generate IDs for headers if they don't have them, and build TOC
		headers.forEach(function(header, index) {
			// Create ID if missing
			if (!header.id) {
				header.id = 'section-' + activeLanguage + '-' + index;
			}

			var li = document.createElement('li');
			li.className = 'book-toc-item book-toc-' + header.tagName.toLowerCase();
			
			var link = document.createElement('a');
			link.href = '#' + header.id;
			link.textContent = header.textContent;
			link.className = 'book-toc-link';
			
			li.appendChild(link);
			tocList.appendChild(li);
		});

		// Reinitialize scroll highlighting with new headers
		initScrollHighlighting();
	}

	/**
	 * Initialize language switcher buttons
	 */
	function initLanguageSwitcher() {
		var langButtons = document.querySelectorAll('.book-lang-btn');
		
		langButtons.forEach(function(btn) {
			btn.addEventListener('click', function() {
				var newLang = this.dataset.lang;
				if (newLang === activeLanguage) return;

				// Update active button
				langButtons.forEach(function(b) {
					b.classList.remove('active');
				});
				this.classList.add('active');

				// Switch content visibility
				var contents = document.querySelectorAll('.book-text');
				contents.forEach(function(content) {
					if (content.dataset.lang === newLang) {
						content.hidden = false;
					} else {
						content.hidden = true;
					}
				});

				activeLanguage = newLang;

				// Regenerate TOC for new language
				generateTOC();
				
				// Keep user's current scroll position - no scrolling
			});
		});
	}

	/**
	 * Highlight current section in TOC while scrolling
	 */
	function initScrollHighlighting() {
		// Disconnect existing observer
		if (observer) {
			observer.disconnect();
		}

		var activeContent = document.querySelector('.book-text[data-lang="' + activeLanguage + '"]');
		if (!activeContent) return;

		var headers = activeContent.querySelectorAll('h2, h3, h4');
		if (headers.length === 0) return;

		var observerOptions = {
			root: null,
			rootMargin: '-80px 0px -70% 0px',
			threshold: 0
		};

		observer = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					updateActiveTocLink(entry.target.id);
				}
			});
		}, observerOptions);

		headers.forEach(function(header) {
			observer.observe(header);
		});
	}

	/**
	 * Update which TOC link is marked as active
	 */
	function updateActiveTocLink(activeId) {
		var tocLinks = document.querySelectorAll('.book-toc-link');
		
		tocLinks.forEach(function(link) {
			if (link.getAttribute('href') === '#' + activeId) {
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
		document.addEventListener('click', function(e) {
			var link = e.target.closest('.book-toc-link');
			if (!link) return;

			var href = link.getAttribute('href');
			if (!href || !href.startsWith('#')) return;

			e.preventDefault();
			var target = document.querySelector(href);
			if (target) {
				var offset = 100; // Account for sticky elements
				var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
				
				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});

				// Update URL without jumping
				history.pushState(null, null, href);
			}
		});
	}

	// Initialize when DOM is ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
