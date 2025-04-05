---
title:  "Advanced Delegates in C++"
excerpt: "All the flavours, all the considerations."
date:   2022-09-02 00:00:00 +0000
tags:
- cpp
header:
  image-inline: /assets/unreal/delegates-advanced-transparent.webp
  teaser: /assets/unreal/delegates-advanced-small.webp
---

This is the second part of a short series on delegates in Unreal Engine. In the
first part, we covered [how to define and use a Dynamic Multicast delegate]({%
link _posts/tutorials/2022-09-01-delegates-intro.md %}). If you are new to
delegates check that out first!

In the previous tutorial, we used an example of notifying the UI when the
player's score has changed. We will continue using that in this tutorial.

As before, will go through the four steps needed to set up and use a delegate
in Unreal, but this time we will discuss in more detail the options available
and their nuances.

1. **Define the delegate's _signature_:** Just like a function, what parameters
   will your delegate have? Will it have a return type?
2. **Create variables of your new delegate:** These are instances of your
   delegate that other functions can subscribe to.
3. **Subscribe to the delegate:** You will need to connect any functions that
   you wish to be called when the delegate is called.
4. **Execute the delegate:** Any functions that subscribed are called.

## 1. Declaring a Delegate


### Choosing a Delegate Type

In the previous tutorial we just used a _Dynamic Multicast Delegate_, but
Unreal actually has four(-ish) different types of delegate:
* Single
* Multicast
* Dynamic single
* Dynamic multicast

Which one you pick depends on what you want to be able to do with your
delegate. Look at this table to see which one is appropriate for you.

|  | *Single* | *Multicast* | *Dynamic Single* | *Dynamic Multicast* |
|:--- | --- | --- | --- |--- |
| How many can subscribe? | One | Many | One | Many |
| Can use from Blueprints? | ❌ | ❌ | ✅ | ✅ |
| Performance | - | - | Slightly slower? | Slightly slower? |

In the next section, take note that the syntax for declaring dynamic and
non-dynamic delegates is _different_.


### Delegate Signature Tool

The signature for different delegate types is is pretty different. To see how
it changes, try playing around with the tool below, changing the delegate type,
adding or removing parameters, changing return types, and see how delegate
declaration signature changes.

<form class="delegate-tool">

<table>
<tr>
<td class="labels">
<label for="dynamic" class="dynamic">Dynamic</label>
</td>
<td colspan="3">
<input type="checkbox" name="dynamic" id="dynamic" value="dynamic" onChange="refreshDelegateForm();" />
</td>
</tr>
<tr>
<td class="labels">
<label for="multicast" class="multicast">Multicast</label>
</td>
<td colspan="3">
<input type="checkbox" name="multicast" id="multicast" value="multicast" onChange="refreshDelegateForm();" />
</td>
</tr>

<tr>
<td class="labels">
<label for="delegate_name" class="delegatename">Delegate Name</label>
</td>
<td colspan="3">
<input type="text" id="delegate_name" name="delegate_name" onInput="refreshDelegateForm();" value="OnScoreChanged" class="code">
</td>
</tr>

<tr>
<td class="labels">
<label for="returntype" class="retval">Return Type</label>
</td>
<td colspan="3">
<input type="text" id="returntype" name="returntype" onInput="refreshDelegateForm();" placeholder="void" class="code">
</td>
</tr>

<tr id="row0">
<td class="labels">
<label for="param0_type" class="params">Parameter 1</label>
</td>
<td>
<input type="text" id="param0_type" name="param0_type" value="int32" placeholder="type" onInput="refreshDelegateForm();" required class="code">
</td>
<td>
<input type="text" id="param0_name" name="param0_name" value="NewScore" placeholder="name" onInput="refreshDelegateForm();" required class="code">
</td>
<td>
<input type="button" id="param0_button" name="param0_button" value="X" onClick="deleteParameter(0);">
</td>
</tr>

<tr id="lastrow">
<td class="labels"></td>
<td colspan="3">
<input type="button" id="add_param_button" name="add_param_button" value="+ Add Parameter" onClick="addParameter();" class="major">
</td>
</tr>

