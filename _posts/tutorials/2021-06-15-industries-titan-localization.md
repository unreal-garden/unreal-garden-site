---
title:   "Industries of Titan Localization"
excerpt: "What I learned along the way."
date:    2021-06-15 00:00:00 +0000
tags:
- ui
- localization
- text
header:
  inline-image: /assets/unreal/localization-titan-japanese-title.webp
  teaser: /assets/unreal/localization-titan-japanese-small.webp
---

We recently finished the bulk of the localization work for [Industries of
Titan](https://store.steampowered.com/app/427940/Industries_of_Titan/),
a city-builder with a tonne of UI text, dialog and tutorials. I have helped
localize another Unreal Engine game so I thought I knew what I was doing, but
it turns out you learn something with every game!

{%
include video
id="fod_c25Ho2g"
provider="youtube"
%}

These are some of the things that surprised me as the UI programmer
supporting localization of an Unreal Engine game.

I've split this into what I learned in general, and some things I learned from
working with an external localization company.


## General Localization Tips


### Concatenation is a Bad Idea

I've [written about how concatenating strings can break localization]({% link _posts/tutorials/2017-05-21-ui-localization.md %}#dont-concatenate-strings),
but I still managed to make decisions that were not localization-compatible.

One in particular was thinking that we could come up with some cool ship names
by having two lists of parts and sticking them together...

| ShipName_Part1 | ShipName_Part2 |
| --- | --- |
| Giant | Hawk |
| Magnificent | Raven |
| Illustrious | Macaw |

**Don't do this**, it won't work in any language with gender (French, German,
Italian etc.), or one in which adjectives can change position (French), and
probably for other reasons I forget right now.

There might have been a way to solve it with a smarter localization system,
choosing different versions of "Giant" depending on the gender of the noun with
which it was paired. In the end we just generated 100 static names and let the
localizers translate them.

| ShipName |
| --- | --- |
| Giant Hawk |
| Giant Raven |
| Giant Macaw |
| Magnificent Raven |
| ...|


### There is no "Placeholder" Text

> "Hey, can you just add this button while we're prototyping this feature?
> There's no need to add its label to the localization table."

I *guarantee* that this placeholder text will end up production and you will get
a report of untranslated text. Ideally you will catch it at the start of your
localization passes, but if the text is hard to find, you might not catch it
before release!

In Unreal Engine C++, some placeholder text might look something like this.

```cpp
MyTextLabel->SetText(FText::FromString("Just Show This"));
```

`FText::FromString` should set off warning bells in your head. There are very
few cases where it is justified.

### Make All Text Localizable from Day 1

In gamedev you want to make the **workflow of each team-member as simple and easy
as possible**. This usually means different solutions for different team-members.

For *Industries of Titan* we used a shared online spreadsheet for defining both
the logic and player-facing text of tutorials. This meant creating scripts to
scrape that tutorial text and add it to the localization table.

It's also important to make sure that **all player-facing text in your game is
in the stringtable**. In Titan, we use "Construction Units" as a measure of
building cost, shortened to "CU". We thought we could keep the text as "CU" for
all languages as it is short, simple and techy, and we would have a tooltip to
explain what CU was short for in every language.

Fortunately, our very helpful localization company politely informed us that:

> You should know that "cu" means "ass" in Brazilian Portuguese.

So we decided to make it localizable.


{%
include img.html
file="unreal/localization-titan-japanese-title.webp"
%}

## Working with A Localization Company

Once you have the groundwork complete, the next steps are to prepare files to
send to a localization/translation company. These tips should help you to make
their job easier and help them produce higher-quality translations.

### Add Comments For All Localization Entries

You should be creating easy-to-understand contextful keys for each of your
localization stringtable entries. e.g. `MainMenu_NewGameButtonLabel`. However
this is not enough.

It's important to understand that translators will do the majority of their
work with _just_ the CSV file you provide them. Their time is too valuable to
spend playing the game. So they need **as much information as possible within the
CSV file itself**.

Your comments should clarify any ambiguity in the text. Here are some of the
questions that we received because we were missing comments:

* "Is 'Research' a noun or a verb in this situation?"
* "In one situation you referred to this character as _*Chief* Waste Management
  Officer_, but in another they are referred to as _Waste Management Officer_.
  Were they promoted in between? Should we differentiate?"
* "What is Xethane?", any technobabble or invented nouns needed clarification.
* "What does this acronym stand for? How is it used?"
* "What is the gender of this speaker? What is their role?"

These are the kind of comments you can add to clarify the text:

| Key | String | Comment |
| --- | --- | --- |
| `mainmenu_newgamebutton` | Start | Button label, verb. |
| `production_inputmodule_minerals` | Input Mineral Modules: | Label preceding a list of all modules that receive Minerals for processing. |
| `dialog_speakername_ai` | AI Construct | Name given to the hybrid artificial intelligence that attacks the player. Technobabble-ish. |


### What to Give to External Localizers

As I've said, translators' time is incredibly precious, they don't have time to
wade through a custom XML file to find strings. Typically localization
companies will want:

* Only CSV/XLS files.
* As few files as possible, ideally **just one**.
* Provide **only modified and new strings**, or tag them so localizers know
  what to work on.

The more files you have, and the more complicated the workflow, the greater
chance you have of strings being missed

### Keep Keys Consistent Between Batches

It is extremely unlikely that your entire game will be localized in a single
pass. Localization takes time, so there's a real possibility that new text will
have been added to your game while localization is happening.

Don't do this:

| Key | String |
| --- | --- |
| `help_page1_title` | Starting a New Game |
| `help_page2_title` | How to Play |
| `help_page3_title` | Winning a Match |

Two weeks after sending the text away to be localized, you decide that you
really want to add another section to the help menu, and you want to put it
right after "How to Play", so your localization table now looks like this:

| Key | String |
| --- | --- |
| `help_page1_title` | Main Menu |
| `help_page2_title` | Starting a New Game |
| `help_page3_title` | How to Play |
| `help_page4_title` | Winning a Match |

You can see that the text and keys have been shifted by one. All the
localizations that come back from the outsourcing company will now be wrong and
have to be done again.

Instead, do this:

| Key | String |
| --- | --- |
| `help_page_mainmenu_title` | Main Menu |
| `help_page_newgame_title` | Starting a New Game |
| `help_page_howtoplay_title` | How to Play |
| `help_page_winning_title` | Winning a Match |

If keys are added, or the English text is changed, the keys will be able to
remain the same.

### Language-specific questions

Depending on the languages you are targeting, you may have to give additional
information to the localization company.

To give you an idea of the kinds of things that might be asked, let's take the
example of translating to Japanese and Chinese. Japanese and Chinese don't have
spaces between words, so technically the text can wrap at any point, even
mid-word. Localizers often prefer to put in manual line breaks to avoid awkward
splitting of words. But in order to do this, they **need to know the number of
characters on a line**.

To help you achieve this, you should:

- Design your UI with a consistent set of widths for text elements.
- Use a consistent set of font sizes.
- Using sample text work out how many characters there are on a line in every
  part of your UI where text will be wrapped.



### Lowercase All Localization Keys

Sometimes a single problem can make you change the way you do things forever.
For all of Industries of Titan's development I didn't think that case in
localization keys was it was a big deal.

When we got our localizations back, a good chunk of them were not being found
and it took me an embarassingly long time to work out that it was because of
case-mismatching.

**Force all of your localization keys to be lowercase**, and you will never
have this issue. When CSV files come back from external localization, you can
force-lowercase the keys just in case.

## Shameless Self-promotion

Industries of Titan is out on Steam Early Access on June 21st!

<iframe src="https://store.steampowered.com/widget/427940/" frameborder="0" width="100%" height="190"></iframe>

## Other Localization-related tutorials

* [BYG Localization Plugin]({% link _posts/tutorials/2021-05-29-byg-localization.md %})
* [Supporting plurals in UE4]({% link _posts/tutorials/2021-02-22-localization-advanced-plurals.md %})
* [Localized Strings Using StringTable and C++]({% link _posts/tutorials/2018-02-16-stringtable-cpp.md %})
* [Unreal UIs and Localization]({% link _posts/tutorials/2017-05-21-ui-localization.md %})


