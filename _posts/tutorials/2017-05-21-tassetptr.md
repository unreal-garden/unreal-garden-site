---
title:  "Asynchronous Loading with TAssetPtr&lt;T&gt;"
excerpt: "In both C++ and Blueprints."
date:   2017-05-21 00:00:00 +0000
tags:
- cpp
- blueprint
header:
  inline-image: /assets/unreal/tassetptr-blueprint-load.webp
---

By default, Unreal is greedy in the way it loads assets, so when you access
a UObject, all of its dependent resources are usually in-memory.  For example,
it's possible to access the texture associated with a `UTexture2D*` or `TObjectPtr<UTexture2D>` variable.

It's also possible to access `TSubclassOf<T>` variables and call
`GetDefaultObject()` without worrying about whether the default object is
in-memory.

Sometimes, however, this greedy-loading can work against us. **Huge assets can be
loaded when they are not needed, increasing our loads times and memory
footprint.**

The way to stop assets being loaded automatically is to use `TAssetPtr<T>` and
`TAssetSubclassOf<T>`:

* `UTexture2D*` or `TObjectPtr<UTexture2D>` becomes `TAssetPtr<UTexture2D>`
* `TSubclassOf<UPlantDefinition>` becomes `TAssetSubclassOf<UPlantDefinition>`

To understand how to use both of these, let's go through an example.


## Defining Our Data

For example imagine you are making a farm simulation game, and your growable
plant properties are defined in inside Blueprint subclasses of
`UPlantDefinition`. Every plant has a large 1024x1024 pixel illustration that
is viewable in an optional "details view" for each plant. It doesn't make sense
for this texture to be loaded when the game starts, as it's almost never seen.
Also if the game has tens of plant types the textures can really impact
memory footprint and load times.


### In Blueprints

{%
include img.html
file="unreal/assetptr-texture.webp"
text="How to create a TAssetPtr type property in Blueprints."
%}


### In C\+\+

Instead our UPlantDefinition class definition would look like this

{%
include figure-begin.html
code="cpp"
%}
```cpp
UCLASS()
class UPlantDefinition : public UDataAsset
{
	GENERATED_BODY()

public:
	UPROPERTY(BlueprintReadOnly, EditDefaultsOnly, Category="Plant")
	TAssetPtr<UTexture2D> LargeImagePtr;
};
```
{%
include figure-end.html
%}

## Loading `TAssetPtr<T>` Data

Asynchronously (and synchronously) loading data is supported in both Blueprints
and C\+\+. Blueprints is a little easier:

### In Blueprints

{%
include img.html
file="unreal/tassetptr-blueprint-load.webp"
text="Loading a Asset ID variable asynchronously in a Blueprint."
%}

The asset returned by **Load Asset** is a plain **UObject** so we must cast it
to our expected type.


### In C\+\+

Life in C\+\+, as always, is a little more *interesting*.



#### Create a `FStreamableManager`

In order to load our `TAssetPtr<T>` resources, we need an instance of FStreamableManager that sticks around. There are a bunch of places you could put this instance, and to be honest I'm not 100% sure where is the "best". You could put it inside GameInstance, a custom game singleton, maybe even GameState.


#### Loading an Array of Assets

{%
include figure-begin.html
code="cpp"
%}
````cpp
void UMyStreamExample::Setup()
{
	TArray<FStringAssetReference> ToStream;

	for (auto SomePtr : MyAssets)
	{
		ToStream.Add(SomePtr.ToStringReference());
	}

	// Getting our StreamableManager
	StreamableManager.RequestAsyncLoad(ToStream,
		FStreamableDelegate::CreateUObject(this,
			UMyStreamExample::OnAssetsLoaded
		)
	);
}

void UMyStreamExample::OnAssetsLoaded()
{
	// Do something
}
```
{%
include figure-end.html
%}

