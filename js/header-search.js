/**
 * Header functionality: burger menu toggle and search
 * Requires simple-jekyll-search.min.js to be loaded first
 */

(function() {
	'use strict';

	/**
	 * Initialize burger menu toggle
	 */
	function initBurgerMenu() {
		const burgerMenu = document.getElementById('burger-menu');
		const mobileNav = document.getElementById('mobile-nav');
		
		if (!burgerMenu || !mobileNav) return;

		burgerMenu.addEventListener('click', function() {
			this.classList.toggle('active');
			mobileNav.classList.toggle('visible');
		});
	}

	/**
	 * Escape special regex characters in a string
	 * @param {string} string - String to escape
	 * @returns {string} Escaped string
	 */
	function escapeRegex(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	/**
	 * Highlight matching text with a mark element
	 * @param {string} text - Text to search within
	 * @param {string} query - Query to highlight
	 * @returns {string} Text with highlights applied
	 */
	function highlightMatch(text, query) {
		if (!query || !text) return text;
		const regex = new RegExp('(' + escapeRegex(query) + ')', 'gi');
		return text.replace(regex, '<mark class="search-highlight">$1</mark>');
	}

	/**
	 * Set up search functionality for a given input/results pair
	 * @param {string} inputId - ID of the search input element
	 * @param {string} resultsId - ID of the results container element
	 */
	function setupSearch(inputId, resultsId) {
		const searchInput = document.getElementById(inputId);
		const searchResults = document.getElementById(resultsId);
		
		if (!searchInput || !searchResults) return;
		
		// Check if SimpleJekyllSearch is available
		if (typeof SimpleJekyllSearch === 'undefined') {
			console.warn('SimpleJekyllSearch not loaded');
			return;
		}

		let currentQuery = '';

		// Initialize SimpleJekyllSearch
		SimpleJekyllSearch({
			searchInput: searchInput,
			resultsContainer: searchResults,
			json: '/search.json',
			searchResultTemplate: '<a href="{url}" class="header-search-result"><span class="header-search-result-title">{title}</span><span class="header-search-result-desc">{description}</span></a>',
			noResultsText: '<div class="header-search-no-results">No results found</div>',
			limit: 8,
			sortMiddleware: function(a, b) {
				const query = currentQuery.toLowerCase();
				const aTitle = (a.title || '').toLowerCase();
				const bTitle = (b.title || '').toLowerCase();
				
				// Prioritize titles starting with query
				const aStartsWith = aTitle.startsWith(query);
				const bStartsWith = bTitle.startsWith(query);
				if (aStartsWith && !bStartsWith) return -1;
				if (!aStartsWith && bStartsWith) return 1;
				
				// Then prioritize titles containing query
				const aTitleContains = aTitle.includes(query);
				const bTitleContains = bTitle.includes(query);
				if (aTitleContains && !bTitleContains) return -1;
				if (!aTitleContains && bTitleContains) return 1;
				
				// Fall back to alphabetical
				return aTitle.localeCompare(bTitle);
			},
			templateMiddleware: function(prop, value, template) {
				if (prop === 'title' || prop === 'description') {
					return highlightMatch(value, currentQuery);
				}
				return value;
			}
		});

		// Show/hide results on input
		searchInput.addEventListener('input', function() {
			currentQuery = this.value;
			searchResults.classList.toggle('visible', this.value.length > 0);
		});

		// Show results on focus if there's a value
		searchInput.addEventListener('focus', function() {
			if (this.value.length > 0) {
				searchResults.classList.add('visible');
			}
		});

		// Hide results when clicking outside
		document.addEventListener('click', function(e) {
			if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
				searchResults.classList.remove('visible');
			}
		});

		// Hide results on Escape key
		searchInput.addEventListener('keydown', function(e) {
			if (e.key === 'Escape') {
				searchResults.classList.remove('visible');
				this.blur();
			}
		});

		// Hide results when clicking a result
		searchResults.addEventListener('click', function(e) {
			if (e.target.closest('.header-search-result')) {
				searchResults.classList.remove('visible');
			}
		});
	}

	/**
	 * Initialize all header functionality when DOM is ready
	 */
	function init() {
		// Always use DOMContentLoaded to ensure all deferred scripts have executed
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', onReady);
		} else {
			// If DOM is already ready, run on next tick to ensure script order
			onReady();
		}
	}

	function onReady() {
		initBurgerMenu();
		setupSearch('header-search-input-desktop', 'header-search-results-desktop');
		setupSearch('header-search-input-mobile', 'header-search-results-mobile');
	}

	init();
})();
