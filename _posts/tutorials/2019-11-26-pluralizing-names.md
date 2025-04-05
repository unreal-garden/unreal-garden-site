---
title: "Pluralizing Item Names"
excerpt: "When \"strawberrys\" won't cut it."
date:   2019-11-26 00:00:00 +0000
tags:
- ui
- localization
- text
header:
  inline-image: /assets/unreal/pluralizing-names.webp
  teaser: /assets/unreal/pluralizing-names.webp
---

Say you're making an cooking game, and in your game there are many ingredients: eggs, lemons, ants, acorns etc.
You want to be able to show text like this:

> "You added *3 acorns* to the soup"

You have a bunch of item definitions with their names, but _dang it they're all singular_. You tried slapping an "s" on the end of the word but "strawberrys" isn't making the cut.

You've put all your terms in a localization table and you're [loading it with C++ by using a handy tutorial]({% link _posts/tutorials/2018-02-16-stringtable-cpp.md %})

{%
include figure-begin.html
title="cooking-before.csv"
code="csv"
%}
```csv
Key,SourceString,Comment
Ingredient_Lemon_Name,"lemon",
Ingredient_Strawberry_Name,"strawberry",
Ingredient_Acorn_Name,"acorn",
Drop_Result,"You found {Count} {Ingredient}!",
```
{%
include figure-end.html
%}


## Fixing Our Localization Table

We can use `FText::Format`'s [support for plural forms](https://docs.unrealengine.com/latest/INT/Gameplay/Localization/Formatting/#pluralforms) to describe how each of our words should be pluralized.

`strawberry` now becomes `{Count}|plural(one=strawberry,other=strawberries)`.
This means that if we pass `Count` into `FText::Format`, the correct plural
form will automatically be displayed.

For more information on `FText::Format` see the [tutorial on UI
Localization]({% link _posts/tutorials/2017-05-21-ui-localization.md %}#do-use-formattext)

{%
include figure-begin.html
title="cooking-after.csv"
code="csv"
%}
```csv
Ingredient_Lemon_Name,"{Count}|plural(one=lemon,other=lemons)",
Ingredient_Strawberry_Name,"{Count}|plural(one=strawberry,other=strawberries)",
Ingredient_Acorn_Name,"{Count}|plural(one=acorn,other=acorns)",
Drop_Result,"You found {Count} {Ingredient}!",
```
{%
include figure-end.html
%}

## Adding a C++ Function

Next, we need to make a C++ function that we can use every time we want to
display an item name in single or plural form.

{%
include figure-begin.html
title="MyGameplayStatics.cpp"
text="We could make another function to get the number and the ingredient name
together if we do that often, but returning just the pluralized name is more
useful as a single-purpose function."
code="cpp"
%}
```cpp
FText UMyGameplayStatics::GetIngredientName(FString IngredientName, int32 Count)
{
	FString Key = FString::Printf("Ingredient_%s_Name", *IngredientName);

	FText UnformattedText = FText::FromStringTable("MyTable", Key);

	FFormatNamedArguments Args;
	Args.Add("Count", Count);
	return FText::Format(UnformattedText, Args);
}
```
{%
include figure-end.html
%}

Now whenever we need to show an ingredient name we pass in how many we're showing, and we can get the correct plural form!

{%
include figure-begin.html
title="ExampleUse.cpp"
code="cpp"
%}
```cpp
struct FLootDrop {
	FString Ingredient;
	int32 Count;
};

FLootDrop Loot { "Strawberry", 3 };

FText PluralizedIngredientName = UMyGameplayStatics::GetIngredientName(Loot.Ingredient, Loot.Count);

FFormatNamedArguments Args;
Args.Add("Ingredient", PluralizedIngredientName);
Args.Add("Count", Loot.Count);

FText LootText = FText::Format(FText::FromStringTable("MyTable", "Drop_Result"), Args));

// LootDropLabel now shows 'You found 3 strawberries!'
LootDropLabel.SetText(LootText);
```
{%
include figure-end.html
%}
