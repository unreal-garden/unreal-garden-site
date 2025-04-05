---
title:  "New Unreal 5 Search"
excerpt: "It's like Duck Duck Go for your game."
date:   2022-09-02 12:00:00 +0000
tags:
- editor
header:
  teaser: /assets/unreal/editor-search-small.webp
  inline-image: /assets/unreal/search-player.webp
---

One of my favourite new features in Unreal Engine 5.0 is an improved Search
window. No longer do you have to bounce between "Find in Blueprints" and
searching within the Content Browser to find stuff, instead you can find
everything from one place!

It is a full-text search that indexes on a huge number of asset types:
* Actors, Blueprints, Widget Blueprints
* Data Tables and Curve Tables
* Levels
* Materials
* Dialogue and Sound Cues

This means that if for example you have a you have a data table with
a particular string in it, you can find that Data Table by searching for that
string.

## How to Use it

First open the **Edit > Plugins** window, find and enable the **Asset Search**
experimental plugin. It will require you to restart your editor

{%
include img.html
file="unreal/search-plugin.webp"
title="First enable the Asset Search plugin"
%}

After restarting you should now see **Tools > Search**. Click it to open up the
new search window

{%
include img.html
file="unreal/search-menu.webp"
title="Where to find the new Search window"
%}

Then it's just a case of typing in what you want to find.  It will also
optionally index map files. Opt-in by clicking the "{Number} Missing* text in
the bottom-right.

{%
include img.html
file="unreal/search-player.webp"
title="Searching for 'Player' in the Lyra Sample Project"
%}

## Advanced Syntax

The search text box supports sqlite-style boolean operators `AND`, `OR` and `NOT`
(the search system is powered by an `FSQLiteDatabase`).

## Extending the Search

The new search system is designed to be a generic search interface that could
be used to search anything. It was designed to be extensible in a few ways:

If you have custom asset types that are not correctly indexed by the
`FGenericObjectIndexer`, you can inherit from the interface `IAssetIndexer` and
add custom rows by using `IndexProperty`. See the existing indexers to see how
it works.

`ISearchProvider` is an interface that you can use to change what is being
searched. `FAssetRegistrySearchProvider` is the only subclass of it provided
with the plugin, and is created to search assets in the asset registry. One
could think of making additional search providers to search Project and Editor
settings, to look for documentation online.

{% comment %}
Feature requests:

* Selecting something in results and pressing Enter should open it
* Wish I could click on columns to sort results
* Columns: wish there were more, ability to right-click to show/hide, drag to
  rearrange
* It seems that search-as-you-type works for 3 characters or more? I would
  prefer if it was made clearer when it will search-as-I-type or it was made
  consistent (always search as type or never search as type).
* There's a visual glitch when searching, seems like a white arrow or home icon
  shows to the left of the search for one frame, moving the bar to the right.
* Clicking "No" for index map files question still indexes the map files.

{% endcomment %}
