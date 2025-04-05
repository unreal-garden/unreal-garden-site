---
title:  "Updating UserWidgets in the Editor"
excerpt: "Using SynchronizeProperties() to show changes to Blueprint properties in the editor."
date:   2017-06-07 00:00:00 +0000
tags:
- ui
- umg
- cpp
header:
  teaser: /assets/unreal/ui-synchronize-properties-title-small.webp
---


When creating more and more complex and flexible UserWidget Blueprints in
Unreal, one problem is that their appearance in the editor can be very
different to their final appearance in-game.

## Inventory Panel Example

Imagine for example that you want to create a generic inventory display widget.
Something we can use throughout our UI, wherever we need to show the contents
of something.

* A *title*, describing the category of items being shown
* A grid of *X columns* by *Y rows*.
* A `UserWidget` to represent a single item, that we will show in our grid.

By default if you create this as a `UUserWidget` subclass in Blueprints,
in the editor this could look like an empty widget,
with the label showing its default placeholder text.

Notice we could add a public variable to define the title, number of rows and
number of columns that the widget will be set up with in-game, but the
appearance in-editor will be nearly empty.

On the other hand in-game, the size and appearance of this widget will change
completely. Its label will be updated, and it will be filled by inventory item
widgets for displaying each item.

We can solve this with C++, and **let the widget update in the editor**. The
key to this is the `SynchronizeProperties` function in `UUserWidget`. In the
editor it is called every time that a property is modified or the Blueprint is
compiled.  We can override it and inside use it to initialize our user widget
in the same way it will be set up in-game.

{%
include figure-begin.html
title="Inventor PanelWidget.h"
code="cpp"
%}
```cpp
#pragma once

#include "InventoryPanelWidget.generated.h"

UCLASS(Blueprintable, Abstract)
class UInventoryPanelWidget : public UUserWidget
{
	GENERATED_BODY()

public:
	virtual void SynchronizeProperties() override;

	UPROPERTY(EditAnywhere, Category = "Inventory Panel")
	FText LabelText;

	UPROPERTY(EditAnywhere, Category = "Inventory Panel")
	TSubclassOf<UUserWidget> ItemWidgetClass = nullptr;

	UPROPERTY(EditAnywhere, Category = "Inventory Panel")
	int32 Columns = 4;

	UPROPERTY(EditAnywhere, Category = "Inventory Panel")
	int32 Rows = 3;

	UPROPERTY(BlueprintReadOnly, Category = "Inventory Panel", meta=(BindWidget))
	TObjectPtr<UTextBlock> Label;

	UPROPERTY(BlueprintReadOnly, Category = "Inventory Panel", meta=(BindWidget))
	TObjectPtr<UUniformGrid> Grid;

};
```
{%
include figure-end.html
%}

**Notes:**

* Our properties are marked as `EditAnywhere`, allowing us to set up defaults
  in the Blueprint class definition, and then override them in instances of the
  UserWidget.
* We made the `LabelText` variable `FText` and not `FString` or `FName`. This is because we want our text
  to be localizable. See the page on [Unreal UIs and
  Localization]({% link _posts/tutorials/2017-05-21-ui-localization.md %}) for more information.
* We use the `BindWidget` meta property to let us access the widgets we will
  create in our Blueprint subclass. This is explained in [Connecting C++ to UMG Blueprints with BindWidget]({% link _posts/tutorials/2017-06-05-ui-bindwidget.md %})


{%
include figure-begin.html
title="InventoryPanelWidget.cpp"
code="cpp"
%}
```cpp
#include "InventoryPanelWidget.h"

// This is called every time that the widget is compiled,
// or a property is changed.
void UInventoryPanelWidget::SynchronizeProperties()
{
	Super::SynchronizeProperties();

	// When first creating a Blueprint subclass of this class,
	// the widgets won't exist, so we must null check.
	if (Label)
	{
		Label->SetText(LabelText);
	}


	// Again, null checks are required
	if (Grid && ItemWidgetClass)
	{
		Grid->ClearChildren();

		for (int32 y = 0; y < Rows; ++y)
		{
			for (int32 x = 0; x < Columns; ++x)
			{
				UUserWidget* Widget = CreateWidget<UUserWidget>(
					GetWorld(), ItemWidgetClass);
				if (Widget)
				{
					UUniformGridSlot* GridSlot = Grid->AddChildToUniformGrid(
						Widget);
					GridSlot->SetCols(x);
					GridSlot->SetRows(x);
				}
			}
		}
	}
}
```
{%
include figure-end.html
%}



With the code in-place we need to **create a Blueprint subclasses it**,
or **change our existing widget Blueprint to be a subclass of it**.

As we discussed before with the [BindWidget meta
property]({% link _posts/tutorials/2017-06-05-ui-bindwidget.md %}), in order for the properties to be
set up correctly you must create widgets with the same type and name as your
`BindWidget` properties, and mark them as Variables. You can see now why
creating C++ base classes is so useful for UI development.

You also need to create a widget Blueprint to use as your inventory item
widget. Once this is compiled you should be able to select it from the
drop-down menu next to *ItemWidgetClass*.

With this done, as you change the values of *ItemPanelWidget*, you should see
its appearance change in the editor.  Changing the text in *LabelText* should
update what is shown in the label box, and changing Rows and Columns should
change how the widgets are shown.


## Conclusion

We saw how `SynchronizeProperties` is invaluable for creating widgets that update
their appearance dynamically in the editor. This can be used to create far more
user-friendly widgets, whose in-editor appearance more closely represents how
they will be shown in-game.


## Update: Event Pre Construct

As of Unreal 4.16, it is now possible to perform some of the functionality of
`SynchronizeProperties` from Blueprints by using the new Event Pre Construct
node. This is called in both the editor and the game and lets you set up your
widget's appearance in the editor based on its settings.

However I still think in the long-term it is worth putting as much of your
logic into C++.
