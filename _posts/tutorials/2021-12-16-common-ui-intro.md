---
title: "Common UI Introduction"
excerpt: "What is the plugin for? What does it contain? Why should we care?"
date:   2021-12-16 00:00:00 +0000
unreal_versions: [ 4.27, 5.0, 5.1 ]
tags:
- cpp
- ui
header:
  inline-image: /assets/unreal/common-ui-plugin.webp
  teaser: /assets/unreal/common-ui-intro-small.webp
---

**Note:** Common UI is an **Experimental** plugin released in Unreal Engine
4.27. It is possible that widgets described below may be removed or their
interfaces significantly changed between 4.27 and their final release.
{:.notice--error }

## Overview

The Common UI plugin or UI Common Plugin is a set of widgets created by Epic
and used in their in-house projects. The widgets solve more complex and
specific problems that are not supported by the core set of Unreal Engine
widgets, things like image carousels, lazy-loading images, centralizing button
styles.

All of the problems are things that you may encounter on larger projects, so
I think it's useful to look at the Common UI plugin to see how Epic has solved
some of these problems, even if you do not intend to use the widgets as-is.

{%
include img.html
file="unreal/commonui-palette.webp"
%}



### Enabling the Plugin

Under `Edit > Plugins`, search for `Common UI` and enable the plugin named "UI
Common Plugin". You will need to restart your editor for it to take effect.

Note that the plugin does not seem to be included in Unreal Engine 5.0 Early
Access as of December 20 2021, but is available through through 4.27.2

{%
include img.html
file="unreal/common-ui-plugin.webp"
%}

### Project Settings

Once you have enabled the plugin, there are now some new section in your
Project Settings.

