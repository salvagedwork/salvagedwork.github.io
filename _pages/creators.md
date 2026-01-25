---
layout: default
title: Creators Index
permalink: /creators/
---

# Creators

<p class="page-intro">The archive focuses on works by the following artists, authors, and collaborators. Each creator page includes a biography and links to all archived materials featuring their work.</p>

<div class="creator-grid">
{% assign sorted_creators = site.creators | sort: 'title' %}
{% for creator in sorted_creators %}
	{% include creator-listing.html %}
{% endfor %}
</div>
