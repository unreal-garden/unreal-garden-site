---
title:  "Unreal UIs and Localization"
excerpt:  "Common pitfalls to avoid as you implement user interfaces in Unreal."
date:   2017-05-24 00:00:00 +0000
last_modified_at:   2022-05-31 00:00:00 +0000
tags:
- ui
- localization
- text
---


As a UI programmer, you must be aware of localization and support it, or you're
going to have some very frustrated translators and players. Localization is
a huge topic, but for the purposes of this article we will only talk about the
aspects that affect UI design and implementation:

- Making sure that all in-game text is localizable.
- Avoiding practices that break localization.
- Creating a localization-friendly UI.


## Making Sure All In-game Text is Localizable

In order for text to be localizable by Unreal, it must be picked up by the
localization system. Unfortunately this isn't just as simple as entering your
text into Unreal, as **only `FText` variables are localized by Unreal**.


### FText vs FString vs FName

There are a few variable types in Unreal that are used for text. Each
of them has its own specific purpose, and **you need to be careful about which
you use from the start of your project**. It's a lot harder to change these
later on, so it's worth taking the time to understand the differences between
the three.

| FName | FString | FText |
| --- | --- | --- |
| Case-insentitive | Case-sentitive | Case-sensitive |
| Not localized | Not localized | **Localized** |
| Use for IDs | ??? | Use for **all text shown to players** |

Anything that you want to display to players must be localizable, therefore it
**must be stored in an FText variable.**

You need to be a real zealot about this. If other developers on the team are
adding data classes, you need to communicate to them that **any player-facing
text must be stored as `FText`**. 


### Skipping Placeholder Text

There are a lot of places in UIs where your UserWidgets will contain TextBlock
widgets, the contents of which will be replaced at run-time from a data asset.

{%
include img.html
file="unreal/wbp-example-widget.webp"
title="In-Editor Placeholder Text"
text="Example of placeholder text that is dynamically replaced when the game is run. As 'Page Title Text' and 'Button Text' will never be shown to players, it should be marked as 'culture independent' as shown below."
%}

In this example above, by default the placeholder text "Page Title Text" and
"Button Text" will end up in your localization database, and translators will
waste time translating something that will never be seen by players.

Thankfully it's possible to **mark any `FText` fields that shouldn't be
translated as Culture Independent.**

{%
include img.html
file="unreal/culture-invariant.webp"
title="Setting Placeholder Text to Culture-Invariant"
text="Setting a button's placeholder text as not
localizable will remove it from localization results, simplifying the
translators' job."
%}



### Dealing with Enums

If you are using Enums and you want to display them in-game, there is a `EnumToString` function but it simply returns an un-localized string. You need to create some other way of creating an `FText` that is associated with them. Usually the best way is to create a helper library that returns an `FText` when passed the enum.

{%
include figure-begin.html
title="Enum to FText helper function"
text="A way of easily getting `FText` from an enum."
code="cpp"
%}
```cpp
// Return a localized string for the enum EWeatherType
UFUNCTION(BlueprintImplementableEvent, BlueprintCallable, Category = "Weather")
FText GetTextForWeather(EWeatherType Weather) const;
```
{%
include figure-end.html
%}

If you have a centralised Blueprint subclass instance that has this function, you will be able to call it from both C++ and Blueprints, and get the right text for your Enum values. And most importantly these will be localized.



### Localizable Text in Code

