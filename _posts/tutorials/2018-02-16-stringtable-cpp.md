---
title:  "Localized Strings Using StringTable and C++"
excerpt: "Store localizable strings in a CSV file and use them in the editor and C++."
date:   2018-02-16 00:00:00 +0000
tags:
- ui
- cpp
- localization
- text
header:
  teaser: /assets/unreal/localized-strings-title.webp
---

Localization is a tricky issue in Unreal. All the tools are there, it's just a case of finding out how to use them.
In this tutorial we will load localized strings from a central .csv file (also known as a StringTable), and use them in both the editor and C++.

Here is the general workflow we will follow

1. Create a CSV (comma-separated values) file.
2. Modify Game Module class in C++.
3. Use our localized strings in C++ or the editor.

For the purposes of this example, our project is called `MyProject`.


## 1. Create a CSV File

Save it in your project's Content directory, anywhere you like. Remember this path,

For the purposes of this example, we will be saving ours as: `MyProject/Content/Localization/UIStringTable.csv`


{%
include figure-begin.html
title="UIStringTable.csv"
code="csv"
%}
```csv
Key,SourceString,Comment
HelloWorld,"Hello there, and welcome to the game!",Welcome message
QuitGameLabel,"Quit the Game",
LongDescription,"Welcome to the thing.

Here's multi-line text.",
ButtonLabel,"Click me",
```
{%
include figure-end.html
%}

A few points about .csv files in Unreal:

* You can surround your strings with quotes, to let you use commas in your strings
* If you use quotes, you can use new-lines in your strings
* If you use quotes, you can use double-quotes to escape. e.g. "She said ""See ya!"" and left"


## 2. Modify our Game Module Class

In order for our String Table to be available from the editor, in drop-down menus, we need to load it when our Game Module gets loaded.

{%
include figure-begin.html
title="MyProject.h"
code="cpp"
%}
```cpp
#pragma once


class FMyProject : public FDefaultGameModuleImpl
{
public:
	virtual void StartupModule() override;
	virtual void ShutdownModule() override;
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="MyProject.cpp"
code="cpp"
%}
```cpp
#include "MyProject.h"
#include "Modules/ModuleManager.h"

#include "Internationalization/StringTableRegistry.h"
#include "Paths.h"

void FMyProject::StartupModule()
{
	FDefaultGameModuleImpl::StartupModule();

	LOCTABLE_FROMFILE_GAME("UIStrings", "AnyOldNamespace", "Localization/UIStringTable.csv");
}


void FMyProject::ShutdownModule()
{
	FDefaultGameModuleImpl::ShutdownModule();
}

IMPLEMENT_PRIMARY_GAME_MODULE(FMyProject, MyProject, "MyProject");
```
{%
include figure-end.html
%}


## 3. Using Stringtable Values

Now we can use the strings in our .csv file when editing Blueprints from C++.

### In C++

If we called our StringTable `UIStrings` like in the example above, we can load one of the strings with the following:

{%
include figure-begin.html
title="Using StringTable values from C++"
code="cpp"
%}
```cpp
// This returns "Hello there and welcome to the game!" in the language that we're playing in
FText::FromStringTable("UIStrings", "HelloWorld")
```
{%
include figure-end.html
%}

We can also edit and add new entries the CSV, and the values will be available in Unreal as soon as we save the file.

### In the Editor

Any `FText` variables will be displayed with the dropdown shown in the
screenshot.

{% include img.html
file="unreal/stringtable.gif"
title="Using StringTable values within the editor."
%}

**Note:** By default Unreal will not include your CSV file(s) as part of the
packaging process, even if they are inside the content folder. Make sure to add
your CSVs directory to **Additional Non-Asset Directories to Package** in your
project's **Packaging** settings.
{:.notice--error }

