---
title: "Why I prefer `BlueprintImplementableEvent` to `BlueprintNativeEvent`"
excerpt: "Is it a hot take? I don't know I hope not."
date:   2024-04-02 00:00:00 +0000
tags:
- cpp
---

Unreal has two `UFUNCTION()` specifiers that allow C++ to call functions whose behaviour is defined in Blueprint subclasses: [`BlueprintImplementableEvent`]({% link _pages/docs/ufunction.md %}#BlueprintImplementableEvent) and [`BlueprintNativeEvent`]({% link _pages/docs/ufunction.md %}#BlueprintNativeEvent).

At first glance they look kind of like the same thing, `BlueprintImplementableEvent` 

# The Basics

| | `BlueprintImplementableEvent` | `BlueprintNativeEvent` |
| --- | --- | --- |
| Define function behaviour in Blueprints | ✅ | ✅ |
| Define function behaviour in parent C++ | ❌ | ✅ |


{%
include figure-begin.html
title="Implementable Event"
code="cpp"
%}
```cpp
// In .h
UFUNCTION(BlueprintImplementableEvent)
void PlantFlowers(const FGameplayTag& FlowerTag, const FLinearColor& Color, int32 Count);
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="Garden_NativeEvent.h"
code="cpp"
%}
```cpp
// In .h
UFUNCTION(BlueprintNativeEvent)
void PlantFlowers(const FGameplayTag& FlowerTag, const FLinearColor& Color, int32 Count);

// In .cpp
void UGarden::PlantFlowers_Implementation(const FGameplayTag& FlowerTag, const FLinearColor& Color, int32 Count)
{

}
```
{%
include figure-end.html
%}


However there is a well-used paradigm in the engine for creating `BlueprintImplementableEvent` functions that do have a base C++ behaviour


{%
include figure-begin.html
title="Garden_NativeEvent.h"
code="cpp"
%}
```cpp
UCLASS()

vs
```cpp
// .h
UFUNCTION(BlueprintNativeEvent)
void DoSomething();

// .cpp
void UMyClass::DoSomething_Implementation()
{

}
```

### Blueprints can easily forget to call parent C++

Unless you're using [Blueprint Assist]({% link _posts/tutorials/2022-10-06-keyboard-only-blueprint-editing.md %}#blueprint-assist), overriding a `BlueprintNativeEvent` function in Blueprints does _not_ automatically add a call to the parent function.

Users have to remember to right-click the newly-created function node and click "Add Call to Parent". This is very easy to forget to do.

- Blueprint users can choose *whether* to call, and *when* to call the parent C++ function.
- Blueprint users can easily forget to call the parent C++ function
- Adding new parameters to the function requires them to be manually hooked up in every Blueprint that implements that function

### New Parameters Are Not Connected to Parent Call

Imagine you have a `BlueprintNativeEvent` function, and it's being overridden in a _lot_ of Blueprint subclasses. Imagine you want to add a new parameter to that function, and use it in your `_Implementation` C++ function. 


From a Blueprint perspective they are very similar
kkk