The **Common UI Editor** section allows you to set default styles for new
[Common Text]({% link _posts/tutorials/2021-12-17-common-ui-text.md
%}#common-text), Common Button and Common Border widgets.

{%
include img.html
file="unreal/common-ui-editor-settings.webp"
%}


## Widgets

Common UI adds 20+ widgets, I will try to cover the most useful ones first in
groups:

- [Text widgets]({% link _posts/tutorials/2021-12-17-common-ui-text.md %})
  - [Common Text]({% link _posts/tutorials/2021-12-17-common-ui-text.md %}#common-text)
  - [Common Text Style asset]({% link _posts/tutorials/2021-12-17-common-ui-text.md %}#common-text-style-asset)
  - [Scroll Style asset]({% link _posts/tutorials/2021-12-17-common-ui-text.md %}#scroll-style-asset)
  - [Common Numeric Text Block]({% link _posts/tutorials/2021-12-17-common-ui-text.md %}#common-numeric-text-block)
  - [Common Date Time Text Block]({% link _posts/tutorials/2021-12-17-common-ui-text.md %}#common-date-time-text-block)
  - [Common Rich Text Block]({% link _posts/tutorials/2021-12-17-common-ui-text.md %}#common-rich-text-block)
- [Button widgets]({% link _posts/tutorials/2022-01-01-common-ui-button.md %})
- Lazy loading widgets (Coming soon)
- Switcher widgets (Coming soon)
- Input system (Coming soon)

{% comment %}

## Common Action Widget
## Common Activatable Widget Switcher

## Common Animated Switcher

Pairs with Common Tab List Widget Base



## Common Border

Uses style assets

Instead of having to change the properties on hundreds of individual instances
of Border, you can now change the properties of a single style asset that is
used by all your Common Border instances.

1. Right-click on a folder and choose to create a new Blueprint Class.
2. Choose the parent to be `CommonBorderStyle`
3. Set up the appearance as you would with a normal Border widget.
{%
include img.html
file="unreal/common-border-style-properties.webp"
%}
4. In your Common Border instance within your User Widget, you should now be
   able to select your newly-created Blueprint subclass.
{%
include img.html
file="unreal/common-border-style-class-select.webp"
%}

## Lazy Loader Widgets

### Common Lazy Image
{: class="no_toc" }

Subclass of UImage
Adds a Loading Background Brush property


Has a SLoadGuard reference

Comment at top:


> A special Image widget that can show unloaded images and takes care of the loading for you!
>
> `UCommonLazyImage` is another wrapper for `SLoadGuard`, but it only handles image loading and 
> a throbber during loading.
>  
> If this class changes to show any text, by default it will have CoreStyle styling


### Common Lazy Widget
{: class="no_toc" }

Must call `SetLazyContent(const TSoftClassPtr<UUserWidget>)` to tell it what to
load. 

Uses `UAssetManager::GetStreamableManager().RequestAsyncLoad`
Immediately starts loading the widget on call.



Uses `SLoadGuard` again

### Common Load Guard
{: class="no_toc" }

> The Load Guard behaves similarly to a Border, but with the ability to hide its primary content and display a loading spinner
> and optional message while needed content is loaded or otherwise prepared.
> 
> Use GuardAndLoadAsset to automatically display the loading state until the asset is loaded (then the content widget will be displayed).
> For other applications (ex: waiting for an async backend call to complete), you can manually set the loading state of the guard.

As it says, you can use GuardAndLoadAsset in C++ or Blueprints to show
a loading widget while an asset is being loaded.

## Common List View




## Switcher Widgets

### Common Visibility Switcher
{: class="no_toc" }

> Basic switcher that toggles visibility on its children to only show one widget at a time. Activates visible widget if possible.

Seems the same as the basic WidgetSwitcher??

### Common Visibility Widget Base
{: class="no_toc" }

Subclass of [UCommonBorder](#common-border)

Shows/hides content depending on the active input.

{%
include img.html
file="unreal/common-visibility-widget-base.webp"
%}


### Common Widget Carousel
{: class="no_toc" }

> A widget switcher is like a tab control, but without tabs. At most one widget is visible at time.

The carousel is actually composed of two parts, *Common Widget Carousel**
(Carousel) and
**Common Widget Carousel Nav Bar** (Nav Bar)

The Carousel can contain multiple child widgets, for example for sliding
between showing a one of a set of images.  The **Nav Bar** is used to control
which widget is shown on the Carousel. It requires you to call
`SetLinkedCarousel` with a pointer to the `Common Widget Carousel` instance.

Set Button Widget Type which must be a Blueprint subclass of
`UCommonButtonBase`

Once done it will create a button for each of the widgets in the carousel

{%
include img.html
file="unreal/common-carousel.gif"
%}


## Common User Widget

Subclass of `UUserWidget`


Has a reference to `UCommonUISubsystem`
Has a reference to `UCommonInputSubsystem`
Has a reference to `FSlateUser`

### CommonUISubsystemBase
{: class="no_toc" }

Subclass of `UGameInstanceSubsystem`

Used for getting the appropriate icon for the currently-active gamepad
, returned as a FSlateBrush

... But isn't called anywhere



### CommonInputSubsystem
{: class="no_toc" }

`ULocalPlayerSubsystem` subclass

Seems to be used to track for changes in input method (e.g. swapping between
keyboard and gamepad).

Can disable input

## CommonActivatableWidget

## Button Widgets

### CommonButtonBase
{: class="no_toc" }

Subclass of [`UCommonUserWidget`](#common-user-widget)

The appearance of `Common Buttons` is defined by their associated [Button Style
asset](#common-button-style).

* Selectable
* Toggleable


### Common Button Style
{: class="no_toc" }

Can use a Single Material or a set of textures

7 states:

* Normal
* Normal Hovered
* Normal Pressed
* Selected Base
* Selected Hovered
* Selected Pressed
* Disabled

In the style asset it's possible to set a text style and a brush for each of
these states.

{%
include img.html
file="unreal/common-button-style-properties.webp"
%}


### Using Common Button

The weird thing is that out of the box, `UCommonButtonBase` *will* apply the
defined brush styles to itself when the state changes, but it *won't* apply the
corresponding text style to anything inside it. To make your text change to the
correct text appearance, create a subclass of `UCommonButtonBase` and overide
the `NativeOnCurrentTextStyleChanged()` function and use the class returned by
`CurrentTextStyleClass()`.

{%
include figure-begin.html
title="MyCommonButton.h"
%}
```cpp
#pragma once

#include "CommonButtonBase.h"
#include "MyCommonButton.generated.h"

UCLASS(Abstract, meta = (DisableNativeTick))
class UMyCommonButton : public UCommonButtonBase
{
	GENERATED_BODY()
protected:
	virtual void NativeOnCurrentTextStyleChanged() override;

	UPROPERTY(meta = (BindWidget))
	class UCommonTextBlock* MyButtonTextLabel;
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="MyCommonButton.cpp"
%}
```cpp
#include "MyCommonButton.h"
#include "CommonTextBlock.h"

void UMyCommonButton::NativeOnCurrentTextStyleChanged()
{
	Super::NativeOnCurrentTextStyleChanged();
	MyButtonTextLabel->SetStyle(GetCurrentTextStyleClass());
}
```
{%
include figure-end.html
%}




### Common Rotator
{: class="no_toc" }

Subclass of [`UCommonButtonBase`](#common-button-base)

> A simple widget that shows a sliding bar with a handle that allows you to control the value between 0..1.


## CommonInputActionDataBase
{: class="no_toc" }

Data table row type


## CommonBoundActionButton
{: class="no_toc" }



## CommonTabListWidgetBase


The main interface for this is `RegisterTab` through C++ or Blueprints

```cpp
bool UCommonTabListWidgetBase::RegisterTab(FName TabNameID, TSubclassOf<UCommonButtonBase> ButtonWidgetType, UWidget* ContentWidget)
```


## Common Tile View
## Common Tree View
## Common Hierarchical Scroll Box
## Common Visual Attachment
## Common Activatable Widget Queue
## Common Activatable Widget Stack
## Common Video Player
## Common Bound Action Bar

## Other widgets

### Common Custom Navigation

A subclass of `UBorder`, its only exposed functionality is an OnNavigationEvent
delegate with a bool return type. I guess it could be used for binding to that
widget and returning true when navigation events have been handled by children
inside the CommonCustomNavigation widget.

{% endcomment %}

