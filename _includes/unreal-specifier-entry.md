{% assign entry = include.entry %}
{% assign type = include.type %}

{% capture prefix %}
{%- if entry.position == "main" -%}
{{type}}(
{%- else if entry.position == "meta" -%}
{{type}}(meta=(
{%- endif -%}
{% endcapture %}

{% capture suffix %}
{%- case entry.type -%}
{%- when "flag" -%}
)
{%- when "bool" -%}
=true)
{%- when "string" -%}
="abc")
{%- when "number" -%}
=123)
{%- when "integer" -%}
=123)
{%- endcase -%}
{%- if entry.position == "meta" -%}
)
{%- endif -%}
{% endcapture %}

{% capture entire_prop %}
{{prefix | strip}}{{entry.name | strip}}{{suffix | strip}}
{% endcapture %}

{%comment %} replace camelcase with camelcase + space {%endcomment %}
{% capture splitname %}{{ entry.name }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "A", " A" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "B", " B" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "C", " C" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "D", " D" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "E", " E" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "F", " F" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "G", " G" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "H", " H" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "I", " I" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "J", " J" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "K", " K" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "L", " L" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "M", " M" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "N", " N" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "O", " O" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "P", " P" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "Q", " Q" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "R", " R" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "S", " S" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "T", " T" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "U", " U" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "V", " V" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "W", " W" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "X", " X" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "Y", " Y" }}{% endcapture %}
{% capture splitname %}{{ splitname | replace: "Z", " Z" }}{% endcapture %}

<div class="unreal__prop" markdown="1">

<div class="prop__item">
<code class="left unreal__prefix"></code>
<div class="right" markdown="1">
<h3 id="{{ entry.name | strip | downcase }}">{{ splitname | strip }}</h3>
{: class="no_toc unreal__prop" -}
</div>
</div>


<div class="prop__item">
<div class="left">

{% comment %}
<div class="unreal__position">
{% if entry.position == "main" -%}
<p class="entry main selected">Main</p><p class="entry meta unselected">Meta</p>
{% else -%}
<p class="entry main unselected">Main</p><p class="entry meta selected">Meta</p>
{% endif %}
</div>
{% endcomment %}

<div class="box">
<h5>Position:</h5>
{%- if entry.position == "main" -%}
<p>Main</p>
{%- else -%}
<p>Meta</p>
{%- endif -%}
</div>

<div class="box">
<h5>Type:</h5>
<p class="unreal__type">
<i class="fa-fw fas {%-
case entry.type %}
{% when "flag" %}
fa-flag
{% when "bool" %}
fa-check-square
{% when "string" %}
fa-file-alt
{% when "number" %}
fa-list-alt
{% when "integer" %}
fa-1
{% endcase %}
"></i>{{ entry.type }}
{% if entry.type-comment %}
({{ entry.type-comment }})
{% endif %}</p>
</div>

{% if entry.version %}
<div class="box">
<h5>Version:</h5>
<p class="unreal__type no_toc">{{ entry.version }}</p>
</div>
{% endif %}

{% if entry.utility %}
<div class="box">
<h5><abbr title="A score to gague how often this specifier is used. 3 stars means it's definitely worth learning, 1 stars means it's not likely you'll need it.">Utility</abbr>:</h5>
<p class="unreal__type no_toc">
{%- for i in (1..3) -%}
  {%- if i <= entry.utility -%}
  ★
  {%- else -%}
  ☆
  {%- endif -%}
{%- endfor -%}</p>
</div>
{% endif %}

{% if entry.required %}
<div class="box">
<h5>Requires:</h5>
<ul class="proplist requires">
{% for requires in entry.required %}
<li>{% include unreal-link.md link=requires %}</li>
{% endfor %}
</ul>
</div>
{% endif %}

{% if entry.incompatible %}
<div class="box">
<h5>Incompatible with:</h5>
<ul class="proplist incompatible">
{% for incompatible in entry.incompatible %}
<li>{% include unreal-link.md link=incompatible %}</li>
{% endfor %}
</ul>
</div>
{% endif %}

{% if entry.synonyms %}
<div class="box">
<h5>Synonyms:</h5>
<ul class="proplist synonyms">
{% for syn in entry.synonyms %}
<li><code>{{syn}}</code></li>
{% endfor %}
</ul>
</div>
{% endif %}

{% if entry.antonyms %}
<div class="box">
<h5>Opposite:</h5>
<ul class="proplist opposite">
{% for antonym in entry.antonyms %}
<li>{% include unreal-link.md link=antonym %}</li>
{% endfor %}
</ul>
</div>
{% endif %}

{% if entry.related %}
<div class="box">
<h5>Related:</h5>
<ul class="proplist related">
{% for rel in entry.related %}
<li>{% include unreal-link.md link=rel %}</li>
{% endfor %}
</ul>
</div>
{% endif %}

{% comment %}
{% if entry.links %}
{% for link in entry.links %}
[{{ link[0] }}]({{ link[1] }})
{% endfor %}
{% endif %}
{% endcomment %}

{% if entry.source -%}
<div class="box">
<p><a href="https://github.com/EpicGames/UnrealEngine/blob/release/{{ entry.source }}" rel="nofollow noopener noreferrer"><i class="fab fa-fw fa-github" aria-hidden="true" style="#fff"></i>Source</a></p>
</div>
{% endif -%}

{% if entry.examples %}
<div class="box">
{% for example in entry.examples %}
<p><a href="https://github.com/EpicGames/UnrealEngine/blob/release/{{ example }}" rel="nofollow noopener noreferrer"><i class="fab fa-fw fa-github" aria-hidden="true" style="#fff"></i>Example</a></p>
{% endfor %}
</div>
{% endif %}
</div>


<div class="right">
<div class="body" markdown="1">
<button class="copy" onclick="copyToClipboard(this,'{{entire_prop|strip|escape}}');" title="Copy {{entire_prop|strip|escape}} to clipboard"><img src="/assets/copy.svg" class="svg-inline--fa svg-filter-link" alt="Copy to clipboard">Copy</button>
```cpp
{{ entire_prop | strip }}
```
{% if entry.comment %}
{{ entry.comment | liquid }}
{% endif %}

{% if entry.documentation %}
<figure class="unreal-doc">
<blockquote cite="{{entry.documentation.source}}">{{ entry.documentation.text | xml_escape | markdownify }}</blockquote>
<figcaption><a href="{{entry.documentation.source}}" rel="nofollow noopener noreferrer">Unreal Documentation</a></figcaption>
</figure>
{% endif %}

{% if entry.samples %}
{% for sample in entry.samples %}
```cpp
{{ sample }}```
{% endfor %}
{% endif %}

{% for image in entry.images %}
{% assign extension = image | get_extension %}
{% if extension == "gif" %}
<img src="/assets/data/UE-Specifier-Docs/images{{ image }}" />
{% else %}
<img src="/assets/data/UE-Specifier-Docs/images{{ image | replace_filename: "webp" }}" />
{% endif %}
{% endfor %}

</div>
</div>
</div>
</div>
