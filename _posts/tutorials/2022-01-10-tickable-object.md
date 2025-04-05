---
title: "How to make a Tickable Object"
excerpt: "Tick any object you want, UObject or not!"
date:   2022-01-10 00:00:00 +0000
tags:
- cpp
- ui
toc: false
classes: wide
header:
  inline-image: /assets/unreal/tickable-transparent.webp
  teaser: /assets/unreal/tickable-object-small.webp
---

By default, some objects in Unreal are tickable and some are not. `UUserWidget`
has a `NativeTick` function, but a lot of other `UWidget` subclasses are not.
Similarly when implementing [Subsystem singletons]({% link _posts/tutorials/2020-12-31-subsystem-singleton.md %}) I often want to make them tickable.

Making something tickable is a lot easier than I first thought. If your class
implements the `FTickableGameObject` interface it will automatically be ticked!
It does not have to be a subclass of `UObject`, it can just be a regular `struct`
or `class`.

This sample code should be all you need to get started:

{%
include figure-begin.html
title="MyTickableThing.h"
%}
```cpp
#pragma once

#include "Tickable.h"

class FMyTickableThing : public FTickableGameObject
{
public:
	// FTickableGameObject Begin
	virtual void Tick(float DeltaTime) override;
	virtual ETickableTickType GetTickableTickType() const override
	{
		return ETickableTickType::Always;
	}
	virtual TStatId GetStatId() const override
	{
		RETURN_QUICK_DECLARE_CYCLE_STAT(FMyTickableThing, STATGROUP_Tickables);
	}
	virtual bool IsTickableWhenPaused() const
	{
		return true;
	}
	virtual bool IsTickableInEditor() const
	{
		return false;
	}
	// FTickableGameObject End


private:
	// The last frame number we were ticked.
	// We don't want to tick multiple times per frame 
	uint32 LastFrameNumberWeTicked = INDEX_NONE;
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="MyTickableThing.cpp"
%}
```cpp
#include "MyTickableThing.h"

void FMyTickableThing::Tick(float DeltaTime)
{
	if (LastFrameNumberWeTicked == GFrameCounter)
		return;

	// Do our tick
	// ...

	LastFrameNumberWeTicked = GFrameCounter;
}
```
{%
include figure-end.html
%}



