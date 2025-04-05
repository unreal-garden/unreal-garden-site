---
title:  "BUIValidator Plugin"
excerpt: "Texture settings validator plugin"
date:   2021-03-01 00:00:00 +0000
tags:
- cpp
- texture
- plugin
- data
header:
  teaser: /assets/unreal/buivalidator-title.webp
  inline-image: /assets/unreal/validator-settings-example.webp
  actions:
  - label: '<i class="fab fa-github"></i> View on Github'
    url: "https://github.com/benui-dev/UE-BUIValidator"
---

A plugin that validates settings for texture assets in Unreal Engine.


## What can it do?

* Throw errors when texture size, texture group and other properties do not
  match customizable rules.
* Automatically set default values for new textures upon import.
* Set different validation rules for textures with different prefixes, or for
  different folders within Unreal.
* Throw errors when users import textures without setting the Data Source
  Folder in their Editor Settings.

## Usage

Once installed, open Project Settings > BUI Validator.

Here you can set up validator groups, that consist of match conditions and
rules to be applied to those matches.

![Settings example](https://benui.ca/assets/unreal/validator-settings-example.webp)

### Settings

#### Match Conditions

For a rule to be triggered, **all** conditions of the match must pass.

* **Texture groups:** Match textures with _any_ of the texture groups.
* **Prefixes:** Match textures with _any_ of the asset name prefixes.
* **Paths:** Match textures in _any_ of the asset directories.

#### Validator Rules

Each rule allows multiple values for a given setting. For example a texture
could be allowed to be within World or UI. To pass, the asset must match
**any** of the values.

* **Texture groups:** Textures must have one of the specified Texture Groups.
* **Compression Settings:** Textures must have one of the specified
  Compression Settings.
* **Pixel Formats:** Textures must have one of these Pixel Formats
* **Mip Gen Settings:** Textures must have one of these Mip Gen Settings
* **Prefixes:** Textures must have one of these prefixes.
* **Texture Size:** Textures must pass these size requirements. Size
  requirements are "Multiple of Four" or "Power of Two"
* **Paths:** Textures must be within this path in Unreal.
* **Require Data Source Folder:** Require that the Data Source Folder be set in
  Editor Preferences, and that assets are imported from there. This is to aid [reimporting between team members](https://benui.ca/unreal/reimporting-assets/).

#### Auto-apply settings to new textures

Validator Groups have an _Apply On Import_ option. When checked, any
newly-imported assets that match the group will have some rules automatically
applied to them.

Prefix, Texture Size and Path rules are not applied on import.

### Running Validation

Whenever UTexture2D asset is saved, the rules in Project Settings are applied.
If the asset does not pass, an error is shown.

![Failure example](https://benui.ca/assets/unreal/validator-fail-example.webp)

## Installation

1. Download the zip or clone the [Github
   repository](https://github.com/benui-dev/UE-BUIValidator) into
   `YourProject/Plugins/BUIValidator/`
2. Add the following to the end of your `.uproject` file, inside the `{ }`
```json
	"Plugins": [
		{
			"Name": "BUIValidator",
			"Enabled": true
		}
	]
```

## Download

The project is on [Github](https://github.com/benui-dev/UE-BUIValidator)

## License

[CC0](https://creativecommons.org/publicdomain/zero/1.0/)
