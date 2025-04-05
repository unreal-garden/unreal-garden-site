---
title: "PlasticSCM Cheat Sheet"
excerpt: "Notes on using PlasticSCM and Unreal"
date:   2022-08-20 00:00:00 +0000
last_modified_at:   2022-11-29 00:00:00 +0000
tags:
- version-control
header:
  inline-image: /assets/unreal/plasticscm-logo.webp
---

I have used Perforce for 5+ years, but for our new project we are trying out
[PlasticSCM](https://www.plasticscm.com/).

I'm updating this document as a list of workarounds for problems that we have
hit.


## Pending changes but no pending changes

Sometimes I get the following error when trying to get latest:

> Cannot perform the switch to the branch/label/changeset/shelve since there are pending changes. Please review the pending changes and retry the operation again.

It seems to be caused by unchanged files that are not recognised by the GUI,
and has been around since 2016. There is no way to fix this from the GUI.
After talking with support, they told me the following command, run it from
`cmd.exe`

```
cm unco --all --silent
```


## No local changes but local state does not match server

I got into a situation where the local state of my repo did not match the
server. I confirmed this by cloning the repository again to a different place
on my machine.

After talking with support there is no way to "validate" all local files and
diff them against the server. The only way to fix this is to delete the repo
and download it again from scratch.

## Make workspace only match a subset of the repo

This is possible via the simplified Gluon interface, but not with the main GUI.


## Allow manual merging from new PlasticX GUI

By default, the new PlasticX GUI will automatically merge files and not allow
a "Manual merge" where you can review changes. Luckily you can change this
behaviour under **Merge Options > Manual conflict resolution**.


## Group changes into Changelists

If you want to have the same experience as Perforce, where you can add
files to changelists and submit them bit by bit. Here's how to do it:

* **In Legacy PlasticSCM:** Next to the "Checkin" and "Undo changes" buttons is
"Options". Under "What to show" choose **Group changes in "change lists"**.
* **In PlasticX:** Next to "Show Shelves" at the top-right of the screen there
  is an **Options** button. Click that. Then under the "What to show" tab,
  choose **Group changes into "change lists"**.

## I can't create changelists

To create a changelist you must right-click on the "Default" changelist that is
only shown at the top when you have the changelist option enabled.

Then you can choose to create a new changelist.

## I can't add files to changelists

You can't drag-and-drop files to changelists.

Instead you have to right-click on files and choose "Move to changelist"
(assuming you have already created a new changelist).

In order to add a file to a changelist, it **cannot** be marked as **Private**
in the **Status** column. Files that are not yet tracked by PlasticSCM are
considered "Private". Right-click on the file and choose "Checkout" in order to
add it to a changelist.



## Help, the files I selected to commit reset after "Get latest" and I committed files that I didn't want to

Yep, this happens with the legacy GUI. As far as I know, they are no longer
updating it and so this bug will not be fixed. It is however fixed in the new
"Plastic X" GUI.


## General merge problems

For the first 9 months of using PlasticSCM, I would constantly have problems
with merging. Your symptoms may include:

* I can't see in-progress merges.
* I can't check my merges before submitting them.
* Merges keep breaking.

Files would get lost, I couldn't check my changes before they were committed,
in-progress merges would not show up in the Pending changelist.

Plastic has two options when merging from the Branch Explorer, under the
right-click menu:

| Menu option | Effect | Should you use it? |
| --- | --- | --- |
| "Merge from this branch..." | Merge from the selected branch to your **current workspace's branch**, with the merge happening **locally on your machine**. | Yes. |
| "Merge from this branch to..." | Merge from the selected branch, to another branch that you select, **with the merge happening on the server**. | Probably not. |

{%
include img.html
file="unreal/plasticscm-merge.webp"
%}

Incidentally Perforce does this way better with its Streams feature.

## Use Beyond Compare to merge files

Beyond Compare is a much better diff/merge tool than the default. To set
PlasticSCM to use Beyond Compare, under Preferences find "Merge Tools", select
the entry for type `$text`, set External tool: to Custom and add this path.

```
"C:\Program Files\Beyond Compare 4\BComp.exe" /title1="@sourcesymbolic" /title2="@destinationsymbolic" /title3="@basesymbolic" "@sourcefile" "@destinationfile" "@basefile" "@output"
```

{%
include img.html
file="unreal/plasticscm-beyond-compare.webp"
%}


## General weirdness

Sometimes you'll get pop-up warning errors about files being in use. Here's are
some random things you can try to solve it:

* Close and re-open PlasticSCM.
* Look for files with "name_conflict" in their filename, delete them.
* As a last resort, delete your local repo and re-download from the server. It
  worked for me a few times.

