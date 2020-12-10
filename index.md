---
title: salvaged.work - A digital archive for salvaged analogue media.
---

<h1>Welcome to salvaged.work</h1>

<p>salvaged.work is an archive for media that has languished under the confines of analogue mediums and pays homage to these works through curation and digital restoration so that they may be shared with a wider audience.</p>

<p>This project is not supported by advertising and has no commercial interest in the materials shared.</p>

<h2>Explore works by artists</h2>

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


<h2>Read a specific article</h2>

<ul>
{% assign sortedPosts = site.posts | sort: 'title' %}
{% for post in sortedPosts %}
  <li>
    <a href="{{ post.url }}">
      {{ post.title }}
    </a>
  </li>
{% endfor %}
</ul>