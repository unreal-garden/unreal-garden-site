---
title:  "Character Health Bar UI using C++"
excerpt: "How to set up widgets attached to actors."
date:   2020-09-19 00:00:00 +0000
tags:
- ui
- umg
- blueprint
- video
toc: false
classes: wide
header:
  video:
    id: nNe-NSrtYUk
    provider: youtube
  teaser: /assets/unreal/ui-in-world-title-small.webp
---

In this tutorial video, I explain how to set up in-world widgets that are
attached to actors, using the `UWidgetComponent` class. 


{%
include figure-begin.html
title="Dog.h"
code="cpp"
%}
```cpp
#pragma once

#include "GameFramework/Actor.h"

#include "Dog.generated.h"

class UWidgetComponent;

UCLASS()
class ADog : public AActor
{
	GENERATED_BODY()
	
public:	
	ADog(const FObjectInitializer& ObjectInitializer);

	float GetHealth() const { return Health; }
	void SetHealth(float Val) { Health = Val; }

	float GetMaxHealth() const { return MaxHealth; }
	void SetMaxHealth(float Val) { MaxHealth = Val; }

protected:
	virtual void Tick(float DeltaTime) override;
	virtual void BeginPlay() override;

	UPROPERTY(VisibleAnywhere)
	TObjectPtr<UWidgetComponent> HealthWidgetComp;

	FVector MovementVelocity = FVector::ZeroVector;

	float Health = 0;
	float MaxHealth = 120;

	float HealthTweenDirection = 0;
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="Dog.cpp"
code="cpp"
%}
```cpp
#include "Dog.h"
#include "Components/WidgetComponent.h"
#include "HealthBar.h"

ADog::ADog(const FObjectInitializer& ObjectInitializer)
	: Super(ObjectInitializer)
{
	PrimaryActorTick.bCanEverTick = true;

	if (RootComponent == nullptr)
	{
		RootComponent = ObjectInitializer.CreateDefaultSubobject<USceneComponent>(this, TEXT("Root"));
	}

	HealthWidgetComp = ObjectInitializer.CreateDefaultSubobject<UWidgetComponent>(this, TEXT("HealthBar"));
	HealthWidgetComp->AttachToComponent(RootComponent, FAttachmentTransformRules::KeepRelativeTransform);

	Health = MaxHealth;
}

void ADog::BeginPlay()
{
	Super::BeginPlay();

	UHealthBar* HealthBar = Cast<UHealthBar>(HealthWidgetComp->GetUserWidgetObject());
	HealthBar->SetOwnerDog(this);

	// Make sure every dog starts with different health
	Health = FMath::RandRange(0.0f, MaxHealth);
	HealthTweenDirection = FMath::RandBool() ? 1 : -1;

	// Move in a random direction at a random speed
	const float DirRads = FMath::RandRange(0.0f, 2 * PI);
	MovementVelocity = FVector(FMath::Cos(DirRads), FMath::Sin(DirRads), 0) * 10.0f;

	// Face that way too
	RootComponent->SetWorldRotation(FRotator::MakeFromEuler(FVector(0, 0, DirRads / PI * 180 - 90)));
}

void ADog::Tick(float DeltaTime)
{
	Super::Tick(DeltaTime);

	SetActorLocation(GetActorLocation() + MovementVelocity * DeltaTime);

	// Bounce health between min and max to show off health bar
	static const float TweenSpeed = 10.0f;
	Health = FMath::Clamp<float>(Health + DeltaTime * HealthTweenDirection * TweenSpeed, 0, MaxHealth);
	if ((Health == MaxHealth && HealthTweenDirection == 1)
		|| (Health == 0 && HealthTweenDirection == -1))
	{
		HealthTweenDirection *= -1;
	}
}
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="HealthBar.h"
code="cpp"
%}
```cpp
#pragma once

#include "Blueprint/UserWidget.h"
#include "Dog.h"

#include "HealthBar.generated.h"

class UProgressBar;
class UTextBlock;

UCLASS(Abstract)
class UHealthBar : public UUserWidget
{
	GENERATED_BODY()

public:
	void SetOwnerDog(ADog* InDog) { OwnerDog = InDog; }
	
protected:
	virtual void NativeTick(const FGeometry& MyGeometry, float InDeltaTime) override;

	TWeakObjectPtr<ADog> OwnerDog;

	UPROPERTY(meta=(BindWidget))
	TObjectPtr<UProgressBar> HealthBar;

	UPROPERTY(meta=(BindWidget))
	TObjectPtr<UTextBlock> CurrentHealthLabel;

	UPROPERTY(meta=(BindWidget))
	TObjectPtr<UTextBlock> MaxHealthLabel;
};
```
{%
include figure-end.html
%}



{%
include figure-begin.html
title="HealthBar.cpp"
code="cpp"
%}
```cpp
#include "HealthBar.h"
#include "Components/ProgressBar.h"
#include "Components/TextBlock.h"

void UHealthBar::NativeTick(const FGeometry& MyGeometry, float InDeltaTime)
{
	Super::NativeTick(MyGeometry, InDeltaTime);

	if (!OwnerDog.IsValid())
		return;

	HealthBar->SetPercent(OwnerDog->GetHealth() / OwnerDog->GetMaxHealth());

	FNumberFormattingOptions Opts;
	Opts.SetMaximumFractionalDigits(0);
	CurrentHealthLabel->SetText(FText::AsNumber(OwnerDog->GetHealth(), &Opts));
	MaxHealthLabel->SetText(FText::AsNumber(OwnerDog->GetMaxHealth(), &Opts));
}
```
{%
include figure-end.html
%}
