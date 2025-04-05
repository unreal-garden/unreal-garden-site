---
title:  "UPROPERTY EditCondition and CanEditChange"
excerpt: "How to make variables read-only or hidden, based on other variables."
date:   2017-08-06 00:00:00 +0000
tags:
- umg
- blueprint
header:
  teaser: /assets/unreal/ui-synchronize-properties-title-small.webp
---

Sometimes you want to make some properties only available for editing if the
object is a certain type.

Imagine we have a farming game, and we let game designers create plant
definitions. We add a property `FlowerColor`, but we want to make it clear that
this is only used if the plant has flowers.

## Basic Example

We can use the meta flag `meta=(EditCondition="bHasFlowers")` to **make this
property only editable if the `bHasFlowers` value is true**.

Similarly, we can make properties that are only available if a variable is
false with the exclamation-mark prefix. For example
`meta=(EditCondition="!bHasFlowers")`.

It's also possible to use enums for edit conditions `meta=(EditCondition="ToolType == EToolTypes::Wheelbarrow")`.

{%
include figure-begin.html
title="PlantDefinition.h (basic)"
text="A simple way of making a property read-only unless a boolean is true."
code="cpp"
%}
```cpp
UCLASS()
class UPlantDefinition : public UObject
{
	GENERATED_BODY()

	UPROPERTY(EditDefaultsOnly)
	bool bHasFlowers = false;

	// Can only edit this property if "Has Flowers" is true
	UPROPERTY(EditDefaultsOnly, meta = (EditCondition = "bHasFlowers"))
	FLinearColor FlowerColor = FLinearColor::White;

};
```
{%
include figure-end.html
%}


## Advanced Example using `CanEditChange`

In the example above we saw a way of making a property read-only with a boolean
variable. **But what can we do for more advanced conditions?**

We can do this with the `CanEditChange` function, which allows us to write any
kind of conditions we want in C++.

{%
include figure-begin.html
title="PlantDefinition.h (advanced)"
code="cpp"
%}
```cpp
UENUM()
enum class EPlantType
{
	Flower,
	Food,
	Poison
};

UCLASS()
class UPlantDefinition : public UObject
{
	GENERATED_BODY()
public:
// Note the CanEditChange() function is only available when compiling with the editor.
// Make sure to wrap it with the WITH_EDITOR define or your builds fail!
#if WITH_EDITOR
	virtual bool CanEditChange(const FProperty* InProperty) const override;
#endif

protected:
	// What type of plant is this?
	UPROPERTY(EditDefaultsOnly)
	EPlantType PlantType = EPlantType::Flower;

	UPROPERTY(EditDefaultsOnly, Category="Flower")
	FLinearColor FlowerColor = FLinearColor::White;

	UPROPERTY(EditDefaultsOnly, Category="Food")
	int32 FoodAmount = 1;

	UPROPERTY(EditDefaultsOnly, Category="Poison")
	float PoisonDamagePerSecond = 0.25f;
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="PlantDefinition.cpp"
code="cpp"
%}
```cpp
#if WITH_EDITOR
bool UPlantDefinition::CanEditChange(const FProperty* InProperty) const
{
	// If other logic prevents editing, we want to respect that
	const bool ParentVal = Super::CanEditChange(InProperty);

	// Can we edit flower color?
	if (InProperty->GetFName() == GET_MEMBER_NAME_CHECKED(UPlantDefinition, FlowerColor))
	{
		return ParentVal && PlantType == EPlantType::Flower;
	}

	// Can we edit food amount?
	if (InProperty->GetFName() == GET_MEMBER_NAME_CHECKED(UPlantDefinition, FoodAmount))
	{
		return ParentVal && PlantType == EPlantType::Food;
	}

	// Can we edit poison amount?
	if (InProperty->GetFName() == GET_MEMBER_NAME_CHECKED(UPlantDefinition, PoisonDamageperSecond))
	{
		return ParentVal && PlantType == EPlantType::Poison;
	}

	return ParentVal;
}
#endif
```
{%
include figure-end.html
%}

## Conditionally Hiding Options

Update: There's more!

There is another meta flag, `EditConditionHides` that you can use to hide
properties rather than disabling them.

Below is kind of a contrived example, but the idea is that you can use
`EditConditionHides` to hide stuff. As always search the source for more examples
of how it's used.

{%
include figure-begin.html
title="Cow.h"
text="Weird way of describing a cow, either with a number or some text."
code="cpp"
%}
```cpp
UENUM()
enum class ECowSizeType
{
	Number,
	Description,
};

UCLASS()
class UCow
{
	GENERATED_BODY()
protected:
	UPROPERTY(EditAnywhere)
	ECowSizeType SizeType;

	// Only show this property when the size specified using a number
	// e.g. this cow is 5.6 tonnes
	UPROPERTY(EditAnywhere, meta=(EditCondition = "SizeType == ECowSizeType::Number", EditConditionHides)
	float SizeNumber;

	// Only show this property when the size is described with text
	// e.g. this cow is HUGE
	UPROPERTY(EditAnywhere, meta=(EditCondition = "SizeType == ECowSizeType::Description", EditConditionHides))
	FString SizeDescription;
};

```
{%
include figure-end.html
%}

