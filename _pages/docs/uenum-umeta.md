---
title:   "All UENUM and UMETA Specifiers"
excerpt: "Sample code, screenshots and comments for all specifiers, including undocumented ones."
date:    2021-10-05 00:00:00 +0000
permalink: /docs/uenum-umeta/
last_modified_at:   2024-11-24 00:00:00 +0000
tags:
- cpp
- ui
- material
- umg
- blueprint
- specifiers
header:
  image-transparent: /assets/unreal/uenum-umeta-title-transparent.webp
  teaser: /assets/unreal/uenum-umeta-small.webp
redirect_from:
- /unreal/uenum-umeta/
- /unreal/uenum-umeta
- /unreal/enum/
- /unreal/enum
- /unreal/enums/
- /unreal/enums
- /unreal/uenum/
- /unreal/uenum
- /unreal/uenums/
- /unreal/uenums
- /unreal/UENUM/
- /unreal/UENUM
- /unreal/meta/
- /unreal/meta
- /unreal/metas/
- /unreal/metas
- /unreal/umeta/
- /unreal/umeta
- /unreal/umetas/
- /unreal/umetas
- /unreal/UMETA/
- /unreal/UMETA
- /unreal/UMETAS/
- /unreal/UMETAS
- /meta/
- /meta
- /umeta/
- /umeta
- /UMETA/
- /UMETA
- /UMETAS/
- /UMETAS
- /enum/
- /enum
- /uenum/
- /uenum
- /UENUM/
- /UENUM
- /UENUMS/
- /UENUMS
---

Unreal's [Enum
Specifiers](https://docs.unrealengine.com/4.27/en-US/ProgrammingAndScripting/GameplayArchitecture/Metadata/)
page lists all of the core specifiers and many of the metadata specifiers, but
it is not an exhaustive list.

{%
include unreal-specifier-preamble.md
type="UENUM"
%}

# UENUM

{%
include unreal-specifier.md
data=site.data.UE-Specifier-Docs.yaml.uenum
entrypath="unreal-specifier-entry.md"
type="UENUM"
%}

# UMETA

* Technically all properties on UMETA properties are counted as MetaData, but
  unlike others they do not have to be grouped into a `meta` category
* It's possible to add and use your own tags to `UMETA` because they are
  counted as MetaData. Look how
  `MovieSceneBuiltInEasingFunctionCustomization.cpp` uses `UMETA(Grouping)` to
  group together enum values.

{%
include unreal-specifier.md
data=site.data.UE-Specifier-Docs.yaml.umeta
entrypath="unreal-specifier-entry.md"
type="UMETA"
%}

