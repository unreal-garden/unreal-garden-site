---
title:  "Return Arrays of the Correct Subclass Type in Blueprints"
excerpt: "Avoid casting with this one weird trick."
date:   2017-06-18 00:00:00 +0000
tags:
- blueprint
- cpp
toc: false
classes: wide
---

Say for example you're developing a pets game and you have a class `AAnimal`,
and subclasses `ADog` and `ACat`.

You've made a function `TArray<AAnimal*> GetAnimalsByClass(TSubclassOf<AAnimal>
ClassType)` that returns an array of all the animal instances of a given
type.

Normally in Blueprints if you called this function, you would be returned an
array of `AAnimal instances, and before using them you would have to cast them
to the animal you expected. Not the end of the world, but **kind of annoying**

The undocumented meta property `DeterminesOutputType` lets you fix that, and
return an array of "pre-cast" instances in Blueprints, removing the need for
casting each element to the expected class type.

{%
include figure-begin.html
title="Returning casted arrays in Blueprints"
code="cpp"
%}

```cpp
UFUNCTION(BlueprintCallable, meta=(DeterminesOutputType = "ClassType"))
TArray<AAnimal*> GetAnimalsByClass(TSubclassOf<AAnimal> ClassType) const;
```

{%
include figure-end.html
%}

