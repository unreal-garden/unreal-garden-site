---
title:  "Intro to Delegates in C++"
excerpt: "How to declare a dynamic multicast delegate and subscribe to it, using C++."
date:   2022-09-01 00:00:00 +0000
tags:
- cpp
redirect_from:
- /unreal/delegates/
- /unreal/delegates
- /unreal/delegate/
- /unreal/delegate
- /unreal/delegates-basic/
- /unreal/delegates-basic
- /unreal/delegates-basics/
- /unreal/delegates-basics
header:
  inline-image: /assets/unreal/delegates-basic-transparent.webp
  teaser: /assets/unreal/delegates-basics-small.webp
---

Delegates are an incredibly useful way to make event-driven code. Conceptually
they are _relatively_ straightforward; allow functions to subscribe to
a "delegate", and when the delegate is called, all those functions are called
too! Kind of like a mailing list. Hopefully that makes sense, because the
implementation in Unreal can get a little tricky.

First let's think about a common use for delegates: **notifying the UI when
something in the player state has changed**. For example, when the player's
score changes, we want the UI to update to show the new score. What does this
look like, in more concrete terms?

1. We add a new _delegate_ variable to the `APlayerState` class, let's call it `OnScoreChangedDelegate`.
2. Other things can _subscribe_ to a `APlayerState` instance's `OnScoreChangedDelegate`. Subscribing means telling the delegate a function to call when it is executed.
3. When `APlayerState` changes its score, it can _execute_ or _call_ `OnScoreChangedDelegate`
4. Anyone who has _subscribed_ is notified!

Before continuing, make sure that this concept makes sense to you. The concept
should give you an anchor, as we go through the steps to get it working in
Unreal.


## Overview

In Unreal, there are four steps to setting up and using a delegate.

1. **Declare the delegate's _signature_:** Just like a function, what parameters
   will your delegate have? Will it have a return type?
2. **Create variables of your new delegate:** These are instances of your
   delegate that other functions can subscribe to.
3. **Subscribe to the delegate:** You will need to connect any functions that
   you wish to be called when the delegate is called.
4. **Execute the delegate:** Any functions that subscribed are called.

In this basic tutorial we will just create a **Dynamic Multicast Delegate**. It
is the most general-purpose delegate and will hopefully give you a feel to
delegates, before you jump into the [Advanced Delegates Tutorial]({% link
_posts/tutorials/2022-09-02-delegates-advanced.md %}).

A Dynamic Multicast Delegate is:

* **Dynamic:** For our purposes, this just means that it is compatible with
  Blueprints.
* **Multicast:** More than one function can subscribe to the delegate at the
  same time.


## 1. Declaring a Delegate

The first step is to think about the signature of the functions that you want
to be called by the delegate. What information do you want to be passed to the
functions?

Going back to our score example, we would probably want the player's new score
`int32 NewScore` at the very least. We can cover more parameters later. So
a function called by our delegate might look like this:

```cpp
void OnScoreChanged(int32 NewScore);
```

To declare a new delegate type, we need to use one of the `DECLARE...DELEGATE`
macros. There are many different types but for now we will focus on Dynamic
Multicast delegates.

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FOnScoreChangedSignature, int32, NewScore);
```

That's quite a mouthful, what are we doing here? Let's break it down:

| `DECLARE_DYNAMIC_MULTICAST_DELEGATE` | OK we're declaring a new Dynamic Multicast Delegate. That makes sense! |
| `OneParam` | The functions that the delegate calls will only have one parameter. Note that it is singular `OneParam`, **not** `OneParams`. |
| `FOnScoreChangedSignature` | This is the name of our new delegate type. The standard prefix in the Unreal codebase is `F` and I prefer to add the `Signature` suffix. |
| `int32, NewScore` | Our parameter is of type `int32` and has a name `NewScore`. Note there is a comma between our first parameter's type and its name. |

We can put this declaration in the same place that we will be adding our
delegate instance. For our score example, somewhere at the top of our
`APlayerState` subclass's header. See the next step if that is not clear.


### Adding another parameter

This part is completely optional, but what if we now have a multiplayer game,
and we need to know **which player's score has changed**? We might also supply
the `APlayerState* PlayerState` to functions called by the delegate:

```cpp
void OnScoreChanged(int32 NewScore, APlayerState* OwningPlayer);
```

Our new delegate declaration would now look like this:

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_TwoParams(FOnScoreChangedSignature, int32, NewScore, APlayerState*, OwningPlayer);
```

Notice that the macro now has `TwoParams` instead of `OneParam`.

For now we'll continue our examples with just a single parameter.


## 2. Creating Variables of Delegate Type

We've declared the signature of our delegate, the parameters that they will
supply to functions that they call. We now need to add the delegates to
a class or struct somewhere, so others that want to be notified can subscribe
to them. What you call them is up to you, but I like to name all of my
delegates with the `Delegate` suffix.

To continue our player score and UI example, let's add our new
`OnScoreChangedDelegate` to our `APlayerState` subclass.

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

Now that we have declared our delegate, and created instances of it somewhere
in our codebase, we can now connect one or more functions to them, so the
functions will be called when the delegate is called.

There are a few different ways to subscribe to a delegate, but for the purposes
of this tutorial we will be doing the most straightforward one,
`AddUniqueDynamic`.

{%
include figure-begin.html
title="BUIPlayerScoreWidget.cpp"
code="cpp"
%}
```cpp
#include "BUIPlayerScoreWidget.h"
#include "BUIPlayerState.h"

void UBUIPlayerScoreWidget::Initialize()
{
	ABUIPlayerState* PlayerState = GetOwningPlayerState<ABUIPlayerState>();

	PlayerState->OnScoreChangedDelegate.AddUniqueDynamic(this,
		&UBUIPlayerScoreWidget::OnScoreChanged);
}

void UBUIPlayerScoreWidget::OnScoreChanged(int32 NewScore)
{
	// Update the state of the UI
}
```
{%
include figure-end.html
%}





## 4. Call the delegate

Thankfully after all the previous work, this is relatively straightforward. We
just need to call `Broadcast` on our delegate variable, and supply it with the
parameters.

In our score example, that looks like this:

{%
include figure-begin.html
title="BUIPlayerState.cpp"
code="cpp"
%}
```cpp
#include "BUIPlayerState.h"

void ABUIPlayerState::AddPoints(int32 Points)
{
	PlayerScore += Points;

	OnScoreChangedDelegate.Broadcast(PlayerScore);
}
```
{%
include figure-end.html
%}

Any functions that have subscribed to the delegate should now be executed
whenever the delegate is `Broadcast`. You can verify this by setting
a breakpoint in your `OnScoreChanged` functions (or throwing in some juicy
print statements).



## Conclusion

That was a lot to cover! Delegates are simple in concept "call a function and
all the subscribers will be notified" but it gets kind of tricky in Unreal.

Once you are familiar with using Dynamic Multicast delegates, you're ready to
move on to the [Advanced Delegates Tutorial]({% link
_posts/tutorials/2022-09-02-delegates-advanced.md %})! There we cover:

* More delegate types: single delegates, Non-dynamic delegates
* Adding return values to delegates
* Events


