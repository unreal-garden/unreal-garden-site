---
title:  "Unreal-style Singletons with Subsystems"
excerpt: "Subsystems are a simple way to make modular, globally-accessible
logic."
date:   2020-12-31 00:00:00 +0000
tags:
- cpp
header:
  inline-image: /assets/unreal/subsystem-singleton-transparent.webp
  teaser: /assets/unreal/subsystem-singleton-small.webp
---

The Singleton design pattern has a lot of baggage, but its utility can't be
ignored. Luckily Unreal provides a way to get the benefits of a Singleton, with
less of the drawbacks.


## The Bad Way: C++ Static Singleton

```cpp
class UMySingleton : public UObject
{
public:
	static UMySingleton* GetInstance() { return Instance; }

private:
	static UMySingleton* Instance;
};
```

Benefits and drawbacks of C++ static class singletons:

<ul class="procon">
<li class="pro"><strong>Interface programmers are used to</strong></li>
<li class="con"><strong>Interacts badly with the editor:</strong> Without work,
instances are preserved between running game through the editor multiple
times.</li>
<li class="con"><strong>Interacts badly class Class Default Objects:</strong> Without work, instances are created when CDOs are created.</li>
<li class="con"><strong>Lifetime unclear:</strong> Requires careful programming
and clear intentions to manage the lifetime of singletons.</li>
</ul>


## Unreal Subsystems

Unreal has something it calls
[Subsystems](https://docs.unrealengine.com/en-US/ProgrammingAndScripting/Subsystems/index.html), that can be used to create globally-accessible modules that have explicitly-defined lifecycles.

Your subsystem's lifetime will match the lifetime of its parent. There are
5 different parent classes to choose from (see below). More info on their lifecycle can be found in the [documentation](https://docs.unrealengine.com/en-US/ProgrammingAndScripting/Subsystems/index.html).

| Subsystem | Parent Class | Lifetime |
|---|---|---|
| Engine | `UEngineSubsystem` | Both in editor and in-game, I think. |
| Editor | `UEditorSubsystem` | When the Editor starts. |
| GameInstance | `UGameInstanceSubsystem` | As soon as your game starts, stays alive until the game is closed. |
| LocalPlayer | `ULocalPlayerSubsystem` | Matches the lifetime of its parent `ULocalPlayer`, can move between levels.
| World | `UWorldSubsystem` | Matches its parent `UWorld`, is effectively per-level. |

Benefits over vanilla C++ singletons:

<ul class="procon">
<li class="pro"><strong>Lifetime is automatically managed:</strong> Subclassing the correct Subsystem ensures that the instance will be created and destroyed for you.</li >
<li class="pro"><strong>Desired lifetime is made explicit:</strong> It is
clear that a Subsystem that inherits from <code>UWorldSubsystem</code> will only exist as
long as a World.</li>
<li class="pro">Cleaner Blueprint access.</li>
<li class="pro">Accessible in Python scripts.</li>
<li class="con">Requires some understanding of the lifecycles of a few Unreal classes.</li>
<li class="con">Have to learn Unreal's access style instead of <code>MyClass::GetInstance()</code></li>
</ul>


### Accessing Subsystems from C++

```cpp
UGameInstance* GameInstance = ...;
UMyGameSubsystem* MySubsystem = GameInstance->GetSubsystem<UMyGameSubsystem>();

ULocalPlayer* LocalPlayer = ...;
UMyPlayerSubsystem* MySubsystem = LocalPlayer->GetSubsystem<UMyPlayerSubsystem>();
```

### Example Usage

Imagine that we want to save player telemetry as they progress through the
game, from the main menu to in-game. We could create a subclass of
`UGameInstanceSubsystem` called `UTelemetrySubsystem`. Our telemetry class
would be instantiated as soon as the game starts, and all logic related to
telemetry would be stored within that subsystem.


### Subsystem Base Class

```cpp
UCLASS(Abstract)
class ENGINE_API USubsystem : public UObject
{
	GENERATED_BODY()

public:
	USubsystem();

	/** Override to control if the Subsystem should be created at all.
	 * For example you could only have your system created on servers.
	 * It's important to note that if using this is becomes very important to null check whenever getting the Subsystem.
	 *
	 * Note: This function is called on the CDO prior to instances being created!
	 */
	virtual bool ShouldCreateSubsystem(UObject* Outer) const { return true; }

	/** Implement this for initialization of instances of the system */
	virtual void Initialize(FSubsystemCollectionBase& Collection) {}

	/** Implement this for deinitialization of instances of the system */
	virtual void Deinitialize() {}

private:
	friend class FSubsystemCollectionBase;
	FSubsystemCollectionBase* InternalOwningSubsystem;

};
```


## Caveats

Massive thanks to [Guillaume Pastor](https://guillaumepastor.com/) for letting
me know some of the caveats with using Subsystems:

### Working With Data

There is no way to make a blueprint subclass of a Subsystem that I know of, so
to expose data for designers to control, you have to come up with an
alternative method.

Guillaume hit upon using
a [`UDeveloperSettings`](https://nerivec.github.io/old-ue4-wiki/pages/customsettings.html#Using_Auto-discovery_Settings)
`UPROPERTY()`, to let designers choose a DataTable, and then doing all the data
customization within that DataTable. It's not as nice as just Blueprint subclassing the Subsystem, but it works!

