---
title:  "Unreal Console Cheat Manager"
excerpt: "Cheat your way to success!"
date:   2020-10-17 00:00:00 +0000
tags:
- cpp
- cheat
- debugging
header:
  inline-image: /assets/unreal/cheatmanager-title.webp
  teaser: /assets/unreal/cheatmanager-title-small.webp
---

Unreal Engine has a built-in debug console that can be used for executing
commands or "cheats" as Unreal calls them. The console is accessed by pressing
the tilde key (it's to the left of the 1 key on most keyboards, and has ` and
~ on it).

Unreal provides many built-in commands like `stat fps` for showing the frames per
second, but it is especially useful for adding your own debug commands or
cheats. 

By default, the console is only available in the editor, development and test
builds (i.e. not shipping builds).

## C++ Setup

### Subclass `UCheatManager`

In order to add our own functions and make them available through the debug
console, we will need to create a subclass of `UCheatManager`, and create
a subclass of `APlayerController` if we do not have one already.

As always, we'll be using the [naming conventions from the best practices
document]({% link _posts/tutorials/2019-09-15-ui-best-practices.md %}), where we
prefix custom classes with a project-specific set of letters, in this example
`BUI`.

{%
include figure-begin.html
title="BUICheatManager.h"
%}
```cpp
#pragma once

#include "GameFramework/CheatManager.h"
#include "BUICheatManager.generated.h"

UCLASS(Within = BUIPlayerController)
class UBUICheatManager : public UCheatManager
{
	GENERATED_BODY()
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="BUICheatManager.cpp"
%}
```cpp
#include "BUICheatManager.h"

// Nothing, we will add function definitions here later
```
{%
include figure-end.html
%}


### Subclass `APlayerController`

Remember that you will also need to modify your level's GameMode to use this
Player Controller subclass.

{%
include figure-begin.html
title="BUIPlayerController.h"
%}
```cpp
#pragma once

#include "GameFramework/PlayerController.h"
#include "BUIPlayerController.generated.h"

UCLASS()
class ABUIPlayerController : public APlayerController
{
	GENERATED_BODY()

public:
	ABUIPlayerController(const FObjectInitializer& ObjectInitializer);
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="BUIPlayerController.cpp"
%}
```cpp
#include "BUIPlayerController.h"
#include "BUICheatManager.generated.h"

ABUIPlayerController::ABUIPlayerController(const FObjectInitializer& ObjectInitializer) 
	: Super(ObjectInitializer)
{
	CheatClass = UBUICheatManager::StaticClass();
}
```
{%
include figure-end.html
%}


## Adding Functions

Now that we have a custom subclass of `UCheatManager`, and we have made sure
that our player controller is using it, we can start adding our own functions.

Here are a few examples to get you going. What you will need will depend on
your game!

{%
include figure-begin.html
title="BUICheatManager.h"
%}
```cpp
#pragma once

#include "GameFramework/CheatManager.h"
#include "BUICheatManager.generated.h"

UCLASS(Within = BUIPlayerController)
class UBUICheatManager : public UCheatManager
{
	GENERATED_BODY()
public:
	// Cheats can take multiple parameters, and have default values
	UFUNCTION(exec)
	void BuyCakes(int32 NumCakes, int32 Diameter = 1);

	// Cheats can take strings too!
	UFUNCTION(exec)
	void SetCakeName(FString NewName);
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="BUICheatManager.cpp"
%}
```cpp
#include "BUICheatManager.h"

void UBUICheatManager::BuyCakes(int32 NumCakes, int32 Diameter)
{
	// Call some internal buy cake method
}

void UBUICheatManager::SetCakeName(FString NewName)
{
	// Pick an appropriate cake and name it!
}
```
{%
include figure-end.html
%}


### How to Run your Cheats

Using the examples above, set a breakpoint in `BuyCakes` and `SetCakeName`,
open up the debug console with the tilde key, and type in the following:

```
BuyCakes 100
```

You should see that NumCakes is 100, and Diameter is your default value of 1.
Note that parentheses are not required when calling cheats from the console.

```
SetCakeName Delicious Cheesecake
```

NewName is "Delicious Cheesecake", note that we did not have to add quotation
marks when calling the cheat command, it globbed all the subsequent text
together into our single parameter. Nice!


## Useful General-purpose Functions

The majority of functions in your cheat manager will be things that are
specific to your game. For example in an RPG you might add cheats to give the
player extra money or immediately complete certain quests.

However here are a few functions that are useful to have in general.

Please let me know if you have any of your own and I can add them here!


{%
include figure-begin.html
title="BUICheatManager.h"
%}
```cpp
#pragma once

#include "GameFramework/CheatManager.h"
#include "BUICheatManager.generated.h"

UCLASS(Within = BUIPlayerController)
class UBUICheatManager : public UCheatManager
{
	GENERATED_BODY()
public:
	// Useful for testing crash reporting tools
	UFUNCTION(exec)
	void ForceCrash();

	// Useful for identifying hanging pointers that could cause a crash when
	// garbage collection eventually happens
	UFUNCTION(exec)
	void ForceGarbageCollection();
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="BUICheatManager.cpp"
%}
```cpp
#include "BUICheatManager.h"

void UBUICheatManager::ForceCrash()
{
	// Let's definitely crash
	*((int*)0) = 0;

	check(false);
}

void UBUICheatManager::ForceGarbageCollection()
{
	GEngine->ForceGarbageCollection(true);
}
```
{%
include figure-end.html
%}
