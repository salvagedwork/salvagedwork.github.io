---
layout: default
title: Article Index
permalink: /articles/
---

# <span id="page-header">Articles</span>

<div class="filter-container">
	<div class="filter-group">
		<span class="filter-label">Filter by category</span>
		<div class="filter-buttons" id="category-filters">
			<button class="filter-btn active" data-filter="all" data-type="category">All</button>
			{% assign all_categories = site.articles | map: 'categories' | join: ',' | split: ',' | uniq | sort %}
			{% for category in all_categories %}
				{% assign clean_category = category | strip %}
				{% if clean_category != '' %}
					{% assign category_count = 0 %}
					{% for article in site.articles %}
						{% if article.categories == clean_category %}
							{% assign category_count = category_count | plus: 1 %}
						{% endif %}
					{% endfor %}
			<button class="filter-btn" data-filter="{{ clean_category }}" data-type="category">{% include titlecase.html text=clean_category %} <span class="filter-count">({{ category_count }})</span></button>
				{% endif %}
			{% endfor %}
		</div>
	</div>
	
	<div class="filter-group">
		<span class="filter-label">Filter by creator</span>
		<div class="filter-buttons" id="creator-filters">
			<button class="filter-btn active" data-filter="all" data-type="creator">All</button>
			{% assign all_creators = site.articles | map: 'creators' | join: ',' | split: ',' | uniq | sort %}
			{% for creator in all_creators %}
				{% assign clean_creator = creator | strip %}
				{% if clean_creator != '' %}
					{% assign creator_count = 0 %}
					{% for article in site.articles %}
						{% if article.creators contains clean_creator %}
							{% assign creator_count = creator_count | plus: 1 %}
						{% endif %}
					{% endfor %}
			<button class="filter-btn" data-filter="{{ clean_creator }}" data-type="creator">{% include titlecase.html text=clean_creator %} <span class="filter-count">({{ creator_count }})</span></button>
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
					{% assign subject_count = 0 %}
					{% for article in site.articles %}
						{% if article.subjects contains clean_subject %}
							{% assign subject_count = subject_count | plus: 1 %}
						{% endif %}
					{% endfor %}
			<button class="filter-btn" data-filter="{{ clean_subject }}" data-type="subject">{% include titlecase.html text=clean_subject %} <span class="filter-count">({{ subject_count }})</span></button>
				{% endif %}
			{% endfor %}
		</div>
	</div>
	
	<div class="filter-group">
		<span class="filter-label">Filter by collection</span>
		<div class="filter-buttons" id="collection-filters">
			<button class="filter-btn active" data-filter="all" data-type="collection">All</button>
			{% assign defined_collections = site.collections | where_exp: "c", "c.collection_id" %}
			{% for collection in defined_collections %}
				{% assign collection_articles = site.articles | where: "member_of", collection.collection_id %}
			<button class="filter-btn" data-filter="{{ collection.collection_id }}" data-type="collection">{{ collection.title }} <span class="filter-count">({{ collection_articles.size }})</span></button>
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
	var activeSubjectFilters = [];
	var activeCategoryFilters = [];
	var activeCreatorFilters = [];
	
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
		var totalFilters = activeCollectionFilters.length + activeSubjectFilters.length + activeCategoryFilters.length + activeCreatorFilters.length;
		
		if (totalFilters === 1) {
			if (activeCollectionFilters.length === 1) {
				headerText = 'Articles in ' + toTitleCase(activeCollectionFilters[0]) + ' collection';
			} else if (activeCategoryFilters.length === 1) {
				headerText = 'Articles about ' + toTitleCase(activeCategoryFilters[0]).toLowerCase();
			} else if (activeSubjectFilters.length === 1) {
				headerText = 'Articles about ' + toTitleCase(activeSubjectFilters[0]).toLowerCase();
			} else if (activeCreatorFilters.length === 1) {
				headerText = 'Articles by ' + toTitleCase(activeCreatorFilters[0]);
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
		
		// Handle creator parameter
		var creatorParam = params.get('creator');
		if (creatorParam) {
			applyFilterFromUrl('creator', creatorParam);
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
		} else if (filterType === 'subject') {
			activeSubjectFilters.push(filterValue);
		} else if (filterType === 'category') {
			activeCategoryFilters.push(filterValue);
		} else if (filterType === 'creator') {
			activeCreatorFilters.push(filterValue);
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
				} else if (filterType === 'subject') {
					activeSubjectFilters = [];
				} else if (filterType === 'category') {
					activeCategoryFilters = [];
				} else if (filterType === 'creator') {
					activeCreatorFilters = [];
				}
			} else {
				// Toggle this filter
				if (this.classList.contains('active')) {
					// Deselect this filter
					this.classList.remove('active');
					
					if (filterType === 'collection') {
						activeCollectionFilters = activeCollectionFilters.filter(function(f) { return f !== filterValue; });
					} else if (filterType === 'subject') {
						activeSubjectFilters = activeSubjectFilters.filter(function(f) { return f !== filterValue; });
					} else if (filterType === 'category') {
						activeCategoryFilters = activeCategoryFilters.filter(function(f) { return f !== filterValue; });
					} else if (filterType === 'creator') {
						activeCreatorFilters = activeCreatorFilters.filter(function(f) { return f !== filterValue; });
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
					} else if (filterType === 'subject') {
						activeSubjectFilters.push(filterValue);
					} else if (filterType === 'category') {
						activeCategoryFilters.push(filterValue);
					} else if (filterType === 'creator') {
						activeCreatorFilters.push(filterValue);
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
			var articleSubjects = article.dataset.subjects ? article.dataset.subjects.split(',') : [];
			var articleCategories = article.dataset.category ? article.dataset.category.split(',') : [];
			var articleCreators = article.dataset.creators ? article.dataset.creators.split(',') : [];
			
			// Check if article matches ALL selected collection filters
			var matchesCollection = true;
			if (activeCollectionFilters.length > 0) {
				matchesCollection = activeCollectionFilters.some(function(filter) {
					return articleCollection === filter;
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
			
			// Check if article matches ALL selected creator filters
			var matchesCreator = true;
			if (activeCreatorFilters.length > 0) {
				matchesCreator = activeCreatorFilters.every(function(filter) {
					return articleCreators.includes(filter);
				});
			}
			
			if (matchesCollection && matchesSubject && matchesCategory && matchesCreator) {
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
		if (activeSubjectFilters.length === 1) {
			params.set('subject', activeSubjectFilters[0]);
		}
		if (activeCategoryFilters.length === 1) {
			params.set('category', activeCategoryFilters[0]);
		}
		if (activeCreatorFilters.length === 1) {
			params.set('creator', activeCreatorFilters[0]);
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
