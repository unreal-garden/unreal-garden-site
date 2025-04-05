---
title: "Iterating over UENUM with TEnumRange<T>"
excerpt: "Make any enum iterable with `ENUM_RANGE_BY_COUNT` and others"
date:   2022-01-27 00:00:00 +0000
tags:
- cpp
header:
  inline-image: /assets/unreal/iterate-uenum-transparent.webp
  teaser: /assets/unreal/iterate-over-enum-tenumrange-small.webp
---

I've always wanted to iterate over `UENUM` values but never known how, until
[Wouter Weynants](https://twitter.com/WWeynants) told me this tip.

## Before

Our simple enum example just lists a few animal types.

{%
include figure-begin.html
%}
```cpp
UENUM()
enum class EAnimal : uint8
{
	Cat,
	Dog,
	Elephant
};
```
{%
include figure-end.html
%}

## Making our Enum iteration-friendly

In order to make our enum iterate-able, we need to use one of three possible macros
that Unreal provides:

* [`ENUM_RANGE_BY_COUNT`](#by-count)
* [`ENUM_RANGE_BY_FIRST_AND_LAST`](#by-first-and-last)
* [`ENUM_RANGE_BY_VALUES`](#by-values)

### By Count

There are a few different macros that we can use to enable iteration over
a `UENUM`. We'll start with what might be the simplest, `ENUM_RANGE_BY_COUNT`
and then show you how to iterate.

First we want to add a new value to the end of our enum. It can be called
anything but `Count` is a good standard to use.

You can hide this value so it doesn't show up in the editor by marking it with
[`UMETA(Hidden)`]({% link _pages/docs/uenum-umeta.md %}#hidden)

Finally we need to add `ENUM_RANGE_BY_COUNT` and include the name of the enum
and the final value we are using to store the size or count of our enum.

{%
include figure-begin.html
%}
```cpp
UENUM()
enum class EAnimal : uint8
{
	Cat,
	Dog,
	Elephant,
	Count UMETA(Hidden)
};
ENUM_RANGE_BY_COUNT(EAnimal, EAnimal::Count);
```
{%
include figure-end.html
%}

### By First and Last

Unreal also has `ENUM_RANGE_BY_FIRST_AND_LAST` that can be useful if you don't
want to add an extra `Count` value to your enum. As before, we add the macro
after our enum definition, but in this case, we pass in the first and last
entries from the enum. 

{%
include figure-begin.html
%}
```cpp
UENUM()
enum class EMilkshake : uint8
{
	Chocolate,
	Vanilla,
	Strawberry,
	Blueberry
};
ENUM_RANGE_BY_FIRST_AND_LAST(EMilkshake, EMilkshake::Chocolate, EMilkshake::Blueberry);
```
{%
include figure-end.html
%}


### By Values

Useful for defining iteration over an enum with a non-contiguous range of
values. We pass in every value in the enum, in order.

```cpp
enum class ERandomValuesThing : uint8
{
	First  = 2,
	Second = 3,
	Third  = 5,
 	Fourth = 7,
 	Fifth  = 11
};

ENUM_RANGE_BY_VALUES(ERandomValuesThing, ERandomValuesThing::First, ERandomValuesThing::Second, ERandomValuesThing::Third, ERandomValuesThing::Fourth, ERandomValuesThing::Fifth)
```

## Iterating over the enum

No matter which `ENUM_RANGE_BY...` macro we used, iteration is the same:

{%
include figure-begin.html
%}
```cpp
for (EAnimal Animal : TEnumRange<EAnimal>())
{

}
```
{%
include figure-end.html
%}


