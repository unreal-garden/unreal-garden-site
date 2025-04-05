---
title:  "Buttons with custom hitboxes"
excerpt: "How can I make a button with a non-rectangular hitbox?"
date:   2020-10-01 00:00:00 +0000
tags:
- blueprint
- ui
toc: false
classes: wide
header:
  inline-image: /assets/unreal/button-x-shape.webp
  teaser: /assets/unreal/button-custom-hitbox-title-small.webp
---

This is based on the [@MMAn_nin](https://twitter.com/MMAn_nin)'s [blog entry](https://limesode.hatenablog.com/entry/2020/09/06/194504) in
which they show how they made an arrow-shaped button with an arrow-shaped
hitbox.

The technique is so straightforward and easy to use I had to translate it into
English for others to learn from.

1. Create a Button widget. Set its brushes to your non-rectangular button
   texture.
2. Set the Button's **Visibility** to **Non Hit-Testable (Self Only)**. This is so
   rather than using the rectangular hitbox of the button, we will be able to
   use its children to define what is hit-testable.
3. Add a panel widget inside the UButton, for example an Overlay or
   CanvasPanel.
4. Add widgets (for example Images) to the panel, and arrange them to
   create the hitbox you want, using angle, shear, padding, or explicit canvas
   coordinates. If you use Image widgets, you can their Draw As to None to make
   them invisible while still blocking hit-detection
5. Make sure the Visibility of all the hitbox children widgets is set to
   **Visible**.
6. You're done!

The button should now change to the hover state when player's cursor is over
its children marked as **Visible**. 

{%
include img.html file="unreal/button-x-shape.webp"
title="Using the angle property to create an X-shaped hitbox"
%}

{%
include img.html file="unreal/button-arrow-shape.webp"
title="Using the sheer property to create an arrow-shaped hitbox"
%}

Thanks again to [@MMAn_nin](https://twitter.com/MMAn_nin) for this!

