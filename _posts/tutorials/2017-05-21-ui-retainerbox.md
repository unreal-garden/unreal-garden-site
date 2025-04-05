---
title: "Using the RetainerBox Widget"
excerpt: "How to apply material effects to a group of child widgets."
date:   2017-06-07 00:00:00 +0000
tags:
- ui
- umg
- material
header:
  inline-image: /assets/unreal/retainerbox-desaturation-material.webp
  teaser: /assets/unreal/ui-retainerbox-title-small.webp
---

The RetainerBox widget is one of the more advanced widgets in the standard
toolbox, but it can be extremely useful for more advanced visual effects.

It allows you to **apply a material effect to all widgets placed inside**. All
widgets that are children of the RenderBox are rendered to a texture that is
passed into the material applied to the RenderBox.

Any kind of visual effects you might want to apply to a set of widgets are best
achieved with a RetainerBox

* Change the hue/saturation of a set of widgets.
* Add an interesting cutoff-based fade-in fade-out effect to show/hide an entire window and its contents.
* Apply glitch or noise effects.
* Offset pixels to make wave effects.
* Add custom dynamic lighting effects to your UI

## Create a Material

Create a new material and set its type to User Interface.

Next, open up your test widget and create a RetainerBox widget. Notice that it
has a property named **Texture Parameter**. To access the texture data of the contents of the
RetainerBox, **you must create an identically-named Parameter2D node in your
material**.

{%
include img.html file="unreal/retainerbox-desaturation-material.webp"
title="Desaturation Example"
text="Our desaturation RetainerBox material. Note that it is set to
UserInterface type."
%}

{%
include img.html file="unreal/retainerbox-details.webp"
title="RetainerBox Details"
text="The details panel for our RetainerBox widget. Note that we have set the
Texture Parameter to match our Material's Param2D node."
%}


## Apply the Material

Finally to see the result in-game, add Blueprint or C++ logic to [set up
a dynamic material instance of your RetainerBox
material]({% link _posts/tutorials/2017-05-21-ui-dynamic-materials.md %}).

Now in real-time you can change the properties of your material instance and
see it applied to the entire contents of your RetainerBox.

{%
include img.html file="unreal/retainerbox-blueprint.webp"
title="Applying Material"
text="Setting up the RetainerBox widget to use a dynamic material instance
allows us to change its parameters real-time."
%}


* [Creating dynamic materials]({% link _posts/tutorials/2017-05-21-ui-dynamic-materials.md %}).
* [Controlling material properties from UMG animations]({% link _posts/tutorials/2017-05-20-ui-animation.md %}).
* [Dynamically updating widget appearance in-editor with `SynchronizeProperties`]({% link _posts/tutorials/2017-05-21-ui-synchronize-properties.md %}).
