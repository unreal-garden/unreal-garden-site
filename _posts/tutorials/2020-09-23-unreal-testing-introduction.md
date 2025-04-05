---
title:  "Testing and Test Driven Development in Unreal"
excerpt: "It's so satisfying when all the lights turn green!"
date: 2020-09-23 00:00:00 +0000
unreal_versions: [ 4.27, 5.0 ]
tags:
- testing
- cpp
header:
  inline-image: /assets/unreal/testing-frontend.webp
  teaser: /assets/unreal/testing-title-small.webp
redirect_from:
- /unreal/unreal-testing-tdd/
---

Unreal comes with a great automated testing tools that can be run in the
editor, in automated builds. We should use them more, let's learn how!

## Initial Setup

Before we get into writing tests, we first have to enable testing on our
project.

Open up the Plugins window under `Edit > Plugins`. Then enable the Functional
Testing Editor plugin under the Testing category.  Restart the editor, and
under the Window menu you should now see the Test Automation item.

{%
include img.html
file="unreal/plugins-menu.webp"
%}

{%
include img.html
file="unreal/testing-plugin.webp"
title=""
%}

{%
include img.html
file="unreal/testing-automation-menu.webp"
%}

From the Session Frontend window, under the Automation tab we can see all of
the tests that are defined for the engine and for our game.

Simply check the box next to the ones you want to run, and hit run!

{%
include img.html
file="unreal/testing-frontend.webp"
%}

Now we'll look at how to define our own simple test.

## Simplest Test Example

For this example, we will be using a simple Hero class, something that might
have health, do damage, take damage, get poisoned etc.

{%
include figure-begin.html
title="Hero.h"
text="For our simplest test, this is all we will need."
code="cpp"
%}
```cpp
#pragma once

#include "GameFramework/Actor.h"
#include "Hero.generated.h"

UCLASS()
class AHero : public AActor
{
	GENERATED_BODY()

public:
	float GetHealth() const { return Health; }
	float GetMaxHealth() const { return MaxHealth; }

protected:
	float Health;
	float MaxHealth = 100;
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="HeroTest.cpp"
text="It's best practice to name your test file the file that you're testing,
but with Test appended. e.g. AHero would have a test file named HeroTest.cpp."
code="cpp"
%}
```cpp
#include "Misc/AutomationTest.h"

#include "Hero.h"

// EditorContext defines that we want to be able to run this test in the Editor
// ProductFilter is for defining how long the test will take to run
// For more information check AutomationTest.h
IMPLEMENT_SIMPLE_AUTOMATION_TEST(FHeroTest, "Example.Hero", EAutomationTestFlags::EditorContext | EAutomationTestFlags::ProductFilter)

// Your function must be named RunTest
// The struct name here "FHeroTest" must match the one in the macro above
bool FHeroTest::RunTest(const FString& Parameters)
{
	AHero* Hero = NewObject<AHero>();

	if (Hero->GetHealth() != Hero->GetMaxHealth())
	{
		// If we call AddError, the test will automatically fail
		AddError(TEXT("Newly-spawned heroes must start at max health"));
	}

	// We can return False to fail the error, but  
	return true;
}
```
{%
include figure-end.html
%}


## Let's TDD!

Test driven development is defined to death elsewhere. For our purposes it
means we'll write tests first, then fix our Hero class to pass the tests.

This is the functionality we want to support:
* Take damage from enemy weapons.
* Get poisoned and take damage over time.
* Die when it's health reaches zero.
* Increase health when healed
* Respawn with full health

Of course with this simple spec there are some other edge cases that we need to
check for:
* After respawning, it should no longer be poisoned
* Increasing its health shouldn't put it over its max health
* What happens when healing the player with a negative amount
* Damaging the player with a positive/negative amount (depending on interface)

{%
include figure-begin.html
title="Hero.h"
text="Our Hero class with placeholder functions so our tests will run, and
fail."
code="cpp"
%}
```cpp
#pragma once

#include "GameFramework/Actor.h"
#include "Hero.generated.h"

UCLASS()
class AHero : public AActor
{
	GENERATED_BODY()

public:
	AHero(const FObjectInitializer& ObjectInitializer)
		: Super(ObjectInitializer)
	{
		MaxHealth = 100;
		Health = MaxHealth;
	}

