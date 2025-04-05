---
title:  "Creating a UserWidget in C++"
excerpt: "How to build user widgets base classes in C++."
date:   2017-05-21 00:00:00 +0000
last_modified_at:   2022-01-01 00:00:00 +0000
tags: 
- ui
- umg
- cpp
- blueprint
header:
  teaser: /assets/unreal/ui-cpp-uuserwidget-small.webp
  inline-image: /assets/unreal/ui-cpp-uuserwidget-inline.webp
---

In the previous tutorial I showed [how you can create a UserWidget Blueprint in the editor]({% link _posts/tutorials/2017-05-21-ui-introduction.md %}), and then [why it's a good idea to transition to a mix of C++ and Blueprints]({% link _posts/tutorials/2017-05-21-ui-cpp-basics.md %}) in our UI.

In this tutorial we will **create a new C++-based subclass of `UUserWidget`**, and
then **create a Blueprint subclass of that new C++ class**.


## Example UUserWidget Subclass

This sample is the most basic, empty "hello world" example User Widget we can
create. We will add functionality to it later.

{%
include figure-begin.html
title="ExampleWidget.h"
code="cpp"
%}
```cpp
#pragma once

#include "Blueprint/UserWidget.h"
#include "ExampleWidget.generated.h"

// We make the class abstract, as we don't want to create
// instances of this, instead we want to create instances
// of our UMG Blueprint subclass.
UCLASS(Abstract)
class UExampleWidget : public UUserWidget
{
	GENERATED_BODY()

protected:
	// Doing setup in the C++ constructor is not as
	// useful as using NativeConstruct.
	virtual void NativeConstruct() override;
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="ExampleWidget.cpp"
code="cpp"
%}
```cpp
#include "ExampleWidget.h"

void UExampleWidget::NativeConstruct()
{
	Super::NativeConstruct();

	// Here is where I typically bind delegates,
	// and set up default appearance
}
```
{%
include figure-end.html
%}

Now that you have a basic example, compile and run the editor.

We now want to create a UserWidget Blueprint class that is a subclass of our newly-created C++ class. There are two ways to do this:

* Either we **create a brand-new UserWidget**
* Or we **change the parent of an existing UserWidget**.



### Creating a new Blueprint subclass of our C++ Class

When creating a new UserWidget, instead of using the right-click "create UserWidget" shortcut, you need to use the more general "create Blueprint shortcut. Then from the list choose your newly created `ExampleWidget` as the base class.

{% include img.html file="unreal/userwidget-picker.webp"
title="Creating a new UserWidget Blueprint"
text="Under All Classes search for ExampleWidget."
%}

{%
include notice.html
type="info"
text="**Note:** The [industry-standard style
guide](https://github.com/Allar/ue5-style-guide) for Unreal Engine recommends
prefixing User Widget Blueprints with `WBP_`.
I also personally like prefixing C++ UserWidget subclasses with `UW`."
%}



## Changing the parent class of an existing Blueprint

Alternatively, we can change the parent of an existing UserWidget Blueprint. Open your Blueprint, then from the menu at the top chooose `File > Reparent Blueprint`. In the popup window choose your `ExampleWidget` class.

{%
include img.html
file="unreal/reparent-blueprint.webp"
title="Reparent an existing Blueprint"
%}


You can **see the Blueprint UserWidget's parent class in the top-right of the
editor window**. If it says ExampleWidget, you're good to go!

{%
include img.html
file="unreal/userwidget-parent-class.webp"
title="Blueprint's parent class is shown in the top-right"
%}


## Now we Have a C++ Base Class, What Next?

Now your Blueprint Widget has a custom parent C++ class, [we will have the
benefits mentioned in the previous tutorial]({{ site.baseurl
}}/unreal/ui-cpp-basics/#why-should-we-use-c), and also:

* [Control Blueprint-created Widgets from C++]({{site.baseurl}}/unreal/ui-bindwidget)
* [Dynamically update the Widget's appearance in the editor]({{site.baseurl}}/unreal/ui-synchronize-properties)



## Blueprints or C++?

After working with UMG for a year, I can safely say one of the most tricky
things to decide when you're making a game's UI, is how to mix C++ and
Blueprints in the UI.

A game's UI is usually one of the most frequently changed parts of the game.
Prototypes and mock-ups are created and thrown away almost every month, and
often it is quicker to start from scratch every time.

At first, it would seem natural to use _only Blueprints_ for your UIs. They're
much quicker to create and test, especially if your C++ build times are
particularly long.

However I found that every time I had to create a new iteration of the UI, with
a new organization of widgets, I often had to rewrite significant chunks of
Blueprint logic. I improved the situation somewhat by creating reusable utility
classes in Blueprints, but it was **still impossible to inspect data for most
variable types in Blueprints**.
 
There is a better compromise, that works quite well in my experience. It is
better to **put all the data-related logic in C++**, and the **visual logic in
Blueprints**.

Generally the data changes much less frequently than the UI visuals, and when
refactoring systems it becomes clear how your UI struct-populating C\+\+ code
needs to be refactored. Then in the Blueprint, it is a simple matter of
connecting up the struct properties to the widgets that use them.

Imagine we wanted to populate a very specific widget with a plant's name and
its icon. If the player had not discovered the plant yet, those could be
replaced in the C++ with correct "unknown plant" values.

{%
include figure-begin.html
title="ExampleWidget.h"
code="cpp"
%}
```cpp
// Only contains properties that we are *sure* are needed in the UI
USTRUCT(BlueprintType)
struct FUIPlantInfo
{
	GENERATED_BODY()

	UPROPERTY(BlueprintReadOnly, Category="Plant")
	FText ShortName;
	UPROPERTY(BlueprintReadOnly, Category="Plant")
	TObjectPtr<UTexture2D> Icon;
};

UCLASS()
class UIDataPopulator
{
	GENERATED_BODY()
public:
	// Populates a struct with all the info about the given plant.
	static void UIDataPopulator::GetPlantInfo(EPlantType Type,
		struct FUIPlantInfo& PlantInfo);
};
```
{%
include figure-end.html
%}


## Conclusion

The next tutorial in the series covers creating a [C++ subclass of
`UWidget`]({{site.baseurl}}/unreal/ui-cpp-uwidget),
which will give us the ability to make generic reusable components that do not
rely on Blueprint subclasses.
