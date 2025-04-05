---
title:  "Unreal UIs and Texture Sizes"
excerpt:  "tldr; Multiple of 4 is great"
date:   2017-05-20 00:00:00 +0000
last_modified_at:   2022-12-01 00:00:00 +0000
tags:
- texture
- ui
header:
  inline-image: /assets/unreal/texture-256px.webp
---

Unreal gives the user a huge number of texture options. Some of which, as user
interface designers, we are unlikely to use but are still worth knowing about.

Here we'll cover some of the texture-related issues that you might encounter as
a UI programmer in Unreal.


## Unreal 5.1 Update

As of Unreal Engine 5.1, mip maps are now supported on all textures!

> Mip maps are now supported on non-power-of-two textures.


## Texture Sizes

The size of the texture affects its **compression**, **mipmap
generation support** and **streaming support**.

### Compression

Generally UI textures are not compressed, as DXT5 compression in particular can
cause some artifacts that can ruin the clean lines of some UI styles.  However
depending on your need to reduce your memory footprint (and whether your UIs
aesthetic is compatible with it), you may want to enable compression.

**DXT5 compression is only available for textures that are a multiple of 4**.
This is important to know, even if you are not planning on enabling compression
for your UI textures as you may need to change your mind in the future.


### Mipmap Generation

Mipmap scaling are not commonly used in UIs. But for some assets that could be shown
at many different scales, like icons used in many parts of the UI, mipmap
support may be useful.

**Mipmap generation is only possible for textures that are a power of two**.

{%
include img.html file="unreal/texture-199px.webp"
title="Base Case"
text="If the texture is not a power-of-two and not a multiple of 4, both compression and mipmap generation are disabled. The \"Format\" is a simple 32-bit image, B8G8R8A8."
%}

{%
include img.html
file="unreal/texture-240px.webp"
title="Multiple of 4"
text="If the texture is a multiple of 4 then it can be compressed with DXT5 compression. However mipmaps are not supported."
%}

{%
include img.html
file="unreal/texture-256px.webp"
title="Power of Two"
text="Power-of-two textures are supported by both
compression and mipmap generation."
%}


{%
include img.html
file="unreal/texture-256px-userinterface-compression.webp"
title="Manually Disabled Compression"
text="With texture compression manually disabled for our 256px texture, the resource size increases from 85Kb to 341Kb."
%}

### Streaming Support

Streaming does not usually affect UI textures, but you should be aware that
Unreal (as of 4.16) **only supports streaming power-of-two textures**.


## Summary

Here's what I do:
* I make sure all my UI textures are multiples of 4.
* I turn on compression for most textures.
* For textures that I notice look gross with compression, I turn it off while
  being conscious of texture memory.

| Texture Size | Compression | Mipmaps | Streaming |
| --- | --- | --- |
| **Power-of-two** | DXT5 Supported | Supported | Supported |
| **Multiple of 4** | DXT5 Supported | Unsupported | Unsupported |
| **Other** | Unsupported | Unsupported | Unsupported |