	float GetHealth() const { return Health; }
	float GetMaxHealth() const { return MaxHealth; }

	// Dummy functions for us to implement
	void Hurt(float Damage, bool bPoison) {}
	void Heal(float Amount) {}
	void CurePoison() {}
	void Respawn() {}

	bool GetIsPoisoned() const { return false; }
	bool GetIsDead() const { return false; }

	// Define some functions just used for testing
#if UE_BUILD_TEST
	void Debug_SetHealth(float InHealth) { Health = InHealth; }
	void Debug_SetMaxHealth(float InMaxHealth) { MaxHealth = InMaxHealth; }
#endif

protected:
	float Health;
	float MaxHealth = 100;
};
```
{%
include figure-end.html
%}


 
{%
include figure-begin.html
title="HeroTest.cpp"
text="We have added a test for damaging the player, and changed our system to
spawn the hero in the world." 
code="cpp"
%}
```cpp
#include "Misc/AutomationTest.h"
#include "Tests/AutomationEditorCommon.h"

#include "Hero.h"

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FHeroTest, "Example.Hero", EAutomationTestFlags::EditorContext | EAutomationTestFlags::ProductFilter)

bool FHeroTest::RunTest(const FString& Parameters)
{
	UWorld* World = FAutomationEditorCommonUtils::CreateNewMap();

	{
		AHero* Hero = World->SpawnActor<AHero>();
		if (Hero->GetHealth() != Hero->GetMaxHealth())
		{
			AddError(TEXT("Newly-spawned heroes must start at max health"));
		}
		Hero->Destroy();
	}

	{
		AHero* Hero = World->SpawnActor<AHero>();
		const float Health = 100;
		Hero->Debug_SetMaxHealth(Health);
		Hero->Debug_SetHealth(Health);
		const float Damage = 10;
		Hero->Hurt(Damage, false);
		if (Hero->GetHealth() != Health - Damage)
		{
			AddError(TEXT("Hurt not subtracting health"));
		}
		Hero->Destroy();
	}

	// ...

	return true;
}
```
{%
include figure-end.html
%}

In order to use `AutomationEditorCommon.h` make sure to add `UnrealEd` to `Project.Build.cs`:

{%
include figure-begin.html
title="Example.Build.cs"
code="cs"
%}
```cpp
using UnrealBuildTool;

public class Example : ModuleRules
{
	public Example(ReadOnlyTargetRules Target) : base(Target)
	{
		PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
	
		PublicDependencyModuleNames.AddRange(new string[] { "Core", "CoreUObject", "Engine", "InputCore" });

		PrivateDependencyModuleNames.AddRange(new string[] { "UnrealEd" });
	}
}
```
{%
include figure-end.html
%}

Running our tests, we fail! Oh no!

{%
include img.html
file="unreal/testing-failed.webp"
%}

We can now update our Hurt function to actually subtract the damage from the
player.

{%
include figure-begin.html
title="Filled out Hurt function"
text="The hurt function now subtracts the damage dealt from the player's
health"
%}
```cpp
// Hurt expects that Damage be positive
void Hurt(float Damage, bool bPoison)
{
	if (Damage < 0)
	{
		Damage = 0;
	}
	Health = FMath::Clamp<float>(Health - Damage, 0, MaxHealth);
}
```
{%
include figure-end.html
%}

Running our tests again, now we pass! Yay!

{%
include img.html
file="unreal/testing-passed.webp"
%}

We can continue this adding more tests, implementing more functionality. This
is an exercise left for you, the reader! Good luck!

## Further Reading

* [Tests and Testability](https://jessicabaker.co.uk/2018/03/11/tests-and-testability/) by
  Jessica Baker is a fantastic article on the benefits of tests in gamedev, and
  how to design your classes to make them less tightly coupled and more easy to
  test.
* UE4 Documentation: [Automation Technical Guide](https://docs.unrealengine.com/en-US/Programming/Automation/TechnicalGuide/index.html)
* UE4 Documentation: [Automation System User Guide](https://docs.unrealengine.com/en-US/Programming/Automation/UserGuide/index.html)
* Video: [Automated Testing at Scale in Sea of Thieves](https://www.youtube.com/watch?v=KmaGxprTUfI) by Jessica Baker
