---
layout: default
title: Tags
permalink: /tags/
---

# Tags

{% assign all_tags = site.articles | map: 'tags' | join: ',' | split: ',' | uniq | sort %}

{% for tag in all_tags %}
  {% if tag != '' %}
  <h2>
		{% include titlecase.html text=tag %}
	</h2>
  <ul>
  {% for article in site.articles %}
    {% if article.tags contains tag %}
    <li>
      <a href="{{ article.url }}">{{ article.title }}</a>
    </li>
    {% endif %}
  {% endfor %}
  </ul>
  {% endif %}
{% endfor %}
