---
title:   "Cheat Console Cheat Scripts"
excerpt: "Store sets of cheats in a .ini, execute them with one command."
date:    2021-11-19 00:00:00 +0000
toc: false
classes: wide
tags:
- cheat
- debugging
header:
  teaser: /assets/unreal/cheat-scripts-small.webp
---

While snooping around in Unreal's `UCheatManager` class I found something fun,
a function called `CheatScript`. It lets you **store a set of cheats in a .ini**, 
and then **run them with a single command**. It seems very handy for
getting the player into a particular state for testing.


Anyway, here's how to use it.

1. Inside your `DefaultGame.ini` file, add a new section that starts with
   `Cheatscript` followed by the name you want to give to, e.g. `[CheatScript.GiveAll]`
2. Underneath, add the cheats you want in the format `Key=Cheat`. `Key` can
   be anything, all your entries can have the same key, it's just that the
   ini file has to be in the format `X=Y`. The value part, `Cheat` is what you
   would normally put into the cheat console.
3. Run your game and open the cheat console with tilde, and type in `CheatScript GiveAll` (where `GiveAll` is the name of the section).

{%
include figure-begin.html
title="DefaultGame.ini"
%}
```
; Example script runnable with "CheatScript GiveAll" that will
; execute the following cheats
[CheatScript.GiveAll]
Cheat=GiveAllTools
Cheat=GiveAllArmor
Cheat=GiveAllSeeds

[CheatScript.Level10Test]
Cheat=SetPlayerLevel 10
Cheat=GiveWeapon Shovel
Cheat=GiveArmor Chainmail
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="Running the cheat"
%}
```
> CheatScript GiveAll
```
{%
include figure-end.html
%}

Some notes:

* The section headings have a period between `CheatScript` and the cheat name,
  but when executing the cheat, you need to use a space
* As far as I can tell, changes `DefaultGame.ini` are not noticed while the
  editor is running. So unfortunately if you change or add to your set of
  cheats

