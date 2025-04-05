---
title:  "Show TMap Entries in the Same Row"
excerpt: "ForceInlineRow or a custom inspector"
date:   2023-02-04 00:00:00 +0000
tags:
- cpp
- editor
---

Unreal Engine will in general display `TMap` entries with the key and the value
in the same row. For example `TMap` with keys that are `FString`, `FName`,
`int32`, even `UTexture` will all be displayed with the key and value together.

{%
include figure-begin.html
code="cpp"
%}
```cpp
UPROPERTY(EditAnywhere)
TMap<FString, int32> StringTMap;

UPROPERTY(EditAnywhere)
TMap<FName, int32> NameTMap;

UPROPERTY(EditAnywhere)
TMap<int32, int32> IntTMap;

UPROPERTY(EditAnywhere)
TMap<UTexture*, int32> TextureTMap;
```
{%
include figure-end.html
%}


{%
include img.html
file="unreal/tmap-fstring-same-row.webp"
%}

## The Problem

However `FGameplayTag` and custom structs will be displayed with the key and
value on separate lines. Yuck.

{%
include figure-begin.html
code="cpp"
%}
```cpp
USTRUCT()
struct FExampleStruct
{
	GENERATED_BODY()
	
public:
	UPROPERTY(EditAnywhere)
	FString Name;
	
	// Used so we can have a TMap of this struct
	FORCEINLINE friend uint32 GetTypeHash(const FExampleStruct& Struct)
	{
		return ::GetTypeHash(Struct.Name);
	}
};

// later...
UPROPERTY(EditAnywhere)
TMap<FGameplayTag, int32> VanillaGameplayTagTMap;
	
UPROPERTY(EditAnywhere)
TMap<FExampleStruct, int32> VanillaStructTMap;
```
{%
include figure-end.html
%}

{%
include img.html
file="unreal/fgameplaytag-separate-row.webp"
%}

Is there a way we can force them to be shown on the same line? Yes! There are
two ways.

## Solutions

### ForceInlineRow

