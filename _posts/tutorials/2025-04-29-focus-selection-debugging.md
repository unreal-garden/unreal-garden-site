---
title:  "Focus, Selection and Debugging"
excerpt: "This really sucks, welcome to hell."
date:   2025-04-29 00:00:00 +0000
author: benui
tags:
- cpp
- ui
- editor
- input
---


First let's talk a bunch of theory because there are a bunch of terms that are extremely confusing.

## Theory

I've been dealing with button states recently, from a programming perspective. Right now at least in Unreal they have 3 separate but very-related properties (for now I am ignoring things like pressed, disabled):

- **"Focused"**: 
  - There can only ever be **one** focused widget on-screen.
  - Typically when the player presses a directional input, their current widget that is _focused_ becomes _un-focused_, and the next widget in that direction becomes _focused_.
- **"Hovered"**
  - Only applies when there is a cursor.
  - If a widget is under the cursor (and is hit-testable) it is _hovered_. 
- **"Selected"**
  - Some widgets have a concept of being _on_ or _off_. This is often confused with focused.
  - Any number of widgets can be selected at the same time. Other logic would need to control if selecting one widget would deselect another.

### Quirks

Of course real life is not as simple as the bullet points above. There a bunch of caveats or quirks to remember.

1. Sometimes games set it so that if a widget becomes _hovered_, it also becomes _focused_ (if it can be _focused_, and removing the focus on whatever).
2. Sometimes pressing a confirmation key (e.g. A on xbox) would change the _focused_ button to become _selected_.
3. Some buttons could be _toggleable_ so that pressing the confirmation on a _selected_ (and implicitly _focused_) button would make it become _unselected_.
4. Sometimes designers might make it so that for a particular container _and_ input mode, if a widget becomes _focused_, it also becomes _selected_ (without having to press a separate confirmation key). For example imagine a character selection screen, moving the focus around between characters could also set their button to _selected_ (so they don't have to press a confirmation button every time). This would only be for controller. On mouse, the player would also have to click.


- If your Button is a subclass of CommonUI's Common Button Base, it has an extra function called `OnFocusReceived`. This is different to `OnFocus`
- `UCommonButtonBase` also has a variable called `bShouldSelectUponReceivingFocus`. Setting this true makes the button become **Selected** if it becomes **Focused**. However, and this is a **HUGE CAVEAT**, it does **_NOT_ become Unselected when it loses Focus**.



## Debugging

### Command-line Tool

```
CommonUI.AlwaysShowCursor 1
```

This makes a duplicate cursor show over the currently-focused widget.


### Widget Reflector

The Widget Reflector window, as well as being super useful for inspecting widgets, can also show which widget is focused.

Click the three-dots "burger" menu next to where you choose "Pick Hit-Testable Widgets" or "Pick Painted Widgets" and choose "Show Focus".

The currently focused element should be outlined in green.

You can use the Widget Reflector's "Pick Hit-Testable Widgets" to debug hover. Select "Pick Hit-Testable Widgets" and move your cursor around the screen. If a widget is hit-testable it will become outlined. This is especially if you are trying to work out why it's not possible to click on a widget with the mouse.

### Project Settings

Under `Engine > User Interface`, setting **Render Focus Rule** to **Always** will make it so that focused elements are drawn with a dashed outline.


### Roll Your Own

The two examples above only show focus. If you want to debug Selection state you'll have to do this.

The simplest way I've found is adding 3 text widgets to the widgets you care about, with text "Hover", "Focus", "Select". Then in the Widget Blueprint show/hide them.
