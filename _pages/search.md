---
title: Search
layout: default
permalink: /search/
classes: wide
toc: false
search: true
redirect_from:
- /keywords/
- /keywords
---

<div id="search_form">
<div id="main" role="main">
	<aside class="sidebar sticky">
		<div class="search-sidebar">
			<details id="categories_details" open>
				<summary>Categories</summary>
				<input type="checkbox" class="category" id="all" name="all" value="all" checked disabled data-group="categories" data-all="true" /><label for="all">All</label>
				<br/>
				<input type="checkbox" class="category" id="articles" name="articles" value="articles" data-group="categories" /><label for="articles">Tutorials</label>
				<br/>
				<input type="checkbox" class="category" id="bits" name="bits" value="bits" data-group="categories" /><label for="bits">Bits</label>
				<br/>
				<input type="checkbox" class="category" id="docs" name="docs" value="docs" data-group="categories" /><label for="docs">Documentation</label>
			</details>
			<details id="tags_details" open>
				<summary>Tags</summary>
				<div id="filter-container" class="tags">
					{% assign all_tags = site.data.bits | map: 'tags' | join: ',' | split: ',' | uniq | sort %}
					{% for tag in all_tags %}
					{% if tag and tag != "" %}
					<button class="filter-button"
					data-state="inactive"
					data-tag="{{tag}}"
					onclick="onFormTagClicked(event)"
					{% if site.data.tags[tag].tooltip %}
					title="{{site.data.tags[tag].tooltip}}"
					{% endif %}
					>
					{% if site.data.tags[tag] %}
					<span class="icon">{{site.data.tags[tag].icon}}</span>
					{{ site.data.tags[tag].title }}
					<!--<span class="tag-link-count">99</span>-->
					{% else %}
					{{ tag }} not found
					{% endif %}
					</button>
					{% endif %}
					{% endfor %}
				</div>
			</details>
		</div>
	</aside>

	<div class="archive page">
		<h1 id="page-title" class="page__title">{{ page.title }}</h1>
		<p>Search articles, documentation, bits, pretty much anything on this site.</p>
		<input type="search" id="search" class="search-input" tabindex="-1" name="q" placeholder="Search..." />
		<div id="results"></div>
  	</div>
</div>
</div>
