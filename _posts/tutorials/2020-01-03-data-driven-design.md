---
title:  "Data-driven Design in Unreal"
excerpt: "Data Tables, Data Assets and others"
date:   2020-01-03 23:00:00 +0900
last_modified_at:   2022-08-03 00:00:00 +0000
tags:
- data
- blueprint
- cpp
- text
header:
  inline-image: /assets/unreal/plant-data-table.webp
  teaser: /assets/unreal/data-design-small.webp
---

In game development, I believe that programmers don't create the game, they
enable designers and artists to create the game. To that end, they must create
game logic and tools that that let designers and artists create the game.


## What is data-driven game design

Through data-driven game design, programmers can empower designers and
artists to create and iterate on games.

Rather than programmers writing custom logic for every part of the game, with
hardcoded values, classes and behaviours, programmers instead create a suite of
behaviours and tools that designers and artists can experiment with to create
the best possible game.


### No hardcoded values

Imagine we are making a village management game where the player can create
buildings and have their little villagers run around, farming, mining and
constructing.

We would expose to designers all of the variables we might associate with such
a game:

* The resource cost of each building.
* The text describing each building.
* The Actor to be spawned when the building is created in-world.
* etc.


### No hardcoded classes

However as a programmer you might decide to write all of the logic for each of
the buildings in their own classes. `Farm.cpp`, `Windmill.cpp`,
`House.cpp` etc. Maybe you use inheritance to share common code, and seems
pretty simple.

But what if a designer wants to create a new type of building? They have to
come to you, the programmer and ask you to create it. Being a programmer is
about being _intelligently lazy_, so how can we improve this?

Stepping back, what is a building? What can it do? We can see a building as
a set of behaviours that can be mixed and matched:

* *Create resource* behaviour. A farm creates wheat, a fisher hut creates
  fish.
* *Convert resource* behaviour. A windmill takes wheat and converts it to
  flour.
* *Store resource* behaviour. A windmill can store a small amount of flour
  that it creates, a barn can store many resources of any type.
* *Require Worker* behaviour. The building will not work unless all the worker
  requirements are met.
* etc.

By decomposing a building into a collection of behaviours, *designers will be
able to create new types of buildings without programmer intervention*. Modders
will be able to create new building types very easily, too.

Programmers are only required to create new behaviours. For example designers might want buildings to
be able to catch fire. In that case then the programmer can create this new
behaviour and let designers add it to the buildings they want to be flammable.






## Unreal Implementation

**Update:** In May 2022, I hosted a [roundtable discussion on data formats]({%
link _posts/tutorials/2022-05-15-data-roundtable-discussion.md %}) in Unreal.
Check it out for a details about the strengths and weaknesses of different
approaches to storing game data in Unreal.
{:.notice--warning }


Data-driven design concepts aside, what tools are available to us in Unreal?

- Data Tables and [Curve Tables]({% link
  _posts/tutorials/2022-08-26-curve-tables.md %})
- Data Asset subclasses or Blueprints in general
- Your own custom data structure and loader (XML, JSON, whatever)

After a bunch of investigating, none of these are ideal, They all have
significant weaknesses that I will discuss.


### Data Tables

Data Tables `UDataTable` are designed for large amounts of data and to be
compatible with import/export from JSON and CSV, however they have some
significant drawbacks too.

Your data structure must inherit from `FTableRowBase` and must be a struct.
To reference other Data Table rows, use `FDataTableRowHandle`.

[Curve Tables]({% link _posts/tutorials/2022-08-26-curve-tables.md %})
are similar to Data Tables but
are suited to defining two-dimensional data like the way a character's health
might change as it levels up.

{%
include figure-begin.html
title="PlantDataRow.h"
code="cpp"
%}
```cpp
USTRUCT()
struct FPlantDataRow : public FTableRowBase
{
	GENERATED_BODY()
public:
	UPROPERTY(EditAnywhere)
	FText DisplayName;

	UPROPERTY(EditAnywhere)
	float FlowerRadius = 0.5f;

	UPROPERTY(EditAnywhere)
	FSlateBrush Icon;

	UPROPERTY(EditAnywhere)
	TArray<FDataTableRowHandle> ChildPlants;
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="Using DataTables"
code="cpp"
%}
```cpp
FName RowName = "sunflower";
FString ContextString = "Searching for sunflowers...?"
FPlantDataRow* Row = PlantsDataTable->FindRow<FPlantDataRow>(RowName, ContextString);
if (Row)
{
	// Do something with row data
}

