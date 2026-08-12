---
title: salvaged.work - A digital archive for salvaged works.
last_modified_at: 2026-08-10
---

{% assign readable_books = site.articles | where_exp: "a", "a.book_reader.enabled" %}

# an archive of salvaged works

salvaged.work is an archive for texts, audio, and images that have languished within the confines of analogue media. The archive pays homage to these works through curation and digital restoration so that they may be shared with a wider, modern audience. Where a work was published in another language, the archive provides a full English reading edition alongside the original text. This project is independently supported and has no commercial interest in the materials shared.
{: .home-mission}

[About the archive and its editorial method &rarr;](/about/)
{: .home-mission}

[{{ site.articles | size }} articles](/articles/)<span class="counter-sep">&middot;</span>[{{ readable_books | size }} books in the reading room](/reading-room/)<span class="counter-sep">&middot;</span>[{{ site.data.creators | size }} creators](/creators/)
{: .home-counters}

{% comment %} The doors: Reading Room, themes, and the random drawer {% endcomment %}
<div class="home-doors">
	<a class="door" href="/reading-room/" style="--door-ink: #a8221c;">
		<span class="door-crop"><img src="/assets/images/backgrounds/7.jpg" alt="" loading="lazy"></span>
		<span class="door-text">
			<span class="door-title">the reading room</span>
			<span class="door-count">{{ readable_books | size }} books &middot; original + english</span>
			<span class="door-blurb">Every book in the archive that can be read cover to cover, in its original language and in English.</span>
		</span>
	</a>
	{% assign theme_docs = site.collections | where: "kind", "theme" | sort: "title" %}
	{% for theme in theme_docs %}
	<a class="door" href="{{ theme.url }}" style="--door-ink: {{ theme.ink | default: '#a8221c' }};">
		<span class="door-crop"><img src="{{ theme.door_image | default: '/assets/images/backgrounds/1.jpg' }}" alt="" loading="lazy"></span>
		<span class="door-text">
			<span class="door-title">{{ theme.title }}</span>
			<span class="door-count">{{ theme.articles | size }} items</span>
			{% if theme.blurb %}<span class="door-blurb">{{ theme.blurb }}</span>{% endif %}
		</span>
	</a>
	{% endfor %}
	<a class="door" href="/articles/" data-random-drawer style="--door-ink: #9a6b12;">
		<span class="door-crop"><img src="/assets/images/backgrounds/5.jpg" alt="" loading="lazy"></span>
		<span class="door-text">
			<span class="door-title">open a drawer</span>
			<span class="door-count">one random item from the archive</span>
			<span class="door-blurb">Let the archive choose. A different drawer every time.</span>
		</span>
	</a>
</div>

<h2 class="home-section-title">recently salvaged</h2>

<div class="collection-catalogue">
{% assign sorted_articles = site.articles | sort: 'date' | reverse %}
{% for article in sorted_articles limit:3 %}
<a class="catalogue-row" href="{{ article.url }}">
	<span class="catalogue-thumb"><img src="{{ article.featured-image }}" alt="" loading="lazy"></span>
	<span class="catalogue-body">
		<span class="catalogue-title">{{ article.title }}</span>
		<span class="catalogue-desc">{% include first-sentence.html text=article.description %}</span>
	</span>
	<span class="catalogue-year">{{ article.date | date: "%b %-d" }}</span>
</a>
{% endfor %}
</div>

<p><a href="/articles/" class="hover-flow">Explore all {{ site.articles | size }} articles &rarr;</a></p>

{% assign featured_articles = site.articles | where_exp: "article", "article.featured-image" %}
{% if featured_articles.size > 0 %}

<h2 class="home-section-title">from the archive</h2>

<div class="featured-article" id="featured-article-container">
	<!-- Content will be populated by JavaScript -->
</div>

<script>
(function() {
	'use strict';
	
	// Creator slug → display name lookup
	var creatorNames = {
		{% for c in site.data.creators %}"{{ c.slug }}": {{ c.name | jsonify }}{% unless forloop.last %},{% endunless %}
		{% endfor %}
	};
	
	// All articles with featured images
	var featuredArticles = [
		{% for article in featured_articles %}
		{
			url: "{{ article.url }}",
			title: {{ article.title | jsonify }},
			description: {{ article.description | jsonify }},
			image: "{{ article.featured-image }}",
			creators: {{ article.creators | jsonify }}
		}{% unless forloop.last %},{% endunless %}
		{% endfor %}
	];
	
	// Select random article
	var randomIndex = Math.floor(Math.random() * featuredArticles.length);
	var featured = featuredArticles[randomIndex];
	
	// Build HTML
	var html = '<div class="featured-article-image">' +
		'<a href="' + featured.url + '"><img src="' + featured.image + '" alt="' + featured.title + '"></a>' +
		'</div>' +
		'<div class="featured-article-content">' +
		'<h3 style="padding-top: 0; margin-top: 0;"><a href="' + featured.url + '">' + featured.title + '</a></h3>' +
		'<p><strong>' + featured.title + '</strong> ' + featured.description + '</p>';
	
	// Add creators if present
	if (featured.creators && featured.creators.length > 0) {
		html += '<p class="featured-article-meta">Creator';
		if (featured.creators.length > 1) html += 's';
		html += ': ';
		
		featured.creators.forEach(function(creator, index) {
			var creatorTitle = creatorNames[creator] || creator.split('-').map(function(word) {
				return word.charAt(0).toUpperCase() + word.slice(1);
			}).join(' ');
			
			html += '<a href="/creators/' + creator + '">' + creatorTitle + '</a>';
			if (index < featured.creators.length - 1) html += ', ';
		});
		
		html += '</p>';
	}
	
	html += '<p><a href="' + featured.url + '">Read more &rarr;</a></p>' +
		'</div>';
	
	// Insert into page
	document.getElementById('featured-article-container').innerHTML = html;
})();
</script>

{% endif %}
