---
title: "Using the same callback function for many UButtons"
excerpt: "Which button was called? Now you can find out!"
category: unreal
date:   2022-05-01 00:00:00 +0000
tags:
- cpp
header:
  teaser: /assets/unreal/using-same-function-small.webp
  inline-image: /assets/unreal/same-function-many-buttons-transparent.webp
---

**Update:** This issue is now resolved with [Common UI buttons]({% link _posts/tutorials/2022-01-01-common-ui-button.md %}).
{: .notice--info }

One thing that I often hit my head against when starting C++ and UMG:

> I have a bunch of buttons, and I want them to all call the same function when
> they are clicked. Then from that function, I want to know _which_ button was
> clicked.
>
> ... so how the heck do I do that?



There are a few ways to do this!

## Why can't we do this by default?

The standard UMG Button class `UButton` provides `OnClicked`, a _Dynamic
Multicast Delegate_ that is called when a user clicks on the button.

{%
include figure-begin.html
title="Standard UButton example"
code="cpp"
%}
```cpp
void UBUIUWTestWindow::NativeConstruct()
{
	Super::NativeConstruct();

	// Imagine we have an array of buttons already populated
	for (UButton* Button : LotsOfButtons)
	{
		// Here we are binding our "OnButtonWasClicked" function to the dynamic
		// multicast delegate "OnClicked"
		Button->OnClicked.AddUniqueDynamic(this, &ThisClass::OnButtonWasClicked);
	}
}

// The function _has_ to be this signature, with no parameters
void UBUIUWTestWindow::OnButtonWasClicked()
{
	// Uh oh, which button was clicked?
}
```
{%
include figure-end.html
%}

Dynamic Multicast Delegates are great for working with Blueprints, but
unfortunately the one in `UButton` doesn't provide us with any arguments. It
also doesn't allow us to use C++ lambdas to add our own arguments. So we can't
tell which button was clicked.


## So what can we do instead?

### a) Make a Button UserWidget

While this method doesn't technically require us to get our hands dirty in C++,
I'm going to show you how to do it in C++ because I like getting dirty.

First we are going to create a new UserWidget subclass that is going to be our
generic wrapper around `UButton`. It will conceptually represent a Button with
some styling, and importantly let us make our own dynamic multicast delegate
that provides us a way of knowing _which button was clicked_.

We do this by defining a new delegate that has our new button class as
a parameter, and using this new delegate in our new `UUserWidget` button class.

**Note on Naming Convention:** I like to preface all my classes with `BUI` to make it
clear that I made them. At Brace Yourself Games we use the preface `BYG` for
our code.
Then `UW` is what I use for UserWidget subclasses.
{:.notice--info }

```cpp
DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FBUIOnClickedSignature, class UBUIUWButton*, Button);
```


{%
include figure-begin.html
title="BUIUWButton.h"
code="cpp"
%}
```cpp
#pragma once

#include "Blueprint/UserWidget.h"
#include "BUIUWButton.generated.h"

DECLARE_DYNAMIC_MULTICAST_DELEGATE_OneParam(FBUIOnClickedSignature, class UBUIUWButton*, Button);

UCLASS()
class UBUIUWButton : public UUserWidget
{
	GENERATED_BODY()
public:
	// Bind a function with the signature "void OnClicked(UBUIUWButton* Button);
	FBUIOnClickedSignature OnClickedDelegate;
	
protected:
	virtual void NativeConstruct() override;

	// In the Blueprint subclass, make sure you create aButton called "MainButton"
	UPROPERTY(meta=(BindWidget))
	class UButton* MainButton;
	
	UFUNCTION()
	void OnButtonClicked();
	
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="BUIUWButton.cpp"
code="cpp"
%}
```cpp
#include "BUIUWButton.h"
#include "Components/Button.h"

void UBUIUWButton::NativeConstruct()
{
	Super::NativeConstruct();

	MainButton->OnClicked.AddUniqueDynamic(this, &ThisClass::OnButtonClicked);
}

