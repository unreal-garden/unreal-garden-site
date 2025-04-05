---
title:  "Curve Tables"
excerpt: "Define gameplay data using external CSV/JSON."
date:   2022-08-26 00:00:00 +0000
tags:
- cpp
- data
header:
  inline-image: /assets/unreal/curve-table-stacked-view.webp
  teaser: /assets/unreal/curve-table-small.webp
---

Curve Tables are another one of Unreal Engine's hidden gems. They are an
excellent tool that can help bridge the gap between designer-created data and
programmer-driven gameplay. It is heavily used by the gameplay abilities
system.

At first glance they might seem the same as Data Tables but they serve
a different purpose:

* Curve Tables for defining _two-dimensional_ numerical data. A series of X and
  Y points that define a curve that can be read at any point. For example
  a power curve that defines how a Ship's _Hit Points_ increase as they
  level up.
* Curve Tables allow you define float curves that can be interpreted as either:
  * float: 1.2, 5.65, etc.
  * integer: 1, 2, 3, etc.
  * boolean: true or false
* Curve Tables allow for reading interpolated values. Like curves in the rest
  of Unreal, they are a series of keys with X/Y positions and interpolation
  settings (constant, linear or cubic). 
* A single Curve Table can have many rows each of which can be interpreted as
  float/integer/boolean. In comparison when creating a Data Tables, you must
  choose a struct that will be used for the data in each row.
