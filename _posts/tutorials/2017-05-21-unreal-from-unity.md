---
title: "Things I wish I knew coming to Unreal from Unity"
excerpt: "Gotchas and surprises I encountered"
date:   2019-01-01 00:00:00 +0000
last_modified_at:   2022-07-01 00:00:00 +0000
tags:
- blueprint
header:
  teaser: /assets/unreal/unity-to-unreal-title.webp
  inline-image: /assets/unreal/unity-to-unreal-transparent.webp
---

I've been using Unreal for a few years now, and I'm pretty comfortable with it.
When I first started, the only other game framework I had experience with was
Unity, and the transition from Unity to Unreal was pretty tough.

At the time, I wished there was an article on how to go from Unity to Unreal,
not just "hey learn C++" but more about the mindset to take when using Unreal.


## Read the Source Code

This is probably the single most important thing to do when learning Unreal.
Unity (at the time of writing) is mostly closed-source, but its documentation
is pretty good, so the only way to learn is throuFor more info on 
trial-and-error.

Conversely, Unreal's documentation is a little _terse_. You're far better off
looking at the source code for how the engine does things. You'll learn how to
use classes and components, and how to compose your game.

For more info on what resources to consult, check out my tutorial on [Help and Resources for Unreal Engine]({% link _posts/tutorials/2020-05-18-help-resources.md %}).


## Subclassing is Important for Core Behaviour

Unity is a much purer entity-component system than Unreal. Its GameObjects are
empty containers to which you add components. If you want custom behaviour, you
add a new component.

Unity has very little in the way of existing code that you are expected to
extend. It's far more agnostic than Unreal, whose code base was built on the
multiplayer first-person shooters.

What does that mean for you as a developer? Well in Unreal you are *expected*
to subclass existing core classes to get the behaviour you want. Unreal uses
a core classes like [`AGameMode`](http://api.unrealengine.com/INT/API/Runtime/Engine/GameFramework/AGameMode/index.html), [`AGameState`](http://api.unrealengine.com/INT/API/Runtime/Engine/GameFramework/AGameState/index.html), [`UGameInstance`](http://api.unrealengine.com/INT/API/Runtime/Engine/Engine/UGameInstance/index.html) to name a few. You *should* subclass these to set up your core gameplay loop.

You then configure Unreal to use your subclasses instead of its defaults.


## Don't agonize over finding the perfect place for stuff

As a corollary to the point above, sometimes it can be really hard to find the
*perfect* place for code. Should I put my custom code in `AGameState` or
`AGameMode`?

There is usually a correct answer to this depending on what you're doing, but
sometimes there isn't. Don't spend ages searching the codebase to find the
perfect spot, it's better to just get something working and wrap it in an
accessor method so that you can move it later if needs be.


## Learn and Follow Naming Conventions

Unreal is pretty strict with naming conventions, and there are a lot of them.
Some things are enforced, if you create a subclass of `AActor` and don't prefix
your class with `A` then it won't even compile. Some other conventions, like
naming Blueprints with the `BP_` prefix, are not enforced. Either way, I think
it's best to [learn the coding
standard](https://docs.unrealengine.com/en-us/Programming/Development/CodingStandard)
and stick to it.


## Use Blueprints scripting to learn, move to C++ when you understand

Unreal has a visual scripting system called Blueprints that can be very helpful
when prototyping. It autocompletes in a useful way and doesn't require you to
recompile your game every time you want to make a minor change.

It can help you learn what the myriad classes in Unreal are for, and how they
should be used.

However, I would warn against using them exclusively. For code that runs every
frame they are not as fast as C++, and they can be far more difficult to debug.
When you understand the systems that your scripts are using, I would recommend
you move your logic from Blueprints to C++.


## Conclusion

Unity's learning curve is definitely more gradual than Unreal; You can start
with an empty scene and gradually add objects and scripts as you implement your
game. Any existing code is "opt-in". Unreal is kind of the opposite, the
learning curve is much steeper and it feels like there's a lot of learning to
be done before you write your first line of code.

But don't be put off, Unreal is a fantastic engine and once you've got over
that first initial hurdle, I've found it's a lot more smooth sailing than
Unity's closed-source ecosystem.


