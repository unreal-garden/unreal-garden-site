---
title:  "Building Complex Functional Tests"
excerpt: "How to build a suite of tests for gameplay code."
date:   2021-01-28 00:00:00 +0000
tags:
- cpp
- testing
header:
  actions:
  - label: '<i class="fab fa-github"></i> View on Github'
    url: "https://github.com/benui-dev/ue4-functionaltests"
  teaser: /assets/unreal/complex-functional-tests.webp
---

So you've written a [simple functional test]({% link
_posts/tutorials/2020-09-23-unreal-testing-introduction.md %}) and now you want to
scale it up to test large parts of your gameplay code. 

This tutorial should help you create a suite of simple tests and helper
functions that you can compose into complex functional tests for your game.

But first, let's discuss Unreal's two testing frameworks: **Functional Tests** and **Gauntlet**.

## Functional Tests vs Gauntlet

The **Functional Test** framework is great for writing small unit tests, and
  not bad for larger integration tests.

**Gauntlet** on the other hand, is Unreal's newer testing framework that focuses on testing
gameplay rather than individual units.

Some benefits and drawbacks of each:

* **Gauntlet** only works on full builds, it does not run in the editor. This
  means every time you update your game and wish to re-run tests, you have to
  **make a full build** in order to run the Gauntlet tests.
* **Gauntlet** tests can be run on any platform; PC, console, mobile.
  Functional Tests cannot as far as I know.
* **Functional Tests** work both in-editor and from the command line.
* Because **Gauntlet** tests run on full builds, they are perfect for tests
  that measure performance and throw errors when FPS drops below a threshold.

In this tutorial we will focus on using Unreal's **Functional Test** framework
rather than Gauntlet.


## Functional Tests for Gameplay Code

In the [Introduction to Testing tutorial]({% link
_posts/tutorials/2020-09-23-unreal-testing-introduction.md %}), we created
a simple **unit test** that instantiated a class, tested it, and cleaned up.

Now we want to test a larger chunk of **gameplay code** or an entire game using
the Functional Testing framework.

Gameplay code does not always execute instantaneously, there are often
animations, delayed callbacks and load times. For our tests to work with these
delays we will need to change our tests to be able to **wait until conditions
are fulfilled**. Unreal calls these functions latent functions.

### Latent Hello World

Previously we could do all our testing in a single function, but now that we
need parts of it to wait for gameplay code, we need to change our approach.

`AutomationTest.h` has a macro `ADD_LATENT_AUTOMATION_COMMAND()`, that creates
a new instance of the class in the parentheses, and adds it to a list of
commands to be performed in-order.

We will be using it to make sure that each part of the test is only started
once the previous one has finished.

Searching the Unreal codebase for uses of `ADD_LATENT_AUTOMATION_COMMAND` turns
up a lot of interesting things showing how it is used:

```cpp
// We can make the test wait for a second before calling the next command
const float ActiveDuration = 1.0f;
ADD_LATENT_AUTOMATION_COMMAND(FWaitLatentCommand(ActiveDuration));
```

```cpp
const float Delay = 1.0f;
ADD_LATENT_AUTOMATION_COMMAND(FDelayedCallbackLatentCommand([=] {
	// Do something after waiting 1 second
}, Delay));
```

So now that we know how to wait, why don't we just write something like this?

{%
include figure-begin.html
title="BrokenLatentTest.cpp"
%}
```cpp
IMPLEMENT_SIMPLE_AUTOMATION_TEST(FBrokenHeroTest, "Example.Broken", EAutomationTestFlags::EditorContext | EAutomationTestFlags::ProductFilter)
bool FBrokenHeroTest::RunTest(const FString& Parameters)
{
	ABUIHero* myHero = NewObject<ABUIHero>();
	myHero->DrinkPotion();
	// Wait 10s so we know it's done
	ADD_LATENT_AUTOMATION_COMMAND(FWaitLatentCommand(10));
	// Check that the state on hero is correct
	// This will fail!
	TestEqual("Hero should have full HP", Hero->GetHP(), Hero->GetMaxHP());
}
```

