---
layout: default
title: Artists Index
permalink: /artists/
---

# Artists

<div class="tile-container">
{% for creator in site.creators %}
	<a href="/creators/{{ creator.name }}">
		<div class="tile">
			<span class="tile-title">
				{% assign words = creator.name | split: '-' %}
				{% capture titlecase %}
					{% for word in words %}
						{{ word | capitalize }}
					{% endfor %}
				{% endcapture %}
				{{ titlecase }}</span>
		</div>
	</a>
{% endfor %}
</div>