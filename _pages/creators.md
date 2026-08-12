---
layout: default
title: Creators Index
permalink: /creators/
date: 2026-08-11
---

{%- comment -%}
The lifespan bars are drawn against one shared span: the earliest birth in
the register (padded a decade) through the present year. Living creators run
to the end of the bar.
{%- endcomment -%}
{% assign born_years = site.data.creators | map: "born" | compact | sort %}
{% assign span_start = born_years | first | minus: 10 %}
{% assign span_end = 'now' | date: "%Y" | plus: 0 %}
{% assign span_total = span_end | minus: span_start %}

# Creators

Artists, composers, authors, printers, and collaborators whose work is held in the archive. Each bar shows a life measured against the span of the whole register, earliest birth to the present.
{: .home-mission}

<div class="collection-toolbar">
	<span class="collection-count">{{ site.data.creators | size }} creators</span>
	<span class="collection-sort" data-sort-controls>
		<span class="sort-label">sort</span>
		<button type="button" data-sort="title" data-dir="asc">surname</button>
		<button type="button" data-sort="forename" data-dir="asc">first name</button>
		<button type="button" data-sort="born" data-dir="asc">born</button>
	</span>
</div>

<div class="creator-roster" data-sortable>
{% assign sorted_creators = site.data.creators | sort: "surname" %}
{% for creator_data in sorted_creators %}
	{% assign creator_slug = creator_data.slug %}
	{% include creator-listing.html %}
{% endfor %}
</div>

<script src="/js/collection-sort.js"></script>
