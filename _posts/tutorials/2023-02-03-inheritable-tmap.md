---
title:  "Inheritable TMap"
excerpt: "Make sure changes made in the parent are propagated to children."
date:   2023-02-03 00:00:00 +0000
tags:
- cpp
---



Imagine you're building an RPG and you want to define stats for different enemy
types like wolves and spiders. You could do this with hierarchical data
like this:

```
UEnemyDataAsset
 - BP_EnemyBase       // Blueprint subclass
   - BP_WolfBase      // Blueprint subclass
   - BP_SpiderBase
```

You could define the stats for each enemy type with a simple
`TMap<FGameplayTag, int32>` and then override the values in child classes.

```
BP_EnemyBase
  TMap<FGameplayTag, int32> Stats
    hp     = 10
    legs   = 2

BP_WolfBase:
  TMap<FGameplayTag, int32> Stats (Modified)
    hp     = 8
    legs   = 4

BP_SpiderBase:
  TMap<FGameplayTag, int32> Stats (Modified)
    hp     = 4
    legs   = 8
```

## The Problem

Notice in the example above that the `stats` variable has been marked as
modified in `BP_WolfBase` and `BP_SpiderBase`, because we changed the number of
legs and hp. Once you have changed the TMap in a child class, **any changes
made to the parent will no longer be reflected in the child!**

Look what happens if we add a new `vision` property to the `BP_EnemyBase`, the
property does not appear either child Blueprint.

```
BP_EnemyBase
  TMap<FGameplayTag, int32> Stats
    hp     = 10
    legs   = 2
    vision = 5  // NEW!

BP_WolfBase:
  TMap<FGameplayTag, int32> Stats (Modified)
    hp    = 8
    legs  = 4
               // <= No vision!

BP_SpiderBase:
  TMap<FGameplayTag, int32> Stats (Modified)
    hp    = 4
    legs  = 8
               // <= No vision!
```

## Solution

How can we make a data structure that lets us:
1. Inherit stats defined in the parent.
2. Override stats in child classes.
3. Allow changes made in the parent to be reflected in children.

### Inherited Map

Huge thanks to [Bohdon Sayre](https://twitter.com/bohdon) for this one. After
describing my problem he said that `FInheritedTagContainer` in the
GameplayAbilities module had a solution for this.

The engine example is a bit more complicated for adding and removing tags, this
just allows you to override values and *not* remove any tags added by the
parent. It also works with Data Assets, not just Blueprint subclasses.

{%
include figure-begin.html
title="InheritedMap.h"
code="cpp"
%}
```cpp
#pragma once

#include "InheritedMap.generated.h"

USTRUCT(BlueprintType)
struct FInheritedMap
{
	GENERATED_BODY()

public:
	// Read-only shows the combined attributes of all parent(s)
	UPROPERTY(VisibleAnywhere, Transient, meta=(ForceInlineRow))
	TMap<FGameplayTag, int32> Combined;

	// Any overrides we wantAttributes to create for this instance
	UPROPERTY(EditDefaultsOnly, Transient, meta=(ForceInlineRow))
	TMap<FGameplayTag, int32> Overridden;

	void UpdateInherited(const FInheritedMap* Parent);
	void PostInitProperties();
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="InheritedMap.cpp"
code="cpp"
%}
```cpp
#include "InheritedMap.h"

void FInheritedMap::UpdateInherited(const FInheritedMap* Parent)
{
	// Make sure we've got a fresh start
	Combined.Reset();

	if (Parent)
	{
		for (auto Itr = Parent->Combined.CreateConstIterator(); Itr; ++Itr)
		{
			Combined.Add(*Itr);
		}
	}

	for (auto Itr = Overridden.CreateConstIterator(); Itr; ++Itr)
	{
		// Remove trumps add for explicit matches but not for parent tags.
		// This lets us remove all inherited tags starting with Foo but still add Foo.Bar
		Combined.Add(*Itr);
	}
}

void FInheritedMap::PostInitProperties()
{
	// We shouldn't inherit the added and removed tags from our parents
	// make sure that these fields are clear
	Overridden.Reset();
}
```
{%
include figure-end.html
%}


### Example Usage


{%
include figure-begin.html
title="EnemyDataAsset.h"
code="cpp"
%}
```cpp
#pragma once

#include "Engine/DataAsset.h"
#include "InheritedMap.h"
#include "EnemyDataAsset.generated.h"

UCLASS()
class UEnemyDataAsset : public UDataAsset
{
	GENERATED_BODY()

public:
	virtual void PostLoad() override;
	virtual void PostInitProperties() override;

#if WITH_EDITOR
	virtual void PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent) override;
#endif

protected:
	UPROPERTY(EditDefaultsOnly, Category="Stats", meta=(ShowOnlyInnerProperties))
	FInheritedMap Stats;

	UEnemyDataAsset* GetInheritedParent() const;
};

```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="EnemyDataAsset.cpp"
code="cpp"
%}
```cpp
#include "EnemyDataAsset.h"

void UEnemyDataAsset::PostLoad()
{
	Super::PostLoad();

	const UEnemyDataAsset* Parent = GetInheritedParent();
	Stats.UpdateInherited(Parent ? &Parent->Stats : nullptr);
}

void UEnemyDataAsset::PostInitProperties()
{
	Super::PostInitProperties();

	Stats.PostInitProperties();
}

#if WITH_EDITOR
void UEnemyDataAsset::PostEditChangeProperty(FPropertyChangedEvent& PropertyChangedEvent)
{
	Super::PostEditChangeProperty(PropertyChangedEvent);

	const FProperty* PropertyThatChanged = PropertyChangedEvent.MemberProperty;
	if (PropertyThatChanged)
	{
		if (PropertyThatChanged->GetFName() == GET_MEMBER_NAME_CHECKED(UEnemyDataAsset, Stats))
		{
			const UEnemyDataAsset* Parent = GetInheritedParent();
			Stats.UpdateInherited(Parent ? &Parent->Stats : nullptr);
		}
	}
}
#endif

UEnemyDataAsset* UEnemyDataAsset::GetInheritedParent() const
{
	UEnemyDataAsset* Parent = nullptr;
	if (HasAnyFlags(RF_ClassDefaultObject))
	{
		Parent = Cast<UEnemyDataAsset>(GetClass()->GetSuperClass()->GetDefaultObject());
	}
	else
	{
		// It's a data asset
		Parent = Cast<UEnemyDataAsset>(GetClass()->GetDefaultObject());
	}
	return Parent;
}
```
{%
include figure-end.html
%}


