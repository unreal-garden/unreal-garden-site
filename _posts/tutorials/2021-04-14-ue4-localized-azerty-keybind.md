---
title:  "Supporting Localized Keybindings"
excerpt:  "Setting defaults for AZERTY, QWERTZ keyboards"
date:   2021-04-14 00:00:00 +0000
toc: false
classes: wide
tags:
- ui
- localization
- cpp
header:
  inline-image: /assets/unreal/localized-keybindings-title.webp
  teaser: /assets/unreal/localized-keybindings-small.webp
---


First we can detect whether the player is using a keyboard with an AZERTY or QWERTZ layout by copying this useful snippet from UE4's `InputSettings.cpp` 

```cpp
#if PLATFORM_WINDOWS
#include "Windows/WindowsHWrapper.h"
#endif

bool bIsAzertyKeyboard = false;
bool bIsQwertzKeyboard = false;
#if PLATFORM_WINDOWS
switch (PRIMARYLANGID(LOWORD(GetKeyboardLayout(0))))
{
case LANG_FRENCH:
	bIsAzertyKeyboard = true;
	break;
case LANG_GERMAN:
	bIsQwertzKeyboard = true;
	break;
}
#endif
```

Next I created a two separate .ini files, one for Azerty and one for Qwertz, in which I stored any keybindings that I wanted to override.

For example in `defaultInputAzertyOverrides.ini`, I change WASD movement
bindings to use ZQSD instead:

```ini
[/Script/Engine.InputSettings]
-ActionMappings=(ActionName="PanLeft",bShift=False,bCtrl=False,bAlt=False,bCmd=False,Key=A)
+ActionMappings=(ActionName="PanLeft",bShift=False,bCtrl=False,bAlt=False,bCmd=False,Key=Q)
-ActionMappings=(ActionName="PanUp",bShift=False,bCtrl=False,bAlt=False,bCmd=False,Key=W)
+ActionMappings=(ActionName="PanUp",bShift=False,bCtrl=False,bAlt=False,bCmd=False,Key=Z)
```

I created some helper classes to make it easier to work out where the .ini
files are stored.

```cpp
UCLASS(config=InputAzertyOverrides, defaultconfig)
class UBUIInputSettings_AZERTY : public UInputSettings
{
	GENERATED_BODY()
};

UCLASS(config=InputQwertzOverrides, defaultconfig)
class UBUIInputSettings_QWERTZ : public UInputSettings
{
	GENERATED_BODY()
};
```

The trick is to then use `FConfigFile::Combine` and load your
`defaultInput.ini`, then `defaultInputAzertyOverrides.ini`.  Combine will
respect the `-` and `+` flags and give you a merged `FConfigFile`.

```cpp
FConfigFile InputConfig;
InputConfig.Combine(UInputSettings::GetInputSettings()->GetDefaultConfigFilename());

#if PLATFORM_WINDOWS
switch (PRIMARYLANGID(LOWORD(GetKeyboardLayout(0))))
{
case LANG_FRENCH:
	InputConfig.Combine(GetDefault<UBUIInputSettings_AZERTY>()->GetDefaultConfigFilename());
	break;
case LANG_GERMAN:
	InputConfig.Combine(GetDefault<UBUIInputSettings_QWERTZ>()->GetDefaultConfigFilename());
	break;
}
#endif

// Now loop through merged settings and set up bindings
const FConfigSection* Section = InputConfig.Find("/Script/Engine.InputSettings");
if (Section)
{
	for (const auto& Pair : *Section)
	{
		// ...
	}
}
```

As to where to do this snippet, it kind of depends on your setup, but we do it
within our subclass of `UGameUserSettings`, during our overridden `LoadSettings`
function.

```cpp

void UBUIGameUserSettings::LoadSettings(bool bForceReload /*= false */)
{
	Super::LoadSettings(bForceReload);

	// Do our local override stuff mentioned above
}
```
