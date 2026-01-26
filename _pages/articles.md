---
layout: default
title: Article Index
permalink: /articles/
---

# <span id="page-header">Articles</span>

<div class="filter-container">
	<div class="filter-group">
		<span class="filter-label">Filter by collection</span>
		<div class="filter-buttons" id="collection-filters">
			<button class="filter-btn active" data-filter="all" data-type="collection">All</button>
			{% assign defined_collections = site.collections | where_exp: "c", "c.collection_id" %}
			{% for collection in defined_collections %}
			<button class="filter-btn" data-filter="{{ collection.collection_id }}" data-type="collection">{{ collection.title }}</button>
			{% endfor %}
		</div>
	</div>
	
	<div class="filter-group">
		<span class="filter-label">Filter by tag</span>
		<div class="filter-buttons" id="tag-filters">
			<button class="filter-btn active" data-filter="all" data-type="tag">All</button>
			{% assign all_tags = site.articles | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
			{% for tag in all_tags %}
				{% assign clean_tag = tag | strip %}
				{% if clean_tag != '' %}
			<button class="filter-btn" data-filter="{{ clean_tag }}" data-type="tag">{% include titlecase.html text=clean_tag %}</button>
				{% endif %}
			{% endfor %}
		</div>
	</div>
	
	<div class="filter-group">
		<span class="filter-label">Filter by subject</span>
		<div class="filter-buttons" id="subject-filters">
			<button class="filter-btn active" data-filter="all" data-type="subject">All</button>
			{% assign all_subjects = site.articles | map: 'subjects' | join: ',' | split: ',' | uniq | sort %}
			{% for subject in all_subjects %}
				{% assign clean_subject = subject | strip %}
				{% if clean_subject != '' %}
			<button class="filter-btn" data-filter="{{ clean_subject }}" data-type="subject">{% include titlecase.html text=clean_subject %}</button>
				{% endif %}
			{% endfor %}
		</div>
	</div>
	
	<div class="filter-group">
		<span class="filter-label">Filter by category</span>
		<div class="filter-buttons" id="category-filters">
			<button class="filter-btn active" data-filter="all" data-type="category">All</button>
			{% assign all_categories = site.articles | map: 'categories' | join: ',' | split: ',' | uniq | sort %}
			{% for category in all_categories %}
				{% assign clean_category = category | strip %}
				{% if clean_category != '' %}
			<button class="filter-btn" data-filter="{{ clean_category }}" data-type="category">{% include titlecase.html text=clean_category %}</button>
				{% endif %}
			{% endfor %}
		</div>
	</div>
</div>

<div class="article-count">
	Showing <span id="visible-count">{{ site.articles | size }}</span> of {{ site.articles | size }} articles
</div>

<div id="article-list">
{% assign sortedArticles = site.articles | sort: 'title' %}
{% for article in sortedArticles %}
	{% include article-listing.html %}
{% endfor %}
</div>

<p id="no-results" style="display: none;"><em>No articles match your selected filters.</em></p>

<script>
document.addEventListener('DOMContentLoaded', function() {
	var filterButtons = document.querySelectorAll('.filter-btn');
	var articles = document.querySelectorAll('.article-tile');
	var visibleCount = document.getElementById('visible-count');
	var noResults = document.getElementById('no-results');
	var pageHeader = document.getElementById('page-header');
	
	var activeCollectionFilters = [];
	var activeTagFilters = [];
	var activeSubjectFilters = [];
	var activeCategoryFilters = [];
	
	// Convert hyphenated-text to Title Case
	function toTitleCase(str) {
		return str.split('-').map(function(word) {
			return word.charAt(0).toUpperCase() + word.slice(1);
		}).join(' ');
	}
	
	// Update the page header based on active filters
	function updateHeader() {
		var headerText = 'Articles';
		
		// Only show custom header if exactly one filter type is active with one value
		var totalFilters = activeCollectionFilters.length + activeTagFilters.length + activeSubjectFilters.length + activeCategoryFilters.length;
		
		if (totalFilters === 1) {
			if (activeCollectionFilters.length === 1) {
				headerText = 'Articles in ' + toTitleCase(activeCollectionFilters[0]) + ' collection';
			} else if (activeTagFilters.length === 1) {
				headerText = 'Articles tagged with ' + toTitleCase(activeTagFilters[0]);
			} else if (activeCategoryFilters.length === 1) {
				headerText = 'Articles about ' + toTitleCase(activeCategoryFilters[0]).toLowerCase();
			} else if (activeSubjectFilters.length === 1) {
				headerText = 'Articles about ' + toTitleCase(activeSubjectFilters[0]).toLowerCase();
			}
		}
		
		pageHeader.textContent = headerText;
	}
	
	// Parse URL parameters to apply initial filters
	function parseUrlParams() {
		var params = new URLSearchParams(window.location.search);
		
		// Handle collection parameter
		var collectionParam = params.get('collection');
		if (collectionParam) {
			applyFilterFromUrl('collection', collectionParam);
		}
		
		// Handle tag parameter
		var tagParam = params.get('tag');
		if (tagParam) {
			applyFilterFromUrl('tag', tagParam);
		}
		
		// Handle subject parameter
		var subjectParam = params.get('subject');
		if (subjectParam) {
			applyFilterFromUrl('subject', subjectParam);
		}
		
		// Handle category parameter
		var categoryParam = params.get('category');
		if (categoryParam) {
			applyFilterFromUrl('category', categoryParam);
		}
	}
	
	// Apply a filter from URL parameter
	function applyFilterFromUrl(filterType, filterValue) {
		var filterGroup = document.getElementById(filterType + '-filters');
		if (!filterGroup) return;
		
		var targetButton = filterGroup.querySelector('[data-filter="' + filterValue + '"]');
		if (!targetButton) return;
		
		var allButton = filterGroup.querySelector('[data-filter="all"]');
		
		// Deactivate "All" button
		if (allButton) {
			allButton.classList.remove('active');
		}
		
		// Activate the target filter button
		targetButton.classList.add('active');
		
		// Add to active filters array
		if (filterType === 'collection') {
			activeCollectionFilters.push(filterValue);
		} else if (filterType === 'tag') {
			activeTagFilters.push(filterValue);
		} else if (filterType === 'subject') {
			activeSubjectFilters.push(filterValue);
		} else if (filterType === 'category') {
			activeCategoryFilters.push(filterValue);
		}
	}
	
	// Set up click handlers for filter buttons
	filterButtons.forEach(function(button) {
		button.addEventListener('click', function() {
			var filterType = this.dataset.type;
			var filterValue = this.dataset.filter;
			var filterGroup = this.parentElement;
			var allButton = filterGroup.querySelector('[data-filter="all"]');
			
			if (filterValue === 'all') {
				// Clicking "All" clears other selections
				filterGroup.querySelectorAll('.filter-btn').forEach(function(btn) {
					btn.classList.remove('active');
				});
				this.classList.add('active');
				
				if (filterType === 'collection') {
					activeCollectionFilters = [];
				} else if (filterType === 'tag') {
					activeTagFilters = [];
				} else if (filterType === 'subject') {
					activeSubjectFilters = [];
				} else if (filterType === 'category') {
					activeCategoryFilters = [];
				}
			} else {
				// Toggle this filter
				if (this.classList.contains('active')) {
					// Deselect this filter
					this.classList.remove('active');
					
					if (filterType === 'collection') {
						activeCollectionFilters = activeCollectionFilters.filter(function(f) { return f !== filterValue; });
					} else if (filterType === 'tag') {
						activeTagFilters = activeTagFilters.filter(function(f) { return f !== filterValue; });
					} else if (filterType === 'subject') {
						activeSubjectFilters = activeSubjectFilters.filter(function(f) { return f !== filterValue; });
					} else if (filterType === 'category') {
						activeCategoryFilters = activeCategoryFilters.filter(function(f) { return f !== filterValue; });
					}
					
					// If no filters selected, reactivate "All"
					var activeInGroup = filterGroup.querySelectorAll('.filter-btn.active:not([data-filter="all"])');
					if (activeInGroup.length === 0) {
						allButton.classList.add('active');
					}
				} else {
					// Select this filter
					this.classList.add('active');
					allButton.classList.remove('active');
					
					if (filterType === 'collection') {
						activeCollectionFilters.push(filterValue);
					} else if (filterType === 'tag') {
						activeTagFilters.push(filterValue);
					} else if (filterType === 'subject') {
						activeSubjectFilters.push(filterValue);
					} else if (filterType === 'category') {
						activeCategoryFilters.push(filterValue);
					}
				}
			}
			
			filterArticles();
			updateHeader();
			updateUrl();
		});
	});
	
	function filterArticles() {
		var visibleArticles = 0;
		
		articles.forEach(function(article) {
			var articleCollection = article.dataset.collection || '';
			var articleTags = article.dataset.tags ? article.dataset.tags.split(',') : [];
			var articleSubjects = article.dataset.subjects ? article.dataset.subjects.split(',') : [];
			var articleCategories = article.dataset.category ? article.dataset.category.split(',') : [];
			
			// Check if article matches ALL selected collection filters
			var matchesCollection = true;
			if (activeCollectionFilters.length > 0) {
				matchesCollection = activeCollectionFilters.some(function(filter) {
					return articleCollection === filter;
				});
			}
			
			// Check if article matches ALL selected tag filters
			var matchesTag = true;
			if (activeTagFilters.length > 0) {
				matchesTag = activeTagFilters.every(function(filter) {
					return articleTags.includes(filter);
				});
			}
			
			// Check if article matches ALL selected subject filters
			var matchesSubject = true;
			if (activeSubjectFilters.length > 0) {
				matchesSubject = activeSubjectFilters.every(function(filter) {
					return articleSubjects.includes(filter);
				});
			}
			
			// Check if article matches ALL selected category filters
			var matchesCategory = true;
			if (activeCategoryFilters.length > 0) {
				matchesCategory = activeCategoryFilters.every(function(filter) {
					return articleCategories.includes(filter);
				});
			}
			
			if (matchesCollection && matchesTag && matchesSubject && matchesCategory) {
				article.style.display = '';
				visibleArticles++;
			} else {
				article.style.display = 'none';
			}
		});
		
		visibleCount.textContent = visibleArticles;
		noResults.style.display = visibleArticles === 0 ? 'block' : 'none';
	}
	
	// Update URL to reflect current filters (for sharing/bookmarking)
	function updateUrl() {
		var params = new URLSearchParams();
		
		if (activeCollectionFilters.length === 1) {
			params.set('collection', activeCollectionFilters[0]);
		}
		if (activeTagFilters.length === 1) {
			params.set('tag', activeTagFilters[0]);
		}
		if (activeSubjectFilters.length === 1) {
			params.set('subject', activeSubjectFilters[0]);
		}
		if (activeCategoryFilters.length === 1) {
			params.set('category', activeCategoryFilters[0]);
		}
		
		var newUrl = window.location.pathname;
		if (params.toString()) {
			newUrl += '?' + params.toString();
		}
		
		window.history.replaceState({}, '', newUrl);
	}
	
	// Initialize: parse URL params and apply filters
	parseUrlParams();
	filterArticles();
	updateHeader();
});
</script>
