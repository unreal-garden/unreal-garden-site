---
title:  "`FUserWidgetPool`"
excerpt: ""
date:   2025-03-06 00:00:00 +0000
tags:
- cpp
- blueprint
- ui
---

`FUserWidgetPool` is a new-ish addition to Unreal, released with Unreal 5. It creates and maintains a pool of UserWidget subclasses. Why would you want to use this?


## Why use a widget pool?

- Creating new widget instances has a lot of overhead. Re-using already-created
- 


## How to use FUserWidgetPool

Your basic interface for the pool is `GetOrCreateInstance`

```cpp
// This type does not have to be UUserWidget, it can be the exact subclass of UUserWidget
TSubclassOf<UUserWidget> WidgetClass; // ... this could be set up in the header
UUserWidget* Widget = WidgetPool.GetOrCreateInstance<UUserWidget>(WidgetClass);
```

Then when you are done with the widget, return it to the pool.

```cpp
UUserWidget* Widget; // ... Imagine this is in a TArray of your active widgets or something
WidgetPool.Release(Widget);
```

## Gotchas

As the comment says in the header for `FUserWidgetPool`:

> **WARNING:** Be sure to release the pool's Slate widgets within the owning widget's `ReleaseSlateResources` call to prevent leaking due to circular references.
> Otherwise the cached references to `SObjectWidgets` will keep the `UUserWidgets` - and all that they reference - alive.

So make sure you implement the `ReleaseSlateResources` function in the owning widget and use it to call `ReleaseAllSlateResources` on the `UserWidgetPool`.


## Full Example

{%
include figure-begin.html
title="BUIAnimalCompass.h"
code="cpp"
%}
```cpp
#pragma once

#include "Blueprint/UserWidgetPool.h"
#include "Components/UserWidget.h"

#include "BUIAnimalCompass.generated.h"

class UCanvasPanel;
class UBUIAnimalCompassEntry;

/**
 * Draws icons along the top of the screen in the direction they exist in the world
 */
UCLASS(MinimalAPI, Abstract)
class UBUIAnimalCompass : public UUserWidget
{
	GENERATED_BODY()

public:
	UBUIAnimalCompass(const FObjectInitializer& Initializer);
	
	virtual void ReleaseSlateResources(bool bReleaseChildren) override;
	
protected:
	virtual void NativeConstruct() override;
	virtual void NativeTick(const FGeometry& MyGeometry, float InDeltaTime) override;
	virtual TSharedRef<SWidget> RebuildWidget() override;
	
	UPROPERTY(meta=(BindWidget))
	UCanvasPanel* AnimalItemsContentsCanvasPanel;
	
	UPROPERTY(EditAnywhere)
	TSubclassOf<UBUIAnimalCompassEntry> WidgetClass;

	UPROPERTY(EditAnywhere)
	TMap<AActor*, UBUIAnimalCompassEntry*> ActorToWidgetMap;
	
	UPROPERTY(Transient)
	FUserWidgetPool WidgetPool;
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="BUIAnimalCompass.cpp"
code="cpp"
%}
```cpp
void UBUIAnimalCompass::NativeTick(const FGeometry& MyGeometry, float InDeltaTime) override
{
    // Pseudo-code time...
    // Find all animals in the world

    // If they should be shown on-screen, create one

    WidgetPool.GetOrCreateInstance<UBUIAnimalCompassEntry>(WidgetClass);
}

void UBUIAnimalCompass::ReleaseSlateResources(bool bReleaseChildren)
{
	WidgetPool.ReleaseAllSlateResources();
	
	Super::ReleaseSlateResources(bReleaseChildren);
}
```
{%
include figure-end.html
%}