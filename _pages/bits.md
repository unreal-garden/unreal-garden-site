---
title: "bits"
tagline: An archive of tips and useful links.
layout: archive
permalink: /bits/
header:
  image: /assets/unreal/default-title.webp
  overlay_filter: 0.5
  teaser: /assets/unreal/default-title-small.webp
toc: true
toc_sticky: true
---

These are short tips or links to useful resources.

They are [searchable]({% link _pages/search.md %}?categories=bits).

You can follow an <a href="{% link _pages/bits-feed.xml %}"><i class="fas fa-fw fa-rss-square" aria-hidden="true"></i>RSS Feed</a> for all the new stuff.

{% include inline-logo.html %}

{% assign sorted_bits = site.data.bits | sort: "posted_date" | reverse %}

# Recent Bits

{%- for bit in sorted_bits limit: 20 -%}
{%- include bits-single.html -%}
{%- endfor -%}