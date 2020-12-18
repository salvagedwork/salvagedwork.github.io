---
layout: default
title: Tags
permalink: /tags/
---

# Tags

{% capture tags %}
  {% for tag in site.tags %}
    {{ tag[0] }}
  {% endfor %}
{% endcapture %}
{% assign sortedtags = tags | split:' ' | sort %}

{% for tag in sortedtags %}
  <h2>
		{% assign words = tag | split: '-' %}
		{% capture titlecase %}
			{% for word in words %}
				{{ word | capitalize }}
			{% endfor %}
		{% endcapture %}
		{{ titlecase }}
	</h2>
  <ul>
  {% for post in site.tags[tag] %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
  </ul>
{% endfor %}