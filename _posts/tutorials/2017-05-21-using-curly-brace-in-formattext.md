---
title:  "Using Curly Braces in FormatText"
excerpt:  "tldr; prefix them with backticks"
date:   2017-07-06 00:00:00 +0000
last_modified_at:   2024-12-07 00:00:00 +0000
tags:
- blueprint
- umg
- text
- localization
classes: wide
toc: false
---

Edit: Previously I incorrectly said that you had to surround curly braces with backticks, but in fact you have to **prefix with backticks**. Thank you [dobacetr for pointing out this mistake](https://github.com/benui-dev/benui-site/issues/33).

`FText::Format()` is an amazingly useful way of, well, formatting text. It's the
cornerstone to [making easily-localizable
UIs]({% link _posts/tutorials/2017-05-21-ui-localization.md %}).

However what if you want to use a curly brace, `{` or `}` but you **don't want
it to be treated as formatting**?

The escape character in other languages is usually a backslash, but in
FormatText it is a backtick. So put a backtick "`" in front of special
characters like curly braces.

For example if you want to print "Hi {Name}, in format text we use parentheses { and } to set up text to be replaced.", your raw text
You'd need your FormatText text formatting string to look like this:

{%
include figure-begin.html
%}
```
Hi Bobbin, in format text we use parentheses `{ and `} to set up text to be replaced.
```
{%
include figure-end.html
%}

