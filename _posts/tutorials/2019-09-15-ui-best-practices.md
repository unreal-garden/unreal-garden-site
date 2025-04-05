---
title:  "Unreal UI Best Practices"
excerpt: "A completely subjective list of things that I do."
date:   2019-09-15 00:00:00 +0000
tags:
- ui
- umg
- cpp
header:
  overlay_image: /assets/unreal/default-title-nologo.webp
  overlay_filter: 0.3
  teaser: /assets/unreal/ui-best-practices-title-small.webp
---

This post is about best practices when dealing with large UI systems in UMG.
I have worked as a UI programmer on two major games for over 5 years. This is based on my experience, working on a [large RPG](https://benui.ca/about/vampyr) that I composed mostly in Blueprints and a [citybuilder](https://benui.ca/about/industries-of-titan) that has almost no logic in Blueprints.

## Logic in C++, Visuals in Blueprints

Writing logic in Blueprints has some benefits and drawbacks:

{:.procon}
- {:.pro} Simpler for people with no experience of programming.
- {:.pro} Faster iteration than C++ in general.
- {:.con} Text diffs, resolves and merges are impossible in Blueprints.
- {:.con} Blueprints must be checked out to avoid merges between team-members.
  So only one team member can work on a widget at any one time.
- {:.con} Slower execution than C++.
- {:.con} Larger systems become very hard to understand and debug in my experience.

If you are not comfortable in C++, definitely stick to blueprints, but
otherwise I would strongly recommend writing logic in C++ and using blueprints
just to lay out widgets. 

I write all my logic in C++, and use Blueprint subclasses just for laying out
the widgets. It is possible to define UIs using Slate in C++ but it is far
slower than using UMG and the Unreal Editor. Using [`meta=(Bindwidget)`]({%
link _posts/tutorials/2017-06-05-ui-bindwidget.md %}) makes it very easy to set
the state of widgets from C++.

I consider visual state changes part of logic, so I [control animations from
C++]({% link _posts/tutorials/2017-05-21-uitween.md %}) and show/hide widgets
using C++.


## Naming Conventions

Unreal has many of naming conventions for `UObject`s, `AActor`s, `enum`s,
`struct`s. This is [explained pretty well in the manual.
](https://docs.unrealengine.com/en-US/Programming/Development/CodingStandard/index.html).

[Allar's Style Guide](https://github.com/Allar/ue4-style-guide) is also great
for naming conventions for assets.

I'd like to talk about UI-specific naming conventions. 

### Project-wide Class Prefix

I got the habit of adding a project or company-wide prefix for all code made
in-house. I find it very useful to know what classes are "ours" and what are
"Unreal's".

For example if you work at Benui Co. you might prefix all your classes with
BUI. A dog actor would be `ABUIDog`, its ball would be `ABUIBall`. It takes
a while to get used to but it avoids naming clashes (I don't use namespaces in
Unreal).

For widgets, `UButton` is Unreal's built-in button widget, and `UBUIButton`
would be an in-house Button class.

### C++ UserWidgets

I like to add `UW` in my `UUserWidget` subclasses. So a health bar class would
be:

`U` + `BUI` + `UW` + `HealthBar` = `UBUIUWHealthBar`

It looks pretty egregious but I find it especially useful for differentiating
between `UWidgets` and `UUserWidgets`:

* `UBUIButton` would be a custom `UButton` subclass
* `UBUIUWButton` would be a `UUserWidget` subclass that defines a button with extra
  features like an icon, label, keyboard shortcut display.

### Blueprint Prefix

I use the prefix `WBP_` ("widget Blueprint") for widget Blueprint subclasses.
I also make sure the Blueprint name matches its C++ parent.

To continue the health bar example a concrete example of a health bar class:

* `UBUIUWHealthBar` is the **C++ class** that defines the logic the health bar.
* `WBP_HealthBar` is the **widget blueprint** that inherits from `UBUIUWHealthBar`, and defines its appearance.


### Naming Conventions Within Blueprints

This is completely subjective, but I find it very helpful to have a consistent
naming convention for widgets within Blueprints.

It helps remembering what type of widget you are dealing with when in C++ code,
and makes it easier to find widgets in the editor.

I use the following suffixes for widgets:

* Don't give custom names to widgets that have no [C++ binding]({%
link _posts/tutorials/2017-06-05-ui-bindwidget.md %})
* `Label` suffix for `UTextBlock` (this could be `Text` but I find it confusing
  with `FText`).
* `Image` suffix for `UImage`
* `Button` suffix for `UButton`
* `Panel` suffix Overlays, Canvas Panels, Horizontal Boxes, Vertical Boxes.
  I merge these because I often want to change how a widget is arranged and
  I don't want to rename everything.
* `Switcher` suffix for `WidgetSwitcher`


## Create a Base UUserWidget Class

Most Unreal UI tutorials (including those on this site) at first teach you to
create C++ subclasses of `UUserWidget`. Leading to a hierarchy 

```
UUserWidget
 ├ UBUIUWHealthBar
 ├ UBUIUWMenuPage
 │  └ UBUIUWMenuSettingsPage
 └ UBUIUWInventoryItem
```

Instead, create a subclass of UUserWidget and make all your classes inherit
from that:

```
UUserWidget
 └ UBUIUserWidget
    ├ UBUIUWHealthBar
    ├ UBUIUWMenuPage
    │  └ UBUIUWMenuSettingsPage
    └ UBUIUWInventoryItem
```

Doing this makes it extremely easy to add functionality to all your UserWidget
subclasses in a single place.


## Create Custom Base Classes for All Widgets

Similar to the example above, I would strongly recommend creating custom widget
base classes for most core widgets, and using those in your UUserWidget
Blueprints.

At first, these can just be dummy subclasses of the standard UMG widgets:

```cpp
#pragma once

#include "Components/Button.h"
#include "BUIButton.generated.h"

UCLASS()
class UBUIButton : public UButton
{
	GENERATED_BODY()
};
```

As your project evolves you can add more functionality to `UBUIButton` by
overriding virtual functions in `UButton` and adding your own delegates.
Eventually if needs be, you can change `UBUIButton` to not inherit from
`UButton` at all, and write something completely from scratch.

The point is if you have been doing this **from Day 1**, all your Blueprint
widget classes will have `UBUIButton` instances within them, so adding
functionality will just be changing a few lines of code, and not going through
hundreds of Blueprint files.

How many core elements you want to subclass is up to you. I would suggest
starting with at least `UButton`, `UImage` and `UTextBlock`.

{%
include img.html
file="unreal/unreal-custom-buibutton.webp"
title="Our beautiful custom button class"
%}



## Create Reusable UserWidget C++ Classes

Using the naming conventions described above, I have found it incredibly useful
to create a general-purpose Button UserWidget class into which I can add many
things.

```cpp
UCLASS()
class UBUIUWButton : public UBUIUserWidget
{
public:

protected:
	// Not all blueprint subclasses of this may want to have a text label
	UPROPERTY(meta=(BindWidgetOptional))
	TObjectPtr<UTextBlock> MainLabel;

	// As described above, this is a custom Image widget
	UPROPERTY(meta=(BindWidgetOptional))
	TObjectPtr<UBUIImage> MainImage;
		
	UPROPERTY(EditAnywhere)
	bool bIsToggleButton;
	UPROPERTY(EditAnywhere)
	bool bIsToggleOn;
		
	UPROPERTY(EditAnywhere)
	TObjectPtr<UButton> MainButton;
};
```

Using this it is simple to create buttons with the same functionality but different appearances by creating different UserWidget Blueprint subclasses of `UBUIUWButton`.

{%
include img.html
file="unreal/button-styles.webp"
title="Different Blueprint subclasses of the same C++ UBUIUWButton class"
%}

For more complex buttons with more widgets, it's simple to subclass `UBUIUWButton`.

For example if we wanted to make a button in a shop for purchasing an item. We could show its price, where it would be equipped on the player by adding more member variables. All of the standard button functionality defined in `UBUIUWButton` is still there.

```cpp
UCLASS()
class UBUIUWShopItemButton : public UBUIUWButton
{
public:

protected:
	UPROPERTY(meta=(BindWidgetOptional))
	TObjectPtr<UTextBlock> PriceLabel;
	UPROPERTY(meta=(BindWidgetOptional))
	TObjectPtr<UImage> InventorySlotImage;
};
```



## Don't use Bind Variable

If you've used UMG for a while, you've probably noticed the "Bind" buttons next
to some Widget properties. These allow you to create a custom function that is
called each frame, and returns the value to be used in the property.

{%
include img.html
file="unreal/bind-evil.webp"
title="Bind is not a great idea"
%}

This functionality can seem very useful; they give you ultimate control over
values, and you don't have to put anything in Event Tick to make sure the
variables are updated.

However they have a few *major* drawbacks:

{:.procon}
* {:.con} They are called *every frame* which is often not what you really need. If the logic within the bound function is even slightly complicated they can become real performance hogs.
* {:.con} The "Find references" function of the editor does not show where bound functions are called from. On larger UserWidget this makes them extremely difficult to track down.
* {:.con} All the drawbacks of Blueprints mentioned in [the first section](#logic-in-c-visuals-in-blueprints).

Instead you should put function calls within your `NativeTick`, or even better change them to an event-based setup so they are only called on state-changes.