</table>

<div class="code-output highlight">
<span class="c">// Delegate signature</span>
<p id="delegate_signature">(none)</p>

<span class="c">// Function signature</span>
<p id="function_signature">(none)</p>
</div>

</form>

<script src="/assets/js/delegates.js"></script>

<script>
refreshDelegateForm();
</script>



### Non-dynamic Delegate Syntax

Non-dynamic delegate declarations start with the macro, then the name of the
delegate signature that you are defining. The Unreal Engine codebase uses the
prefix `F` with delegate signatures. I like to add a `Signature` suffix to
differentiate between the delegate signature and delegate instance variables.

```cpp
// It's possible to declare a delegate with no params
DECLARE_DELEGATE(FOnScoreChangedSignature);
// Matching function: void OnScoreChanged();

// Note that we do not need the parameter name, but it is good practice to add it
DECLARE_DELEGATE_OneParam(FOnScoreChangedWithScoreSignature, int32 /* NewScore */);
// Matching function: void OnScoreChangedWithScore(int32 NewScore);

// Note "params" is plural
DECLARE_DELEGATE_TwoParams(FOnScoreChangedWithOwnerSignature, int32 /* NewScore */, class APlayerState* /* OwningPlayer */);
// Matching function: void OnScoreChangedWithOwner(int32 NewScore, class APlayerState* OwningPlayer);

// You can split declarations over multiple lines with backslash
// Note "params" is plural
DECLARE_DELEGATE_TwoParams(FOnMultilineExampleSignature, \
	int32 /* NewScore */,\
	class APlayerState* /* OwningPlayer */);
// Matching function: void OnScoreChangedWithOwner(int32 NewScore, class APlayerState* OwningPlayer);
```

### Dynamic Delegate Syntax

```cpp
// It's possible to declare a dynamic delegate with no params
DECLARE_DYNAMIC_DELEGATE(FOnScoreChangedSignature);
// Matching function: void OnScoreChanged();

// Note we need a comma between the parameter type and the parameter name
DECLARE_DYNAMIC_DELEGATE_OneParam(FOnScoreChangedSignature, int32, NewScore);
// Matching function: void OnScoreChanged(int32 NewScore);

// Note "params" is plural
DECLARE_DYNAMIC_DELEGATE_TwoParams(FOnScoreChangedSignature, int32, NewScore, class APlayerState*, OwningPlayer);
// Matching function: void OnScoreChanged(int32 NewScore, APlayerState* OwningPlayer);
```

### Return Values

Non-multicast delegates can also include a custom return value, instead of the
default `void`. Simply add `RetVal` and insert the return type at the start of
the macro.

```
DECLARE_DELEGATE_RetVal_TwoParams(bool, FOnDogSucceededWoofing, class ADog* /* Dog */, FString /* WoofWord */);
// Matching function: bool OnDogWoof(ADog* Dog, FString WoofWord);

DECLARE_DYNAMIC_DELEGATE_RetVal_TwoParams(bool, FOnDogSucceededWoofing, class ADog*, Dog, FString, WoofWord);
// Matching function: bool OnDogWoof(ADog* Dog, FString WoofWord);
```

### Multicast Delegates

The signature for multicast delegates is exactly the same, just add
`MULTICAST_` before `DELEGATE`. The signature of the functions that can bind to
them are the same. However the way to bind to them is a little different, as
we will see later.

Note that return values are not supported for multicast delegates.

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnScoreChangedSignature, int32, NewScore);
```

## 2. Creating Variables of Delegate Type

We've chosen the type of delegate we want, and its signature which defines the
parameters that they will supply to functions that they call. We now need to
add these delegates to a class or struct somewhere, so others that want to be
notified can subscribe to them.

No matter the type of delegate we have declared, adding it to another class is
the same. However note only Dynamic delegates can be exposed through
Blueprints.

{%
include figure-begin.html
title="BUIPlayerState.h"
code="cpp"
%}
```cpp
#pragma once

#include "GameFramework/PlayerState.h"
#include "BUIPlayerState.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnScoreChangedSignature, int32, NewScore);

