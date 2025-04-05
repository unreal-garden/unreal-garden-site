---
title:   "Getting Unreal Crash Reports with BugSplat"
excerpt: "Automatically collect crash info from your players!"
date:    2021-07-18 00:00:00 +0000
tags:
- ui
- qa
- debugging
header:
  inline-image: /assets/unreal/bugsplat-logo.svg
  teaser: /assets/unreal/bugsplat-small.webp
---

_**Disclaimer:** This tutorial was not paid for by Bugsplat, nor did I get
approval from them to make this tutorial. We have been using them for
Industries of Titan since our Early Access Launch in April 2020._


When an Unreal Engine game crashes, the Unreal Engine Crash Reporter is shown
to the player, and they can choose to send a report. But where does this report
go?  By default, it goes to Epic, but with a few changes to an `.ini` and your
build process, you can see those crash reports too!

{% include img.html file="unreal/crash-reporter.webp"
title="Unreal Engine Crash Reporter"
text="The window that players see when an Unreal Engine game crashes."
%}


## Why automatically collect crash reports?

Crashes are incredibly frustrating for players, and you cannot rely on them
taking the time to join your Discord, copy and paste each crash, explain
what they were doing, add log files etc.

Also you would need to include `.pdb` files with your distributed game for them
to be able to show you the full stacktrace of the crash.



## BugSplat

When we were preparing to release [Industries of
Titan](https://store.steampowered.com/app/427940/Industries_of_Titan/) on the
Epic Games Store, we knew we wanted to get crash reports from players. There
are a few different services out there that will collect the reports for you
but ultimately we settled on BugSplat.

We've been using it for over a year and we've found it incredibly useful for
finding and fixing crash bugs.  One of the things we loved is that it works
with a **vanilla version of Unreal Engine**.

This is the kind of information and screens that you can get through BugSplat:

* For each crash, a full callstack.
* The current value of (some) variables.
* Logs
* Included files: CrashContext.runtime-xml, CrashReportClient.ini,
  UE4Minidump.dmp

{% include img.html file="unreal/bugsplat-callstack.webp"
title="The full callstack of the crash."
%}

{% include img.html file="unreal/bugsplat-variables.webp"
title="The current value of variables."
%}

{% include img.html file="unreal/bugsplat-over-time.webp"
title="Reports showing crash frequency over time."
%}


## Setup

Simply follow the steps on [Bugsplat's Unreal Setup page](
https://www.bugsplat.com/docs/sdk/unreal/).

The steps boil down to:

1. Replace a value in `/Engine/Programs/CrashReportClient/Config/NoRedist/DefaultEngine.ini`.
2. Add a step to your automated build system to upload `.exes`, `.dlls` and `.pdbs`
   to BugSplat's servers.
3. That's it!

There's also an example [Unreal
Project](https://github.com/BugSplat-Git/MyUnrealCrasher) to look through if
you get stuck.


## Testing your set-up

```
debug crash
```
Enter this command on the Unreal console to force your game to crash and test that
your report is received after hitting Send on the crash reporter (thanks
[@SeanliMurmann](https://twitter.com/SeanliMurmann/status/1417779091084693504)
and
[@torchedhill](https://twitter.com/torchedhill/status/1417790448085708801)!)


## Further Reading

* It's possible to customize the look of the crash reporter if you have
  a custom version of the engine. This isn't Bugsplat specific but they have [a
  good tutorial explaining
  it](https://www.bugsplat.com/resources/development/customizing-ue4-crash-dialog/)
* Alternative services are provided by [Backtrace](https://backtrace.io/) and [Sentry](https://sentry.io/welcome/) (thanks [Nacho
  Abril](https://twitter.com/nacho_abril/status/1417523877509582857) for the
  tip!)

