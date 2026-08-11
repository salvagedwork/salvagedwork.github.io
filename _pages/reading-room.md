---
title: Reading Room
permalink: /reading-room/
description: Every book in the archive that can be read in full, in its original language and in English translation.
date: 2026-08-10
---

<div class="home-masthead" style="padding-top: 0;">
	<h1>the reading room</h1>
	<p class="home-mission">Every book in the archive that can be read cover to cover. Each is presented in its original language alongside a full English reading edition, prepared under the archive's <a href="/about/#editorial-method">editorial method</a></p>
</div>

<hr class="zag-rule" />

{% assign shelf_books = site.articles | where_exp: "a", "a.book_reader.enabled" | sort: "title" %}
<div class="shelf">
	{% for article in shelf_books %}
	<a class="shelf-item" href="/books/{{ article.slug }}/">
		<span class="shelf-cover"><img src="{{ article.featured-image }}" alt="{{ article.title | escape }}" loading="lazy"></span>
		<span class="shelf-title">{{ article.title }}</span>
		<span class="shelf-desc">{% include first-sentence.html text=article.description %}</span>
		<span class="shelf-meta">
			{%- for lang in article.book_reader.languages -%}
			{{ lang.code }}{% unless forloop.last %} &middot; {% endunless %}
			{%- endfor -%}
		</span>
	</a>
	{% endfor %}
</div>
