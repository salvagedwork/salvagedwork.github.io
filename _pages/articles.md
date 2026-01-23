---
layout: default
title: Article Index
permalink: /articles/
---

# Articles

<div class="filter-container">
	<div class="filter-group">
		<span class="filter-label">Filter by artist</span>
		<div class="filter-buttons" id="tag-filters">
			<button class="filter-btn active" data-filter="all" data-type="tag">All</button>
			{% assign all_tags = site.posts | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
			{% for tag in all_tags %}{% assign clean_tag = tag | strip %}{% if clean_tag != '' %}{% assign words = clean_tag | split: '-' %}{% capture label %}{% for word in words %}{% if word != '' %}{{ word | capitalize }} {% endif %}{% endfor %}{% endcapture %}
			<button class="filter-btn" data-filter="{{ clean_tag }}" data-type="tag">{{ label | strip }}</button>
			{% endif %}{% endfor %}
		</div>
	</div>
	
	<div class="filter-group">
		<span class="filter-label">Filter by subject</span>
		<div class="filter-buttons" id="subject-filters">
			<button class="filter-btn active" data-filter="all" data-type="subject">All</button>
			{% assign all_subjects = site.posts | map: 'subjects' | join: ',' | split: ',' | uniq | sort %}
			{% for subject in all_subjects %}{% assign clean_subject = subject | strip %}{% if clean_subject != '' %}{% assign words = clean_subject | split: '-' %}{% capture label %}{% for word in words %}{% if word != '' %}{{ word | capitalize }} {% endif %}{% endfor %}{% endcapture %}
			<button class="filter-btn" data-filter="{{ clean_subject }}" data-type="subject">{{ label | strip }}</button>
			{% endif %}{% endfor %}
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
	const filterButtons = document.querySelectorAll('.filter-btn');
	const articles = document.querySelectorAll('.article-tile');
	const visibleCount = document.getElementById('visible-count');
	const noResults = document.getElementById('no-results');
	
	let activeTagFilters = [];
	let activeSubjectFilters = [];
	
	filterButtons.forEach(button => {
		button.addEventListener('click', function() {
			const filterType = this.dataset.type;
			const filterValue = this.dataset.filter;
			const filterGroup = this.parentElement;
			const allButton = filterGroup.querySelector('[data-filter="all"]');
			
			if (filterValue === 'all') {
				// Clicking "All" clears other selections
				filterGroup.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
				this.classList.add('active');
				
				if (filterType === 'tag') {
					activeTagFilters = [];
				} else {
					activeSubjectFilters = [];
				}
			} else {
				// Toggle this filter
				if (this.classList.contains('active')) {
					// Deselect this filter
					this.classList.remove('active');
					
					if (filterType === 'tag') {
						activeTagFilters = activeTagFilters.filter(f => f !== filterValue);
					} else {
						activeSubjectFilters = activeSubjectFilters.filter(f => f !== filterValue);
					}
					
					// If no filters selected, reactivate "All"
					const activeInGroup = filterGroup.querySelectorAll('.filter-btn.active:not([data-filter="all"])');
					if (activeInGroup.length === 0) {
						allButton.classList.add('active');
					}
				} else {
					// Select this filter
					this.classList.add('active');
					allButton.classList.remove('active');
					
					if (filterType === 'tag') {
						activeTagFilters.push(filterValue);
					} else {
						activeSubjectFilters.push(filterValue);
					}
				}
			}
			
			filterArticles();
		});
	});
	
	function filterArticles() {
		let visibleArticles = 0;
		
		articles.forEach(article => {
			const articleTags = article.dataset.tags ? article.dataset.tags.split(',') : [];
			const articleSubjects = article.dataset.subjects ? article.dataset.subjects.split(',') : [];
			
			// Check if article matches ALL selected tag filters
			let matchesTag = true;
			if (activeTagFilters.length > 0) {
				matchesTag = activeTagFilters.every(filter => articleTags.includes(filter));
			}
			
			// Check if article matches ALL selected subject filters
			let matchesSubject = true;
			if (activeSubjectFilters.length > 0) {
				matchesSubject = activeSubjectFilters.every(filter => articleSubjects.includes(filter));
			}
			
			if (matchesTag && matchesSubject) {
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
