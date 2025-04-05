---
title:  "How to Manually Install an Unreal Engine Plugin"
excerpt: "Where to put those files in both a C++ and Blueprint project"
date:   2025-01-08 00:00:00 +0000
tags:
- cpp
---

For this example, we will assume you have a project called `MyProject`, and you're trying to add a new plugin called `MyPlugin`. And that you're installing it manually (not from the Marketplace/FAB).

The basics:

1. If it does not exist, create a new directory named `Plugins` inside your Unreal project's folder. So alongside typical existing directories like `Binaries`, `Config` and `Content`, you should also see a `Plugins` directory.
2. Inside the `Plugins` directory, create a directory with the name of the plugin. The exact name does not need to match, just make something that makes sense to you.
3. Inside that new directory, paste your plugin's files. If your plugin is called MyPlugin, there should be a file named `MyPlugin.uplugin` under `SomeProject/Plugins/MyPlugin/`
4. Launch (or re-launch) the editor.
5. Open up the Plugins window by clicking the `Edit` menu and then `Plugins`
6. Under the Project category you should be able to find your newly-installed plugin. Make sure that it is enabled.

## For C++ Projects wanting to use C++ Plugins

If you are trying to use functions within the plugin, and you are getting errors like:
```
Cannot open include file: 'MyPlugin.h': No such file or directory
```
or
```
unresolved external symbol "__declspec(dllimport) public: __cdecl UMyPlugin::UMyPlugin(class FObjectInitializer const &)" (__imp_??0UMyPlugin@@QEAA@AEBVFObjectInitializer@@@Z) referenced in function ...
```

You need to add the C++ module to your dependencies in your project's `Build.cs` file.

Assuming your project is called MyProject:

1. Under `Source/MyProject/`, open up `MyProject.Build.cs`.
2. Find the module name of your plugin. Look under the plugin's `Source` directory for classes that subclass `IModuleInterface`. It may be called something like `MyPlugin`, or `MyPluginRuntime`.
3. Under either `PublicDependencyModuleNames` or `PrivateDependendencyModuleNames` add the name of the plugin's C++ module.