* Both Curve Tables and Data Tables have separate [composite
  varieties](#composite-curve-tables).
* Both Curve Tables and Data Tables support Blueprints, but Curve Tables'
  support is a little basic.


## How to use a data table

### 1. Create a CSV File

Curve Tables can be defined in CSV or JSON. For this example we will use CSV
but see the end of the page for [how to define the same information in
JSON](#what-is-the-json-format-for-curve-tables).

{%
include figure-begin.html
title="DT_ShipData.csv"
code="csv"
%}
```csv
Name,1,5,10,20
Ship.HitPoints,10,30,60,100
Ship.MoveSpeed,1.5,1.8,2.9,4.6
Ship.CanBoost,0,0,1,1
```
{%
include figure-end.html
%}

An explanation of what's going on here:
* The first row is used to define the "X" values of your curves. What this
  means depends on your data but in the example above we have a game with
  a ship that can increase in level. The column values are the level of the
  ship. Then each row is used to define a stat for that level.
* The `Name` text for the first column is arbitrary. When exporting CSV instead
  they use `---`.
* The names for each row are completely free, you do not have to use the dot
  convention. It is just inspired by Gameplay Tags.


### 2. Import CSV into Unreal

Dragging the CSV file onto Unreal should show a pop-up window. Under "Import
As" choose "CurveTable" and then choose your desired curve interpolation type.

This is important as **the interpolation type is global for the table and
cannot be changed**.

* **Constant:** Values in Y will not be interpolated between datapoints in X.
  They will clamp to the previous-known value of X.
* **Linear:** Values in Y will be linearly interpolated between datapoints in X.
* **Cubic:** Values in Y will be cubic-ly(?) interpolated between datapoints in X.

{%
include img.html
title="Curve Table import options"
file="unreal/curve-table-import.webp"
%}

After importing, you should see your data in the table view. Across the top are
the X values you defined in your columns.

{%
include img.html
title="The table view of an imported Curve Table"
file="unreal/curve-table-imported.webp"
%}

To see your data in graph form, click the button in the top-left. You can edit
the values of your curve in the table view or by dragging data points up and
down in the curve view, but you will not be able to add new data points. See
the FAQ for more on the [limitations of CSV-imported curve
tables](#imported-csv-curve-table-limitations)

The curve view also allows multiple curves to be displayed in a few ways:
overlaid on top of each other with and without scaling or as a stack of curves.

{%
include img.html
title="Curve view of a Curve Table with multiple curves selected"
file="unreal/curve-table-stacked-view.webp"
%}

### 3. Using Curve Tables

Now that we have a Curve Table asset created and populated with data, how can
we use that data in-game?

One way is to create member variables in our classes that we can use to refer
to rows in our Curve Table asset. In the example below we add some
`FScalableFloat` properties and expose them through `UPROPERTY`.

{%
include figure-begin.html
title="BUIShip.h"
code="cpp"
%}
```cpp
// Make sure you add GameplayAbilities to your Build.cs

#pragma once

#include "ScalableFloat.h"
#include "GameFramework/Actor.h"
#include "BUIShip.generated.h"

UCLASS()
class ABUIShip : public AActor
{
	GENERATED_BODY()
protected:
	// There are no meta properties for filtering by row type, unfortunately
	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="Data")
	FScalableFloat HitPoints;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="Data")
	FScalableFloat MoveSpeed;

	UPROPERTY(EditDefaultsOnly, BlueprintReadOnly, Category="Data")
	FScalableFloat CanBoost;
};
```
{%
include figure-end.html
%}

Exposing a `FScalableFloats` property using `UPROPERTY` displays them as shown
in the diagram below.
* Choosing the Curve Table and Row is 
* The text entry box shown in the top-left of every entry, with `1.0` value
  shown is a multiplier that can be applied to that particular property. For
  example we could imagine a custom weapon actor that uses a Curve
  Table-defined BaseDamage property, but multiplies it by a custom value.
* The "Preview At" slider lets us see the value of the curve at the selected
  X-value with the above custom multiplier applied.

{%
include img.html
file="unreal/curve-table-properties.webp"
%}

Getting values from a `FScalableFloat` is pretty straightforward, there are
even helper methods for interpreting the float values as integer or boolean.

{%
include figure-begin.html
title="Using Curve Table FScalableFloat properties in C++"
code="json"
%}
```cpp
const float CurrentLevel = 5;

HitPoints.AsInteger(CurrentLevel);
	
MoveSpeed.GetValueAtLevel(CurrentLevel);

// Returns true for float values greater than zero
bCanBoost.AsBool(CurrentLevel);
```

As far as I can tell, Blueprints do not have built-in support for evaluating
Curve Table rows as specific data types, instead you have to do it yourself as
shown below.

{%
include img.html
title="Evaluating Curve Table Rows in Blueprints"
file="unreal/curve-table-blueprint-logic.webp"
%}


## FAQ

### Composite Curve Tables

Much like Data Tables, Curve Tables can be grouped together into composite
tables. A Composite Curve Table can contain references to one or more Curve
Tables. The useful thing about them is values from curves in latter ones can
override values in earlier ones.

So for example if you had a general Curve Table that defined how health, speed
etc. changed as ships level up, but you also had a Curve Table for how Battle
Ships level up, you could create a Composite Curve Table with the generic ship
as Index[0] and your Battle Ship Curve Table as Index[1]. The Battle Ship curve
table could have a small subset of data that differs from the base.

Composite Curve Tables have a "Source File" property that doesn't seem to do
anything.

It's possible to export data from a Composite Curve Table but it's just
a merged version of the data from the Parent Tables. You can't reimport it back
into the composite curve table.


### What is the JSON format for Curve Tables?

{%
include figure-begin.html
title="DT_ShipData.json"
code="json"
%}
```json
[
	{
		"Name": "Ship.HitPoints",
		"1": 10,
		"5": 30,
		"10": 60,
		"20": 100
	},
	{
		"Name": "Ship.MoveSpeed",
		"1": 1.5,
		"5": 1.8,
		"10": 2.9,
		"20": 4.6
	},
	{
		"Name": "Ship.CanBoost",
		"1": 0,
		"5": 0,
		"10": 1,
		"20": 1
	}
]
```
{%
include figure-end.html
%}


### Imported CSV Curve Table limitations

There are a bunch of differences between Curve Tables that are created directly
through the editor via **New Asset > Miscellaneous > Curve Table**.

| *Feature* | *Created in-editor* | *Imported from CSV/JSON* |
|:--- | --- | --- |
| Edit curves | Possible | Can change values for existing datapoints through the table or curve editor but cannot add new data points. |
| Data interpolation | Can edit per-point. | Global per-table. To change you must re-create the asset. |
| Choose sampling before/after first/last key | Possible. | Impossible. |
| Table view | Nope. I don't know why, the button is just not there. | Possible. |


### How do I export changes?

It is not visible in the Curve Table editor if you open an individual editor.
However if navigate to the asset in the Content Browser, you can right-click on
a Curve Table asset and choose "Export as CSV" or "Export as JSON".


## Conclusion

Curve Tables are a pretty powerful way of letting designers create
two-dimensional data and use it in-game. However they have some limitations when it
comes to importing from CSV.

Special thanks to Kyle at [Brace Yourself
Games](https://braceyourselfgames.com/) for telling me about Curve Tables and
getting me started down this rabbit hole!

