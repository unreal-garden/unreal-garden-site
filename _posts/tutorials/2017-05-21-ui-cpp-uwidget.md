---
title:  "Creating new UWidgets in C++"
excerpt: "Create your own custom re-usable widgets in pure C++. No Blueprints
required!"
date:   2017-05-21 00:00:00 +0000
ue_versions: [ 4.25 ]
toc: false
classes: wide
tags:
- ui
- cpp
---

Create an UMG Widget, or subclass an existing UMG widget

In the previous tutorial we covered creating a C++ subclass of
`UUserWidget`.

The alternative to this is to create a C++ subclass of an existing 


Good for creating new compound widgets that you want to re-use everywhere

e.g. a button with an icon and text

`RebuildWidget()` is where you set up stuff

Look at existing widgets to see how they work

We can see inside the `RebuildWidget()` function for `UButton`
It creates a new instance of the Slate class `SButton`.

{%
include figure-begin.html
code="cpp"
%}
```cpp
TSharedRef<SWidget> UButton::RebuildWidget()
{
	MyButton = SNew(SButton)
		.OnClicked(BIND_UOBJECT_DELEGATE(FOnClicked,
			SlateHandleClicked))
		.OnPressed(BIND_UOBJECT_DELEGATE(FSimpleDelegate,
			SlateHandlePressed))
		.OnReleased(BIND_UOBJECT_DELEGATE(FSimpleDelegate,
			SlateHandleReleased))
		.OnHovered_UObject(this, &ThisClass::SlateHandleHovered)
		.OnUnhovered_UObject(this, &ThisClass::SlateHandleUnhovered)
		.ButtonStyle(&WidgetStyle)
		.ClickMethod(ClickMethod)
		.TouchMethod(TouchMethod)
		.IsFocusable(IsFocusable)
		;

	if (GetChildrenCount() > 0)
	{
		Cast<UButtonSlot>(GetContentSlot())
			->BuildSlot(MyButton.ToSharedRef());
	}
	
	return MyButton.ToSharedRef();
}
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="ExampleOverlay.h"
code="cpp"
%}
```cpp
UCLASS()
class UExampleOverlay : public UOverlay
{
	GENERATED_BODY()
public:

#if WITH_EDITOR
	virtual const FText GetPaletteCategory() override;
#endif

protected:
	// UWidget interface
	virtual TSharedRef<SWidget> RebuildWidget() override;
	// End of UWidget interface
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="ExampleOverlay.cpp"
code="cpp"
%}
```cpp
#define LOCTEXT_NAMESPACE "ExampleUMG"

TSharedRef<SWidget> UExampleOverlay::RebuildWidget()
{
	auto Result = Super::RebuildWidget();

	for (UPanelSlot* InSlot : Slots)
	{
		// Do something custom
	}

	return Result;
}

#if WITH_EDITOR
const FText UExampleOverlay::GetPaletteCategory()
{
	return LOCTEXT("ExampleUI", "ExampleOverlay");
}
#endif
```
{%
include figure-end.html
%}


In the next and final tutorial of the series, we will discuss [how to create
subclasses of Slate widgets]({{site.baseurl}}/unreal/ui-cpp-slate).

