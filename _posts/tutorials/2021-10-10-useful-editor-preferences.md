---
title:   "Useful Editor Preferences"
excerpt: "Improve your workflow, avoid annoyances"
date:    2021-10-27 00:00:00 +0000
tags:
- cpp
- blueprint
header:
  inline-image: /assets/unreal/editor-preferences-transparent.webp
  teaser: /assets/unreal/editor-preferences-small.webp
---

Unreal separates settings into two parts: Project Settings and Editor
Preferences.
Project Settings are shared between everyone working on the project, and Editor
Preferences are per-machine.

Editor Settings have a lot of less-known useful settings, even after 4 years of
working with Unreal I'm still discovering new things that help my workflow!

Thanks to everyone on Twitter that suggested stuff!

## Enable Live Coding

`General > Live Coding > General > Enable Live Coding`

This might be obvious for some but a lot of new programmers coming to
Unreal don't know about it. It's possible to recompile while keeping the editor
running by using Live Coding. Trust me, it's amazingly useful.

## Always Open In Tabs, Not Windows

`General > Appearance > User Interface > Asset Editor Open Location`

Unreal's default behaviour when the user opens an asset is to sometimes open it
in a docked tab, sometimes to open it in a separate window. There's some logic
to it but it's beyond mortal comprehension.

I am not very smart, so I prefer to make sure all new assets are opened as new
tabs in the main window.

To enable this, change `General > Appearance > User Interface > Asset Editor Open Location`
to `Main Window`

{%
include img.html
file="unreal/open-in-tabs.webp"
%}

## Open Last Level on Startup

`General > Loading & Saving > Startup > Load Level at Startup`

By default, Unreal will open up the "Editor Startup Map" set in Project
Settings. Those settings are shared between everyone on the project, so it's
rare that this gets changed during the project.

I find it useful to change "Load Level at Startup" to `Last Opened` so when
I restart the editor over and over it re-loads the level I was working on.

{%
include img.html
file="unreal/load-level-on-startup.webp"
%}


## Stop Escape from Closing Play In Editor

`General > Keyboard Shortcuts > Play World > Stop`

Pressing the Escape key stops the current play-in-editor session, but this can
be frustrating because Escape is often used to open pause menus in games.

I like to rebind stop simulation to to `Shift+Escape` instead.

{%
include img.html
file="unreal/stop-simulation.webp"
%}


## Add Properties to Favorites

This isn't an editor setting as far as I can tell, but there is a kind of
hidden feature in that you can right-click properites and add them to a list of
favorites.

{%
include img.html
file="unreal/add-to-favorites.webp"
%}


## Disable All Tutorials

`General > Tutorials > Disable All Tutorial Alerts`

The tutorial notification in the top-right is great at first, but its flashing
can get annoying if you re-install Unreal and don't need it anymore.

{%
include img.html
file="unreal/disable-all-tutorials.webp"
%}

## Blueprint Save On Compile

`Content Editors > Blueprint Editor > Compiler > Save on Compile`

This is pretty self-explanatory, instead of having to hit two buttons, hit one!

{%
include img.html
file="unreal/save-on-compile.webp"
%}

## Blueprint Default Pure Casts

`Content Editors > Blueprint Editor > Experimental > Default to Using Pure Cast
Nodes`

In Blueprints it's possible to cast in a Pure way or an "Impure" way. The pure
way produces a node with no Execution pin, similar to a function marked
`BlueprintPure`. Impure is the standard way that has an execution node.

{%
include img.html
file="unreal/pure-impure-bp-cast.webp"
%}

It's possible to convert between the two by right-clicking on the node and
choosing

## Blueprint Auto Cast Object Connections

`Content Editors > Blueprint Editor > Workflow > Auto Cast Object Connections`

When enabled, dragging between two unrelated pins will automatically create
a cast node between them.

{%
include img.html
file="unreal/auto-cast-object-connections.gif"
%}

## Break on Blueprint Exceptions

**EDIT:** I no longer recommend this. It gives false positives, breaking even
in valid situations. For example when building a network game, the Blueprint
would break on setting a parameter for a particle system as if it was null when
it was valid.

`General > Experimental > Blueprints > Blueprint Break on Exceptions`

By default Blueprint will print Error messages to the log when trying to access
`nullptr` pointers. This setting changes that to stop the game and open up the
offending blueprint on these kinds of errors.


## My Settings

I save this in `MyProject/Config/DefaultEditorPerProjectUserSettings.ini`
because I want to inflict them on other people. And want to make sure that
I have the same settings by default every time I clone the repo on a new
machine.

```ini
[/Script/IntroTutorials.EditorTutorialSettings]
bDisableAllTutorialAlerts=True

[/Script/LiveCoding.LiveCodingSettings]
bEnabled=True
Startup=AutomaticButHidden

[/Script/EditorStyle.EditorStyleSettings]
bUseSmallToolBarIcons=True
AssetEditorOpenLocation=MainWindow

[/Script/UnrealEd.EditorLoadingSavingSettings]
LoadLevelAtStartup=LastOpened

[/Script/LogVisualizer.LogVisualizerSettings]
bResetDataWithNewSession=True
```
