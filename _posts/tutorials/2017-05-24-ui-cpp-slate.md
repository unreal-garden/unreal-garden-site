---
title:  "Unreal UIs and C++: Slate"
excerpt: "After you have mastered UserWidgets and UMG, let's get down to the nitty-gritty."
date:   2017-05-24 00:00:00 +0000
tags:
- ui
- cpp
- slate
---

This is the final part of a mini-series on creating UIs in Unreal using UMG and Slate.
Previously we discussed [creating C++-based UserWidgets]({{site.baseurl}}/unreal/ui-cpp-uuserwidget) and [creating new UMG classes]({{site.baseurl}}/unreal/ui-cpp-uwidget).

Once again we will be implementing a simple button that contains an image and text, but this time we will see how to achieve the same result from Slate.

**Note:** This article links to the Epic Games Unreal Engine GitHub account for examples, to access it you will need to request permission.

## Introduction

Slate is a UI framework that pre-dates UMG and Blueprints in Unreal. The Unreal editor itself is written using Slate.

## When to use Slate, when to use UMG?

Some reasons for using Slate: 

* Creating Editor UI: Custom asset inspectors, windows and other visual tools used to have to be implemented using Slate. As of 4.22, [Editor Utility Widgets](https://docs.unrealengine.com/en-US/InteractiveExperiences/UMG/UserGuide/EditorUtilityWidgets/index.html) can be written using UMG+Blueprints, but as far as I know, asset inspectors must still be written in Slate.
* Need to implement low-level functionality that is not supported by any existing widgets. For example some complex graph-drawing might be better written in Slate than UMG C++.

It can be used to define UI layout in a somewhat unusual declarative syntax. Here's how we could declare a Button with an icon and text side-by-side:

```cpp
SNew(SButton)
+ SButton::Slot()
[
	SNew(SHorizontalBox)
	+ SHorizontalBox::Slot()
		.VAlign(VAlign_Center)
		.HAlign(HAlign_Center)
	[
		SNew(SImage)
			.Image(MyIconBrush)
	]
	+ SHorizontalBox::Slot()
		.VAlign(VAlign_Center)
		.HAlign(HAlign_Fill)
	[
		SNew(STextBlock)
			.Text(FText::FromString("Click me!"))
	]
]
```

Hopefully your experience with creating UIs in the Blueprint editor and with UMG in C++ should make some of this familiar.

* `SButton` is the Slate button class
* `SButton::Slot()` has properites the same as those you see in the Slot section of a Button` in the Blueprint editor.
* `SHorizontalBox` is the Slate equivalent of UMG's `UHorizontalBox`.

In fact, `SButton` is not the equivalent of `UButton`, [`UButton`](https://github.com/EpicGames/UnrealEngine/blob/release/Engine/Source/Runtime/UMG/Public/Components/Button.h) is a wrapper around `SButton`!

```cpp
class UButton : public UVisual
{
// ...
	/** Cached pointer to the underlying slate
	    button owned by this UWidget */
	TSharedPtr<SButton> MyButton;
};
```



## Extending an Existing Slate Widget

I have found the easiest thing to do at first when learning Slate is to duplicate and extend an existing widget. For example let's create a SImage that supports multiple images, drawn on top of each other.

Find `SImage` in the Unreal source code, and give it a read over.

Key functions:

* [`Construct`](https://github.com/EpicGames/UnrealEngine/blob/2bf1a5b83a7076a0fd275887b373f8ec9e99d431/Engine/Source/Runtime/SlateCore/Private/Widgets/Images/SImage.cpp#L10) is how the Slate widget is set up.
* [`SLATE_BEGIN_ARGS`](https://github.com/EpicGames/UnrealEngine/blob/2bf1a5b83a7076a0fd275887b373f8ec9e99d431/Engine/Source/Runtime/SlateCore/Public/Widgets/Images/SImage.h#L24) in `SImage.h` is where the arguments allowed by the widget are defined
* [`OnPaint`](https://github.com/EpicGames/UnrealEngine/blob/2bf1a5b83a7076a0fd275887b373f8ec9e99d431/Engine/Source/Runtime/SlateCore/Private/Widgets/Images/SImage.cpp#L18) is where the widget defines how it is rendered.

Note: Make sure that you add `Slate` to your project's dependencies in its `Build.cs` file.

## Creating a Slate Widget from Scratch

Hopefully extending an existing class should have given you a feel for Slate. Now it's time to create a new Slate widget from scratch.

You have a few choices for what to subclass:
* `SCompoundWidget` --- this is one of the [most commonly-used](https://docs.unrealengine.com/en-US/API/Runtime/SlateCore/Widgets/SCompoundWidget/index.html) parent Slate classes.
* `SLeafWidget`
* `SPanel`


### ExampleSlate.h

```cpp
#pragma once


class SExampleSlate : public SCompoundWidget
{
	SLATE_BEGIN_ARGS(SExampleSlate){}

	// See private declaration of OwnerHUD below.
	SLATE_ARGUMENT(TWeakObjectPtr<class AHUD>, OwnerHUD)
 
	SLATE_END_ARGS()
 
public:
  // Required
	void Construct(const FArguments& InArgs);

	// Begin SWidget interface
	void OnArrangeChildren(const FGeometry& AllottedGeometry, FArrangedChildren& ArrangedChildren) const override;
	virtual FReply OnMouseMove(const FGeometry& MyGeometry, const FPointerEvent& MouseEvent) override;
	virtual void Tick(const FGeometry& AllottedGeometry, const double InCurrentTime, const float InDeltaTime) override;
	// End SWidget interface

 
private:
	TWeakObjectPtr<class AHUD> OwnerHUD;
};
```

### ExampleSlate.cpp


In this example there isn't a lot of benefit from implementing the same
behaviour in Slate over UMG. However for original, more complicated behaviour
that cannot be broken down into pre-existing Slate widgets, creating a new
Slate widget is your only option.






