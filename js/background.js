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
		backgroundSize: '1300px',
		backgroundPosition: 'top',
		backgroundRepeat: 'repeat-y',
		backgroundAttachment: 'fixed'
	};

	/**
	 * Apply a random background image to the document body
	 */
	function setRandomBackground() {
		const num = Math.ceil(Math.random() * CONFIG.totalBackgrounds);
		const imageUrl = `${CONFIG.imagePath}${num}${CONFIG.imageExtension}`;
		
		document.body.style.backgroundImage = `url('${imageUrl}')`;
		document.body.style.backgroundSize = CONFIG.backgroundSize;
		document.body.style.backgroundPosition = CONFIG.backgroundPosition;
		document.body.style.backgroundRepeat = CONFIG.backgroundRepeat;
		document.body.style.backgroundAttachment = CONFIG.backgroundAttachment;
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
