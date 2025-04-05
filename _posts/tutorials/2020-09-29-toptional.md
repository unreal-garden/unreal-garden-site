---
title:  "Why `TOptional<T>` is my new favourite tool"
excerpt: "For optional parameters, and explictly marking undefined state."
date:   2020-09-29 00:00:00 +0000
tags:
- cpp
header:
  teaser: /assets/unreal/toptional-small.webp
  inline-image: /assets/unreal/toptional-transparent.webp
---

Every so often I find a new class or function in Unreal, and I find it so
useful that I start using it everywhere. `TOptional<T>` is one such class.

## Doggy Example

Imagine we're making a pet shelter game, where players can search for dogs
that they want to rescue and give a good home.

In our example, players can set any number of search parameters of the kind of
dog they would like.

### Without `TOptional<T>`

We might start out with a search parameters struct like this:

```cpp
struct FDogSearchParams
{
	// Treat -1 as unset
	int32 MinimumAge = -1;
	int32 MaximumAge = -1;

	// Treat Magenta as unset
	FLinearColor FurColor = FLinearColor::Magenta;

	// Oh, boolean only has 2 values, what do we use for "unset"?
	bool bHasVaccinations = false;
}
```

In our search code, we could detect whether the player has specified each
parameter something like this:

```cpp
// Has the player has set a minimum age?
if (params.MinimumAge != -1 || params.MaximumAge != -1)
{
	// Filter by age
}

// Has the player chosen a color? Treat FLinearColor::Magenta as
// unset, because pink dogs don't exist
if (params.FurColor != FLinearColor::Magenta)
{
	// Filter by fur color
}

// Oh true/false could both be valid, now what?
if (params.bHasVaccinations)
{
}
```

You can see we go from treating `-1` as unset, which is pretty sensible. To treating
`FLinearColor::Magenta` as the color being unset, which is kind of weird. To being totally stuck when we try to come up with an
"unset" value for a boolean parameter.

### With `TOptional<T>`

What happens if we rewrite the struct above using `TOptional<T>`?

We can use `TOptional<T>` for, you guessed it, _optional parameters_.

```cpp
struct FDogSearchParams
{
	TOptional<int32> MinimumAge;
	TOptional<int32> MaximumAge;
	TOptional<FLinearColor> FurColor;
	TOptional<bool> bHasVaccinations;
}
```

We no longer need magical values that we treat as unset, we instead have an
explicit `IsSet()` function we can call.

```cpp
// Has the player has set a minimum age?
if (params.MinimumAge.IsSet() || params.MaximumAge.IsSet())
{
	// filter by age ...
}

// Has the player chosen a color?
if (params.FurColor.IsSet())
{
	// Filter by fur color
}

if (params.bHasVaccinations.IsSet())
{
	// Filter by vaccination state
}
```


## TOptional<T> Usage Overview

Now that we can see how `TOptional<T>` is useful, what can else can we do with
it?

```cpp
// After creation, Size.IsSet() returns false
TOptional<int32> Size;

// Assignment is standard, and after this, Size.IsSet() returns true
Size = 16;

// Get the current value with GetValue()
UE_LOG(LogTemp, Verbose, TEXT("Size is: %d:"), Size.GetValue());

// == works as you'd expect, and will return false if IsSet() is false
if (Size == 16)
{
	// returns true
}
```

- There is a `checkf(IsSet())` inside  `GetValue()`, so if you call
  `GetValue()` on an uninitialized value, your game will crash.
- `Get(DefaultValue)` is an alternative that if unset, it will return the
  provided value. e.g. `MyDog.IsCute.Get(true)` because all dogs are cute
  unless otherwise specified.



## UI Example

A common way I use `TOptional<T>` is to make it clear when a newly-instantiated
widget's internal cached state has never been set, and so its visual should be
refreshed the first time its state is set.

That means that when the widget is instantiated, I consider both its cached
state and visual state to be _undefined_.

```cpp
UCLASS(Abstract)
class UDogStatusPanel : public UUserWidget
{
	void SetIsTailWagging(bool bIsTailWagging);

protected:
	TOptional<bool> bIsTailWagging;
};
```

```cpp
void UDogStatusPanel::SetIsTailWagging(bool bInIsTailWagging)
{
	// Only change visual state if we have undefined state
	// or if the values differ
	if (bIsTailWagging.IsSet()
		&& bIsTailWagging == bInIsTailWagging)
	{
		return;
	}

	bIsTailWagging = bInIsTailWagging;
		
	// Set up some expensive visual state...
}
```

## Update: Returning an unset TOptional<T>

Huge thank you to [Brendan Brewster](https://github.com/bjbrewster) for [their suggestion via GitHub](https://github.com/benui-dev/benui-site/issues/28) on how to use `NullOpt` to return a `TOptional<T>` with an unset value

```cpp
template <typename T>
TOptional<T> TryConvertEnumNameToValue(const FString& Name)
{
	UEnum* EnumClass = StaticEnum<T>();

	int64 index = EnumClass->GetIndexByNameString(Name, EGetByNameFlags::CaseSensitive);
	if (index == INDEX_NONE)
		return NullOpt; // or TOptional<T>() or {}

	return static_cast<T>(EnumClass->GetValueByIndex(index));
}

UENUM()
enum class ETest { None, Foo, Bar };

ETest value = TryConvertEnumNameToValue<ETest>("Foo").Get(ETest::None)
check(value == ETest::Foo);
```


## Further Reading

* [`TOptional<T>` Unreal Documentation](https://docs.unrealengine.com/en-US/API/Runtime/Core/Misc/TOptional/index.html)
