---
layout: default
title: Categories
description: Article categories at salvaged.work, a digital archive for salvaged analogue materials.
permalink: /categories/
---

# Categories

{% capture categories %}
  {% for category in site.categories %}
    {{ category[0] }}
  {% endfor %}
{% endcapture %}
{% assign sortedcategories = categories | split:' ' | sort %}

{% for category in sortedcategories %}
  <h4>{{ category | capitalize }}</h4>
  <ul>
	{% assign sortedPosts = site.categories[category] | sort: 'title' %}
  {% for post in sortedPosts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
  </ul>
{% endfor %}