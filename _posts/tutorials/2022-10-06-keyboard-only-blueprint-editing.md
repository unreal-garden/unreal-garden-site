---
title:  "Keyboard-only Blueprint Editing"
excerpt: "Edit faster, avoid RSI, improve consistency"
date:   2022-10-06 00:00:00 +0000
classes: wide
tags:
- editor
- blueprint
- productivity
header:
  teaser: /assets/unreal/keyboard-only-blueprint-editing-small.webp
---

I've written a lot of Blueprint logic in the past, to the point of getting RSI
from using a mouse too much. But I much prefer the speed and
keyboard-friendliness of writing my logic in C++.

However there are some plugins that make editing Blueprints a lot faster.

{% comment %}
Just like when you write C++ in an IDE, you should not be hand-crafting how
  many tabs there should be to indent your code. Yuu should be letting your IDE
  do that for you, automatically. Blueprint Assist can auto-format your
  Blueprint logic in a couple of different ways.
{% endcomment %}

## Blueprint Assist

If you have to spend more than 5 minutes a day using Blueprints, you have to
get [Blueprint
Assist](https://www.unrealengine.com/marketplace/en-US/product/blueprint-assist).

Some of the features include:

* Automatically formatting node arrangement.
* Speed up navigation, no more search in blueprints, just Go to the node with
  **Ctrl+G**.
* Reorder node execution with Shift+Arrow.
* Navigate nodes and pins with the keyboard.
* Automatically adds calls to parent nodes when adding events. I can't count
  how many times I've been bitten by forgetting to call to parent.

{%
include img.html
file="unreal/blueprint-assist-format.gif"
title="Blueprint Assist's auto-format function."
link="https://www.unrealengine.com/marketplace/en-US/product/blueprint-assist"
%}


It has a huge number of shortcuts but here are some of my favourites.

| *Shortcut* | *Effect* |
| --- | --- |
| Ctrl+G | **Go** to the symbol in the graph |
| Tab | Open "add node" window. If node selected, append to exec |
| Shift+F | **Formats** everything downstream of the selected node |
| Ctrl+Shift+A | Quick-**add** (variable, function) |
| Arrow keys| Change selected pin |
| Ctrl+Arrow keys| Change selected node |
| Shift+Arrow keys| Pan view |
| Ctrl+Shift+Arrow | Swap order of selected node |
| Ctrl+E | Edit value of selected pin, cycle to next editable value |
| D | Delete wire for hovered pin/wire |
| Alt+O | Swap between Designer/Graph view when editing User Widget Blueprints |

For the full list of shortcuts and how to customize them, search "Assist" in
**Editor Preferences > General > Keyboard Shortcuts**

Make sure that you [share your settings with the
team](https://github.com/fpwong/BlueprintAssistWiki/wiki/FAQ#sharing-plugin-settings-through-source-control)
so everyone has the same formatting.




## Node Graph Assistant

[Node Graph Assistant](https://www.unrealengine.com/marketplace/en-US/product/node-graph-assistant)
is another must-have plugin. It fixes a bunch of UX nightmares with
Blueprints, and works well with Blueprint Assist.

{%
include img.html
file="unreal/node-graph-assistant-auto-connect.gif"
title="Node Graph Assistant can auto-connect when nodes are close"
link="https://www.unrealengine.com/marketplace/en-US/product/node-graph-assistant"
%}

Some of the things it fixes:

* No longer need to drag a wire to an exact tiny pin, you can just drag to the
  node (the box itself) and Node Graph Assist will choose the most appropriate
  pin within the node.
* Drag a node near another and it will automatically connect appropriate pins
  from nearby nodes (see animation above).

My favourite shortcuts:

| *Shortcut* | *Effect* |
| --- | --- |
| Alt+C | Connect pins on selected nodes |
| Alt+X | Remove node and re-route pins ahead |


## More

If you have any other suggestions for built-in keyboard shortcuts or other
plugins that help, send me a message.




