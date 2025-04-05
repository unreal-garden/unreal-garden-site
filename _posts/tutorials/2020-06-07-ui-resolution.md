---
title: "Creating Resolution-independent UIs in Unreal Engine"
excerpt: "Design at lowest resolution, scale with DPI Scaling and Custom Application Scaling"
date: 2020-06-07 12:00:00 +0900
last_modified_at:   2024-06-04 00:00:00 +0000
tags:
- texture
header:
  inline-image: /assets/unreal/resolution-title.webp
  teaser: /assets/unreal/resolution-title.webp
---


# Choosing a minimum resolution

The [Steam Hardware &amp; Software
Survey](https://store.steampowered.com/hwsurvey/Steam-Hardware-Software-Survey-Welcome-to-Steam)
is a great source of data when deciding what to minimum resolution to support.

If we reformat the data for Primary Display Resolution into a table showing
cumulative numbers, sorted by Y resolution we get this:
{%
include figure-begin.html
title="Steam Stats Primary Display Resolution"
text="Data as of 6th April, 2024"
%}

| Resolution | Percentage | Percentage of users<br/>with this resolution or higher |
| --- | --- | --- |
| 1280 x 720 | 0.22% | 100% |
| 1280 x 800 | 0.52% | 99.78% |
| 1280 x 1024 | 0.34% | 99.26% |
| 1360 x 768 | 0.62% | 98.92% |
| 1366 x 768 | 3.46% | 98.30% |
| 1440 x 900 | 1.03% | 94.84% |
| 1600 x 900 | 0.99% | 93.81% |
| 1680 x 1050 | 0.62% | 92.82% |
| 1920 x 1080 | 58.45% | 92.20% |
| 1920 x 1200 | 1.05% | 33.75% |
| 2560 x 1080 | 0.89% | 32.70% |
| 2560 x 1440 | 19.86% | 31.81% |
| 2560 x 1600 | 2.89% | 11.95% |
| 2880 x 1800 | 0.26% | 9.06% |
| 3440 x 1440 | 2.11% | 8.80% |
| 3840 x 2160 | 3.44% | 6.69% |
| 5120 x 1440 | 0.28% | 3.25% |


{% include figure-end.html %}

For example if we make the UI work at 1440 x 900, it will also work at all
larger resolutions simply by scaling it up. Reading the table above, if we
support 1440 x 900, roughly 84% of Steam users will be able to play the game
without visual issues in the UI.

In comparison, if the UI is designed to only work at 2560x1080 or greater, only
11% of Steam users will be able to play the game without visual issues in the
UI.

While it's possible to scale a UI down to support lower resolutions, it starts
to look pretty ugly and there's no guarantee that text will be readable. For an
example of this, Frostpunk allows the player to set their resolution to
640x480, but the text is completely illegible.

{%
include img.html
file="unreal/frostpunk-640x480.webp"
title="Frostpunk 640x480"
text="Players can choose 640x480 from resolutions settings, but the text in-game is illegible."
%}

Compare this to Civ IV, which is readable at its lowest-supported resolution of
1024x768.

{%
include img.html
file="unreal/civ6-1024x768.webp"
title="Civ IV 1024x768"
text="Even at the relatively low resolution of 1024x768, text is crisp, legible, and all elements are visible on-screen in Civ IV."
%}

Going back to the table, if we design the UI to work at 1280 x 720, it will
support roughly 98% of Steam users, so I personally recommend supporting this.


# In Unreal

The process in Unreal is pretty straightforward. We will go into greater
detail on each of these below:

1. _Design_ the UI to work at the lowest-supported resolution. 
2. Make the _source textures_ at the highest-supported resolution.
3. (Optional) Set DPI scaling rules to scale in the preferred way.
4. (Optional) Allow players to set custom UI scaling.

## Design the UI at the lowest-supported resolution

The workflow for actually creating the UI in Unreal should be the same as
normal, composing the UI with widgets and custom UserWidgets. However the key
change is to **design the UI at the lowest-supported resolution**.

By that, I mean as you are composing your UI, you should be doing so at your
lowest supported resolution. It is far easier to design at minimum resolution
and add elements in at larger sizes, than the opposite. Your game should be
functional at the minimum resolution:

* All text should be legible.
* No UI elements should be overlapping.
* No text should be breaking out of its containers.
* Text should be tested with at least +30% longer than the base English, to test localization.



Going back to the results of the Steam Stats Survey, you will need to decide
what is the minimum resolution you wish to support. For Industries of Titan we
chose 1280 x 720 as it had the broadest coverage without being impossible.

With the minimum resolution chosen, the first thing to do is set up the UMG
widget designer interface to that resolution.

Choose Custom in the top-right hand corner of the designer view, and then type
in the desired resolution, in this case 1280 and 720 (see screenshot).
{%
include img.html
file="unreal/resolution-main-1280x720.webp"
title="Creating the main UI at 1280x720"
text="Setting the display resolution to Custom and 1280x720 displays the widget
at that resolution."
%}

For individual widgets that are composed into others, this isn't necessary, but
for anything that will be displayed full-screen, make sure to set up the custom
resolution to ensure everything fits at the minimum resolution.

## Make source textures at the highest-supported resolution

It's important to understand that while you will be designing your UI to be
functional at a small resolution, a lot of players will be playing at much
higher resolutions. In 2023, 4K is usually the highest you can expect to
support.

In Unreal it's possible to set UI elements to scale up based on a DPI curve
(covered in the next section), UI textures are scaled up along with any text.
If you author your UI images at your minimum resolution, they will be blurry
and ugly at your maximum resolution.

* Author your images to look good at 4K.
* [Create a custom texture group]({% link
  _posts/tutorials/2021-02-08-custom-texture-group.md %}) and [enable mipmaps]({%
  link _posts/tutorials/2017-05-21-ui-texture-size.md %}) so
  that when the textures are displayed scaled down at your minimum resolution,
  they are not all jaggedy.


## Setting up a DPI Curve

By default, Unreal will scale the UI in a fairly sensible way as the resolution
increases. It is not required to set up a custom DPI curve but playing with
the settings will help you understand how the UI will be shown to players at
different resolutions.

The settings for the DPI curve are under:
> Project Settings > User Interface > DPI Scaling > DPI Curve

Pay attention to the DPI Scaling Rule setting. This is what is used in the
Y-axis of the DPI curve. It defaults to "Shortest" which in portrait monitors
would be the vertical resolution.

{%
include img.html
file="unreal/resolution-dpi-curve.webp"
title="Setting a custom DPI curve"
text="Project Settings > User Interface > DPI Scaling > DPI Curve"
%}

Setting a custom DPI curve allows more control in how the UI will appear at
different resolutions. One option is to force the UI to be scaled by specific
stepped amounts, for example 1.0, 1.5, 2.0 (see below).

{%
include img.html
file="unreal/resolution-custom-dpi-curve.webp"
title="Example stepped DPI curve"
text="Creating a curve like this would make the UI be scaled by 1.0, 1.5, 2.0."
%}


## Testing the UI at different resolutions 

I've found the easiest way to see how the UI scales across different resolutions is to start the game in New Editor Window and simply resize by dragging the window.


{%
include figure-begin.html
title="Testing the UI in a window"
text="Choosing Play In New Editor Window and dragging to resize the window
shows how it is scaled across different resolutions."
%}
<video width="100%" controls>
<source src="/assets/unreal/resolution-regular.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>
{%
include figure-end.html
%}


{%
include figure-begin.html
title="Scaling with custom stepped DPI curve"
text="Using the custom stepped DPI curve shown above, the UI is scaled by 1.0,
1.5 and 2.0 as Y height increases."
%}
<video width="100%" controls>
<source src="/assets/unreal/resolution-stepped.mp4" type="video/mp4">
Your browser does not support the video tag.
</video>
{%
include figure-end.html
%}

To make the Editor window start at a specific resolution, change the settings
under:
>  Editor Preferences &gt; Play &gt; Game Viewport Settings

{%
include img.html
file="unreal/resolution-new-viewport-resolution.webp"
title="Setting default PIE Window resolution"
text="Editor Preferences > Play > Game Viewport Settings"
%}


## Allow players to set custom UI scale

Depending on their monitor, game resolution and eyesight, players may prefer to
scale the UI up or down. Luckily Unreal makes this super easy, and it works in
tandem with the previously-set custom DPI curve.

{%
include figure-begin.html
title="Setting UI scale"
text="Setting the UI to always be scaled by 50%."
code="cpp"
%}
```cpp
UUserInterfaceSettings* UISettings
	= GetMutableDefault<UUserInterfaceSettings>(
		UUserInterfaceSettings::StaticClass());

UISettings->ApplicationScale = 0.5f;
```
{%
include figure-end.html
%}

For a full tutorial check out [Changing UI Scale in Unreal Engine]({% link _posts/tutorials/2021-06-05-ui-scale.md %}).
