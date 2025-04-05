---
title: "Lambdas with TFunctionRef&lt;T&gt;"
excerpt: "Unreal-style lambda functions that can be passed around to functions."
date:   2017-05-21 00:00:00 +0000
toc: false
classes: wide
tags:
- cpp
---

`TFunctionRef<T>` is an Unreal-friendly way of letting you define and use
Lambda functions. If you are unfamiliar with Lambda functions in C++, you
should research what they are first before trying to use the following.

{%
include figure-begin.html
code="cpp"
%}
```cpp
TFunctionRef<int32 (const FString& Str)> Thing
```
{%
include figure-end.html
%}



Imagine we have a function that takes a list of items as input, and it performs
some actions on each one, and then passes them on to another internal object.
We might want to let the user specify a custom initializer function that is
called on each item before it is handed off.

We can do this by adding a `TFunctionRef<T>` parameter to our function, as
shown below.

{%
include figure-begin.html
code="cpp"
%}
```cpp
void SetupContents(const TArray<UObject*>& StuffToAdd,
	TFunctionRef<void (UInternalObject* Thing)> CustomInitializer)
{
	// Take the provided UObject stuff, create some, kind of internal
	// data structure...
	TArray<UInternalObject*> CreatedObjects;
	for (int32 i = 0; i < CreatedObjects.Num(); ++i)
	{
		// Call the provided function on each instance
		CustomInitializer(CreatedObjects[i]);
	}
}
```
{%
include figure-end.html
%}


With a function definition above, how do we call it and provide a Lambda
function that it will accept?

{%
include figure-begin.html
code="cpp"
%}
```cpp
SetupContents(MyStuff, [](UInternalObject* Thing)
{
	// Do something with Thing to initialize it
});
```
{%
include figure-end.html
%}

