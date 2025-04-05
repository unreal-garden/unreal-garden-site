---
title:  "BYG Rich Text plugin"
excerpt: "Define Markdown-like custom syntax, use nested styles"
date:   2021-05-13 00:00:00 +0000
tags:
- cpp
- plugin
- text
header:
  teaser: /assets/unreal/bygrichtext-teaser.webp
  inline-image: /assets/unreal/bygrichtext-output.webp
  actions:
  - label: '<i class="fab fa-github"></i> View on Github'
    url: "https://github.com/BraceYourselfGames/UE-BYGRichText"
---

As part of my work at Brace Yourself Games, I created a Rich Text system for
[Industries of Titan](https://braceyourselfgames.com/industries-of-titan/).

Thanks to our Free Fridays, I had the time to improve the system, roll it up
into a plugin and publish it on GitHub.

It's still a work in progress but let me know what you think!

[Rich Text Plugin for Unreal Engine](https://github.com/braceyourselfgames/UE-BYGRichText)

# BYG Rich Text Library

{%
include img.html
file="unreal/bygrichtext-output.webp"
title="Example rich text"
%}

This plugin for Unreal Engine is an alternative to Unreal's built in rich text
system.

It differs from Unreal's default rich text implementation in a few ways:

* Support for Markdown and customizable markup.
* Support for nested styles.
* Simple to extend supported text properties in C++.

## Feature Comparison

| Feature | Unreal Rich Text | BYG Rich Text |
| --- | --- | --- |
| Nested styles					| ❌					| ✅	|
| Customizable syntax   		| ❌					| ✅	|
| Markdown-like shortcuts		| ❌					| ✅	|
| Inline images					| ✅	| ✅	|
| Style-based justification		| ❌ (block only)		| ✅	|
| Style-base margins			| ❌ (block only)		| ✅	|
| Inline tooltips				| ✅	| ✅	|
| Customizable paragraph separator | ❌ | ✅					|
| XML-like syntax   			| ✅	| ✅	|
| Datatable-based stylesheet	| ✅	| ❌					|
| Blueprint code support		| ✅	| ❌					|


## Usage

### Creating a custom stylesheet

1. Create a new Blueprint asset, with `BYGRichTextStylesheet` as the`parent
   class.
2. Add styles to the stylesheet.
3. Add properties to each style.

* Each stylesheet can have one or more _Styles_.
* Each style can hae one or more _Properties_ applied to it. 

#### Rich Text Properties

* **Font/Typeface**
* **Text style:** bold, italic and other styles.
* **Text size**
* **Text color**
* **Text case:** force uppercase or lowercase
* **Text shadow (color and distance)**
* **Margin:** Add spacing between paragraphs.
* **Justification:** Align text left, right or center.
* **Line Height:** Change the spacing between lines.
* **Text Wrap** 
* **Background:** Set a background color or image.

## Download

For more information, see the [BraceYourselfGames/UE-BYGRichText GitHub
page](https://github.com/BraceYourselfGames/UE-BYGRichText)


{%
include img.html
file="unreal/bygrichtext-stylesheet.webp"
title="Example rich text"
%}




# Large Header

Some body text with *emphasis* and things _in italics_.

> Block quotes are possible too

## Secondary Header

$ Make up your own notation!

Why not @Proper Nouns@ and @Item Names@? 