Why does this not work? It seems our `TestEqual` is being called right after
`DrinkPotion`, without waitinf or 10 seconds! It's because `FWaitLatentCommand`
is being added to the list of commands to be performed, but `TestEqual` is not,
and so it's being executed immediately.

How would we fix this? By creating a custom latent command!

### Custom Latent Commands

We will break down the steps we did above into two separate latent automation
commands.

```cpp
DEFINE_LATENT_AUTOMATION_COMMAND_ONE_PARAMETER(FBUISetupHero, ABUIHero*, Hero);
bool FBUIHeroDrinkPotion::Update()
{
	Hero->DrinkPotion();
	return true;
}

DEFINE_LATENT_AUTOMATION_COMMAND_ONE_PARAMETER(FBUISetupHero, FAutomationTestBase*, Test, ABUIHero*, Hero);
bool FBUITestHeroAtMaxHealth::Update()
{
	Test->TestEqual("Hero should have full HP", Hero->GetHP(), Hero->GetMaxHP());
	return true;
}

IMPLEMENT_SIMPLE_AUTOMATION_TEST(FHeroTest, "Example.HeroLatent", EAutomationTestFlags::EditorContext | EAutomationTestFlags::ProductFilter)
bool FHeroTest::RunTest(const FString& Parameters)
{
	ADD_LATENT_AUTOMATION_COMMAND(FBUIHeroDrinkPotion());
	ADD_LATENT_AUTOMATION_COMMAND(FWaitLatentCommand(10.0f));
	ADD_LATENT_AUTOMATION_COMMAND(FBUITestHeroAtMaxHealth());
	return true;
}
```
{%
include figure-end.html
%}

#### Nuances of Latent Commands

It's worth going into a little more detail on what exactly is happening when we
define and run a custom latent command.

In our example below, we use `DEFINE_LATENT_AUTOMATION_COMMAND_TWO_PARAMETER`
to defines a class called `FBUIWaitUntilCountMatches`, with two member variables,
`Start` and `Target`. Note that they are **member variables in the class** `FBUIWaitUntilCountMatches`,
not function parameters.

The `Update()` function that is implemented immediately after it is called as
the test runner executes commands in its queue. If the function returns `false`
it is re-run again from the start, next frame.

Thus the member variable `Start` is incremented over and over, returning
`false` which prompts the test runner to re-run the latent command again. Until
finally `Start` matches `Target` and the `Update()` function returns true;

```cpp
DEFINE_LATENT_AUTOMATION_COMMAND_TWO_PARAMETER(FBUIWaitUntilCountMatches, int32, Start, const int32, Target);
bool FBUIWaitUntilCountMatches::Update()
{
	Start += 1;
	if (Start < Target)
		return false;
	return true;
}
```

This nuance should be clearer when we see what happens with
`ADD_LATENT_AUTOMATION_COMMAND`. It is calling the constructor of
`FBUIWaitUntilCountMatches`, and setting its member variables `Start` and
`Target` to 0 and 100.

```cpp
IMPLEMENT_SIMPLE_AUTOMATION_TEST(FBUICustomLatentTest, "BUI.CustomCommands.Simple", TestFlags)
bool FBUICustomLatentTest::RunTest(const FString& Parameters)
{
	ADD_LATENT_AUTOMATION_COMMAND(FBUIWaitUntilCountMatches(0, 100));
	return true;
}
```

{%
include figure-begin.html
title="Snippet of Unreal's AutomationTest.h"
text="Looking at the definition of DEFINE_LATENT_AUTOMATION_COMMAND_TWO_PARAMETER makes it clear that it defines a new class with member variables."
%}
```cpp
#define DEFINE_LATENT_AUTOMATION_COMMAND_TWO_PARAMETER(CommandName,ParamType0,ParamName0,ParamType1,ParamName1)	\
class CommandName : public IAutomationLatentCommand \
	{ \
	public: \
	CommandName(ParamType0 InputParam0, ParamType1 InputParam1) \
	: ParamName0(InputParam0) \
	, ParamName1(InputParam1) \
		{} \
		virtual ~CommandName() \
		{} \
		virtual bool Update() override; \
	private: \
	ParamType0 ParamName0; \
	ParamType1 ParamName1; \
}
```
{%
include figure-end.html
%}


