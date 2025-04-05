---
title:  "Unreal UIs and Performance"
excerpt: "Make Unreal go fast brr"
date:   2017-05-27 00:00:00 +0000
tags:
- ui
- umg
- optimization
sugroups:
- UI
---

It's important to preface this with by mentioning that you should never
optimise prematurely. And you should always be careful to only optimise what
you are *sure* is causing problem.

That being said, knowing some of the things I mention below could help avoid
performance-affecting things as you are developing your game.

## Benchmark Your Code

Before guessing what is slow about your UI and applying fixes based on some
[half-baked tutorial you read online]({% link _posts/tutorials/2017-05-21-ui-performance.md %}),
you should benchmark your UI to find out exactly what is taking up the most
time.

Open up your console with the tilde key and enter one of the following

* `stat dumpframe -ms=0.1`
* `stat slate`


## Be Careful What is Calculated Every Frame

If something is only run once, and is hidden during a screen transition, it is
pretty easy to argue that there's no point in optimising it. Or at least that
it should be pretty far down your list of things to optimise.

However operations that are run every frame are usually prime candidates for
optimisation. These could be:
- any HUD-style elements: health bars, minimaps, on-screen notifications



## Be Careful What is Instantiated

When you instantiate a UserWidget in-game, a lot of other stuff can be created. In
particular:

* The UserWidget itself
* The entire contents of any WidgetSwitcher panels (even if it seems the panel
  is hidden)
* The entire contents of any UserWidgets that are embedded within the parent.
* Everything that is created or called on Event Construct for all touched UserWidgets
* Any `TSubclassOf<T>` references will have their DefaultObjects loaded and any
  assets that are not [`TAssetPtr<T>` or similar]({% link _posts/tutorials/2017-05-21-tassetptr.md %}).

This can cause some serious hitches/frame-drops that could be a problem.

* Only instantiate what is shown to the player. Widgets hidden in subtabs or
  that are set to Hidden by default could be instantiated only when needed.
* [Change large, less-important textures from `UTexture2D*` to `TAssetPtr<UTexture2D>`]({% link _posts/tutorials/2017-05-21-tassetptr.md %}) and stream them in  asynchronously.
* Similarly, `TSubclassOf<T>` variables whose contents is not needed every time
  the object is instantiated can be changed to `TAssetSubclassOf<T>`.
* If you have the memory to spare, instantiate your UI once during initial
  loading, and show/hide it as needed, instead of re-creating it every time it
  is shown.



## Moving Complex Operations to C++

Exactly how much slower is constantly disputed, mainly because there is no
single number that makes sense across all cases, but **Blueprints can be 
significantly slower than C++ code**.

**Complex mathematical operations that you are performing every frame** are
best moved to C++.



## Use InvalidationBox

The UMG InvalidationBox widget caches its contents so it does not need to be
re-rendered widget-by-widget every frame. It is especially useful for reducing
the amount of time spent per frame rendering complex hierarchies of widgets.

When its contents change, as a developer you must explicitly call the
cache invalidation function.


## UMG and Performance


### FText's FormatText isn't Free

Calling FormatText is vital to creating [localizable UIs]({% link _posts/tutorials/2017-05-21-ui-localization.md %}). However FormatText isn't _free_. I've seen one
example of it taking 0.04ms _per call_ on PS4. You should especially avoid
calling it every frame. Instead call it only when it needs to be changed using
delegates and events. Or cache the value you're using for the FormatText (e.g.
an integer), and only update your text when the value itself changes.


### SetVisibility isn't Free

If you're like me, you maybe assumed that calling `SetVisibility` on a widget is
very performance-light, or that calling `SetVisibility(Hidden)` on an already
hidden widget is effectively free.

It's not.

Calling SetVisibility every frame with your desired visibility is very easy,
but it can also be surprisingly heavy.
As with `FormatText`, you should change your UI so that `SetVisibility` is only
called when a change of state is needed.


