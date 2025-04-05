---
title:  "C++-style Singletons in Unreal Engine"
excerpt: "Seriously don't do it."
date:   2021-05-18 00:00:00 +0000
tags:
- cpp
---

Coming from other C++-based game dev, you might be used to having singletons
that are globally-accessible. With Unreal it requires a bit more work.


## How to set up a vanilla C++ singleton

Don't.

Seriously in Unreal you will cause more problems than you solve.

<ul class="procon">
<li class="con">Easy to leave instances hanging around between using Run Game
in the Editor</li>
<li class="con">Easy to create instances from the Class Default Object being
loaded, or viewing a Blueprint subclass in-editor</li>
<li class="con">Nightmare for automated testing.</li>
</ul>


## No but seriously, how do I do it?

Have you considered some of the many alternatives?

Add your code to some of the easily-accessible classes like `AGameState`,
`APlayerState`, and use `UGameplayStatics` helper functions to get access to
them.

You could use [subsystems]({% link
_posts/tutorials/2020-12-31-subsystem-singleton.md %}), a more Unreal but
decoupled way of making something globally-accessible.

What about making a plugin of your code, and accessing the code through that?


## Hey kid, over here....

OK so you really want to know? Here's the gross hacky way to do it.



```cpp
UBUIMyEvilSingleton* UBUIMyEvilSingleton::Instance = nullptr;

UBUIMyEvilSingleton::UBUIMyEvilSingleton(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	// Don't set up Singleton instance in CDO constructor
	// or other Unreal-style constructors
	if (!HasAnyFlags(RF_ClassDefaultObject
		| RF_NeedLoad
		| RF_NeedPostLoad
		| RF_NeedPostLoadSubobjects))
	{
		ensureMsgf(pInstance == nullptr, TEXT("Uh-oh two singletons!"));
		pInstance = this;
	}
}

UBUIMyEvilSingleton::BeginDestroy()
{
	if (pSingleton != nullptr)
	{
		if (ensureMsgf(pSingleton == this, TEXT("We have a singleton that isn't this!"))
		{
			pInstance = nullptr;
		}
	}
}
```

