---
title:  "Creating a Custom Texture Group in Unreal Engine"
excerpt: "Stop changing all those settings manually, centralize them in
a custom texture group."
date:   2021-02-08 00:00:00 +0000
toc: false
tags:
- texture
header:
  overlay_image: /assets/unreal/default-title-nologo.webp
  overlay_filter: 0.3
---

{%
include figure-begin.html
title="DefaultDeviceProfile.ini"
text="Create a new texture group with the specified settings."
%}
```ini
[/Script/Engine.TextureLODSettings]
+TextureLODGroups=(Group=TEXTUREGROUP_Project01,MinLODSize=1,MaxLODSize=4096,LODBias=0,MinMagFilter=aniso,MipFilter=point,NumStreamedMips=0,MipGenSettings=TMGS_Sharpen3)
```
{%
include figure-end.html
%}



{%
include figure-begin.html
title="DefaultEngine.ini"
text="Give a custom name to our new texture group."
%}
```ini
[EnumRemap]
TEXTUREGROUP_Project01.DisplayName=Custom UI - General
```
{%
include figure-end.html
%}