UCLASS()
class ABUIPlayerState : public APlayerState
{
	GENERATED_BODY()

public:
	// We want this public so our UI can access it to subscribe to it
	// Also adding BlueprintAssignable makes it accessible by blueprints
	UPROPERTY(BlueprintAssignable)
	FOnScoreChangedSignature OnScoreChangedDelegate;
};
```
{%
include figure-end.html
%}





## 3. Subscribe to a delegate

Now that we have declared our delegate, and created member variables
of it somewhere in our codebase, we can now connect one or more functions to
them, so the functions will be called when the delegate is called.

As with defining the delegate, subscribing to the delegate is different
depending on whether it's single/multicast and non-dynamic/dynamic.

### Non-Dynamic Single Delegate

Non-dynamic delegates have a host of different functions you can use to bind
a function or lambda to be executed. I won't cover them all but here's the
syntax for a few of the ones that I have used more frequently.

* `BindLambda`
* `BindRaw`
* `BindStatic`
* `BindSP`
* `BindUFUnction`
* `BindUObject`
* `BindWeakLambda`
* `BindThreadSafeSP`

```cpp
DECLARE_DELEGATE_OneParam(FOnScoreChangedSignature, int32 /* NewScore */);

// BindUObject requires that the target be a UObject
OnScoreChangedDelegate.BindUObject(this, &ThisClass::OnScoreChanged);

// BindRaw is for if the target is not a UObject
OnScoreChangedDelegate.BindRaw(SomeSlateThing, &SSlomeSlateThing::OnScoreChangedRaw);

// BindLambda is useful for simpler anonymous functions
OnScoreChangedDelegate.BindLambda([](int32 NewScore)
{
	// Do something with score
});
```

**Edit:** Previous versions of this tutorial said that functions used with
`BindUObject` must be marked with `UFUNCTION()`, this was incorrect. They do
not need to be marked with `UFUNCTION()`. Thanks to @sswires for this
correction!

### Non-Dynamic Multicast Delegate

Subscribing to non-dynamic _multicast_ delegates is very much the same as their
single counterparts. Functions are prefixed with `Add` instead of `Bind`,
because multiple functions can be bound to the delegate.

* `AddLambda`
* `AddRaw`
* `AddStatic`
* `AddSP`
* `AddUFunction`
* `AddUObject`
* `AddWeakLambda`
* `AddThreadSafeSP`

```cpp
DECLARE_MULTICAST_DELEGATE_OneParam(FOnScoreChangedSignature, int32 /* NewScore */);

// AddUObject requires that the target be a UObject
OnScoreChangedDelegate.AddUObject(this, &ThisClass::OnScoreChanged);

// AddRaw is for if the target is not a UObject
OnScoreChangedDelegate.AddRaw(SomeSlateThing, &SSlomeSlateThing::OnScoreChangedRaw);

// AddLambda is useful for simpler anonymous functions
OnScoreChangedDelegate.AddLambda([](int32 NewScore)
{
	// Do something with score
});
```

**Edit:** Previous versions of this tutorial said that functions used with
`BindUObject` must be marked with `UFUNCTION()`, this was incorrect. They do
not need to be marked with `UFUNCTION()`. Thanks to @sswires for this
correction!

### Dynamic Single Delegate

```cpp
DECLARE_DYNAMIC_DELEGATE_OneParam(FOnScoreChangedSignature, int32, NewScore);

// If we have a UFUNCTION()-marked function `OnScoreChanged(int32 NewScore)
// we can subscribe using BindDynamic and the ThisClass macros
OnScoreChangedDelegate.BindDynamic(this, &ThisClass::OnScoreChanged);
```

### Dynamic Multicast Delegate

For Dynamic Multicast Delegates I would recommend using `AddUniqueDynamic`, as
it only binds if the supplied `UFUNCTION` has not been bound before.

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnScoreChangedSignature, int32, NewScore);

// If we have a UFUNCTION()-marked function `OnScoreChanged(int32 NewScore)
// we can subscribe using AddUniqueDynamic and the ThisClass macros
OnScoreChangedDelegate.AddUniqueDynamic(this, &ThisClass::OnScoreChanged);
```



## 4. Call the delegate

Thankfully after all the previous work, this is relatively straightforward.

* For single delegates: `.Execute()` or `.ExecuteIfBound()`
* For multicast delegates: `.Broadcast()`


## Advanced Topics

These are some more advanced or nuanced issues related to delegates.

### Re-using delegate signatures

There are some situations in which many different events may share the same
signature. For a kind of silly example, imagine we had delegates for different
things our `ADog` class could do:

```cpp
UCLASS()
class ADog : public AActor
{
	GENERATED_BODY()

