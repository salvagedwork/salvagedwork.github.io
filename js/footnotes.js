/**
 * Footnote generation script
 * Converts <span class="footnote">text</span> into numbered footnotes with hover tooltips
 * Automatically adds "References" heading only when footnotes are present
 * 
 * Originally adapted from https://www.milania.de/blog/Automatic_footnote_generation_with_jQuery
 * Rewritten in vanilla JavaScript
 */

(function() {
	'use strict';

	// Configuration
	const CONFIG = {
		articleSelector: 'article div.entry',
		footnoteSelector: 'span.footnote',
		tooltipClass: 'tooltip',
		footnoteIdPrefix: 'ftn_',
		fadeInDuration: 300,
		fadeOutDuration: 200,
		tooltipOffsetX: 20,
		tooltipOffsetY: 10
	};

	// Track active tooltip for cleanup
	let activeTooltip = null;

	/**
	 * Initialize footnotes when DOM is ready
	 */
	function init() {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', processFootnotes);
		} else {
			processFootnotes();
		}
	}

	/**
	 * Process all footnotes in article entries
	 */
	function processFootnotes() {
		const articles = document.querySelectorAll(CONFIG.articleSelector);
		let globalCounter = 1;

		articles.forEach(article => {
			const footnotes = article.querySelectorAll(CONFIG.footnoteSelector);
			
			// Only proceed if there are footnotes
			if (footnotes.length === 0) {
				return;
			}
			
			// Create references container
			const referencesSection = document.createElement('div');
			referencesSection.className = 'references-section';
			
			// Add references heading
			const heading = document.createElement('h2');
			heading.textContent = 'References';
			referencesSection.appendChild(heading);
			
			let localCounter = 1;

			footnotes.forEach(footnote => {
				const id = `${CONFIG.footnoteIdPrefix}${globalCounter}_${localCounter}`;
				const content = footnote.innerHTML;

				// Replace footnote span content with superscript link
				footnote.innerHTML = `<sup><a href="#${id}" style="text-decoration: none;">${localCounter}</a></sup>`;

				// Create footnote text element
				const footnoteText = document.createElement('sup');
				footnoteText.id = id;
				footnoteText.innerHTML = `${localCounter}. ${content}`;
				referencesSection.appendChild(footnoteText);
				referencesSection.appendChild(document.createElement('br'));

				// Set up tooltip hover behavior
				setupTooltip(footnote, content);

				localCounter++;
				globalCounter++;
			});
			
			// Append references section to article
			article.appendChild(referencesSection);
		});
	}

	/**
	 * Set up tooltip hover behavior for a footnote
	 * @param {HTMLElement} element - The footnote element
	 * @param {string} content - The footnote content to display
	 */
	function setupTooltip(element, content) {
		element.addEventListener('mouseenter', function(e) {
			showTooltip(content, e.pageX, e.pageY);
		});

		element.addEventListener('mouseleave', function() {
			hideTooltip();
		});

		element.addEventListener('mousemove', function(e) {
			moveTooltip(e.pageX, e.pageY);
		});
	}

	/**
	 * Show tooltip with content at specified position
	 * @param {string} content - HTML content to display
	 * @param {number} x - Mouse X position
	 * @param {number} y - Mouse Y position
	 */
	function showTooltip(content, x, y) {
		// Remove any existing tooltip
		hideTooltip(true);

		// Create new tooltip
		const tooltip = document.createElement('p');
		tooltip.className = CONFIG.tooltipClass;
		tooltip.innerHTML = content;
		tooltip.style.opacity = '0';
		tooltip.style.position = 'absolute';
		tooltip.style.left = (x + CONFIG.tooltipOffsetX) + 'px';
		tooltip.style.top = (y + CONFIG.tooltipOffsetY) + 'px';
		
		document.body.appendChild(tooltip);
		activeTooltip = tooltip;

		// Fade in
		requestAnimationFrame(() => {
			tooltip.style.transition = `opacity ${CONFIG.fadeInDuration}ms ease`;
			tooltip.style.opacity = '1';
		});

		// Trigger MathJax typesetting if available
		if (typeof MathJax !== 'undefined' && MathJax.Hub) {
			MathJax.Hub.Queue(['Typeset', MathJax.Hub, tooltip]);
		} else if (typeof MathJax !== 'undefined' && MathJax.typesetPromise) {
			// MathJax 3.x API
			MathJax.typesetPromise([tooltip]).catch(function(err) {
				console.warn('MathJax typeset failed:', err);
			});
		}
	}

	/**
	 * Hide and remove the active tooltip
	 * @param {boolean} immediate - Skip fade animation
	 */
	function hideTooltip(immediate) {
		if (!activeTooltip) return;

		const tooltip = activeTooltip;
		activeTooltip = null;

		if (immediate) {
			tooltip.remove();
			return;
		}

		tooltip.style.transition = `opacity ${CONFIG.fadeOutDuration}ms ease`;
		tooltip.style.opacity = '0';

		setTimeout(() => {
			if (tooltip.parentNode) {
				tooltip.remove();
			}
		}, CONFIG.fadeOutDuration);
	}

	/**
	 * Move tooltip to follow mouse cursor
	 * @param {number} x - Mouse X position
	 * @param {number} y - Mouse Y position
	 */
	function moveTooltip(x, y) {
		if (!activeTooltip) return;
		activeTooltip.style.left = (x + CONFIG.tooltipOffsetX) + 'px';
		activeTooltip.style.top = (y + CONFIG.tooltipOffsetY) + 'px';
	}

	// Initialize
	init();
})();