TArray<FName> RowNames = PlantsDataTable->GetRowNames();
for (const FName& RowName : RowNames)
{
}
```
{%
include figure-end.html
%}

{%
include img.html
file="unreal/plant-data-table.webp"
title="Data Table editor interface"
text="Tabular data at the top is not editable. You must select a row and edit
it in the bottom half. Which sucks."
%}

#### The Good

<ul class="procon">
<li class="pro"><strong>Tabular view</strong> is good for viewing and comparing large numbers of similar entries. Note however that it is <strong>not possible to edit the data</strong>.</li>
<li class="pro"><strong>Import/export from CSV/JSON</strong> could be useful. However comes with a serious caveat (see cons).</li>
<li class="pro"><strong>Can to refer to individual rows</strong> in specific Data Tables by using <code class="highlighter-rouge">FDataTableRowHandle</code>. Unlike using a raw text format.</li>
<li class="pro"><strong>Quick to add rows</strong> unlike DataAssets that
require creating a new asset for every entry. Imagine managing hundreds of
DataAsset classes.</li>
<li class="pro">Works with <a href="https://docs.unrealengine.com/en-US/data-registries-in-unreal-engine/">Data Registries</a>, a powerful way to add and override values between plugins.</li>
</ul>

#### The Bad

<ul class="procon">
<li class="con"><strong>Data Table row structs cannot contain UObjects</strong>. This
limitation cannot be overstated. It is possible to reference other blueprint
assets on-disk, or contain struct assets, but it is not possible to use
UObjects.</li>
<li class="con"><strong>It is not possible to edit the data in the
shown table.</strong> Designers have to select the row and then edit the
properties in the standard vertical interface.</li>
<li class="con"><strong>No parent/child hierarchy possible</strong>, unlike
with DataAssets. If many rows within the table have the same default value, and
then designers want to change that value, they will have to do it one by one by
hand, or export to CSV, edit and re-import</li>
<li class="con"><strong>Referencing rows in Data Tables is laborious.</strong> You have to select the
Data Table, then select the row.</li>
<li class="con"><strong>Subclassing UDataTable a nightmare.</strong> You have to create custom editor tools to spawn the right type of
asset, then support all of the CSV/JSON importer/exporter stuff manually
because it only works with raw <code class="highlighter-rouge">UDataTable</code> classes.</li>
<li class="con"><strong>CSV/JSON import/export creates *two places of authority*</strong>. Is
the latest data in the CSV file or the imported asset? What if someone edits
one but does not import/export to update the other? Changes could be
overwritten when someone else imports/exports.</li>
<li class="con"><strong>Annoying C++ interface for finding and getting rows.</strong></li>
<li class="con"><strong>Impossible to reorder entries</strong> in the Data Table. Their order is
undefined anyway as it's a <code class="highlighter-rouge">TMap&lt;FName, T&gt;</code>.</li>
<li class="con"><strong>Data Tables are stored as binary Uassets</strong>, meaning diffing is impossible and if you use Perforce, require exclusive locking to edit.</li>
</ul>


**Update:** I previously had a point saying that *"Referencing Data Table rows is not type-safe."*. As of Unreal 5.0 this is no longer the case. There is a `meta` property that lets you specify the row type to use for a `FDataTableRowHandle`
```cpp
USTRUCT()
struct FPlantDataRow : public FTableRowBase
{
	GENERATED_BODY()
};

UCLASS()
clas USomeClass : public UObject
{
	GENERATED_BODY()
public:
	UPROPERTY(EditAnywhere, meta=(RowType=PlantDataRow))
	FDataTableRowHandle PlantRowHandle;
};
```


### Data Assets

Create a C++ subclass of `UDataAsset`. Then in the editor create an Asset
Instance of this through **right-click > Miscellaneous > Data Asset**.

**Note:** There is a significant difference between creating a **Blueprint
Subclass** of `UDataAsset` and creating an **Asset Instance** of a `UDataAsset`
class. Most likely you want to create instances of your defined `UDataAsset`
subclass. Make sure to create them through **right-click > Miscellaneous > Data
Asset.** Creating Blueprint subclasses of your `UDataAsset` is **not the same thing**.
It is for creating new classes to add new properties.
{:.notice--error }

{%
include figure-begin.html
title="PlantRowAsset.h"
code="cpp"
%}
```cpp
UCLASS(CollapseCategories)
class UPlantFlowerData : public UObject
{
	GENERATED_BODY()
public:
	UPROPERTY(EditAnywhere)
	float Radius = 0.5f;
	
	UPROPERTY(EditAnywhere)
	int32 Count = 5;
};

UCLASS(BlueprintType)
class UPlantDataAsset : public UDataAsset
{
	GENERATED_BODY()
public:
	UPROPERTY(EditAnywhere)
	FText DisplayName;

	UPROPERTY(EditAnywhere)
	FSlateBrush Icon;

