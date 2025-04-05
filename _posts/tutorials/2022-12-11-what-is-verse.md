---
title:  "What's the deal with Verse?"
excerpt: "No boolean? Const everything? Out-of-order evaluation?"
date:   2022-12-11 00:00:00 +0000
tags:
- cpp
---

**Disclaimer:** My aim here is to summarize the most recent Verse information
and translate some of the more technical parts into concrete examples for an
audience familiar with C++. This is based on what they have announced as of
December 2022, and my own limited interpretation of it.
{:.notice--error }

**tl;dr:** I'm kind of stupid, I get stuff wrong a lot.
{:.notice--error }

Verse is an as-yet unreleased language from Epic. It was first announced in
[December 2020](https://twitter.com/saji8k/status/1339709691564179464), and not
much was known about it until last week one of the authors Simon Peyton-Jones
gave a talk at a Haskell convention, so now we have a lot more information!
 
If you have an advanced degree in programming language design, check out their
paper [The Verse Calculus: a core calculus for functional logic
programming](https://simon.peytonjones.org/assets/pdfs/verse-conf.pdf). The
[slides from the
talk](https://simon.peytonjones.org/assets/pdfs/haskell-exchange-22.pdf) are
a bit easier to understand, but it was aimed at people with a lot of Haskell
experience.

My aim here is to try to translate the slides into something a bit more
familiar to C++ programmers. 


## Why is Verse a thing?

Hearing about Verse, a lot of people have the same concerns:

* _Is this going to replace C++?_
* _Is this going to replace Blueprints?_
* _Do I have to learn this to continue using Unreal?_

The answer to all of these is _no_.

As far as I can tell, Verse is not intended as a replacement for Blueprints or
C++. It's being described as a "programming language for the Metaverse". In
more concrete terms it's a new language designed to work at scale and make it
easier for players to add user-generated content to games. As we've seen from
a [December 2020 Tweet](https://twitter.com/saji8k/status/1339709691564179464),
it's already being tested out with Fortnite's user-created game modes.


## Let's learn about Verse

I've divided this into two parts:
1. The basic features of Verse. Get used to the syntax, before you hit the
  really weird stuff.
2. The really weird stuff.


## Basic Features

### Variables

Let's start with the basics of syntax. In Verse, there are two different ways
to declare a variable and assign it a value.

Declaring a variable and assigning it a value uses `:=`

{% include verse-cpp.html

title="Declaring variable, assigning value"

verse="x := 5;"

cpp="int x = 5;"

%}

Like C++, you can separate declaring a variable, and giving it a value. In this
case you can "bind" x to the value of 5 with just `x = 5`.

{% include verse-cpp.html

verse="x:int;
x = 5;"

cpp="int x;
x = 5;"

%}

But unlike C++, all variables are effectively `const` (once given a value).
This is an important feature of the language both from a philosophical and
practical standpoint.

_Edit:_ The December 2022 slides mention that there might be a way to make some
variables mutable, so maybe this isn't a hard-and-fast rule.

{% include verse-cpp.html

verse="x:int;
x = 5;
x = 6; // Error"

cpp="int x;
x = 5;
x = 6; // OK!"

%}

### Tuple

Verse supports tuples/arrays that look a lot like C++ arrays.

{% include verse-cpp.html

verse="ages := (23,49)
ages[0]; // returns 23"

cpp="int ages[] = {23, 49};
ages[0]; // returns 23"

%}


### Choice

A core feature of Verse are "choices".

A variable is only ever bound to a single value. Although that value could be
a tuple

{% include verse-cpp.html

verse="x := (1|7|2);
x + 1; // Executed three times
       // With values 2, 8, then 3"

cpp="for (int x : {1, 7, 2})
{
	x + 1; // Do something
}"

%}

More complex things are possible by mixing choices and tuples:

{% include verse-cpp.html

verse="print((1|2), (7|8));
// This evaluates to 4 separate tuples:
// (1,7)
// (1,8)
// (2,7)
// (2,8)"


cpp="int xs[] = {1,2};
int ys[] = {7,8};
for (int x : xs)
{
	for (int y : ys)
	{
		// do something with x, y
	}
}"

%}


### Conditionals and Comparison

The slides for the talk show conditionals all on the same line, but from other
talks it seems that they are going for a Python-like syntax.

{% include verse-cpp.html

verse="dog_age:int;
if (dog_age < 2):
	// it's a puppy
else:
	// it's a dog"

cpp="int dog_age;
if (dog_age < 2)
{
	// it's a puppy
}
else
{
	// it's a dog
}"

%}

Confusingly, or interestingly, depending on your position, `x=5` can be used to
say that x is equal to the value "5", and also be used in a conditional:

{% include verse-cpp.html

verse="dog_age:int;
if (dog_age = 0):
	// it's newborn
else:
	// it's not"

cpp="int dog_age;
if (dog_age == 0)
{
	// it's newborn
}
else
{
	// it's not
}"

%}

It's also possible to compare against multiple numbers.

{% include verse-cpp.html

verse="age:int;
if (13 < age < 19):
	// teenager"

cpp="int age;
if (13 < age && age < 19)
{
	// teenager
}"

%}


## Weird Stuff

### Everything is Math

One core philosophical difference between Verse and C++ is that Verse tries to
be way closer to Math.

In C++, when you write `x = 5;` you are telling the computer "take the value
5 and store it in the space that we named x".

In Verse, when you write `x := 5;` you are telling the computer that for
**all** uses of `x`, it should be treated as equal to 5. Note that this applies
for **all** uses of `x`, not just **subsequent** values of `x`.

Which brings us neatly to the next point.

### Order Does not Matter

The following is completely valid Verse:

{% include verse-cpp.html

verse="y := x + 1;
x := 3;"

cpp="int y = x + 1; // ERROR
int x = 3;"

%}

As mentioned previously, it's important to remember that Verse is designed not
to be a series of instructions that you give the computer, but more like
a series of conditions or relationships that you are telling the computer hold
true.

First we tell the computer that "y is equal to the value of x, plus one".

Then we tell it x is equal to 3.

This is possible because once the value of a variable has been defined, it
cannot be changed. We know for the rest of that scope that `x = 3`


### There are no booleans

This is more of a clickbait title but it got you here.

In Verse, which branch of a conditional is run depends on whether the
expression **succeeds** or **fails**.

* **Success** is defined as "returning one or more values"
* **Failure** is defined as "returning zero values"

Failure has a shorthand of `false?`, which we use later.

Why does this matter?

Taking the example of using choices and expanding them out, we can see that the
example below executes statement e1 because the conditional returns one or more
values:

{% include verse-cpp.html

verse="
dice_result := 5;
if (dice_result=(1|3|5)):
	// Dice landed on odd-numbered side
"

cpp="
int dice_result = 5;
if (dice_result == 1
	|| dice_result == 3
	|| dice_result == 5)
{
	// Dice landed on odd-numbered side
}
"
%}

#### Logical OR

Logical OR in verse uses the choice operator `|`. Remember that branches are
executed if the if condition succeeds, with success being defined as having one
or more values.

So it would make sense that the choice operator, where every part of it is
evaluated, would work as an OR. So long as one of them returns non-null, then
the conditional would evaluate to **success**.

{% include verse-cpp.html

verse="age:int; grumpiness:int;
if (age > 80 | grumpiness > 99):
	// very old or very grumpy"

cpp="int age; int grumpiness;
if (age > 80 || grumpiness > 99)
{
	// very old or very grumpy
}"

%}


#### Logical AND

Logical AND in Verse uses the tuple comma. This is not quite as clear as with
the choice operator being used like OR.

As shown on slide 25, a tuple with any failures is itself evaluated as
a failure.


{% include verse-cpp.html

verse="(1<3, 2<3, 3<3, 4<3)
// This then evaluates to the following,
// because comparisons return the left-hand operator
(1, 2, false?, false?)
// Which then evaluates to
false?"

%}



### Comparison returns the left-hand value if they succeed

This is just kind of a weird feature of the language and feeds in to why you
can write some complex conditionals.

{% include verse-cpp.html

verse="x := 10;
y := (x < 15) + 2;
// Because x < 15 is true,
// the left-hand operand is returned.
// So y is set to 10 + 2"

cpp="int x = 10;
y = (x < 15 ? x : 0) + 2;
"

%}



### Type is a Function

This was dropped at the end and details were kind of scant but it seemed to
imply that it was easy to define new types.

`int` is a function that returns the value for values that pass the test of
being an integer, and fail otherwise.

{% include verse-cpp.html

verse="price = 200;
x:int;
x = 2.5; // This would fail"

%}

So you could define a new type called `isPositive`, I have no idea what the
syntax would be to do that, but it would let you set up rules for valid uses of
that type.

{% include verse-cpp.html

verse="hat_price:isPositive;
price = 200;

shoe_price:isPositive;
shoe_price = -50; // FAIL"

%}

This might explain why there's a `bool` type in the old Fortnite example Verse
we saw in 2020. Or maybe that's just an old feature of the language that was
removed.


## Thoughts

It's still way too early to tell much about Verse (but that doesn't stop us
wildly speculating and getting ourselves worked up!). So far we have
a work-in-progress academic paper that talks about some very cool but unusual
language features, and some screenshots of more "normal"-looking code.

I'm wondering if some of the more "odd" features are things that will not get
used much in day-to-day programming. For example a language like Perl has some
horrendous features that could be described at length, but to write "_good
Perl_" you just avoid those features.

Being able to "use" variables before they are defined, and those definitions
being far away in the code could be something that we try to avoid as
programmers, just to avoid the cognitive load.

I hope they release a prototype version of the language soon so we can mess
around with it.

