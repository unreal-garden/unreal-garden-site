---
title:  "Controlling UMG Animations from C++"
excerpt: "How to call UMG animations defined in Blueprints from C++."
date:   2017-05-21 00:00:00 +0000
last_modified_at:   2021-07-20 00:00:00 +0000
tags:
- ui
- umg
- animation
- cpp
- blueprint
---

It's often pretty useful to be able to access UMG-created animations from C++.
Especially as you move more and more logic from Blueprints into C++, UMG
animations can seem like the last hold-out.


## New Method

**UPDATE:** The method I described in an old version of this tutorial is now
not needed! There is now a `meta` property that does all the work for us!

`BindWidget` and `BindWidgetOptional` are undocumented `meta` properties that
we can use to access our animations from C++.

Add variables to the header of your Blueprint's parent C++ class, as shown in
the code below.

{%
include figure-begin.html
title="BUIUWWindow.h"
code="cpp"
%}
```cpp
UPROPERTY(Transient, meta=(BindWidgetAnim))
TObjectPtr<UWidgetAnimation> RevealWindow;

UPROPERTY(Transient, meta=(BindWidgetAnim))
TObjectPtr<UWidgetAnimation> HideWindow;
```
{%
include figure-end.html
%}

This works in very much the same way as the [`BindWidget` meta property]({%
link _posts/tutorials/2017-06-05-ui-bindwidget.md %}) that we can use to hook up
C++ to Blueprint widgets.

As of Unreal Engine 5.0 you must mark your properties as `Transient`.


## Old Method

**NOTE:** This method is deprecated, you just need to do the `BindWidget`
method above instead!

With a [custom subclass of
`UUserWidget`]({% link _posts/tutorials/2017-05-21-ui-cpp-uuserwidget.md %}), we can create a map of `FName` to
`UWidgetAnimation*` and access the animations by name from C++.

Let's see how to do this:


{%
include figure-begin.html
title="CustomUserWidget.h"
code="cpp"
%}
```cpp
#pragma once

#include "CustomUserWidget.generated.h"

UCLASS(Abstract)
class UCustomUserWidget : public UUserWidget
{
	GENERATED_BODY()

public:
	virtual void NativeConstruct() override;

	UWidgetAnimation* GetAnimationByName(FName AnimationName) const;

	bool PlayAnimationByName(FName AnimationName,
		float StartAtTime,
		int32 NumLoopsToPlay,
		EUMGSequencePlayMode::Type PlayMode,
		float PlaybackSpeed);

protected:
	TMap<FName, UWidgetAnimation*> AnimationsMap;

	void FillAnimationsMap();

};
```
{%
include figure-end.html
%}

**Notes:**

* Our `PlayAnimationByName` isn't entirely needed, but it can be a helpful wrapper
  for the regular `PlayAnimation` function


{%
include figure-begin.html
title="CustomUserWidget.cpp"
code="cpp"
%}

```cpp
#include "CustomUserWidget.h"

void UCustomUserWidget::NativeConstruct()
{
	FillAnimationsMap();

	// Call Blueprint Event Construct node
	Super::NativeConstruct();
}

void UCustomUserWidget::FillAnimationsMap()
{
	AnimationsMap.Empty();
	
	UProperty* Prop = GetClass()->PropertyLink;

	// Run through all properties of this class to find any widget animations
	while (Prop != nullptr)
	{
		// Only interested in object properties
		if (Prop->GetClass() == UObjectProperty::StaticClass())
		{
			UObjectProperty* ObjProp = Cast<UObjectProperty>(Prop);

			// Only want the properties that are widget animations
			if (ObjProp->PropertyClass == UWidgetAnimation::StaticClass())
			{
				UObject* Obj = ObjProp->GetObjectPropertyValue_InContainer(this);

				UWidgetAnimation* WidgetAnim = Cast<UWidgetAnimation>(Obj);

				if (WidgetAnim != nullptr && WidgetAnim->MovieScene != nullptr)
				{
					FName AnimName = WidgetAnim->MovieScene->GetFName();
					AnimationsMap.Add(AnimName, WidgetAnim);
				}
			}
		}

		Prop = Prop->PropertyLinkNext;
	}

UWidgetAnimation* UCustomUserWidget::GetAnimationByName(FName AnimationName) const
{
	UWidgetAnimation* const* WidgetAnim = AnimationsMap.Find(AnimationName);
	if (WidgetAnim)
	{
		return *WidgetAnim;
	}
	return nullptr;
}


bool UCustomUserWidget::PlayAnimationByName(FName AnimationName,
	float StartAtTime,
	int32 NumLoopsToPlay,
	EUMGSequencePlayMode::Type PlayMode,
	float PlaybackSpeed)
{
	UWidgetAnimation* WidgetAnim = GetAnimationByName(AnimationName);
	if (WidgetAnim)
	{
		PlayAnimation(WidgetAnim, StartAtTime, NumLoopsToPlay, PlayMode, PlaybackSpeed);
		return true;
	}
	return false;
}
```
{%
include figure-end.html
%}

