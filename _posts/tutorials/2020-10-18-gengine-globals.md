---
title: "Accessing Unreal's Global Variables"
excerpt: "How to use `GAverageFPS`, `GAverageMS`"
date:   2020-10-16 00:00:00 +0000
toc: false
classes: wide
tags:
- cpp
---

There are some global variables `GEngine` like `GAverageFPS` and `GAverageMS`
that can be very useful.

They are declared in `GEngine`, but to access them from your own code you will
need to use the `extern` keyword: 

```cpp
#include "Engine.h"

void UBUIUWMyStatWidget::ShowFPS()
{
	extern ENGINE_API float GAverageFPS;
	extern ENGINE_API float GAverageMS;

	FPSLabel->SetText(FText::AsNumber(GAverageFPS));
	MSLabel->SetText(FText::AsNumber(GAverageMS));
}
```

That's it!

