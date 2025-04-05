---
title: "Add UWidgets to a UserWidget using C++ in the Editor"
excerpt: "How to programmatically build up a widget in the editor, while keeping the widget tree in sync."
date:   2023-03-01 00:00:00 +0000
classes: wide
toc: false
tags:
- cpp
- editor
---

Have you ever wanted to build the contents of a `UUserWidget` in the editor
using C++? For example imagine you want to create a gallery widget and you need
20 buttons with correct names. You could create them by hand, but it's slow and
error-prone.

The example below shows how to create widgets inside a User Widget blueprint,
from C++, and correctly update the widget tree so the new widgets can be
selected.

Huge thanks to [@Sharundaar](https://twitter.com/Sharundaar) for sharing how to
do this in my [Discord]({{ site.discord_url }}), and allowing me to share it
here.

**Edit:** It's worth mentioning that if you're trying to fill out a list, tree
or grid in the editor, to give designers an idea of how it will look, you
should consider using [ListView]({% link _posts/tutorials/2021-12-09-listview.md %}).


{%
include img.html
file="unreal/editor-test-widget.webp"
title="WBP_EditorTestWidget"
text="The final result, notice the tree contains the text widgets created, as
well as the \"Fill Text Blocks\" button in the details panel."
%}


## Solution

First, we'll need to add `"UMGEditor"` and `"UnrealEd"` to your dependencies in
your `Build.cs` file.

We're doing something a little weird here, we're going to be adding some
editor-specific code to a non-editor class.  In order to use the editor
functions, we need to add `UnrealEd` and `UMGEditor` to our list of modules in
`MyProject.Build.cs`, but only when building the editor.


{%
include figure-begin.html
title="MyProject.Build.cs snippet"
code="cs"
%}
```cs
if (Target.bBuildEditor)
{
	PrivateDependencyModuleNames.AddRange(new string[]
	{
		"UMGEditor",
		"UnrealEd"
	});
}
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="BUIEditorTestWidget.h"
code="cpp"
%}
```cpp
#pragma once

#include "Blueprint/UserWidget.h"
#include "BUIEditorTestWidget.generated.h"

UCLASS()
class UBUIEditorTestWidget : public UUserWidget
{
	GENERATED_BODY()

protected:
	// Marking a parameterless function with CallInEditor makes a button
	// show up in editor with that name (see screenshot)
	UFUNCTION(CallInEditor, Category="Editor Fill Test")
	void FillTextBlocks();

#if WITH_EDITORONLY_DATA
	UPROPERTY(EditAnywhere, Category="Editor Fill Test", meta=(UIMin=1, UIMax=10, ClampMin=1, ClampMax=10))
	int32 Width = 2;
	UPROPERTY(EditAnywhere, Category="Editor Fill Test", meta=(UIMin=1, UIMax=10, ClampMin=1, ClampMax=10))
	int32 Height = 2;
#endif

	// We don't use GridPanel directly in this example, but it being BindWidget means Unreal
	// will display an error if there is no correctly-named variable.
	UPROPERTY(meta=(BindWidget))
	class UGridPanel* GridPanel;
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="BUIEditorTestWidget.cpp"
code="cpp"
%}
```cpp
#include "BUIEditorTestWidget.h"

#if WITH_EDITOR
#include "WidgetBlueprint.h"
#include "Blueprint/WidgetBlueprintGeneratedClass.h"
#include "Blueprint/WidgetTree.h"
#include "Components/GridPanel.h"
#include "Components/TextBlock.h"
#include "Kismet2/BlueprintEditorUtils.h"
#endif

void UBUIEditorTestWidget::FillTextBlocks()
{
#if WITH_EDITOR
	if (!GridPanel)
		return;

	UWidgetBlueprintGeneratedClass* WidgetBlueprintGeneratedClass = Cast<UWidgetBlueprintGeneratedClass>(GetClass());

	UPackage* Package = WidgetBlueprintGeneratedClass->GetPackage();
	UWidgetBlueprint* MainAsset = Cast<UWidgetBlueprint>(Package->FindAssetInPackage());

	// We *cannot* use the BindWidget-marked GridPanel, instead we need to get the widget in the asset's widget tree.
	// However thanks to the BindWidget, we can be relatively sure that FindWidget will be successful.
	UGridPanel* AssetGridPanel = Cast<UGridPanel>(MainAsset->WidgetTree->FindWidget("GridPanel"));

	AssetGridPanel->ClearChildren();
	for (int32 Y = 0; Y < Height; ++Y)
	{
		for (int32 X = 0; X < Width; ++X)
		{
			const FString WidgetName = FString::Printf(TEXT("Text_X%d_Y%x"), X, Y);
			// Create widget with ConstructWidget, not NewObject
			UTextBlock* Text = MainAsset->WidgetTree->ConstructWidget<UTextBlock>(UTextBlock::StaticClass(), FName(WidgetName));
			Text->SetText(FText::FromString(WidgetName));

			AssetGridPanel->AddChildToGrid(Text, X, Y);
		}
	}
	AssetGridPanel->Modify();

	MainAsset->Modify();
	FBlueprintEditorUtils::MarkBlueprintAsStructurallyModified(MainAsset);
#endif
}
```
{%
include figure-end.html
%}

