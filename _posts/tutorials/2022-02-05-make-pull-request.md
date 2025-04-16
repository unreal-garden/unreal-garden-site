---
title: "How to make a pull request to Unreal Engine"
excerpt: "Be the changelist you want to see in the world."
date:   2022-02-05 00:00:00 +0000
tags:
- cpp
header:
  inline-image: /assets/unreal/unreal-pull-request-inline.webp
  teaser: /assets/unreal/unreal-pull-request-small.webp
---

One of the great things about Unreal Engine is that it is open-source and
accepts pull requests (also known as PRs) from users. Last year I tried my hand at submitting [a few
fixes and improvements to the engine](https://github.com/EpicGames/UnrealEngine/pulls?q=is%3Apr+author%3Abenui-dev) and some were even accepted!

When I first started I remember it was relatively tricky to find a single
source of information on how to submit a pull request so here's what you need
to know to submit a pull request to Unreal Engine.

## Set-up

First you will need access to the Unreal Engine GitHub. Luckily there's [a great
tutorial from Epic](https://www.unrealengine.com/en-US/ue-on-github) on how to
do this.


## Creating a Pull Request


### 1. Create a Fork

If you have not already done so, create a fork of
[Epic/UnrealEngine](https://github.com/EpicGames/UnrealEngine) on GitHub.

{%
include img.html
file="unreal/github-unreal-fork.webp"
%}

### 2. Get latest in `ue5-main` (or `master`)

It's important to know whether you want to push a change to Unreal Engine 5 or
Unreal Engine 4:

* For Unreal Engine 5, use the `ue5-main` branch.
* For Unreal Engine 4, use the `master` branch.

On your machine, switch to the correct branch and make sure to get latest.

**Note:** it is very important that you only submit to the correct branch
for the correct version! Otherwise your pull request won't get accepted!
{:.notice--error }

### 3. Make a new branch from `ue5-main`

Make a new branch from `ue5-main`, and name it something related to the
feature or bug you wish to submit. I have previously used descriptive names
like:
* [`umg-wrap-with-multiple`](https://github.com/benui-dev/UnrealEngine/tree/umg-wrap-with-multiple)
* [`umg-snap-to-pixel`](https://github.com/benui-dev/UnrealEngine/umg-snap-to-pixel)
* [`allow-umg-negative-padding-input`](https://github.com/benui-dev/UnrealEngine/allow-umg-negative-padding-input)

### 4. Write your feature/bugfix

This will be the bulk of your work, but there are a few things to remember
while you are doing it:

- Try to change as little as possible. Your diffs should look very clean,
  changing only what is necessary.
- Add comments to your code where appropriate. [Explain what your code is trying to do](https://github.com/EpicGames/UnrealEngine/pull/8542/files#diff-34bd69e6776538cc9995c6192daa4fbce6d5ff9aefb6332e6b7165da4a6fd118R708-R709).
- Make as few commits as possible to get the feature/bugfix implemented.

Test your code! One way to do this without having to compile the entire engine
every time is to create a test project that uses your custom engine.

### 5. Create the pull request

Now that your feature is complete, On the Pull Requests page for your fork, click **New pull request**.

{%
include img.html
file="unreal/github-unreal-create-pull-request.webp"
%}

Then on the next page, you should see the name of your fork next to *head repository*. To the right of that click *compare* and choose the new branch that you have created.

The page should update to show whether your changes can be automatically merged
or not. If they cannot it might mean that you haven't merged the latest changes
from `ue5-main` into your branch.

{%
include img.html
file="unreal/github-unreal-merge-changes.webp"
%}

You should now have an input area where you can enter the details of your pull
request:

* Clearly and simply describe what your change does.
* In the comment, describe what did Unreal do previously? What does it do now?
* If appropriate, include links to screenshots. It will help the people
  triaging requests understand what the change is about.

You can check out my pull requests for some examples:
* [Fixed UMG Wrap With to support multiple widgets #8542](https://github.com/EpicGames/UnrealEngine/pull/8542)
* [Fixed arrow key input to change order of UMG Box and Grid slots #8572](https://github.com/EpicGames/UnrealEngine/pull/8572)


### 6. Wait

Depending on the size and importance of your change, it might take a while for
it to be merged. At least a month. Keep an eye on your GitHub notifications to
see if there is any progress on the pull request.
