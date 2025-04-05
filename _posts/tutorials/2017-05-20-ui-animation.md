---
title:  "Unreal Engine UI Animation"
excerpt: "Creating animations, events, reusable animations."
date:   2017-05-20 00:00:00 +0000
last_modified_at:   2022-03-10 00:00:00 +0000
tags:
- ui
- animation
- umg
- blueprint
header:
  inline-image: /assets/unreal/ui-animation-transparent.webp
  teaser: /assets/unreal/ui-animation-small.webp
---

Animations are a relatively new addition to UMG, and are still being improved
by Epic. That being said, it's still possible to make juicy animations in UMG,
once you get used to a few of the quirks of the system.

This page is kind of a grab-bag of all the features in UMG animations, so let's
dive in!

Thanks to [@PartlyAtomic](https://twitter.com/PartlyAtomic) for helping to
debug some of the weird behaviours with additive/relative animations.

## The Basics

At the bottom of the screen, you should see a tab labelled **Animations**.
Click it to open the Animations Window. If you are using Unreal 5.0 you may
want to dock it by clicking "Dock in Layout" so that it stays open.

A widget can have many _animations_. An _animation_ is made up of one or more _tracks_.
A track is a timeline of changes that are applied to properties within the
UserWidget's hierarchy.



## Additive/Relative Animations

By default, new animation sections are added as Absolute animations. However it
is possible to create additive or relative animations that work even when
multiple animations are being played at the same time on the same widget.

To create an additive or relative animation, first add a default (absolute) track for the property you want to animate. Then click Track and choose Additive or Relative.

Alternatively you can right click on an animation section within a track, and
in the pop-up choose Blend.

{%
include img.html
file="unreal/animation-right-click-blend-type.webp"
%}

{%
include img.html
file="unreal/animation-section-additive.webp"
title="Adding an additive section"
%}

Hovering over a section will show text explaining whether it is Additive,
Relative, Additive from Base or no text, which means Absolute.

{%
include img.html
file="unreal/additive-animation.webp"
title="Additive Animation"
%}


## Blending and Easing Curves

It's hard to find, but the UI animation editor allows you to create multiple
tracks for a single property and blend between them.

1. Create an animation and create a track for some property. For example Color
   and Opacity on an Image widget.
2. Next, click the "+ Section" button.
3. You will now have 2 separate Color and Opacity sections. These are applied
   together to create the final resulting color.
4. To change how the two are blended together, you can change the relative
   strength of a track by dragging on the **very small** white arrow in the
   top-left of a section.
{%
include img.html
file="unreal/animation-curve-handle.webp"
%}
{:start="4"}
4. Now that you have a default animation curve, you can right-click on the
   arrow to change the easing function to any of the built-in easing curves
{%
include img.html
file="unreal/animation-easing-curve.webp"
%}


## Re-using animations

It's not possible to create widget animation assets and re-use them across
different Widget Blueprints, _but_ it is possible to get something close to
that by using the **Named Slot** widget.

1. Create a UserWidget Blueprint. Let's call it `WBP_FadeInContainer`.
2. Add a **Named Slot** to it. This is an empty element that will allow us to
   place other widgets inside instances of this UserWidget
3. Add any animations you wish to `WBP_FadeInContainer`. Make sure the
   animations are affecting your **Named Slot**. For example an
   animation `FromTop` could fade in the **Named Slot** in from the top.
4. Wrap the elements you wish to fade in with your new `WBP_FadeInContainer`,
   and call the animation on your `WBP_FadeInContainer` instance to animate
   them.

{%
include img.html
file="unreal/fade-in-container.webp"
title="WBP_FadeInContainer Animations"
%}

{%
include img.html
file="unreal/fade-in-container-instance.webp"
title="WBP_FadeInContainer Instance"
text="Other widgets can be placed in its Named Slot we have called ContentSlot."
%}

## Retargeting Animations

There are times where you might have an animation that you wish to apply to
a different widget. This can be useful in a few situations:
* Duplicating an animation but making it affect a different widget.
* Fixing animations with broken links (shown in red).

1. Select the new widget you wish to apply the animation to in the Widget
   Hierarchy.
2. Right-click on an existing Track, and choose "Replace with (widget name)"
   where Widget name should be the name of the widget you have selected. 
3. Done!


## Animating Multiple Widgets

1. Select all the widgets you wish to animate with the same track in the Widget
   Hierarchy
2. Right-click on an existing Track, choose Add Selected.
3. The icon now should have yellow arrows on it to show that it affects
   multiple widgets. Who knew!
{%
include img.html
file="unreal/animation-multiple-widgets.webp"
%}


## Animation Groups and Folders

UMG animations can be added to Groups and Folders.

* Groups can be used to filter which tracks are shown in the Track Filter 
* Folders are useful for... grouping things. I don't know.

## Creating and Triggering Events

1. Click on the green "+ Track" button.
2. Drag the timeline scrubber to when you want the event to be fired.
3. Click the (very small) + symbol to the right of the events flag, to create
   a new keyframe at this time.
4. Right-click on the newly-created keyframe. It should look like a little dot.
   From here you can choose `Properties > Event > Create New Endpoint`
{%
include img.html
file="unreal/animation-create-event.webp"
%}
5. You should now be in the Graph view with your newly-created Sequencer Event!


## Controlling Materials in UMG Animations

The ability to control material properties from an animation is absolutely
indispensable for anyone using UMG. The interface for it is a little hidden but
with it, you can set keyframes to control scalar and vector parameters to
materials.

{%
include img.html
file="unreal/material-animation.gif"
title="Controlling Materials in UMG"
text="Animation showing the 5-step process to create an animation that controls a material parameter."
%}



## Exposing New Properties To Animation

If your UserWidget is the subclass of a C++ class, you may want to control some
parameters 

For this you can use the [`Interp`]({% link _pages/docs/uproperty.md %}#interp) property.


1. Create a `UUserWidget` C++ parent class, and mark some of the properties you want to animate with `UPROPERTY(Interp)`
{%
include figure-begin.html
title="BUIUWCharacterPanel.h"
code="cpp"
%}
```cpp
#pragma once

#include "Blueprint/UserWidget.h"
#include "BUIUWCharacterPanel.h"

UCLASS()
class UBUIUWCharacterPanel : public UUserWidget
{
	GENERATED_BODY()
public:

	UPROPERTY(Interp)
	float SmileIntensity = 0;
	
	UPROPERTY(Interp)
	bool bShowTeeth = false;
	
	UPROPERTY(Interp)
	FVector2D LookDirection;
	
	UPROPERTY(Interp)
	FVector HairWaveDirection;
};
```
{%
include figure-end.html
%}
{:start="2"}
2. Create a Blueprint subclass of your C++ class.
3. In the Animation panel, create an animation.
4. Click "+ Track" and under "All Named Widgets" choose "[[This]]"
{%
include img.html
file="unreal/animation-this.webp"
%}
{:start="5"}
5. In your newly-created track, create the smaller "+ Track" button. In the
   dropdown window you should see all the properties you have marked with
   `Interp`
{%
include img.html
file="unreal/animation-custom-interp.webp"
%}

