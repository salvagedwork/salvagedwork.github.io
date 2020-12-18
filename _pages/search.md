---
layout: default
title: Search
description: Search for articles on salvaged.work.
permalink: /search/
last_modified_at: 2020-12-13
---
# Search

Looking for a specific article? You can search for titles, article tags, and article categories here.

Try _Jorn_, for instance...

<!-- Html Elements for Search -->
<div id="search-container">
<input type="text" id="search-input" placeholder="Search">
<ul id="results-container"></ul>
</div>

<!-- Script pointing to simple-jekyll-search.min.js -->
<script src="/js/simple-jekyll-search.min.js" type="text/javascript"></script>

<!-- Configuration -->
<script>
SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('results-container'),
  searchResultTemplate: '<div class="article-list-entry"><a href="{url}"><h2>{title}</h2></a><span>{description}</span></div>',
  json: '/search.json'
  
})
</script>