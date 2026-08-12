/**
 * Random background image selector
 * Applies a random background image from the backgrounds folder on page load
 */

(function() {
	'use strict';

	const CONFIG = {
		totalBackgrounds: 7,
		imagePath: '/assets/images/backgrounds/',
		imageExtension: '.jpg',
		backgroundSize: '100% auto',
		backgroundPosition: 'top center',
		backgroundRepeat: 'repeat-y'
	};

	/**
	 * Apply a random background image to the dedicated background element
	 */
	function setRandomBackground() {
		const num = Math.ceil(Math.random() * CONFIG.totalBackgrounds);
		const imageUrl = `${CONFIG.imagePath}${num}${CONFIG.imageExtension}`;
		const el = document.getElementById('site-background');
		if (!el) return;

		el.style.backgroundImage = `url('${imageUrl}')`;
		el.style.backgroundSize = CONFIG.backgroundSize;
		el.style.backgroundPosition = CONFIG.backgroundPosition;
		el.style.backgroundRepeat = CONFIG.backgroundRepeat;
	}

	/**
	 * Initialize when DOM is ready
	 */
	function init() {
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', setRandomBackground);
		} else {
			setRandomBackground();
		}
	}

	init();
})();