	// Showing how to do an inlined UObject instance for completeness
	UPROPERTY(EditAnywhere, Instanced)
	TArray<UPlantFlowerData*> FlowerDatas;

	// Point to other Data Assets
	// Instead of raw pointer could also be TObjectPtr<T> or TAssetPtr<T>
	UPROPERTY(EditAnywhere)
	TArray<UPlantDataAsset*> ChildPlants;
};
```
{%
include figure-end.html
%}


{%
include img.html
file="unreal/plant-data-asset.webp"
title="Data Asset editor interface"
text="Looks basically the same as a single entry in the DataTable editor."
%}

#### The Good

<ul class="procon">
<li class="pro"><strong>Subclassing is possible,</strong> as with all
blueprints. So common values can be stored in a base class, and instances can
modify those.</li>
<li class="pro"><strong>Refering to other assets is fast and
type-safe.</strong> Just create a UPROPERTY-exposed <code class="highlighter-rouge">UMyDataAsset*</code></li>
<li class="pro"><strong>Can edit many assets and properties in tabular
form</strong> by using the "Bulk Edit via Property Matrix" tool (shown below).
Not all properties are supported (asset references for example), but it can be
useful.</li>
<li class="pro"><strong>Can contain UObject instances.</strong></li>
</ul>

{%
include img.html
file="unreal/bulk-edit-property-matrix2.webp"
title="Bulk Edit via Property Matrix interface"
text="Selecting many assets, right-clicking and choosing Asset Actions > Bulk
Edit via Property Matrix brings up this very useful interface. Pinning
properties adds them to the column view where they are editable."
%}

#### The Bad

<ul class="procon">
<li class="con"><strong>Still annoying managing large numbers of entries.</strong> Creating an asset for every single new datapoint could be a nightmare if you have hundreds of items in an RPG for example.</li>
<li class="con"><strong>Managing lists of assets is a pain.</strong> If the
designer creates a new <code class="highlighter-rouge">BP_Plant</code> subclass, they then have to add that to some
other array that knows about all class types. It cannot be automatically
discovered (as far as I know).</li>
<li class="con"><strong>Binary asset</strong> as with all Blueprints, Data Assets are stored in binary meaning diffs and locking are an issue.</li>
</ul>


### Raw text format (XML/JSON etc.)

Alternatively you could just ignore the Unreal editor interface entirely and
keep and edit all your data in plain text, in a format of your choosing.

This has its own set of problems, regardless of what text format you choose.

#### The Good

<ul class="procon">
<li class="pro"><strong>Nicer to edit large amounts of data</strong> in plain text using
copy/paste, Excel, some other editor depending on your format.</li>
<li class="pro"><strong>Diffs are possible.</strong> Yay.</li>
</ul> 

#### The Bad

<ul class="procon">
<li class="con"><strong>Completely breaks Unreal's asset cooking tool.</strong> Normally Unreal's build tool works based on references. If an asset is referred to, it is included in the build. If all your assets are referred to in a plain text file outside of Unreal, the build tool will not include any of your assets. So you will have to include every single asset in your project, or maintain a separate asset library.</li>
<li class="con"><strong>No validation during editing.</strong> For example if a value must be
an integer between 0 and 10, users can enter "11" or "0.2" and not know that
they are doing something wrong until they run the game.</li>
<li class="con"><strong>Harder to edit for non-technical team-members.</strong> I don't care what fancy format you recommend, JSON, XML, YAML, TOML, they are all designed for machines or programmers.</li>
<li class="con"><strong>Extremely brittle.</strong> A single quotation mark, tab
or colon out of place can break the entire data file and require debugging from
a technical team member.</li>
<li class="con"><strong>Does not work with Unreal's reference system.</strong>
I use the reference viewer all the time to see if an asset is still being used,
or what it's being used by. Storing data externally breaks this and means
you're never sure if something can be safely deleted.</li>
<li class="con"><strong>Referring to Unreal assets is laborious and not type-safe</strong>, error
prone and annoying. Finding the exact path of something and typing it is awful
compared to just clicking a UI element.</li>
<li class="con"><strong>Text format means merges may be required</strong>, something that
non-technical members may struggle with.</li>
<li class="con"><strong>Custom data loading may be required</strong> depending
on your format. Meaning every time you add a property to a structure, you need
to add the associated data loading code.</li>
</ul>


## Conclusion

The ideal tool would:

* Allow for editing data in Unreal in a tabular format.
* Use a plain-text file as a single point of authority, letting users edit it
  directly or use the editor.
* Work with Unreal's build system to include any referenced assets. 
* Support all data types as properties.

None of the tools offered by Unreal fulfill this list.

So choose whichever is the least-bad for you.

Or just use Unity and [Odin Inspector](https://odininspector.com/).




