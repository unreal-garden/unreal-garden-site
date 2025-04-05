---
title: "Pause Game When Window Loses Focus"
excerpt: "Want to pause the game, reduce FPS, mute audio when the game window loses focus?"
date:   2020-10-16 00:00:00 +0000
tags:
- cpp
header:
  teaser: /assets/unreal/window-focus-change-small.webp
toc: false
classes: wide
---

More of a text snippet than a tutorial, this is how it's possible to call
a function when the game loses focus.

In this example we have put the callback function in a custom
`APlayerController` subclass, but it could be just about anywhere.

Also it might be worth wrapping this feature in a `UUserGameSetting` property
so players can disable it if they don't want it.

First we need to add `Slate` to our `MyProject.Build.cs` file:

{%
include figure-begin.html
title="MyProject.Build.cs"
%}
```cpp
public class MyProject : ModuleRules
{
	public MyProject(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
	
		PublicDependencyModuleNames.AddRange(new string[] {
			"Core",
			"CoreUObject",
			"Engine",
			"InputCore",
			"Slate" // Add this!
		});

		PrivateDependencyModuleNames.AddRange(new string[] {  });
	}
}
```
{%
include figure-end.html
%}

Next, we need to add to our player controller in both the `.h` and the `.cpp`:

{%
include figure-begin.html
title="BUIPlayerController.h"
%}
```cpp
// Fill out your copyright notice in the Description page of Project Settings.

#pragma once

#include "BUIPlayerController.generated.h"

UCLASS()
class ABUIPlayerController : public APlayerController
{
	GENERATED_BODY()
protected:
	virtual void BeginPlay() override;
	void OnWindowFocusChanged(bool bIsFocused);
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
#include "Framework/Application/SlateApplication.h"

void ABUIPlayerController::BeginPlay()
{
	FSlateApplication::Get().OnApplicationActivationStateChanged()
		.AddUObject(this, &ABUIPlayerController::OnWindowFocusChanged);
}

void ABUIPlayerController::OnWindowFocusChanged(bool bIsFocused)
{
// Don't pause in the editor, it's annoying
#if !WITH_EDITOR
	if (bIsFocused)
	{
		// Unlimit game FPS
		GEngine->SetMaxFPS(0);

		// Unpause the game
		// MyHUD->SetPause(false);
	}
	else
	{
		// Reduce FPS to max 10 while in the background
		GEngine->SetMaxFPS(10.0f);

		// Pause the game, using your "show pause menu" function
		// MyHUD->SetPause(true);
	}
#endif
}
```
{%
include figure-end.html
%}

