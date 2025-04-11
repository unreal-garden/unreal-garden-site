---
title:  "Using Materials in Unreal UIs"
excerpt:  "How to apply shader effects to your UIs."
date:   2017-06-07 00:00:00 +0000
tags:
- ui
- umg
- material
header:
  inline-image: /assets/unreal/material-complete.webp
  teaser: /assets/unreal/ui-dynamic-materials-title-small.webp
---

For 90% of the time when creating UIs, using static textures inside Image
widgets is good enough. Some of the time static textures are not enough and you
need to display a material.

Luckily the standard Image widget accepts both static textures (`UTexture2D`)
and materials.


## Creating a User Interface Material

First we need to create a material that we can use within our UI. 
> Create > New Material

We want to use our material in our UI so the first thing we do is mark it as
a User Interface material. We want to be able to make our widget
semitransparent so we will set the Blend Mode to Transparent.

{%
include img.html
file="unreal/material-user-interface-material-domain.webp"
title="Material Domain"
text="Set the new material's Material Domain to User Interface."
%}

The material editor gives us a visual graph-based method for creating new
materials. This tutorial won't delve into the details of material creation but
we will create a simple material that will let us desaturate the colour of the
texture that we want to display.

The Image widget has its own Colour property that we use to easily change the
colour of static textures. We can use this property as an input to our material
by using the **VertexColor** node.

{%
include img.html
file="unreal/material-complete.webp"
title="Final Result"
text="Our complete material."
%}



## Creating a Dynamic Material Instance

With our material created it's time to see how to use it in-game and how we can
dynamically change our custom `saturation` parameter.

We will cover two different ways of achieving the same results, one from
Blueprints and the other from pure C++.

We can't set our material on the Image widget and try to change that. Instead
we need to create a new Dynamic Material Instance at run-time, set that to the
Image widget, and keep a reference to it in order to change its values.


### In Blueprints

{%
include img.html
file="unreal/material-blueprint-setup.webp"
title="Setup"
text="Setting up a dynamic material instance in a Blueprint."
%}


### In C++

Assuming we have used the [Bindwidget meta property to make our Image widget
accessible from C++]({% link _posts/tutorials/2017-06-05-ui-bindwidget.md %}), we can create
a new Dynamic Material Instance in C++ and assign it to the widget:

{%
include figure-begin.html
title="MaterialExample.h"
code="cpp"
%}

```cpp
#pragma once

#include "MaterialExample.generated.h"

UCLASS(Abstract)
class UMaterialExample : public UUserWidget
{
	GENERATED_BODY()

public:
	virtual void NativeConstruct() override;

	// We need an Image widget in our Blueprint class named "IconImage"
	UPROPERTY(BlueprintReadOnly, meta = (BindWidget))
	TObjectPtr<UImage> IconImage = nullptr;

	// Our base material that will be the template for our material instance
	UPROPERTY(EditDefaultsOnly)
	TObjectPtr<UMaterialInterface> IconMaterial = nullptr;

	// Our actual material instance
	TObjectPtr<UMaterialInstanceDynamic> IconMaterialInstance = nullptr;

	// A texture we'll set as a parameter to our dynamic material instance
	UPROPERTY(EditDefaultsOnly)
	TObjectPtr<UTexture2D> IconTexture = nullptr;
};

```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="MaterialExample.cpp"
code="cpp"
%}

```cpp
#include "MaterialExample.h"

void UMaterialExample::NativeConstruct()
{
	Super::NativeConstruct();

	// Create dynamic material instance, based on parent
	IconMaterialInstance = UMaterialInstanceDyanmic::Create(IconMaterial, this);

	IconMaterialInstance->SetScalarParameterValue("Strength", 0.8f);
	IconMaterialInstance->SetVectorParameterValue("Color", FLinearColor::Red);
	IconMaterialInstance->SetTextureParameterValue("IconTex", IconTexture);
}
```
{%
include figure-end.html
%}



## UMG Animations and Materials

UMG animations are a little fiddly and under-documented but you can produce
some amazing things with them. One of their best-kept secrets is that **it's
possible to control material properties from UMG animations**.

Using our previous desaturation example, it's possible to control the
saturation scalar parameter from a UMG animation.

{%
include img.html
file="unreal/material-animation.gif"
title="UMG Material Animations"
text="5-step process to create an animation that controls a material parameter."
%}

* [Applying a material to all children of a widget with RetainerBox]({% link _posts/tutorials/2017-05-21-ui-retainerbox.md %}).
* [Controlling material properties from UMG animations]({% link _posts/tutorials/2017-05-20-ui-animation.md %}).
* [Dynamically updating widget appearance in-editor with `SynchronizeProperties`]({% link _posts/tutorials/2017-05-21-ui-synchronize-properties.md %}).
