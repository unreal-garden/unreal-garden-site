---
title: "Localization: Advanced Plurals"
excerpt: "More than just \"one\" and \"other\""
date:   2021-02-22 00:00:00 +0000
tags:
- ui
- localization
- text
---

Previous tutorials have covered setting up basic [item pluralization]({% link _posts/tutorials/2019-11-26-pluralizing-names.md %}), and [localization practices in general]({% link _posts/tutorials/2017-05-21-ui-localization.md %}).
In this tutorial we will cover setting up pluralization rules for languages
with more complex rules like Polish and Russian, and how to find out the rules
for any language.

You will need this information when you send your [centralized localization
file]({% link _posts/tutorials/2018-02-16-stringtable-cpp.md %}) to localizers.

## The Basics in English

We can use `FText::Format` to output "day" or "days" depending on the value of
`NumDays`. In English we use a singlar form when there is 1 of something (day),
and plural in all other situations (0 day, 2 days, 123 days).

{%
include figure-begin.html
title="Simple Plural Example in English"
text="Will output 1 day, 2 days etc. depending on the value of NumDays"
%}
```
{NumDays} {NumDays}|plural(one=day,other=days)
```
{%
include figure-end.html
%}

## Languages Other than English

Not all languages follow the same rules as English.

The [Unicode Langauge Plural Rules
document](https://unicode-org.github.io/cldr-staging/charts/37/supplemental/language_plural_rules.html)
describes how each language changes words according to pluralization rules.

{%
include figure-begin.html
title="English Plural Rules"
%}
| Name | Category | Examples | Minimal Pairs |
| --- | --- | --- | --- |
| English | one | 1 | 1 day |
| | other | 0, 2~16, 100, 1000, 10000, 100000, 1000000, ... | 2 days |
| | | 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, ... | 1.5 days |

{%
include figure-end.html
%}

`FText::Format` uses the same keywords shown in the **Category** column to allow
localizers to specify what word should be used for different values of the number.

Let's go through an example with more complex plural rules that English.

### Polish Example

We will use Polish as an example. In Polish, there are different forms of the word for when there number is 1, for when the number
ends in 2~4 (with 12~14 excluded), and for 0 and 5~19. This is explained in the [Polish section of the Unicode
document](https://unicode-org.github.io/cldr-staging/charts/37/supplemental/language_plural_rules.html#pl)

{%
include figure-begin.html
title="Polish Plural Rules"
text="'Minimal Pairs' column contains Polish examples for 1 month, 2 months etc."
%}
| Name | Category | Examples | Minimal Pairs |
| --- | --- | --- | --- |
| Polish | one | 1 | 1 miesi&#261;c |
| | few | 2~4, 22~24, 32~34, 42~44, 52~54, 62, 102, 1002, ... | 2 miesi&#261;ce |
| | many | 0, 5~19, 100, 1000, 10000, 100000, 1000000, ... | 5 miesi&#281;cy | 
| | other | 0.0~1.5, 10.0, 100.0, 1000.0, 10000.0, 100000.0, 1000000.0, ... | 1,5 miesi&#261;ca  |

{%
include figure-end.html
%}

We can use this information, in particular the **Category** column to create a Polish translation, with correct plural rules to be used by `FText::Format`.

{%
include figure-begin.html
title="Polish translation using correct plural forms"
%}
```
{NumMonths} {NumMonths}|plural(one=miesiąc,few=miesiące,many=miesięcy,other=miesiąca)
```
{%
include figure-end.html
%}

I didn't find much documentation for this feature online, so hopefully this will help you in localizing your game into other languages!
