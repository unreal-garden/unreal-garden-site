---
title: "Coding Standards I use in 2024"
excerpt: "Looking back at old code and thinking 'ew who wrote this' and then 'oh, that was me'"
date:   2024-04-02 00:00:00 +0000
tags:
- cpp
- tip
---

I have changed a bunch of my coding standards over the years. The most
important thing is usually to follow whatever your company does. That being
said, these are some things that I have grown to adopt.

All of these are suggestions, things to try out. I'm describing things that work
for me, not telling you how you "must" do things.

## Includes

### Include What You Use

Unreal Engine moved to Include What You Use (shortened to "IWYU") at least
a while ago. At first I wasn't really sure what it meant in concrete terms.

For me I understand it to mean **only include headers where you absolutely have to**.

1. Don't `#include "CoreMinimal.h"`
2. Forward declare whereever possible

### Forward Declare

Forward declaration is well discussed online but the TL;DR version is:
- You can forward declare something when C++ doesn't need to know the size of it in memory

{%
include figure-begin.html
title="Example.h"
code="cpp"
%}
```cpp
enum class EDogState : uint8;
class UDog;
struct FDogInfo;

// Later in file
void RegisterDog(UDog* Dog);
void SetupDog(const FDogInfo& DogInfo);
void SetDogState(EDogState DogState);
```
{%
include figure-end.html
%}


### Sort Includes

Sort your `#include` statements alphabetically. It makes it way less likely
that merge conflicts will happen, and way easier to fix them if they do.

### Forward declare, don't inline declare

I used to get lazy and put `class` directly in front of where I was using the
class in the header file. This gets really noisy really fast. Rider will
automatically add the forward declare for you in the right place so there's not
much excuse not to do it.

{%
include figure-begin.html
title="Inline forward declaration"
description="Not great."
code="cpp"
%}
```cpp
UCLASS()
class ADog : public AActor
{
	GENERATED_BODY()

	UPROPERTY()
	TObjectPtr<class UWoofComponent> WoofComponent;
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title=""
description=""
code="cpp"
%}
```cpp
class UWoofComponent;

UCLASS()
class ADog : public AActor
{
	GENERATED_BODY()

	UPROPERTY()
	TObjectPtr<UWoofComponent> WoofComponent;
};
```
{%
include figure-end.html
%}


### Use `TObjectPtr<T>`

This was released with Unreal Engine 5 if I remember correctly.

{%
include figure-begin.html
title="TObjectPtr is the new hotness"
code="cpp"
%}
```cpp
// Old raw pointer
UPROPERTY()
ADog* Dog;

// New TObjectPtr<T>
UPROPERTY()
TObjectPtr<ADog> Dog;
```
{%
include figure-end.html
%}

## Code Style

### Inline assignment

Like all of the suggesions here this is purely subjective but I've gotten used
to it and kind of like it.

{%
include figure-begin.html
title="How I used to write code"
code="cpp"
%}
```cpp
UFlower* Flower = Garden->FindFlower(FlowerType);
if (Flower)
{
	// Do stuff with flower
}
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="Preferred"
code="cpp"
%}
```cpp
if (UFlower* Flower = Garden->FindFlower(FlowerType))
{
	// Do stuff with flower
}
```
{%
include figure-end.html
%}

### Don't Export Everything

In a lot of my earlier code I used code generators or copied tutorials online and ended up adding the API macros at the start of my header `MYPROJECT_API` Instead, **only export the symbols (functions) that other modules need**.

The table below illustrates different macros in increasing order of how much gets exported.

| 1. | Nothing                               | Nothing is exported, neither the class nor its functions will be usable in other modules |
| 2. | `UCLASS(MinimalAPI)`                  | It is possible to use `Cast<T>` on instances of this class in other modules.             |
| 3. | `MYPROJECT_API` on specific functions | Only functions marked with the macro will be callable in other modules.                  |
| 4. | `MYPROJECT_API` on class              | All functions are exported. |


{%
include figure-begin.html
title="1. Export Nothing"
code="cpp"
%}
```cpp
// ADog cannot be used outside the current module
UCLASS()
class ADog : public AActor
{
	GENERATED_BODY()

	void Woof();
	void RollOver();
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="2. MinimalAPI"
code="cpp"
%}
```cpp
// Outside of the current module, ADog can be cast to
UCLASS(MinimalAPI)
class ADog : public AActor
{
	GENERATED_BODY()

	void Woof();
	void RollOver();
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="3. Export Specific Functions"
code="cpp"
%}
```cpp
// ADog's Woof function can be used, that's it
UCLASS()
class ADog : public AActor
{
	GENERATED_BODY()

	MYPROJECT_API void Woof();
	void RollOver();
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="4. Export Everything"
code="cpp"
%}
```cpp
// ADog and all its functions can be used in any other module.
UCLASS()
class MYPROJECT_API ADog : public AActor
{
	GENERATED_BODY()

	void Woof();
	void RollOver();
};
```
{%
include figure-end.html
%}



### Only use dynamic delegates where needed

I used to make all my delegates Dynamic delegates.  Now I think about whether
it needs to be exposed to Blueprints or not. There's not a huge overhead in
making things dynamic but it's just a case of keeping things simple.


## Avoiding Crashes

"Crash early" and not hiding errors is a great idea if your game and your editor
are not one and the same. Having to re-launch the editor every time that the
game crashes will waste time for your entire team, so avoiding crashing is
extremely important.


### `IsValidIndex` before accessing `TArray<T>`

Even if you think your math is valid, I would seriously recommend wrapping all
your calls to `TArray<T>` elements with a call to `IsValidIndex`. There's
nothing worse than a game breaking crash on a build that took hours and hours
to create.

{%
include figure-begin.html
title="Accessing an array element without checking"
code="cpp"
%}
```cpp
const int32 Index = ResultOfCalculation();
// If your math is wrong, crash and burn
SomeArray[Index].RiskyBusiness = 1;
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="Using IsValidIndex before accessing"
code="cpp"
%}
```cpp
const int32 Index = ResultOfCalculation();
if (SomeArray.IsValidIndex(Index))
{
	SomeArray[Index].DoSomething;
}
```
{%
include figure-end.html
%}



## Other stuff

### Log Until It Gets Annoying

Adding `UE_LOG` stuff everywhere seems kind of overkill, until you get
situations where having a log would have saved you hours of debugging and
reproducing the error.

If it's a function that's called every couple of frames, or is very real-time
and spatial in nature, consider using the [Visual Logger]({% link
_posts/tutorials/2022-07-22-visual-logger.md %}).

For all other situations, seriously consider logging as much as you can.
Especially in situations where a bunch of information is considered to make a
decision. See the example below for a

{%
include figure-begin.html
title="Log everything"
code="cpp"
%}
```cpp
// Do we let the player buy the item from the store?
const int32 ItemCost = // ...
const int32 GoldInInventory = // ...
const int32 ItemSlotSize = // ...
const int32 InventorySpace = // ...
const FGameplayTagContainer ShopkeeperTags = // ... maybe there's some other stuff we care about
UE_LOG(LogShopUI, Display, TEXT("Trying to buy an item... Cost: %d, Gold in inventory: %d, Item slot size: %d, ... (You get the idea)"), ItemCost, GoldInInventory, ItemSlotSize);
if (/* a bunch of complicated boolean */)
{
	UE_LOG(LogShopUI, Display, TEXT("We bought the item!"));
}
```
{%
include figure-end.html
%}

