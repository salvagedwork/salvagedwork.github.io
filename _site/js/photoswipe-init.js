/**
 * PhotoSwipe Gallery Initialization
 * Properly pre-loads image dimensions to maintain aspect ratios
 */

document.addEventListener('DOMContentLoaded', function() {
    // Find all gallery sections
    const galleries = document.querySelectorAll('[data-gallery]');
    
    galleries.forEach(function(galleryEl, galleryIndex) {
        // Get all image links in this gallery
        const links = galleryEl.querySelectorAll('a');
        
        if (links.length === 0) return;
        
        // Pre-load dimensions for all images in this gallery
        const imageData = [];
        let loadedCount = 0;
        
        links.forEach(function(link, index) {
            const img = new Image();
            const href = link.href;
            
            imageData[index] = {
                src: href,
                w: 0,
                h: 0,
                element: link
            };
            
            img.onload = function() {
                imageData[index].w = this.width;
                imageData[index].h = this.height;
                loadedCount++;
                
                // Once all images are loaded, initialize PhotoSwipe
                if (loadedCount === links.length) {
                    initGallery(galleryEl, links, imageData);
                }
            };
            
            img.onerror = function() {
                // Use fallback dimensions if image fails to load
                imageData[index].w = 1920;
                imageData[index].h = 1080;
                loadedCount++;
                
                if (loadedCount === links.length) {
                    initGallery(galleryEl, links, imageData);
                }
            };
            
            img.src = href;
        });
    });
});

function initGallery(galleryEl, links, imageData) {
    // Add click handlers to each link
    links.forEach(function(link, index) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get caption for current image
            const items = imageData.map(function(data, i) {
                const figure = links[i].closest('figure');
                const caption = figure ? figure.querySelector('figcaption') : null;
                
                return {
                    src: data.src,
                    w: data.w,
                    h: data.h,
                    title: caption ? caption.innerHTML : ''
                };
            });
            
            // Initialize PhotoSwipe
            const lightbox = new PhotoSwipeLightbox({
                dataSource: items,
                index: index,
                pswpModule: PhotoSwipe,
                
                // Zoom settings
                showHideAnimationType: 'zoom',
                initialZoomLevel: 'fit',
                secondaryZoomLevel: 2,
                maxZoomLevel: 4,
                
                // UI settings
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                bgOpacity: 0.9,
                
                // Interaction
                wheelToZoom: true,
                pinchToClose: false,
                closeOnVerticalDrag: true,
                
                // Navigation
                arrowKeys: true
            });
            
            lightbox.init();
            lightbox.loadAndOpen(index);
        });
    });
}
