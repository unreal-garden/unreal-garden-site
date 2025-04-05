---
title:  "Help and Resources for Unreal Engine"
excerpt: "How to get help, and help yourself"
date:   2020-05-18 18:00:00 +0900
tags:
- community
header:
  inline-image: /assets/unreal/help-resources-title.webp
  teaser: /assets/unreal/help-resources-title.webp
---

So, you're stuck? Me too, it happens a lot more than I'd like to admit.

Other than [searching the web in
general](https://duckduckgo.com/?t=ffab&q=unreal+engine+4+help+i%27m+stuck&ia=web),
luckily there are a bunch of places to get help for Unreal Engine.


## Search the engine source

If you're not sure how to do something, whether a function exists for it, or
how to use a function you've found, I often find the quickest way is to search
the engine source code. This is my first port of call, and I find it easiest as
I'm usually in Visual Studio anyway.

In Visual Studio, press **Control + Shift + F** to do a plain-text search, make
sure "Entire Solution" is selected so it seaches both your project and the
Unreal Engine project.

{%
include img.html
file="unreal/find-in-solution.webp"
title="Use 'Find in Files' to search for use cases"
text="Searching for uses of UGameUserSettings can help you to work out how to
use the class."
%}


## Unreal Slackers Discord

The [Unreal Slackers Discord](https://unrealslackers.org/) server is an
incredibly helpful and friendly place. If you have C++ or UMG questions in
particular, you will probably get a reply.

Of course it's only people helping out each other in their free time, so don't
be too demanding :)

{%
include img.html
file="unreal/unreal-slackers.webp"
link="https://docs.unrealengine.com/5.0/en-US/lyra-sample-game-in-unreal-engine/"
%}

## Lyra Starter Game

{%
include img.html
file="unreal/lyra-starter-game.webp"
link="https://unrealslackers.org/"
%}

The [Lyra Starter
Game](https://docs.unrealengine.com/5.0/en-US/lyra-sample-game-in-unreal-engine/)
(aka Lyra Sample Game) is a project made by Epic games for the release of 5.0. It showcases the
"correct" way to make a bunch of things in Unreal Engine. It's a little
complicated for complete beginners but if you're wondering about the best way
to do something, looking how Lyra does it is a very good starting point.


## Engine Feature Samples

In the Epic Games Launcher, under Unreal Engine there is a Learn tab that has
a fantastic selection of example projects and demos to learn from.

If you are new to Unreal Engine, I recommend starting with Content Examples.
For a more complete example to learn from, scroll down further and try the
Action RPG game sample.

{%
include img.html
file="unreal/help-samples.webp"
%}


## Unreal AnswerHub

The [Unreal Engine AnswerHub](https://answers.unrealengine.com/) is
a Stack Overflow-style question and answer forum that anyone can use.

{%
include img.html
file="unreal/answerhub.webp"
link="https://answers.unrealengine.com/"
%}


## Unreal Engine Forums

I haven't used the [Unreal Engine Forums](https://forums.unrealengine.com/) for
asking questions very often, but they are a great repository of knowledge.


## GitHub Search

[Searching "Unreal Engine" on
GitHub](https://github.com/search?q=unreal+engine+4) might not be a great way
to answer questions, but I've found it really useful for finding interesting
code snippets, new ways of doing things, plugins and more.

Definitely worth checking out every month or so to see what pops up.

{%
include img.html
file="unreal/github-unreal-engine.webp"
link="https://github.com/search?q=unreal+engine+4"
%}


## Unreal Marketplace Search

Similarly, the Unreal Marketplace has a huge number of [free code
plugins](https://www.unrealengine.com/marketplace/en-US/content-cat/assets/codeplugins?count=20&priceRange=%5B0%2C0%5D&sortBy=effectiveDate&sortDir=DESC&start=0) that
can be interesting to learn from.


## Unreal Developer Network

[UDN](https://udn.unrealengine.com/) is available to developers that apply
through Epic's developer program. It is a closed developer-only question and
answer forum, similar to Answers, but 99% of the time your questions will get
an answer from an Epic staff member within a week.

It costs money to be registered and access but I've found it really useful
asking about odd bugs or asking if there are better ways to solve certain
problems. If you're a medium to large studio I would definitely recommend it.


## Unreal Engine Documentation

There's a reason the [official
documentation](https://docs.unrealengine.com/en-US/index.html) is this far down
the list. It can be useful to get a high-level overview of a system but if
you're writing C++ pretty soon it's better to start looking at the engine
source or examples of usage. 


## Unreal Engine Community Wiki

The old Unreal Engine Community Wiki was a huge repository of knowledge created
and maintained by hundreds of developers. Unfortunately it was removed and all
the links to its pages are broken and now point to this [forum
post](https://forums.unrealengine.com/t/a-new-community-hosted-unreal-engine-wiki/141494).

The new [Unreal Community Wiki](https://www.ue4community.wiki) is
a still pretty [bare-bones](https://ue4community.wiki/topic/ui), but some of
the old content is still available through the [Legacy
tag](https://unrealcommunity.wiki/browse/tag/Legacy).

Michael J Cole created a [backup of the original Unreal Community
Wiki](https://michaeljcole.github.io/wiki.unrealengine.com/) which is also
pretty helpful.

{%
include img.html
file="unreal/unreal-community-wiki.webp"
link="https://www.ue4community.wiki/Main_Page"
%}


## Unreal Garden Discord

Of course I couldn't leave my own discord off this list. If you are looking for
help with more advanced UI issues, come chat with us on [{{ site.discord_url }}]({{ site.discord_url }}))

## Other

* [Tom Looman](https://tomlooman.com/) has some very interesting tutorials.
* [Unreal Tournament GitHub repo](https://github.com/EpicGames/UnrealTournament)
* Helium Rain's source code is available on its [GitHub
  repo](https://github.com/arbonagw/HeliumRain/tree/master/Source/HeliumRain/UI), and uses mostly Slate. It's a great place to look for examples of Slate code.

I've found Twitter a great place to learn little bits and pieces for Unreal.
Here are some people who post interesting stuff!

* [@phyronnaz](https://twitter.com/phyronnaz)
* [@codekittah](https://twitter.com/codekittah)
* [@MMAn_nin](https://twitter.com/MMAn_nin)
* [@joyrok](https://twitter.com/joyrok)
* [@t_looman](https://twitter.com/t_looman)
* [@hachque](https://twitter.com/hachque) and [@RedpointGames](https://twitter.com/RedpointGames)


