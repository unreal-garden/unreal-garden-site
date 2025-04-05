---
title:  "Content Browser Filters"
excerpt: "Finding things, particular things by their metadata."
date:   2025-01-08 00:00:00 +0000
tags:
- editor
---

The only documentation I could find on this was long video that didn't need to be a video, and the official documentation didn't seem to mention it.

Unreal's Content Browser has a super powerful way of filtering results. You are probably used to just typing in what you want to find, but it supports more complex queries.

You can filter by **any metadata that exists on assets**.

## How to find filter attributes

{% include img.html file="unreal/content-browser-filters-metadata.webp" %}

If you mouse over an asset in the Content Browser, it should show a tooltip. The left-hand text is the human-readable version of the metadata.

Non-exhaustive list of some of the more useful metadata attributes.

| Tooltip Text | Attribute Name | Notes |
| --- | --- |
| Native Parent Class | `NativeParentClass` | Use this to search for the **parent class of Blueprints**. |
| Native Class | `NativeClass` | Match assets of this type. For example Data Assets |
| Is Data Only | `IsDataOnly` | `true` if the Blueprint does not have any event graphs or functions. |
| Dimensions | `Dimensions` | Seems to match _either_ X or Y dimensions |
| Compression Settings | `CompressionSettings` | Seems to match _either_ X or Y dimensions |
| Texture Group | `TextureGroup` | |
| SRGB | `sRGB` | Boolean true/false. |

The content browser will also try to autocomplete any metadata names that you start typing in.

{% include img.html file="unreal/content-browser-filters-autocomplete.webp" %}

The syntax is:

```
{AttributeName}=={Value}
```

```
TextureGroup==Default
```

Details:

- Spaces don't matter. `Blah == foo` is the same as `Blah==foo`.
- Case doesn't matter.
- All values are matched using substrings. Searching for `TextureGroup==or` would match "World" and "Organics" for example.
- Numeric comparators do _not_ work. `Dimensions > 100` **does not work**. If you want to find or sort assets by size, use the **Asset Audit** tool.

## Useful Filters

My favourite filters that exist by default:
- **Checked Out:** Files you have checked out in version control. Useful to find what you're currently working on.

Useful filters to create that don't exist by default:

- **Actors:** `NativeParentClass==Actor`
- **Data Assts of type:** `NativeClass=={Data Asset Type}`
- **Data Tables**: `RowStructure=={Row type}`


## Saving Filters

All of the filters that you manually type into the search box can be saved so they show up as buttons on the left of the Content Browser.
