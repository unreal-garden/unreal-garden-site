---
title:   "In-Game Bug Reporter Best Practices"
excerpt: "What information to inlcude, how to get the most out of it"
date:    2021-07-01 00:00:00 +0000
tags:
- ui
- qa
- debugging
header:
  inline-image: /assets/unreal/titan-bug-reporter.webp
  teaser: /assets/unreal/titan-bug-reporter-small.webp
---

[Industries of Titan](https://store.steampowered.com/app/427940/Industries_of_Titan/)
features an in-game bug reporter that has been incredibly useful. Players have
been very kind in submitting bug reports and suggestions through it, and we
usually get a couple of hundred reports a day.

{% include img.html file="unreal/titan-bug-reporter.webp"
title="Industries of Titan in-game bug reporter"
text="This is what the bug reporter looks like in-game."
%}

In this tutorial I won't go into the technical aspects of creating a bug
reporter, but instead talk about how to get the most out of a your bug report
system.


## Make it easy for players to submit bug reports

This first point might be obvious, but it's the whole point of making an
in-game bug reporter. Players can always contact via other methods (Discord,
forums, Twitter etc.) but in-game should have as little friction as possible.
Ideally a button visible on-screen or on the pause screen.


## Include as much information as possible

**System specs:** Windows version, CPU, GPU, RAM information etc.

**Current game information:** If there is information about the player's
current game state that is not present in a screenshot, make sure to included
it in files or logs. For example what skills do they have equipped, where are
they in the overworld, what quests have they completed, can all be incredibly
useful in understanding the cause of a bug.

**Log files:** 

**Current save file:** QA will need to load saves to verify bugs. The key is to
make the process of going from reading the bug report to being in-game with the
save as simple as possible. Ideally it should be a single click for QA to
download the save, start the game, and load the downloaded save file.

**A screenshot**: Players will often report visual bugs. You will need
a screenshot to see what they are referring to. Giving the player the ability
to re-take the screenshot and see it is ideal.

**All configuration files:** If a user reports that some input is not working,
or that they are having problems with their resolution, you will need to their
configuration files to confirm if it is something with the config, or the game,
or something else.


## Give each report a player-facing unique ID

Players have often used the in-game bug reporter and then followed up about it
in Discord. By showing them a copy-pastable unique ID after submitting
a report, they can use it when asking for more help or adding info.

> Hey I submitted a report via the in-game bug reporter, ID 12345, I found out
> that I can repro the bug by making a ship with 3 people as well as with
> 5 people.

{% include img.html file="unreal/titan-bug-reporter-confirm.webp"
title="Reporter confirmation screen with ID"
%}


## Filter by game version

As your game changes, older versions will be deprecated and replaced with newer
ones. You will continue to get bug reports from users who are still playing old
versions. Those are not useful for QA, so you will need to be able to filter
reports by game version.

I would recommend your game version information include the repository version
number so programmers can know whether a particular bugfix would be included in
a build.


## Filter gross comments

Players will be frustrated by bugs and some will take to foul language. QA's
job is to help identify bugs in the game, not to be abused or read hate-speech,
so you will need to filter any comments with hateful content.


## Make reports searchable

This might seem optional, but it's incredibly useful to be able to search
reports to find if multiple players are seeing the same issue, or when an issue
started to appear.



## Translate all reports into your QA's language

Hopefully you will be releasing your game in multiple languages, which means
you will be getting bug reports in multiple languages too!

QA can manually copy-paste text into a translation services but it's a huge
time-sink and is _really boring_.

There are a bunch of online automated translation services that are
reasonably-priced, and will help QA make the best of all the reports you will
be receiving.


## Allow optional user ID

Some users may wish to know workarounds, or be willing to supply more
informaiton on request. Give them the option of supplying an email address or
Discord username for this.


## Further Reading

* [Tech Toolbox: Subnautica's Feedback System](https://www.youtube.com/watch?v=Urx7WQE6NY0)
*
* For crash reporting, check out [BugSplat](https://www.bugsplat.com/)
* [Getting Unreal Crash Reports with BugSplat]({% link
  _posts/tutorials/2021-07-18-crash-reporter-bugsplat.md %})

<iframe src="https://store.steampowered.com/widget/427940/" frameborder="0" width="100%" height="190"></iframe>

