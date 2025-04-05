---
title:  "FRunnable and Threads"
excerpt:  "One way to set up threads in Unreal."
date:   2017-08-13 00:00:00 +0000
last_modified_at:   2021-05-25 00:00:00 +0000
toc: false
classes: wide
tags:
- cpp
header:
  teaser: /assets/unreal/frunnable-threads-title-small.webp
---

There are a bunch of ways to do threads in Unreal. Today we're going to cover
possibly the simplest one, `FRunnable`.

I updated this example based on how `FRunnable` is used in the Unreal source code.
If you need more examples of `FRunnable`, I strongly recommend taking a look.

{%
include figure-begin.html
title="BUIExampleRunnable.h"
code="cpp"
%}
```cpp
#pragma once

#include "HAL/Runnable.h"

DECLARE_DYNAMIC(FBUIOnCompleteSignature);

// Note that we do not have to mark our class as UCLASS() if we don't want to
class FBUIExampleRunnable : public FRunnable
{
public:
	// Custom constructor for setting up our thread with its target
	FBUIExampleRunnable(int32 InTargetCount);
	virtual ~FBUIExampleRunnable();

	// FRunnable functions
	virtual uint32 Run() override;
	virtual void Stop() override;
	virtual void Exit() override;
	// FRunnable

	FBUIOnCompleteSignature OnCompleteDelegate;

protected:
	FRunnableThread* Thread = nullptr;

	TArray<int32> ProcessedNumbers;

	int32 TargetCount = -1;
	int32 FoundCount = -1;

	bool bStopThread = false;
};
```
{%
include figure-end.html
%}


{%
include figure-begin.html
title="BUIExampleRunnable.cpp"
code="cpp"
%}

```cpp
#include "ThreadExample.h"

FBUIExampleRunnable::FBUIExampleRunnable(int32 InTargetCount)
{
	TargetCount = InTargetCount;
	FoundCount = 0;
	Thread = FRunnableThread::Create(this, TEXT("This is my thread example"));
}

FBUIExampleRunnable::~FBUIExampleRunnable()
{
	if (Thread != nullptr)
	{
		Thread->Kill(true);
		delete Thread;
	}
}

uint32 FBUIExampleRunnable::Run()
{
	bStopThread = false;

	// Keep processing until we're cancelled through Stop() or we're done,
	// although this thread will suspended for other stuff to happen at the same time
	while (!bStopThread && FoundCount < TargetCount)
	{
		// This is where we would do our expensive threaded processing

		// Instead we're going to make a really busy while loop to slow down processing
		// You can change INT_MAX to something smaller if you want it to run faster
		int32 x = 0;
		while (x < INT_MAX)
		{
			x++;
		}
		ProcessedNumbers.Add(FMath::RandRange(0, 999));
		FoundCount += 1;
	}

	OnCompleteDelegate.ExecuteIfBound();

	// Return success
	return 0;
}


void FBUIExampleRunnable::Exit()
{
	// Here's where we can do any cleanup we want to 
}


void FBUIExampleRunnable::Stop()
{
	// Force our thread to stop early
	bStopThread = true;
}

```
{%
include figure-end.html
%}



{%
include figure-begin.html
title="Running our code"
code="cpp"
%}
```cpp
TSharedPtr<FBUIExampleRunnable> SomeRunnable = MakeShared<FBUIExampleRunnable>(10);
```
{%
include figure-end.html
%}