	{Delegate type} OnDogJumpedDelegate;
	{Delegate type} OnDogWoofedDelegate;
	{Delegate type} OnDogSatDownDelegate;
};
```

What should be in `{Delegate type}`? Should we declare 3 delegates with the
same parameter?
```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnDogJumpedSignature, ADog*, Dog);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnDogWoofedSignature, ADog*, Dog);
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnDogSatDownSignature, ADog*, Dog);

UCLASS()
class ADog : public AActor
{
	GENERATED_BODY()

	FOnDogJumpedSignature OnDogJumpedDelegate;
	FOnDogWoofedSignature OnDogWoofedDelegate;
	FOnDogSatDownSignature OnDogSatDownDelegate;
};
```

Or just one, and re-use that same event?

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(OnDogEventSignature, ADog*, Dog);

UCLASS()
class ADog : public AActor
{
	GENERATED_BODY()

	FOnDogEventSignature OnDogJumpedDelegate;
	FOnDogEventSignature OnDogWoofedDelegate;
	FOnDogEventSignature OnDogSatDownDelegate;
};
```

I think in this kind of silly example, the second one makes more sense but if
the events really are different purposes and only _by chance_ happen to have
the same signature, then you could declare a separate delegate type for
delegates with different purposes. 


### Sparse Delegates

Sparse Delegates are a special type of delegate that should be used for
some situations:
- When the delegate is only rarely bound.
- When memory usage of the object containing the delegate is a consideration. For example there will be many instances of that object so reducing the per-instance size is desired.

Only only comes in the Dynamic Multicast flavour, and don't seem to support return values. You can see them in use in `Actor.h` and `PrimitiveComponent.h`, and are defined in `SparseDelegate.h` that contains this comment:

> Sparse delegates can be used for infrequently bound dynamic delegates so that
> the object uses only 1 byte of storage instead of having the full overhead of
> the delegate invocation list. The cost to invoke, add, remove, etc. from the
> delegate is higher than using the delegate directly and thus the memory
> savings benefit should be traded off against the frequency with which you
> would expect the delegate to be bound.

Their macro signature is a very different to other delegates so be careful:
```cpp
DECLARE_DYNAMIC_MULTICAST_SPARSE_DELEGATE(SparseDelegateClassName, OwningClass, DelegateName);
DECLARE_DYNAMIC_MULTICAST_SPARSE_DELEGATE_OneParam(SparseDelegateClassName, OwningClass, DelegateName, Param1Type, Param1Name);
```


{%
include figure-begin.html
title="Dog.h"
code="cpp"
%}
```cpp
#pragma once

#include "GameFramework/Actor.h"
#include "Dog.generated.h"

// Note you have to forward declare here, you *cannot* do it within the
// delegate declaration 
class ADog;

DECLARE_DYNAMIC_MULTICAST_SPARSE_DELEGATE_OneParam(FOnDogWoofSignature, ADog, OnDogWoofDelegate, FString, WoofText);

UCLASS()
class ADog : public AActor
{
	GENERATED_BODY()

	// We only very rarely need to subscribe to woofs
	// And we have a *lot* of dogs
	FOnDogWoofSignature OnDogWoofDelegate;
};
```
{%
include figure-end.html
%}

There is also a handy console command `SparseDelegateReport`, to output a report on which sparse delegates are bound.

### Using Datatypes with Commas

At one point you've probably tried to declare a delegate that uses `TMap<K,V>`,
like this:

```cpp
// This doesn't work!
DECLARE_DELEGATE_OneParam(FOnScoresForPlayersChangedSignature, TMap<FName, int32> /* ScoreMap */)
```

