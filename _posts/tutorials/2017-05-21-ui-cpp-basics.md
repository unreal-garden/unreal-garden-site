---
title: "Introduction to C++ UIs in Unreal"
excerpt: "What's the deal with Slate, UMG and Blueprints?"
date:   2017-05-21 00:00:00 +0000
tags: 
- ui
- cpp
---

A lot of UI tutorials for Unreal focus entirely on Blueprints. This might have
a broader appeal but in order to make **professional-level UIs**, you really need
to **use C++**.


## Why Should We Use C++?

First of all, why do we want to deal with C++ when making a UI, *"surely we can
do everything with Blueprints?"* The answer to that is *yes and no*. You can
write an entire game's UI using Blueprints but you're going to hit some major
problems along the way:

* {: .con }You are likely to **hit performance problems in large Blueprint-based UIs**.
  Small one-use blueprints are fine, but for large, complicated logic that is
  called every frame, a Blueprint-based UI can really affect performance.
* {: .con }In Blueprints **complicated logic is a nightmare to maintain**. Anyone who's
  written large Blueprint scripts can attest to the **constant fight against
  spaghetti**.
* {: .con }**No separation of acquisition, processing and data presentation**. With
  a Blueprint-only system, it's easy to mix getting data from disparate
  sources, and formatting it for display. This makes future changes to data or
  display a real pain to implement as your display graph nodes are so closely
  tied to data-acquisition nodes.
* {: .con }**Harder for many people to work on the UI at once**. Blueprints are binary
  assets, meaning they're impossible to merge, so only one person can edit them
  at a time. If the UI artist wants to update the appearance of a widget, and
  the developer is updating some Blueprint logic, they artist will have to
  wait. If most of the logic is in C++, both people are less likely to step on
  each others' toes.
* {: .con }**Harder to change code while the game is running**. With Live Compile
  it's possible to change the behaviour of a C++ function and re-compile while
  the game is running. This is makes iteration a lot faster. This is _technically possible_
  with Blueprints but it's pretty error-prone.
{: .procon }


## Three Ways of Using C++ in UIs

Here's where things get a little tricky. As with all UI design, there are
a hundred ways to do the same thing. We will cover each of these three
approaches individually in tutorials that follow, but here is an overview:

* Subclassing `UUserWidget`
* Subclassing or creating a new a UMG widget 
* Subclassing or creating a new a Slate widget

Each of these have their benefits and drawbacks. To know what these mean, we
need to discuss the difference between Slate and UMG.


## Slate and UMG

To create your first C++-based UserWidget, you'll need to create a C++ class
that is a subclass of UUserWidget.

Before starting this, you should now be comfortable with creating UIs in
the editor, and understand the purpose and features of most of the widgets in
the palette. This is best achieved by creating a simple UI using the editor and
blueprints. See the [series introduction]({% link _posts/tutorials/2017-05-21-ui-introduction.md %}) for how to do that.

The next step is to learn **how to create widgets in C++**.

As we mentioned in the introduction to this series, there are two UI systems in
Unreal (as of 4.15), **UMG and Slate**.

**Slate** is the old Unreal UI system, and is what the UMG and the editor are
built on. It uses some funky-looking C++ to simplify setting up widgets. It's
important to understand that **just because it's the "old" system doesn't mean
it's obsolete**. You will gradually need to learn Slate in order to add more
complicated functionality to your UIs.

**UMG** is the newer UI system that was added as part of Unreal 4.  It is
designed to be more Blueprint-friendly and let designers visually lay out their
UIs in the editor. Each UMG widget generally has an almost-identically named
Slate class inside it. The **Slate class handles most of the logic, and its
corresponding UMG class is a wrapper around it. e.g. `UImage` is the UMG class,
and it contains a `SImage` instance inside it.

First off, a tiny bit of history. **Don't skip this, it's important for your
understanding!**

Before version 4.0, UIs in Unreal were created using a system called **Slate**.
It was designed to make UI creation in C++ as simple as possible. Later on in
the tutorial series we will cover how you too can use it.

With version 4.0 of Unreal Engine, Epic released their new UI system, **UMG**.
UMG is effectively a wrapper around Slate, to make it easier to use from
Blueprints, and to let UI designers create custom UIs from within the Unreal
editor.

It's important to understand that **Slate underlies all of the UMG systems we
will discuss**. Slots, different kinds of widgets, the options on widgets, these
are all the same in Slate. **UMG is simply a editor- and Blueprint-friendly
wrapper for Slate.**


## Three Approaches

Now that's out of the way, **there are three major ways you can add C++-based
widgets to your UI.** Listed below they are progressively lower-level and 'more
work', none of them are the sole "best way" to solve a problem, and **each
approach has its own benefits and drawbacks**.

For context, this is my experience from working as an Unreal UI programmer for many years:
* Custom `UUserWidget` — 95% of the time this is enough
* Custom UMG/Slate subclass — 5% of the time if I want something very specific,
  I make a custom UMG/Slate subclass

As with everything there are benefits and drawbacks to each approach. But
generally **the further "down" you go in the hierarchy, towards Slate, the more
customisation you will be able to do, but the more work it might be to set up
interfaces with Blueprints.**

I've separated each approach into its own tutorial.

1. [Create a C++ subclass of `UUserWidget`]({% link _posts/tutorials/2017-05-21-ui-cpp-uuserwidget.md %})
2. [Create a UMG subclass in C++]({% link _posts/tutorials/2017-05-21-ui-cpp-uwidget.md %})
3. [Create a Slate subclass in C++]({% link _posts/tutorials/2017-05-24-ui-cpp-slate.md %})

