---
title: "Connect C++ to UMG Blueprints with BindWidget"
excerpt:  "How to control logic from C++ and configure visuals in Blueprints."
date:   2017-06-05 00:00:00 +0000
last_modified_at:   2021-12-28 00:00:00 +0000
tags:
- ui
- umg
- cpp
- blueprint
header:
  inline-image: /assets/unreal/ui-bindwidget-inline.webp
  teaser: /assets/unreal/ui-bindwidget-title-small.webp
---

One of the most common questions you'll have if you start making C++-based UIs is this:

> How can I control Blueprint-created widgets from C++?

The answer to this is the `BindWidget` meta property.

{%
include figure-begin.html
title="Basic BindWidget example"
code="cpp"
%}
```cpp
UPROPERTY(BlueprintReadWrite, meta = (BindWidget))
TObjectPtr<UTextBlock> TitleLabel;

UPROPERTY(BlueprintReadWrite, meta = (BindWidget))
TObjectPtr<UImage> IconImage;
```
{%
include figure-end.html
%}

While it's not mentioned on the [`UPROPERTY()` documentation](https://docs.unrealengine.com/latest/INT/Programming/UnrealArchitecture/Reference/Properties/Specifiers/),
it's **one of the most useful tags for you as a UI developer**.

As an aside, check out my [full UPROPERTY documentation]({% link
_pages/docs/uproperty.md %}#bindwidget) that includes all
properties for `BindWidget` and others.

By marking a pointer to a widget as `BindWidget`, you can create an
**identically-named widget in a Blueprint subclass of your C++ class**, and at
run-time **access it from the C++**.

Here's a step-by-step process to getting a test working:

1. Create a [C++ subclass of `UUserWidget`]({% link
   _posts/tutorials/2017-05-21-ui-cpp-uuserwidget.md %}).
2. In it add a member variable that is `UWidget*` or a subclass of it (e.g. `UImage`, `UTextBlock` etc.)
3. Mark it with `UPROPERTY(meta=(BindWidget))`.
4. Run the editor and create a Blueprint subclass of your C++ class.
5. Create a widget with the **same type and exact name** as your member variable.
6. You can now access the widget from C++.

If any of these steps don't make sense, check out my [introductory series on making
UIs with Unreal]({% link _posts/tutorials/2017-05-21-ui-introduction.md %}).

## Example Code

{%
include figure-begin.html
title="BindExample.h"
code="cpp"
%}

```cpp
#pragma once 

#include "Blueprint/UserWidget.h"
#include "BindExample.generated.h"

UCLASS(Abstract)
class UBindExample : public UUserWidget
{
	GENERATED_BODY()

protected:
	virtual void NativeConstruct() override;

	UPROPERTY(BlueprintReadOnly, meta=(BindWidget))
	TObjectPtr<UTextBlock> ItemTitle;
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="BindExample.cpp"
code="cpp"
%}

```cpp
#include "BindExample.h"
#include "Components/TextBlock.h"

void UBindExample::NativeConstruct()
{
	Super::NativeConstruct();

	// ItemTitle can be nullptr if we haven't created it in the
	// Blueprint subclass
	if (ItemTitle)
	{
		ItemTitle->SetText(FText::FromString(TEXT("Hello world!")));
	}
}
```
{%
include figure-end.html
%}

Now compile the C++ and open up your Blueprint subclass of the C++ class where
you added the `ItemTitle` property. If you compile your Blueprint, you will be
shown an error if there is no TextBlock widget named `ItemTitle` inside your
UserWidget.

{%
include img.html
file="unreal/bindwidget-error.webp"
title="Compiling a Blueprint with a missing BindWidget-marked property"
%}

If we now add a Text widget and change its name to match our C++ file, this
compilation error will go away, and when we run the game, the text will be
changed to say "Hello world!".

{%
include img.html
file="unreal/bindwidget-working-window.webp"
title="Blueprint with correctly-named Text Block"
%}


## Pros & Cons of using `BindWidget` and C++

Why would we want to use `BindWidget` and C++ instead of just writing
all our logic in Blueprints?

<ul class="procon">
<li class="pro">Easier to maintain complex logic in C++. No spaghetti-fighting in Blueprints.</li>
<li class="pro">Easier for collaboration, no worries about locking Blueprint assets.</li>
<li class="con">Requires re-compile to see changes. This time cost can be
avoided to
some extent by using **Live Coding**.</li>
<li class="con">Harder for non-programmers to see how data is being populated as the logic is moved from Blueprints to C++.</li>
</ul>



## Optional Widgets

There are some situations where you may have a base C++ class and many
different Blueprint subclasses of it. For example a base button class could
have common logic in C++, but you could create many different Blueprint
subclasses, one for each visual style. Some visual styles might have icons,
others might have text, so it would make sense to make the text and icon image
widgets optional.

To make a widget optional use `meta=(BindWidgetOptional)`.  With this there
will be no error shown if the Blueprint class does not have a widget with that
name.

{%
include figure-begin.html
title="BindWidgetOptional example"
code="cpp"
%}
```cpp
UPROPERTY(BlueprintReadWrite, meta=(BindWidgetOptional))
TObjectPtr<UTextBlock> ButtonLabel;

UPROPERTY(BlueprintReadWrite, meta=(BindWidgetOptional))
TObjectPtr<UImage> IconImage;
```
{%
include figure-end.html
%}


## Quirks of `BindWidget`

- Compiling a Blueprint *without* a `BindWidget`-marked widget will show an
  error. However it is still possible to run your game. If you want to avoid
  crashes in this situation, you will need to check that the variable is not
  `nullptr`.
- Normally when ticking the "Is Variable" flag on a UserWidget would make it
  available in the Graph tab of the editor. However, if there is a property
  with that name, marked as `BindWidget`, the only way to make it accessible in
  the blueprint is add `BlueprintReadOnly` or
  `BlueprintReadWrite` to its `UPROPERTY()` tag.
- By default, variables defined in a parent C++ class are **only shown in the
  Variables list if "Show Inherited Variables" is checked** (see screenshot).
- Widgets marked with `BindWidget` are null in the C++ constructor, they are
  initialized later on in the lifecycle. If you need to do constructor-like
  setup use the `NativeConstruct()` function.

{%
include img.html
file="unreal/show-inherited-variables.webp"
title="Showing variables defined in a parent C++ class"
%}

## What next?

* It's also possible to [control UMG animations from C++ with
`meta=(BindWidgetAnim)`]({% link
_posts/tutorials/2017-05-21-ui-animations-from-cpp.md %})
* You can combine this with the `SynchronizeProperties` function to [create
UserWidgets whose appearance updates dynamically in the
editor]({% link _posts/tutorials/2017-05-21-ui-synchronize-properties.md %}).


