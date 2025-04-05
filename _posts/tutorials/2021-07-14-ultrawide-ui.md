---
title:   "Ultrawide Monitor UI Support"
excerpt: "How to clamp your UI to an aspect ratio"
date:    2021-07-14 00:00:00 +0000
tags:
- ui
- umg
header:
  inline-image: /assets/unreal/ultrawide-constrained.webp
  teaser: /assets/unreal/ultrawide-support-title.webp
---

One of the UI features that [Industries of
Titan](https://store.steampowered.com/app/427940/Industries_of_Titan/) has been
praised for is ultrawide monitor support.

Before launch we saw a comments asking whether we would support ultrawide, and
post-launch threads popped up from players asking how good the support was.

## Why it matters

Ultrawide monitors are those with an aspect ratio of 21:9, 32:9 or similar.
They're great for providing an immersive experience, but require a bit of
thought when designing the game's UI.

By default, your UI will probably scale to fill the screen, with some elements
being anchored in the corners of the screen. On a 21:9 monitor, this means the
player has to move their mouse (or their eyes) a really huge distance to
interact with things.

**Industries of Titan** is a mouse-based strategy game, so the simplest UX
improvement I could think of would be to clamp the UI so it only filled the
middle of the screen, preserving the 16:9 ratio.

## What it looks like in-game

In the Graphics section of the settings menu, we have a dedicated Ultrawide
support area.

{%
include img.html
file="unreal/widescreen-settings.webp"
title="Players can choose to clamp the UI to the middle of the screen, and
choose the aspect ratio of the clamp."
%}

With the setting applied, the UI is constrained to the middle of the screen
with the aspect ratio chosen by the player.

{%
include img.html
file="unreal/ultrawide-unconstrained.webp"
text="Unconstrained UI in a 21:9 window."
%}

{%
include img.html
file="unreal/ultrawide-constrained.webp"
text="UI constrained to 16:9 within a 21:9 window."
%}


## Unreal Implementation

The simplest way I could think of to support this was to create a new
"Widescreen Panel" UserWidget, and use it to wrap the rest of the UI widgets.

It uses a SizeBox widget to clamp its contents to the player's chosen aspect
ratio, and a NamedSlot to allow me to place things inside instances of it.

This is the widget hierarchy inside `WBP_WidescreenPanel`

<pre>
Root
&#x2514; WidescreenRatioSizeBox
  &#x2514; ContentSlot
</pre>


### BYGUWWidescreenPanel.h 

{%
include figure-begin.html
title="BYGUWWidescreenPanel.h"
code="cpp"
%}
```cpp
// Copyright Brace Yourself Games. All Rights Reserved.

#pragma once

#include "Blueprint/UserWidget.h"
#include "BYGUWWidescreenPanel.generated.h"

class UBYGSizeBox;

UCLASS(Blueprintable, Abstract)
class UBYGUWWidescreenPanel : public UUserWidget
{
	GENERATED_BODY()

protected:
	virtual void NativeConstruct() override;

	UPROPERTY(meta = (BindWidget))
	TObjectPtr<UBYGSizeBox> WidescreenRatioSizeBox;

	UFUNCTION()
	void OnSettingsChanged();

	void UpdateWidescreenRatioSizeBox();
};
```
{%
include figure-end.html
%}

### BYGUWWidescreenPanel.cpp

{%
include figure-begin.html
title="BYGUWWidescreenPanel.h"
code="cpp"
%}
```cpp
// Copyright Brace Yourself Games. All Rights Reserved.

#include "BYGUWWidescreenPanel.h"
#include "Titan/Core/BYGGameUserSettings.h"
#include "Components/SizeBox.h"
#include "Titan/Util/BYGGameplayStatics.h"

void UBYGUWWidescreenPanel::NativeConstruct()
{
	Super::NativeConstruct();

	if (UBYGGameUserSettings* GameSettings = UBYGGameplayStatics::GetBYGGameUserSettings())
	{
		GameSettings->OnSettingsChangedDelegate.AddUniqueDynamic(this, &UBYGUWWidescreenPanel::OnSettingsChanged);
		GameSettings->OnSettingsAppliedDelegate.AddUniqueDynamic(this, &UBYGUWWidescreenPanel::OnSettingsChanged);
	}
	UpdateWidescreenRatioSizeBox();
}

void UBYGUWWidescreenPanel::OnSettingsChanged()
{
	UpdateWidescreenRatioSizeBox();
}

void UBYGUWWidescreenPanel::UpdateWidescreenRatioSizeBox()
{
	
	if (UBYGGameUserSettings* GameSettings = UBYGGameplayStatics::GetBYGGameUserSettings())
	{
		if (GameSettings->UIWidescreenClampEnabled.GetCurrentValue())
		{
			const FIntVector2D Vec = GameSettings->UIWidescreenClampRatioVec.GetCurrentValue();
			WidescreenRatioSizeBox->SetMaxAspectRatio(Vec.X / (float)Vec.Y);
		}
		else
		{
			WidescreenRatioSizeBox->ClearMaxAspectRatio();
		}
	}
}
```
{%
include figure-end.html
%}


## Custom USizeBox

**Update: January 2024**

Huge thanks to DanteSSS333 for making a [pull request on GitHub](https://github.com/EpicGames/UnrealEngine/pull/11213) that fixes this. It looks like it was accepted into the engine on January 23 2024.

**Update: 2021-07-16**

When I originally wrote this I hadn't realised that I was using a customized
version of `USizeBox`. `UBYGSizeBox` uses a customized version of `SBox` that
aligns the contents ot the center of the widget rather than the left.

To use a custom `SBox` you will need to create a custom version of `USizeBox`.

```cpp
void BYGSBox::OnArrangeChildren(const FGeometry& AllottedGeometry, FArrangedChildren& ArrangedChildren) const
{
	// ...

	if (NewHeight > MaxHeight)
	{
		float Scale = MaxHeight / NewHeight;
		NewWidth *= Scale;
		NewHeight *= Scale;
	}

	XAlignmentResult.Size = NewWidth;
	YAlignmentResult.Size = NewHeight;

	// CHANGE: Force contents to be center-aligned, not left-aligned
	XAlignmentResult.Offset = (MaxWidth - NewWidth) / 2.0f;
	YAlignmentResult.Offset = (MaxHeight - NewHeight) / 2.0f;
	// CHANGE

	bAlignChildren = false;

	// ...
}
```

<iframe src="https://store.steampowered.com/widget/427940/" frameborder="0" width="100%" height="190"></iframe>
