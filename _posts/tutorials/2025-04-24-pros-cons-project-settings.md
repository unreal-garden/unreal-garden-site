---
title:  "Pros and Cons of Using Project Settings"
excerpt: "It sounds handy but then you fall into a pit of spikes."
date:   2025-04-25 00:00:00 +0000
author: benui
tags:
- data
- editor
---

I wrote this tutorial because I was bitten by one of the _Cons_ here. See if you can guess which one!

<ul class="procon">
<li class="pro">Simple <strong>central</strong> place for all project-specific values, rather than having a bunch of assets strewn around the project.</li>
<li class="pro">Settings are stored in text .ini files, allowing <strong>merging</strong> and removing the need for exclusive checkouts.</li>
<li class="con">Assets that are pointed to in Project Settings <strong>do not show up in Reference Viewer</strong>. This has two important knock-on effects:<ul><li>Assets may appear to be unused because the Reference Viewer shows nothing, when they are in fact in use. Making it harder to clean up old assets with confidence.</li><li>Also it makes it much harder to find where settings are coming from; by using the asset viewer.</li></ul></li>
<li class="con">Large numbers of settings quickly become unwieldy. They are presented in a single flat list.</li>
<li class="con">Impossible to use bulk-edit functionality like Edit In Property Matrix.</li>
<li class="con">Impossible to split data into separate modules (as far as I can tell).</li>
</ul>


## Alternatives

For alternatives check out tutorials on [Data-Driven Design]({% link _posts/tutorials/2020-01-03-data-driven-design.md %}) or the [Roundtable Discussion on Data]({% link _posts/tutorials/2022-05-15-data-roundtable-discussion.md %}). But your alternatives include:

* Primary Data Assets, Data Assets.
* Data Tables.
* External text files.
