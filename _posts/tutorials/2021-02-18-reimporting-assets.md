---
title:  "Reimporting Assets"
excerpt: "A single setting makes working in a team a breeze"
date:   2021-02-18 00:00:00 +0000
tags:
- ui
- texture
header:
  inline-image: /assets/unreal/data-source-unset.webp
---

By default, when importing assets, Unreal stores paths to each asset relative
to the Unreal project folder. You can usually tell the path is relative because
the **Source File** property of an asset has a lot of `../../../../` at the
front.

{% include img.html file="unreal/data-source-unset.webp"
title="Asset imported with Data Source unset."
%}

## Why is this a problem?

If you are working on a project on your own and on a single machine, this isn't
usually a problem.

But if you are working in a team, or across multiple machines this can start to
be a real pain in the butt.

That relative path to the asset will likely **not point to the raw asset** on
**another machine**:
* The project could be installed in a different location.
* The raw asset could be stored in a different location.

This matters because when changing a bunch of assets, the easiest thing to do
is overwrite the raw file(s), and click Reimport from Unreal.

{% include img.html file="unreal/data-reimport-action.webp"
title=""
%}

However if the raw asset cannot be found, Reimport will prompt you to find the
asset. This is the last thing you want to be doing for hundreds of updated
icons, right before a deadline.

So what's the solution?

## Making "reimport" work on everyone's machine

Before starting, you will need to make sure your raw asset files are organized
correctly:

* All your raw assets **should** be in version control, or at least some kind
of online backup service. If they're not, go and do that now.
* All of your raw assets should be under the same root structure. e.g.
  environment models in `GameAssets/Environment/Meshes/`, UI textures in
  `GameAssets/UI/Textures/` etc.
* Everyone in your team **should** be able to access all the raw assets. If
  they don't have access to version control or online backup account, give it
  to them.

Next, open **Editor Settings**, and set the **Data Source Folder** property to point to
the root of where all your assets are stored. In this example they are in
`C:\MyGameAssets\`

Make sure that **everyone in your team** sets the Data Asset Folder setting, on
**all of their machines**.

{% include img.html file="unreal/data-source-folder.webp"
title="Data Source Folder property in Editor Settings"
%}

From then on, all of your imported assets should have paths that are relative
to the Data Asset Folder.

{% include img.html file="unreal/data-source-set.webp"
title="Source File path with Data Asset Folder set"
%}

Now any time any asset is changed, you can simply click Reimport!


## A note on Auto Reimport

As of Feburary 2021, there is a bug with Unreal's Auto Reimport feature where
it does not respect the data source path. There is a [GitHub PR for
a fix](https://github.com/EpicGames/UnrealEngine/pull/6359) for
this but just something to be aware of if you use Auto Reimport.

Thanks to [@dougrichardson_](https://twitter.com/dougrichardson_) for telling
me about this!
