---
layout: default
title: Article Index
permalink: /articles/
---

# Articles

<div class="filter-container">
	<div class="filter-group">
		<span class="filter-label">Filter by tag</span>
		<div class="filter-buttons" id="tag-filters">
			<button class="filter-btn active" data-filter="all" data-type="tag">All</button>
			{% assign all_tags = site.posts | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
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
			{% assign all_subjects = site.posts | map: 'subjects' | join: ',' | split: ',' | uniq | sort %}
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
			{% assign all_categories = site.posts | map: 'categories' | join: ',' | split: ',' | uniq | sort %}
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
	Showing <span id="visible-count">{{ site.posts | size }}</span> of {{ site.posts | size }} articles
</div>

<div id="article-list">
{% assign sortedPosts = site.posts | sort: 'title' %}
{% for post in sortedPosts %}
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
	
	var activeTagFilters = [];
	var activeSubjectFilters = [];
	var activeCategoryFilters = [];
	
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
				
				if (filterType === 'tag') {
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
					
					if (filterType === 'tag') {
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
					
					if (filterType === 'tag') {
						activeTagFilters.push(filterValue);
					} else if (filterType === 'subject') {
						activeSubjectFilters.push(filterValue);
					} else if (filterType === 'category') {
						activeCategoryFilters.push(filterValue);
					}
				}
			}
			
			filterArticles();
		});
	});
	
	function filterArticles() {
		var visibleArticles = 0;
		
		articles.forEach(function(article) {
			var articleTags = article.dataset.tags ? article.dataset.tags.split(',') : [];
			var articleSubjects = article.dataset.subjects ? article.dataset.subjects.split(',') : [];
			var articleCategories = article.dataset.category ? article.dataset.category.split(',') : [];
			
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
			
			if (matchesTag && matchesSubject && matchesCategory) {
				article.style.display = '';
				visibleArticles++;
			} else {
				article.style.display = 'none';
			}
		});
		
		visibleCount.textContent = visibleArticles;
		noResults.style.display = visibleArticles === 0 ? 'block' : 'none';
	}
});
</script>
