---
title: "Unreal Engine Scripting Languages"
excerpt: "What scripting languages can you use in Unreal?"
date:   2022-01-30 00:00:00 +0000
tags:
- cpp
header:
  inline-image: /assets/unreal/scripting-languages-transparent.webp
  teaser: /assets/unreal/scripting-languages-small.webp
---

Out of the box, Unreal Engine supports creating game logic in C++ and
Blueprints, but sometimes it's useful to be able to write some game logic in
another scripting language.

Thanks to Impromptu Games Discord for starting me down this rabbit-hole again.

## Why use a scripting language?

Why would you want to add scripting support to your game?

* **Empower Designers:** Some technical designers may have experience in
  scripting languages and want to create game logic themselves, without having
  to go to Blueprints or rely on C++ engineers.
* **Easier Mod Support:** The same tools that you give designers to implement
  custom behaviour can also be used by modders. For example a strategy game
  could allow players to define new unit types in a scripting language.
  Scripting languages are often simpler in syntax than C++ and are much easier
  to drop into a specific folder and get running.
* **Easier collaboration:** Text-based scripts (in contrast to binary Blueprint
  assets) can be easily merged, so multiple people can work on the same logic
  at the same time.


## How to choose a language?

There is no "right answer", despite what some passionate supporters of
a particular language might tell you. There are many factors, so think which
ones are most important to you.

* **Previous Experience:** Who will be using the scripting tools? What
  languages do they have experience with?
* **Documentation:** How good is the documentation? If the language is more
  niche there will be less documentation online, making it harder to on-board
  new team members.
* **Long-term Support:** Is the Unreal integration still maintained? When was
  the last update? Otherwise do you have enough engineers to support it
  in-house?

## Languages

I found all the languages that have plugins or integrations with a decent amount
of support and active maintenance.

### Lua

{%
include img.html
file="unreal/lua-logo.svg"
css_class="small-figure"
no_link="true"
%}

Lua has a long history as a language that is commonly integrated with games for
scripting purposes. The documentation and [online
resources](https://www.lua.org/pil/1.html) are excellent, but
I have found it somewhat lacking in libraries for solving problems.

```lua
-- Silly example code
function draw_woof(canvas, dog, ntimes)
	for i=1, ntimes do
		local woof_text = dog:get_woof_text()
		canvas:draw(woof_text)
	end
end
```

For Unreal, [LuaMachine](https://github.com/rdeioris/LuaMachine) is a fantastic
plugin that I found straightforward to integrate with [Industries of
Titan](https://store.steampowered.com/app/427940/Industries_of_Titan/). It even
has an active Discord channel for support.


### AngelScript

{%
include img.html
file="unreal/angelscript-logo.webp"
css_class="small-figure"
no_link="true"
%}

[AngelScript](https://www.angelcode.com/angelscript/) has been around for
a while, its [list of games](https://www.angelcode.com/angelscript/users.html)
go back to Turok 2. It is actively maintained and seems very highly
recommended. 

Its [list of features](https://www.angelcode.com/angelscript/features.html)
includes:

* Looks a lot like C/C++.
* Statically typed.
* Object oriented.
* No pointers, instead has object handles.

```cpp
void DoSomething()
{ 
	SomeObject myObj;
	// AngelScript
	SomeObject@ myObjHandle = null;
	@myObjHandle = SomeObject();
}
```


Unfortunately integrating AngelScript into Unreal isn't quite as simple as
dropping in a plugin. [Hazelight](https://www.hazelight.se/) have made a set of
modifications to Unreal Engine and published it as a [fork of Unreal
Engine](https://github.com/Hazelight/UnrealEngine-Angelscript), so you will
have to be comfortable building a custom version of the engine.

[Their version of the language](https://angelscript.hazelight.se/) has a lot
of tight integration with Unreal Engine so it differs slightly from the
original language.

### JavaScript

{%
include img.html
file="unreal/javascript-logo.svg"
css_class="small-figure"
no_link="true"
%}

NCSoft's [Unreal.js](https://github.com/ncsoft/Unreal.js/) seems like a very
actively-maintained and well-used JavaScript plugin.

* Great for anything that needs to communicate with the web.
* Full access to the whole UnrealEngine API.
* Live reload.
* Supports debugging within Visual Studio, Visual Studio Code.
* Access to existing JavaScript libraries via npm, bower, etc.
* Installable through a plugin.

```js
class MyActor extends Actor {
	properties() {
		this.MyProp/*EditAnywhere+Replicated+int*/;
	}
	RPC(x/*int*/) /*Server+Reliable*/ {
		console.log('This function is replicated',this.MyProp++);
	}
}
let MyActor_C = require('uclass')()(global,MyActor);
if (GWorld.IsServer()) { 
	new MyActor_C(GWorld);
}
```


### SkookumScript

{%
include img.html
file="unreal/skookumscript-logo.webp"
css_class="small-figure"
no_link="true"
%}

SkookumScript is a custom scripting language that is now Epic-owned and
community-maintained. It was used in [Sleeping
Dogs](https://skookumscript.com/about/#sleeping-dogs) and seems really
battle-tested.

That being said, it seems that it has not been updated in a while, the [last
supported version on the Marketplace is 4.24](https://www.unrealengine.com/marketplace/en-US/product/skookumscript)

Some Features (the full list is available on the [Features
page](https://skookumscript.com/about/features/)):

* Concurrency at language-level. See the example below, it's really easy to set
  up code to execute simultaneously, for things to wait for each other, or be
  cancelled if one finishes first
* Can make changes to the code and see it update live while the game is
  running.
* Compile-time type checking.
* Can be [installed via a plugin](https://skookumscript.com/unreal/).

```cpp
// Person and car both start at same time.
// Next line is run after whichever one completes first
// and any remaining commands are cancelled.
race
  [
  person._walk
  car._drive
  ]
println("Completed")
```


### Verse

At the time I'm writing this in January 2022, Epic have announced a new
scripting language called *Verse*. It is not yet released but [it does look very
interesting.](https://twitter.com/saji8k/status/1339709691564179464)

It's got a very... unique syntax.

```cpp
BoxFight = class(FortGameScriptBase):
	GameStarted^ : bool = false
	CurrentRound^ : int = 0

	RunGame()<latent>=

		# Pause until all players are in the matchmaking session
		WaitForPlayersToJoin()
		GameStarted := true

		for(i = 1..NumberOfRounds):

			if(!SetupPlayersAndSpawnPoints()?):
```



{%
include img.html
file="unreal/verse-example.webp"
link="https://twitter.com/saji8k/status/1339709691564179464"
%}


### Python

{%
include img.html
file="unreal/python-logo.svg"
css_class="small-figure"
no_link="true"
%}

Unreal has great built-in support for Python **as an Editor scripting tool**.
As far as I know none of the Python-related code is available at runtime.


### Blueprints

Blueprints aren't a scripting language in the same vein as the ones listed
above but it's important to not discount them when considering what to use. If
your designers are most comfortable with Blueprints, stick with them and see
what else you can do to empower them!

