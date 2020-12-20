---
layout: default
title: Article Index
permalink: /articles/
---

# Articles

{% assign sortedPosts = site.posts | sort: 'title' %}
{% for post in sortedPosts %}
{% include article-listing.html %}
{% endfor %}