This is covered pretty well in the [official documentation for
FText](https://docs.unrealengine.com/latest/INT/Programming/UnrealArchitecture/StringHandling/FText/)
but it bears repeating:

There are two different ways of creating localizable text in code:

* `LOCTEXT("Key", "Text")` requires that you define a namespace somewhere else in the file using `LOCTEXT_NAMESPACE "MyNamespace"`
* `NSLOCTEXT("MyNamespace", "Key", "Text")` lets you specify the namespace
  in-line

{%
include figure-begin.html
code="cpp"
%}
```cpp
// Top of File
#define LOCTEXT_NAMESPACE "FarmGame"

FText TestHUDText = LOCTEXT("Your Key", "Your Text");

#undef LOCTEXT_NAMESPACE
// Bottom of File
```
{%
include figure-end.html
%}



As your game increases in size, it's easy for game text to become spread across
many places: inside UMG widgets, Blueprint Classes for enemies and data, inside
C++ files, etc.

This makes it nearly-impossible for designers, producers etc. to easily find
and change that's shown in-game. They have to find the appropriate widget,
piece of data etc.

[As of 4.16](https://www.unrealengine.com/en-US/blog/unreal-engine-4-16-released), Unreal has a [String
Table asset](https://docs.unrealengine.com/latest/INT/BlueprintAPI/Utilities/StringTable/) that stores keys and localized text values that should help solve this problem.



## Don't break localization

So you've made sure all your text data is stored in FText variables, but
**there are still some things you that can accidentally break
localization** or make it very hard for translators to do their job
well.

### Don't Concatenate Strings

The most obvious and easy way to mess up localization is to concatenate (join
together) strings. The problem with joining together strings is that the
contents of each string is not always guaranteed to be the same between
languages.

For example in your game about cleaning an apartment, your character's log of
things they did could have entries like "Washed dishes", "Ate apple". You could
structure your UI so you have a Verb TextBlock followed by a Thing TextBlock.

However in Japanese, the verb follows the noun, so your game would be
impossible to localize for Japanese without changing the order of UI elements.

This might seem like a contrived example, but there are a few ways to get into
the same situation by accident.


#### Don't Use Blueprint String Concatenation

In Blueprints it's super easy to convert between string types (`FText`, `FString`
and `FName`) and it's equally easy to start concatenating text. Especially when
you're rushing to hit a deadline.

{%
include img.html
file="unreal/localization-concatenation.webp"
title="Avoid String Concatenation"
text="The FString-using node Concatenate might seem
logical for sticking two string variables together. However it is not
localizable."
%}

#### Don't Concatenate with UMG Widgets

By adding GivenNames and FamilyName TextBlock widgets to a HorizontalBox, you're
implictly creating concatenation in the same way as above.

{%
include img.html
file="unreal/localization-widget-concat.webp"
title="Avoid Widget Concatenation"
text="Putting two text widgets in a horizontal box can make life hard for
translators, as the two words can be in different orders in other languages."
%}


### Do Use FormatText

The solution to all of this concatenation mess is to use [FormatText](https://docs.unrealengine.com/latest/INT/Gameplay/Localization/Formatting/). FormatText uses a string to define how some text should be displayed, and **the format string itself is localizable**. Using our previous name example, we would create an `FText` `"{GivenNames} {FamilyName}"`, that defines how full names should be displayed in English.

In Japanese, this string could be localized to `"{FamilyName} {GivenName}"`, to
allow names to be shown in their preferred order.

{%
include img.html
file="unreal/localization-formattext.webp"
title="Do Use Format Text"
text="FormatText is the correct way of joining
these two variables. The format text itself is localizable and so the word
order can be changed in other languages."
%}

{%
include figure-begin.html
title="Format Text in C++"
text="The blueprint example above could be written in C++ like this."
code="cpp"
%}
```cpp
// Assuming we have been passed two FText variables, GivenNames and FamilyName
FFormatNamedArguments Args;
Args.Add("GivenNames", GivenNames);
Args.Add("FamilyName", FamilyName);

FText FormattedText = FText::Format(
	NSLOCTEXT("MyNamespace", "FullNameFormat", "{GivenNames} {FamilyName}"),
	Args
);

NameLabel->SetText(FormattedText);
```
{%
include figure-end.html
%}

FormatText has some other incredibly useful features, in particular [pluralization](https://docs.unrealengine.com/latest/INT/Gameplay/Localization/Formatting/#pluralforms), and [different forms for gendered languages like French](https://docs.unrealengine.com/latest/INT/Gameplay/Localization/Formatting/#genderforms)

In the example below, if `NumCats` is 1, it outputs "There is 1 cat.", but in
other cases, like zero, 2 or 3, it outputs "There are X cats."

{%
include figure-begin.html
title="FormatText Plurals"
text="FormatText supports plural versions of words depending on values provided."
code="cpp"
%}
```
"There {NumCats}|plural(one=is,other=are) {NumCats}
{NumCats}|plural(one=cat,other=cats)"
```
{%
include figure-end.html
%}


Note that FormatText is not "free" in terms of performance. It's still the only way to make localizable strings, but you should avoid doing it every frame. See the [article on UMG and performance]({% link _posts/tutorials/2017-05-21-ui-performance.md %}) for more details.



## Making a Localization-friendly UI

At this point if you've followed the advice above, you should have all of the
player-facing text in your game localizable, and you should have set up your UI
in such a way that localization efforts will not be broken by your UI layout.

The final step is to **make some efforts to make your UI work really well in
all languages.**


### Text Length

When designing your game's UI, it was probably done in a single language.
Artists may have designed buttons to fit the size of the text that they
contain. For example a "Start" button might only be the size of 5 characters
plus a little bit of margin.

To make your UI work with multiple languages, you will need to consider how
your TextBlock widgets and their surrounding widgets will react when your
default text is replaced by much longer or much shorter text.

There are a few behaviours you can implement to handle this:


#### Scale Text to Fit

This is often the simplest to implement, but can lead to the ugliest results.
Wrapping your TextBlock with a ScaleBox will force the text to be shown in
a smaller size if it does not fit the container.

<ul class="procon">
<li class="pro">All text is *visible*</li>
<li class="con">In extreme cases text will not be *readable*</li>
<li class="con">A large variety of texts sizes in a UI can look ugly</li>
</ul>

#### Wrap Text

Set an explicit width on the container element using a **SizeBox** and set your
widget to scale to content but only vertically.

<ul class="procon">
<li class="pro">Text size is preserved</li>
<li class="con">Container element's size can change significantly</li>
<li class="con">Generally only works for larger blocks of text</li>
</ul>

#### Clip Text With Ellipsis (&hellip;)

When the text is longer than the container allows, you replace the last word or
last few characters of the word with an [ellipsis character
"&hellip;"](https://en.wikipedia.org/wiki/Ellipsis) to show it has been
clipped.

This is not supported by Unreal by default and would require you to write some
custom C++ code to do it.

<ul class="procon">
<li class="pro">Preserve text size</li>
<li class="pro">Preserve container widget size</li>
<li class="con">Can cut off important information</li>
<li class="con">What text is cut off is unknown to translators unless they play the game</li>
<li class="con">Can look kind of ugly</li>
</ul>

#### Marquee

Scrolling or bouncing text within a box, so some of it is clipped. Think of
scrolling text that's shown on a LED billboard.

This is not supported by Unreal by default and would require you to write some
custom C++ code to do it.

If your UI is sci-fi or futuristic, this could fit quite well with the
aesthetic. But for a game about elves and wizards, a marquee would probably be
out of place.

<ul class="procon">
<li class="pro">Preserve container widget size</li>
<li class="con">Only works with very short text</li>
<li class="con">Depending on UI style, could not fit</li>
</ul>



### Right-to-Left languages

If you've achieved all of this, you could consider how you to support both
left-to-right and right-to-left languages (e.g. Arabic, Hebrew, Persian, Urdu).

This is not just a simple case of replacing text as with left-to-right
languages. To have a truly natural-feeling UI, you will need to flip entire
elements or entire screens for your UI to feel natural to right-to-left
language users.

[Google's UI guideline documents on
Bidirectionality](https://material.io/guidelines/usability/bidirectionality.html#bidirectionality-ui-mirroring-overview)
give a good starter as to what you would need to change in your UI to support
right-to-left.


## Testing Localization Coverage

One of the most common problems in the localization process is certain strings
not being picked up by localization. For example an on-screen label that is
filled by a `FString`.

One way to test this is to use Unreal Engine's "leetify" or "leettspeak" flag.
When the flag is present, Unreal will "translate" all on-screen text to
[Leetspeak](https://en.wikipedia.org/wiki/Leet). Any text that is _not_
transformed is text that is not being picked up by Unreal's localization
system.

To activate the leetspeak mode, you can either:

* Adding the `-leet` flag to a shortcut to a built `.exe`
* Add `-leet` to `Editor Preferences > Play In Standalone Game > Additional Launch Parameters`

{%
include img.html
file="unreal/localization-leet.webp"
title="Leetified Industries of Titan"
text="The text is just about readable to navigate the game, and any unmodified
text is immediately obvious."
%}


## Conclusion

We covered:

- Making sure that all in-game text is localizable by using `FText`
- Avoiding practices that break localization, in particular **concatenation**
- Creating a localization-friendly UI, by being aware of how text length can
  change in other languages.


