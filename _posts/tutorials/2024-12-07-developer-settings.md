---
title:  "Developer Settings"
excerpt: "Project-specific settings done the easy way"
date:   2024-12-07 00:00:00 +0000
tags:
- editor
---

Developer Settings are a quick and easy way of creating Project-wide settings that show up under Project Settings.

You could use them for creating defaults that your game uses that are not tied to a particular game mode, and without having to make a custom subclass of Game Instance


## Basic Version

Required:
- Subclass `UDeveloperSettings`.
- Set `CategoryName` through the constructor. Also setting SectionName is a good idea.
- Add some properties tagged with [`EditAnywhere`]({% link _pages/docs/uproperty.md %}#editanywhere) and [`Config`]({% link _pages/docs/uproperty.md %}#config).
- Tag your class with [`Config`]({% link _pages/docs/uclass.md %}#config) and [`DefaultConfig`]({% link _pages/docs/uclass.md %}#defaultconfig).

You can create multiple subclasses of `UDeveloperSettings` to keep unrelated settings in separate files. 

{%
include figure-begin.html
title="MyGameSettings.h"
code="cpp"
%}
```cpp
#pragma once

#include "Engine/DeveloperSettings.h"
#include "MyGameSettings.generated.h"

UCLASS(config=Game, DefaultConfig)
class UMyGameSettings : public UDeveloperSettings
{
	GENERATED_BODY()

public:
	UMyGameSettings(const FObjectInitializer& ObjectInitializer);
	
protected:
	UPROPERTY(Config, EditAnywhere)
	int32 DogCount = 0;
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="MyGameSettings.cpp"
code="cpp"
%}
```cpp
#include "MyGameSettings.h"

UMyGameSettings::UMyGameSettings(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	// Large text for where settings should be grouped on the left
	CategoryName = "Project";

	// Smaller sub-heading for grouping
	SectionName = "Some Settings";
}
```
{%
include figure-end.html
%}

I would recommend setting `CategoryName` to `"Project"` so your settings show up in the standard "Project" category at the top of the list.
Otherwise if you set CategoryName to something new, it will appear at the bottom of the settings list.

## Using In-game

To access these settings in-game, you can use the following:

{%
include figure-begin.html
code="cpp"
%}
```cpp
const UMyDeveloperSettings* Settings = GetDefault<UMyDeveloperSettings>();
Settings->DogCount ... // do something with this
```
{%
include figure-end.html
%}


## Advanced Version

This way allows you to change the name that is shown in the left-hand list.

{%
include figure-begin.html
title="MyGameSettingsAdvanced.h"
code="cpp"
%}
```cpp
#pragma once

#include "Engine/DeveloperSettings.h"
#include "MyGameSettingsAdvanced.generated.h"

UCLASS(config=Game, DefaultConfig)
class UMyGameSettingsAdvanced : public UDeveloperSettings
{
	GENERATED_BODY()

public:
	//~ Begin UDeveloperSettings interface
	virtual FName GetCategoryName() const;
#if WITH_EDITOR
	virtual FText GetSectionText() const override;
	virtual FText GetSectionDescription() const override;
#endif
	//~ End UDeveloperSettings interface
	
protected:
	UPROPERTY(Config, EditAnywhere, Category="Dog-related Settings")
	int32 DogCount = 0;
	
	UPROPERTY(Config, EditAnywhere, Category="Dog-related Settings")
	FName DefaultDogId = "Bingo";
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="MyGameSettingsAdvanced.cpp"
code="cpp"
%}
```cpp
#include "MyGameSettingsAdvanced.h"

FName UMyGameSettingsAdvanced::GetCategoryName() const
{
	return TEXT("Project");
}

#if WITH_EDITOR
FText UMyGameSettingsAdvanced::GetSectionText() const
{
	return NSLOCTEXT("MyGameSettingsAdvanced", "SomeDoggySettings", "Doggy Settings");
}

FText UMyGameSettingsAdvanced::GetSectionDescription() const
{
	return NSLOCTEXT("MyGameSettingsAdvanced", "SomeDoggySettingsDescription", "Everything related to dogs within the game.");
}
#endif
```
{%
include figure-end.html
%}