## Composing Complex Functional Tests

Now we understand how the Functional Testing framework supports latent
functions, let's talk about how we can build a suite of tests in a smart way.

After a bit of experimentation, I found it helpful to break down testing code
into three categories:

* Single tests
* Composite tests
* Helper functions


### Single Tests

Single tests are exactly what they sound like, they test a single value. They
must be implemented as latent commands, so they can be placed in a queue of
commands to be executed.

Continuing with our generic RPG example, these could be some simple tests:
* Test that the hero's health matches an expected value
* Test if the hero is poisoned
* Test if the hero's inventory contains a given item
* Test if the hero is dead
* Test if the hero has spoken to a given NPC

In order to be able to call `TestEqual` and other test functions, I always pass
in a pointer to `FAutomationTestBase` as the first parameter.

{%
include figure-begin.html
title="Test hero gold equals"
%}
```cpp
DEFINE_LATENT_AUTOMATION_COMMAND_TWO_PARAMETER(FBUITestHeroGoldEquals, FAutomationTestBase*, Test, ABUIHero*, Hero, int32, ExpectedGold);
bool FBUITestHeroGoldEquals::Update()
{
	// Wait until the hero is alive again rather than failing instantly
	if (Hero->IsDead())
		return false;

	Test->TestEqual("Hero should have specified gold", Hero->GetGold(), ExpectedGold);

	return true;
}
```
{%
include figure-end.html
%}

We can call this function in the following way:

{%
include figure-begin.html
title="Calling our single test"
%}
```cpp
IMPLEMENT_SIMPLE_AUTOMATION_TEST(FHeroTest, "Example.Hero", EAutomationTestFlags::EditorContext | EAutomationTestFlags::ProductFilter)
bool FHeroTest::RunTest(const FString& Parameters)
{
	ADD_LATENT_AUTOMATION_COMMAND(FBUITestHeroGoldEquals(this, 0));

	return true;
}
```
{%
include figure-end.html
%}



### Helper Functions

Helper functions are latent commands that perform no tests. They can be useful
for setting the game's state before running tests. For our RPG example they
could be things like:
* Add items to the player's inventory.
* Create monsters
* Change the player's stats

As before, these need to be defined as latent commands so they are executed
in-order after other latent commands. They are implemented in the same way as
simple tests, but there is no need to pass in `FAutomationTestBase*`.





### Composite Tests

We can now use our **Single Tests** and **Helper Functions** to put together
more complex integration tests.

Using the examples from Single Test, we could compose a more complex
integration test that checks that the poison system works in the game.

1. Helper &mdash; Create a new hero
2. Helper &mdash; Shoot the hero with a poison arrow
3. Single &mdash; Test that the hero is poisoned
4. Single &mdash; Test that the hero has lost health
5. Helper &mdash; Wait for 1 seconds
6. Single &mdash; Test that the hero has lost health
7. Helper &mdash; Wait for 30 seconds
8. Single &mdash; Test that the hero is dead

{%
include figure-begin.html
title="Example composite test"
text="Using helper functions and single tests to compose complex tests."
%}
```cpp
IMPLEMENT_SIMPLE_AUTOMATION_TEST(FBUICustomLatentTest, "BUI.CustomCommands.Simple", TestFlags)
bool FBUICustomLatentTest::RunTest(const FString& Parameters)
{
	ABUIHero* Hero = nullptr;
	ADD_LATENT_AUTOMATION_COMMAND(FBUICreateHero(Hero));
	ADD_LATENT_AUTOMATION_COMMAND(FBUIShootHero(Hero));
	ADD_LATENT_AUTOMATION_COMMAND(FBUITestHeroStatusEffect(this, Hero,
		EBUIStatusEffect::Poison));
	// ... etc
	return true;
}
```
{%
include figure-end.html
%}



You can see that as you add more and more Single Tests and Helper Functions,
you are creating a library of tools that make it easier and easier to compose
complex integration tests.




## Code

All of the code for this tutorial can be found on GitHub.

[<i class="fab fa-github"></i> View on GitHub](https://github.com/benui-dev/ue4-functionaltests){: .btn
.btn--large .btn--info }

