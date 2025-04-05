---
title:   "Fuzzy Search in Unreal's Cheat Console"
excerpt: "tldr; prefix with ? and a space."
date:    2021-11-18 00:00:00 +0000
last_modified_at:   2022-05-14 00:00:00 +0000
toc: false
classes: wide
tags:
- cheat
header:
  inline-image: /assets/unreal/cheat-console-fuzzy-search-transparent.webp
  teaser: /assets/unreal/fuzzy-search-small.webp
---

**Update:** As of Unreal 5.0 this is now the default behaviour, even without adding `?` at the front! There is a `console.searchmode.legacy` setting for going back to the old behaviour but it doesn't seem to work. Thanks to [HatiEth](https://github.com/HatiEth) for letting me know about this!
{:.notice--error }


This is an article with a very singular purpose: to document something I wish
I had discovered 5 years ago when starting Unreal.

I often asked myself:

* How do I search for all cheats with a particular word?
* How do I do fuzzy search in the Unreal cheat console?

The answer is simple, prefix what you're searching for with `? ` (a question
mark and a space).

To find all cheats that include the text "player":

```
? player
```

{%
include img.html
file="unreal/cheat-fuzzy-screenshot.webp"
%}

{%
include img.html
file="unreal/cheat-fuzzy-player.webp"
%}
