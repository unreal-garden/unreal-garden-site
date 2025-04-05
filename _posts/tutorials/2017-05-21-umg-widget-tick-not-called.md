---
title:  "Fix Tick Not Being Called on Widgets"
date:   2017-06-18 00:00:00 +0000
tags:
- blueprint
- umg
classes: wide
toc: false
---

I see this one being asked quite often in the Unreal Slackers #ui chat.

> Why isn't my Widget's Tick Event being called? I've tried everything!

**If a UMG widget is not visible, its tick is not called.** Specifically in
these two cases:

* If its visibility is set to Hidden.
* If it's inside a CanvasPanel and it is outside its parents bounds so it is
  not drawn.

If you need a hidden widget to be ticked, you will need to create a custom
tick function and call it in a widget that is not hidden (possibly the
parent/containing widget).

