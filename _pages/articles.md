---
layout: default
title: Article Index
permalink: /articles/
---

# Articles

<!-- This loops through the paginated posts -->
{% for post in paginator.posts %}
  {% include article-listing.html %}
{% endfor %}


{% assign sortedPosts = site.posts | sort: 'title' %}
{% for post in sortedPosts %}
{% include article-listing.html %}
{% endfor %}