The meta `UPROPERTY()` tag [`ForceInlineRow`]({% link _pages/docs/uproperty.md %}#ForceInlineRow) does exactly what you expect, it forces keys and values to be displayed inline on the same row.

{%
include figure-begin.html
code="cpp"
%}
```cpp
UPROPERTY(EditAnywhere)
TMap<FGameplayTag, int32> Stats;

UPROPERTY(EditAnywhere, meta=(ForceInlineRow))
TMap<FGameplayTag, int32> StatsInlineRow;
```
{%
include figure-end.html
%}

{%
include img.html
file="data/UE-Specifier-Docs/images/uproperty/force-inline-row.webp"
%}

That's all you need to add!


### Custom Inspector

This is a lot more involved, but it will let us show any sort of data structure
in a key-value TMap-style way.

Imagine we want to let designers specify the contents of a store. There will be
an array of items and how many of them there will be.

{%
include figure-begin.html
title="ShopEntry.h"
code="cpp"
%}
```cpp
USTRUCT()
struct FShopEntry
{
	GENERATED_BODY()

	UPROPERTY(EditAnywhere)
	TSoftObjectPtr<UItemDataAsset> ItemDataAsset;

	UPROPERTY(EditAnywhere, meta=(UIMin=1, ClampMin=1, UIMax=20))
	int32 Count = 1;
};
```
{%
include figure-end.html
%}

We want to show this in tabular form, like `ForceInlineRow`, but for whatever
reason, `ForceInlineRow` doesn't work for the class we're using as a Key.

Here's how you do that.

1. Create an editor module if you don't have one already.
2. Create a details customization for the struct mentioned above.
3. In the editor module's `StartupModule()` function, register the
   customization.


{%
include figure-begin.html
title="ShopEntryCustomization.h"
code="cpp"
%}
```cpp
// Copyright Brace Yourself Games. All Rights Reserved.

#pragma once

#include "IPropertyTypeCustomization.h"

class IPropertyHandle;

class FShopEntryCustomization : public IPropertyTypeCustomization
{
public:
	static TSharedRef<IPropertyTypeCustomization> MakeInstance() 
	{
		return MakeShareable(new FShopEntryCustomization);
	}

	/** IPropertyTypeCustomization interface */
	virtual void CustomizeHeader(TSharedRef<class IPropertyHandle> InStructPropertyHandle,
		class FDetailWidgetRow& HeaderRow,
		IPropertyTypeCustomizationUtils& StructCustomizationUtils) override;
	virtual void CustomizeChildren(TSharedRef<class IPropertyHandle> InStructPropertyHandle,
		class IDetailChildrenBuilder& StructBuilder,
		IPropertyTypeCustomizationUtils& StructCustomizationUtils) override;

private:
	/** Handle to the struct property being customized */
	TSharedPtr<IPropertyHandle> StructPropertyHandle;
};
```
{%
include figure-end.html
%}

{%
include figure-begin.html
title="ShopEntryCustomization.cpp"
code="cpp"
%}
```cpp
#include "ShopEntryCustomization.h"
#include "Widgets/DeclarativeSyntaxSupport.h"
#include "PropertyHandle.h"
#include "PropertyCustomizationHelpers.h"

void FShopEntryCustomization::CustomizeHeader(TSharedRef<IPropertyHandle> InStructPropertyHandle,
	FDetailWidgetRow& HeaderRow,
	IPropertyTypeCustomizationUtils& StructCustomizationUtils)
{
	StructPropertyHandle = InStructPropertyHandle;

	// Gets ItemDataAsset
	TSharedPtr<IPropertyHandle> Key = StructPropertyHandle->GetChildHandle(0);

	// Gets Count
	TSharedPtr<IPropertyHandle> Value = StructPropertyHandle->GetChildHandle(1);

	// Setup in the header row so that we still get the TArray dropdown
	HeaderRow
		.NameContent()
		[
			Key->CreatePropertyValueWidget()
		]
		.ValueContent()
		.MaxDesiredWidth(0.0f)
		[
			Value->CreatePropertyValueWidget()
		];

	// This avoids making duplicate reset boxes
	StructPropertyHandle->MarkResetToDefaultCustomized();
}

void FShopEntryCustomization::CustomizeChildren(TSharedRef<IPropertyHandle> InStructPropertyHandle,
	IDetailChildrenBuilder& StructBuilder,
	IPropertyTypeCustomizationUtils& StructCustomizationUtils)
{
}
```
{%
include figure-end.html
%}

Now here's how we register the details customization.

{%
include figure-begin.html
title="MyProjectEditorModule.cpp"
code="cpp"
%}
```cpp
#include "MyProjectEditorModule.h"
#include "Modules/ModuleManager.h"
#include "Modules/ModuleInterface.h"
#include "PropertyTypeCustomization/ShopEntryCustomization.h"

#define LOCTEXT_NAMESPACE "FMyProjectEditorModule"

void FMyProjectEditorModule::StartupModule()
{
	FPropertyEditorModule& PropertyModule = FModuleManager::LoadModuleChecked<FPropertyEditorModule>("PropertyEditor");

	PropertyModule.RegisterCustomPropertyTypeLayout("ShopEntry", FOnGetPropertyTypeCustomizationInstance::CreateStatic(&FShopEntryCustomization::MakeInstance));
}

void FMyProjectEditorModule::ShutdownModule()
{
	FModuleManager::Get().OnModulesChanged().RemoveAll(this);

	// Unregister customization and callback
	FPropertyEditorModule* PropertyEditorModule = FModuleManager::GetModulePtr<FPropertyEditorModule>("PropertyEditor");

	if (PropertyEditorModule)
	{
		PropertyEditorModule->UnregisterCustomPropertyTypeLayout(TEXT("ShopEntry"));
	}
}

IMPLEMENT_MODULE(FMyProjectEditorModule, MyProjectEditor)

#undef LOCTEXT_NAMESPACE
```
{%
include figure-end.html
%}

Hopefully between `ForceInlineRow` and the example above, you should have an
idea of how to do key-value style display