Unreal's `DECLARE` macro is getting confused because of the comma in
`TMap<FName, int32>`. There are a few ways to solve this.

#### Use `typedef`

One way to solve this is to create a new `typedef` for your `TMap<FName, int32>`

```cpp
typedef TMap<FName, int32> ScoreMap;
DECLARE_DELEGATE_OneParam(FOnScoresForPlayersChangedSignature, ScoreMap /* NewMap */)
```

#### Use `TDelegate` instead of macro

The other way is to avoid using the macro altogether, and just declare the type
inline with your delegate. Note that these will only be accessible from C++,
not from Blueprints.

{%
include figure-begin.html
title="Using TDelegate instead of DECLARE_DELEGATE"
code="cpp"
%}
```cpp
UCLASS()
class ABUIPlayerState : public APlayerState
{
	GENERATED_BODY()

public:
	// We don't need the DECLARE_DELEGATE_... macro
	TDelegate<void(TMap<FName, int32>)> OnScoreChangedDelegate;
};
```
{%
include figure-end.html
%}

#### Wrap in a struct

If you want to use a dynamic delegate and have it used by Blueprints, I would
instead wrap that datatype in a `struct` and use that as the delegate parameter.
It's also good practice to use a `struct` as a parameter when you start needing
more than a few parameters or you think you may need more in the future.
Wrapping all the required information in a structure avoids the signature
changing and avoids having to refactor functions and delegates.


{%
include figure-begin.html
title="Using a struct to wrap a TMap<K,V>"
code="cpp"
%}
```cpp
USTRUCT(BlueprintType)
struct FScoreData
{
	GENERATED_BODY()

	UPROPERTY(BlueprintReadWrite)
	TMap<FName, int32> ScoreMap;
};

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnScoreChangedSignature, FScoreData, ScoreData);

UCLASS()
class ABUIPlayerState : public APlayerState
{
	GENERATED_BODY()

public:
	UPROPERTY(BlueprintAssignable)
	FOnScoreChangedSignature OnScoreChangedDelegate;
};
```
{%
include figure-end.html
%}


{% comment %}
### Using Delegates without the Macros

The `DECLARE_...` macros are wrappers around C++ classes that you can use
yourself.

TDelegate<{ReturnType}
TMulticastDelegate<{ReturnType}
TBaseDynamicMulticastDelegate
T

| *Macro* | *Equivalent* |
| --- | --- |
| DECLARE_DELEGATE_TwoParams(FString, int32) | TDelegate<void(FString, int32)> |
| DECLARE_DYNAMIC_DELEGATE_TwoParams(FString, int32) | TDelegate<void(FString, int32)> |
TDynamicMulticastDelegate<void(TMap<FName, int32>)> OnScoreChangedDelegate;

{% endcomment %}

### Serialization

Only _Dynamic Delegates_ support serialization, but why would we care about
serialization?

In our running example of binding a UI widget to the Player State's
`OnScoreChangedDelegate`, we would not normally need to serialize that binding.
We could do it when the widget is created when the game starts.

However, let's instead imagine we are creating a city building game, and we
have instances of an actor `AWorker` that run around and can bind to delegates
that are executed when tasks are complete. In this case we could imagine that
we might want to serialize those subscriptions so they are restored when
re-loading a game.

Then when the game saves its state, we want it to preserve those connections.
For that we need to use Dynamic Delegates.

### Events

Events are mentioned in the [4.27
documentation](https://docs.unrealengine.com/4.27/en-US/ProgrammingAndScripting/ProgrammingWithCPP/UnrealArchitecture/Delegates/Events/) but Dylan found this little gem in the 5.0 engine source code:

```cpp
/**
 * Declares a multicast delegate that is meant to only be activated from OwningType
 * NOTE: This behavior is not enforced and this type should be considered deprecated for new delegates, use normal multicast instead
 */
#define DECLARE_EVENT(OwningType, EventName) FUNC_DECLARE_EVENT(OwningType, EventName, void)
 ```

So I would consider Events deprecated as of 5.0. Just use multicast delegates
instead.



