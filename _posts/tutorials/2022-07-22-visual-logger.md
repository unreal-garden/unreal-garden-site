---
title: "Using the Visual Logger"
excerpt: "Unreal's Visual Logger is great for debugging spatial issues."
date:   2022-08-12 00:00:00 +0000
tags:
- cpp
- debugging
header:
  inline-image: /assets/unreal/visual-logger-example.webp
  teaser: /assets/unreal/visual-logger-small.webp
---

When using Unreal Engine, there are many different ways to help you understand
what is going on in your game. To name a few:

* Log files `UE_LOG(LogMyCategory, Warning, TEXT("Watch out!"))`.
* On-screen print messages `GEngine->AddOnScreenDebugMessage`.
* On-screen text using [Gameplay
  Debugger](https://docs.unrealengine.com/5.0/en-US/using-the-gameplay-debugger-in-unreal-engine/) components.
* [`UKismetSystemLibrary::DrawDebug`](https://docs.unrealengine.com/4.27/en-US/API/Runtime/Engine/Kismet/UKismetSystemLibrary/) functions.
* Breakpoints in Blueprints and C++.
* The [Visual
  Logger](https://docs.unrealengine.com/4.27/en-US/TestingAndOptimization/VisualLogger/).

Today we will cover the Visual Logger.

## Overview

So what can the Visual Logger do?

* Draw debug shapes in space while the game is running.
* Print formatted debug text on the state of objects at a point in time (e.g.
  HP, inventory, selected AI behaviour).
* Record and move through a recorded log after gameplay has stopped, seeing how
  the state of the game changed over time.
* Save the recording to an external file, perfect for attaching to bug tickets.

Now let's compare it to other debugging related tools in Unreal:

| *System* | Text | Shapes | Written to log | View recordings | Interactive |
|:--- | --- | --- | --- | --- |
| Plain logs | ✅ | ❌ | ✅ | ❌ | ❌ |
| DrawDebug shapes | ❌ | ✅ | ❌ | ✅ | ❌ |
| Visual Logger | ✅ | ✅ | ✅ | ✅ | ❌ |
| Gameplay Debugger | ✅ | ✅ | ❌ | ❌ | ✅ |

So we can see that the Visual Logger lives up to its name: it is great for
creating a visual and spatial log of what happened during gameplay. It's
perfect for debugging things that have a spatial element; movement, collisions,
projectiles.


## Opening the Visual Logger

To open the Visual Logger window:
* Unreal 5.0 or newer: **Tools > Debug > Visual Logger**.
* Unreal 4.27 or older: **Windows > Developer Tools > Visual Logger**.

At any point, before starting your game or during, click Start to begin
recording. You may want to change Unreal's settings so that the log is cleared
every time you press Play, in that case select
**Editor Preferences > Advanced - Visual Logger > Reset Data with New Session**.
With this you do not have to start and stop the Visual Logger every time you
start or end a Play In Editor session.

The [documentation for the Visual
Logger](https://docs.unrealengine.com/4.27/en-US/TestingAndOptimization/VisualLogger/)
is great for getting started, I thoroughly recommend reading it and then coming
back here for advanced usage and tips on usage.

{%
include img.html
file="unreal/visual-logger-example.webp"
%}

## Actor Snapshot

Every time a shape, event or text is added to the visual logger for an actor,
the visual logger can also get a snapshot of any of that actor's state that we
might want to log. For example if we had an `ABUIPlant` actor, we might want to
log its `Height`, its current number of `Leaves`, so we know what was happening
to it when the log event happened.

We provide this snapshot by implementing the
`IVisualLoggerDebugSnapshotInterface` interface, which consists of a single
function `void GrabDebugSnapshot(FVisualLogEntry* Snapshot) const`.

The snapshot information is shown in the bottom-left of the Visual Logger. It's
a hierarchy of nested categories and strings.



{%
include figure-begin.html
title="BUIPlant.h"
%}
```cpp
#pragma once

#include "GameFramework/Actor.h"
#include "VisualLogger/VisualLoggerDebugSnapshotInterface.h"
#include "BUIPlant.generated.h"

UCLASS()
class ABUIPlant : public AActor, public IVisualLoggerDebugSnapshotInterface
{
	GENERATED_BODY()
	// ...
#if ENABLE_VISUAL_LOG
    virtual void GrabDebugSnapshot(FVisualLogEntry* Snapshot) const override;
#endif
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="BUIPlant.cpp"
%}
```cpp
#if ENABLE_VISUAL_LOG
void ABUIPlant::GrabDebugSnapshot(FVisualLogEntry* Snapshot) const
{
	IVisualLoggerDebugSnapshotInterface::GrabDebugSnapshot(Snapshot);
	const int32 CatIndex = Snapshot->Status.AddZeroed();
	FVisualLogStatusCategory& Category = Snapshot->Status[CatIndex];
	Category.Category = TEXT("Plant");
	Category.Add(TEXT("Height"), FString::Printf(TEXT("%4.2f"), Height));
	Category.Add(TEXT("Nutrients"), FString::Printf(TEXT("%4.2f"), Nutrients));
	Category.Add(TEXT("Leaves"), FString::Printf(TEXT("%d"), Leaves));

	Snapshot->AddText("This is some text", "Some category", ELogVerbosity::Verbose);
	Snapshot->AddText("More text", "Another category", ELogVerbosity::Warning);

	const float VisualScale = 50.0f;
	Snapshot->AddArrow(GetActorLocation(), GetActorLocation() + FVector::UpVector * Height * VisualScale, "Height",
	                   ELogVerbosity::Verbose, FColor::Green, "Plant height");

	// Subcategories are auto-closed whenever you select a new entry so they
	// kind of suck from a usability standpoint.
	FVisualLogStatusCategory SubCategory(TEXT("Sub category"));
	SubCategory.Add(TEXT("Some key"), "Some value");
	SubCategory.Add(TEXT("Another key"), "Some value");
	Category.AddChild(SubCategory);
}

```
{%
include figure-end.html
%}

### Shapes Within Snapshots

It is also possible to set up visual logger shapes from within this
`GrabDebugSnapshot` function, as well as by using `UE_VLOG`.

I think it's best to put these shape calls inside `GrabDebugSnapshot` if it's
some information that you *always* want to know about the actor.

```cpp
// These both do the same thing; draw an arrow

// Inside GrabDebugSnapshot
Snapshot->AddArrow(GetActorLocation(), GetActorLocation() + FVector::UpVector * Height, "Height", ELogVerbosity::Verbose, FColor::Green, "Plant height");

// Or inside tick or an event
UE_VLOG_ARROW(this, LogTemp, Verbose, GetActorLocation(), GetActorLocation() + FVector::UpVector * Height, FColor::Green, TEXT("Plant height"));
```


### Sub-categories

It's possible to create sub categories but they are auto-closed whenever you
select a new entry so it kind of sucks from a usability standpoint.
```cpp
FVisualLogStatusCategory Category(TEXT("Sub category"));
AnotherPlaceableCategory.Add(TEXT("Some key"), "Some value");
AnotherPlaceableCategory.Add(TEXT("Another key"), "Some value");
```

### Components

Implementing `IVisualLoggerDebugSnapshotInterface` on Actors causes them to
automatically show up in the Visual Logger, but the same is not true for
components. However I still like to implement the interface in components and
then call them in this way from the actor:

```cpp
#if ENABLE_VISUAL_LOG
void ABUIPlant::GrabDebugSnapshot(FVisualLogEntry* Snapshot) const
{
	for (UActorComponent* Comp : GetComponentsByInterface(UVisualLoggerDebugSnapshotInterface::StaticClass()))
	{
		IVisualLoggerDebugSnapshotInterface* Interface = Cast<IVisualLoggerDebugSnapshotInterface>(Comp);
		Interface->GrabDebugSnapshot(Snapshot);
	}
}
```

Then from within the component's `GrabDebugSnapshot` function, I can create new
categories or add information to the last-added category:

```cpp
#if ENABLE_VISUAL_LOG
void UBUIHealthComponent::GrabDebugSnapshot(FVisualLogEntry* Snapshot) const
{
	FVisualLogStatusCategory& Category = Snapshot->Status.Last();
	Category.Add(TEXT("Health"), FString::Printf(TEXT("%d/%d"), CurrentHealth, MaxHealth));
}
```

## Text

```cpp
UE_VLOG(this, LogTemp, Verbose, TEXT("Character hit zero HP"));
```

Text log entries are shown as piece of text associated with a single-frame. I would use them for making it clear when events happen if they are related to spatial logging. For example when a character hits zero HP and starts their death animation.  Use `UE_VLOG_UELOG` to also write to the regular log.

```cpp
UE_VLOG_UELOG(this, LogTemp, Verbose, TEXT("Ran out of nutrients"));
```


## Shapes

The main purpose of the visual logger is to draw 3D shapes in the world, so it
has support for a bunch of different shapes.

There's not much more to say other than check the [official
documentation](https://docs.unrealengine.com/4.27/en-US/TestingAndOptimization/VisualLogger/) for most of the functions, and check the source for _all_ of the functions.



## Events

The Visual Logger also has the concept of _Events_. They appear much as text
does, as a single-frame entry. I can't really tell how they are treated
differently to text, but they are used in a few places within the Unreal
codebase.

```cpp
DEFINE_VLOG_EVENT(EventTest, All, "Simple event for vlog tests")

const FName EventTag1 = TEXT("ATLAS_C_0");
const FName EventTag2 = TEXT("ATLAS_C_1");

UE_VLOG_EVENT_WITH_DATA(World, EventTest, EventTag1, EventTag2);
```



## Histogram

The visual logger can also display two-dimensional charts that they call
histograms. They are displayed in full-screen and seem to be useful for showing
2D data that changes over time. The graph seems to scale itself to fit all the
data for that frame. I can't think of any particularly common use-cases 

```cpp
UE_VLOG_HISTOGRAM(GetOwner(), LogTemp, Verbose, "Location", "Some 2D info", FVector2D(20, 30));
```

Interestingly the Gameplay Abilities System has a call to it for visualizing
attributes changing over time.


{% comment %}

## Extensions

Check out uses of `FVisualLogExtensionInterface` in the Unreal Engine codebase.
I haven't used it yet, but it looks like there is a 

```cpp
class FVisualLogExtensionInterface
{
public:
	virtual ~FVisualLogExtensionInterface() { }

	virtual void ResetData(IVisualLoggerEditorInterface* EdInterface) = 0;
	virtual void DrawData(IVisualLoggerEditorInterface* EdInterface, UCanvas* Canvas) = 0;

	virtual void OnItemsSelectionChanged(IVisualLoggerEditorInterface* EdInterface) {};
	virtual void OnLogLineSelectionChanged(IVisualLoggerEditorInterface* EdInterface, TSharedPtr<struct FLogEntryItem> SelectedItem, int64 UserData) {};
	virtual void OnScrubPositionChanged(IVisualLoggerEditorInterface* EdInterface, float NewScrubPosition, bool bScrubbing) {}
};
```

There's a way to save custom data to a data field

There is a great example in the AIModule to learn from

```cpp
FVisualLogDataBlock& FVisualLogEntry::AddDataBlock(const FString& TagName, const TArray<uint8>& BlobDataArray, const FName& CategoryName, ELogVerbosity::Type Verbosity)
```

Then create a custom extension to 





Register the module as part of your startup

```cpp
#if WITH_EDITOR && ENABLE_VISUAL_LOG
	FVisualLogger::Get().RegisterExtension(*EVisLogTags::TAG_EQS, &VisualLoggerExtension);
#endif
```


Lets you draw to a `UCanvas` instance
{% endcomment %}

## Conclusion

From what I've heard from people at Epic the future of the Visual Logger is a little in question, but I've
found it incredibly useful for debugging collisions, movement and AI.

For a point of comparison, the [Gameplay Debugger](https://docs.unrealengine.com/5.0/en-US/using-the-gameplay-debugger-in-unreal-engine/)
is under more active development and is more suited for multiplayer and
realtime interactive debugging.

