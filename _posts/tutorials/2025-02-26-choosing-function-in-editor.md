---
title:  "Choosing a Function in the Editor"
excerpt: "Make a picker show up in the Details panel, and let users create their own matching functions."
date:   2025-02-26 00:00:00 +0000
tags:
- cpp
- blueprint
- editor
header:
  inline-image: /assets/unreal/choosing-function-dropdown.webp
---

Imagine you want to let users select which function will be called but just by changing some data. There's a way to do this in Unreal by using the `FunctionReference` UPROPERTY specifier.

To see how it works, let's imagine we have a game where enemies are triggered based on the value of a dice. When designers are creating new enemies, we want to be abel to set up some of the logic just by setting properties, and avoid using the Blueprint Graph. We want designers to be able to choose the function that gets called. Whether that's a **Blueprint function they make themselves**, or an existing function that's **defined in C++**. The functions could be something like "is the value on the dice _even_?" or "is the value greater than 3?".

## Creating the Property

{%
include figure-begin.html
code="cpp"
%}
```cpp
UCLASS(Blueprintable)
class ASomeTestActor : public AActor
{
	GENERATED_BODY()

protected:
    virtual void BeginPlay() override;

    // This is the function we will use to see if the dice passes.
    // It can use an existing function from a function library, or we can define our own.
	UPROPERTY(EditAnywhere, meta=(FunctionReference, AllowFunctionLibraries, PrototypeFunction="/Script/MyProject.DiceFunctionLibrary.Prototype_DiceCheck", DefaultBindingName="CheckDiceValue"))
	FMemberReference DiceCheck;
};
```
{%
include figure-end.html
%}

What the `UPROPERTY` parts do:
- `FunctionReference`: **(Required)** This makes Unreal show the dropdown picker in the editor. 
- `AllowFunctionLibraries`: If you want to be able to choose functions in function libraries, add this. Otherwise it will only let you pick functions within the same class, as far as I can tell.
- `PrototypeFunction`: **(Required)** Path to a function that has the signature that you want selectable functions to have.
- `DefaultBindingName`: If the user clicks "Create Binding", the function will be called this, prefixed with "On".

We need to define the signature of the functions we want to allow in our `FMemberReference`. And we can also implement some functions that match that signature so users can choose them. 


## Defining Functions to Use

{%
include figure-begin.html
code="cpp"
%}
```cpp
UCLASS(MinimalAPI)
class UDiceFunctionLibrary : public UBlueprintFunctionLibrary
{
	GENERATED_BODY()
	
public:
#if WITH_EDITOR
	// This Prototype function defines the signature of the function for the editor
	UFUNCTION(BlueprintInternalUseOnly)
	bool Prototype_DiceCheck(int32 DiceValue) { return false; }
#endif
	
    // Only do the thing if the number is even
	UFUNCTION(BlueprintCallable)
	bool OnlyOnEven(int32 DiceValue) { return (DiceValue % 2) == 0; }
	
    // Only do the thing if the number is even
	UFUNCTION(BlueprintCallable)
	bool OnlyOnOdd(int32 DiceValue) { return (DiceValue % 2) == 1; }
};
```
{%
include figure-end.html
%}


## In the Editor

In the editor, create a Blueprint subclass of `SomeTestActor`. Then click on the drop-down that's to Dice Check. It should show a list of _all_ functions that match the signature. Note that some standard Unreal functions match this very simple signature and show up in the list.

{% include img.html file="unreal/choosing-function-dropdown.webp" %}

It's also possible for people to use _Create Binding_ and create their own functions in Blueprint.

{% include img.html file="unreal/choosing-function-custom-function.webp" %}



## Calling the Function

Calling the function requires more work than just calling a regular C++-defined function but this is how you do it. 

{%
include figure-begin.html
code="cpp"
%}
```cpp
void ASomeTestActor::BeginPlay()
{
	Super::BeginPlay();
	
	if (UFunction* Func = DiceCheck.ResolveMember<UFunction>(GetClass()))
	{
		const int32 TheDiceValueWeWantToUse = FMath::RandRange(1, 6);
			
		// ProcessEvent deals with raw memory, so let's set up some memory to be used
		// This is just an anonymous struct, the syntax looks kind of funky though
		struct {
			int32 DiceValue;
			bool bResult;
		} Args = { TheDiceValueWeWantToUse, false };

		// This will collect our results
		FStructOnScope FuncParam(Func);
		
		// Call our function with our parameters
		this->ProcessEvent(Func, &Args);
		const FString TrueFalse = Args.bResult ? "True" : "False";
		UE_LOG(LogTemp, Display, TEXT("Called function '%s' with '%d' was '%s'"), *Func->GetDisplayNameText().ToString(), TheDiceValueWeWantToUse, *TrueFalse);
	}
}
```
{%
include figure-end.html
%}

Hopefully from this you can let users pick functions to be called just through configuration!

## Supporting Blueprint-defined Functions in Blueprint Function Libraries

Hoo boy. So if you want to be able to select functions that are defined purely in Blueprint, I've tried a bunch of stuff but I haven't maanged to get it to work.

If you can work out how to do this I would love to hear about it. Here is what I have worked out so far.

If you define a Blueprint-only function in a Blueprint Function Library, when it is called it seems to have a hidden `WorldContextObject` parameter that is added to it. So you need to make sure your `FunctionReference` signature has that.

{%
include figure-begin.html
code="cpp"
%}
```cpp
#if WITH_EDITOR
	// This Prototype function defines the signature of the function for the editor
	UFUNCTION(BlueprintInternalUseOnly)
	bool Prototype_ForBlueprintOnly(int32 DiceValue, const UObject* HiddenWorldContextObject) { return false; }
#endif

	UPROPERTY(EditAnywhere, meta=(FunctionReference, AllowFunctionLibraries, PrototypeFunction="/Script/MyProject.DiceFunctionLibrary.Prototype_ForBlueprintOnly", DefaultBindingName="DiceCheck"))
	FMemberReference DiceCheckForBlueprintOnly;
```
{%
include figure-end.html
%}

Doing this does seem to make the Blueprint-defined functions show up in the drop-down list, but they show up twice. Also calling the function causes a crash. This is as far as I've gotten, so far.


## Thanks

Huge thank-you to [Sharundaar](https://sharundaar.github.io/) and [Dylan Dumesnil](https://github.com/DoubleDeez) for helping on this one.

