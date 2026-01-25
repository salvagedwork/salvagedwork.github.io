/**
 * Translation toggle for collapsible sections
 * Allows switching between original text and English translation
 */

(function() {
	'use strict';

	/**
	 * Initialize translation toggles when DOM is ready
	 */
	function init() {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', setupTranslationToggles);
		} else {
			setupTranslationToggles();
		}
	}

	/**
	 * Set up all translation toggle buttons
	 */
	function setupTranslationToggles() {
		const toggleContainers = document.querySelectorAll('.translation-toggle');
		
		toggleContainers.forEach(function(container) {
			const buttons = container.querySelectorAll('.translation-btn');
			const content = container.nextElementSibling;
			
			if (!content || !content.classList.contains('translatable-content')) {
				return;
			}
			
			const originalText = content.querySelector('.original-text');
			const translatedText = content.querySelector('.translated-text');
			
			if (!originalText || !translatedText) {
				return;
			}
			
			// Set initial state: show original, hide translation
			originalText.style.display = 'block';
			translatedText.style.display = 'none';
			
			buttons.forEach(function(button) {
				button.addEventListener('click', function() {
					const lang = this.dataset.lang;
					
					// Update active button state
					buttons.forEach(function(btn) {
						btn.classList.remove('active');
					});
					this.classList.add('active');
					
					// Toggle content visibility
					if (lang === 'original') {
						originalText.style.display = 'block';
						translatedText.style.display = 'none';
					} else {
						originalText.style.display = 'none';
						translatedText.style.display = 'block';
					}
					
					// Recalculate max-height for the collapsible container
					const collapsibleContent = container.closest('.collapsible-text-content');
					if (collapsibleContent && collapsibleContent.style.maxHeight) {
						collapsibleContent.style.maxHeight = collapsibleContent.scrollHeight + 'px';
					}
				});
			});
		});
	}

	init();
})();