void UBUIUWButton::OnButtonClicked()
{
	OnClickedDelegate.Broadcast(this);
}
```
{%
include figure-end.html
%}

Then instead of creating an array of `UButton` instances, we can create an
array of `UBUIUWButton` instances.

{%
include figure-begin.html
title="Updated example using UUserWidget subclass"
code="cpp"
%}
```cpp
void UBUIUWTestWindow::NativeConstruct()
{
	Super::NativeConstruct();

	for (UBUIUWButton* Button : LotsOfButtons)
	{
		Button->OnClickedDelegate.AddUniqueDynamic(this, &ThisClass::OnButtonWasClicked);
	}
}

// Yay, we now have a parameter
void UBUIUWTestWindow::OnButtonWasClicked(UBUIUWButton* Button)
{
	// We know which button was clicked!
}
```
{%
include figure-end.html
%}

### b) Bind to the Slate Button Widget

As discussed, the UMG `UButton` class dynamic multicast delegate does not
provide us with any arguments, and does not allow us to use lambdas.

On the other hand, the Slate `SButton` that is contained within `UButton`, has
a non-dynamic delegate that _does_ allow us to use lambdas.

Taking our earlier example, here's how we could re-write it to bind to the
`SButton`'s delegate instead.

{%
include figure-begin.html
title="Binding to SButton instead of UButton"
code="cpp"
%}
```cpp
void UBUIUWTestWindow::NativeConstruct()
{
	Super::NativeConstruct();

	// Imagine we have an array of buttons already populated
	for (int32 i = 0; i < Buttons.Num(); ++i)
	{
		UButton* Button = Buttons[i];

		SButton* ButtonWidget = (SButton*)&(Button->TakeWidget().Get());
		ButtonWidget->SetOnClicked(FOnClicked::CreateLambda([this, i]()
		{
			OnClicked(i);
			return FReply::Handled();
		}));
	}
}

void UBUIUWTestWindow::OnClicked(int32 Index)
{
	// Find the button and do whatever we want
	// The argument passed in here doesn't have to be an int32
}
```
{%
include figure-end.html
%}


### c) Use CommonUI Button

[CommonUI is a plugin from Epic]({% link
_posts/tutorials/2021-12-16-common-ui-intro.md %}) released with Unreal Engine
4.27 and 5.0. It is still somewhat experimental but has been in use by Epic for
a while. 


One of the things it adds is [a new button class]({% link
_posts/tutorials/2022-01-01-common-ui-button.md %}) that addresses some of the
issues with `UButton`:

* On-Click delegates pass a pointer to the button that clicked them, useful when binding many button instances to the same function.
* Centralized styling using assets.
* Support for a Selected state, useful for making toggle-able buttons.
* Centralized text styling, using the same text style asset as the Common Text widget.
* Tooltip shows even when the button is disabled.
* Minimum desired width/height properties to ensure a standard size for buttons.

So using CommonUI's `UCommonButtonBase` can solve our problem:

{%
include figure-begin.html
title="Using CommonUI's button class"
code="cpp"
%}
```cpp
void UBUIUWTestWindow::NativeConstruct()
{
	Super::NativeConstruct();

	// Now we have an array of UCommonButtonBase*
	for (UCommonButtonBase* Button : Buttons)
	{
		Button->OnClicked.AddUniqueDynamic(this, &ThisClass::OnClicked);
	}
}

void UBUIUWTestWindow::OnClicked(UCommonButtonBase* Button)
{
	// We now know which button was clicked!
}
```
{%
include figure-end.html
%}



### d) Write your own Button class

This is the most time-consuming of the solutions but it has its benefits. By
writing your own alternative to `SButton` and `UButton`, you can add whatever
functionality you like, including changing the signatures of any `OnClicked`
delegates you might add.

Rather than writing entirely new button classes from scratch, for [Industries
of Titan](https://benui.ca/about/industries-of-titan) I duplicated `SButton`,
`UButton` and their slot classes, renamed a stuff till it compiled and then
gradually added the functionality I needed. 


## Conclusion

Hopefully this should give you at least one solution that works for you!

Thank you to _Hash Buoy_ for asking this question on the [Discord]({%
link _posts/tutorials/2022-01-01-ui-discord.md %}). If you are interested in
joining the discussion, come and say hi!

