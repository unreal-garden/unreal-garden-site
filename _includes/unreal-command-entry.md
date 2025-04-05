{% assign entry = include.entry %}
{% assign type = include.type %}

{% capture suffix %}
{%- case entry.type -%}
{%- when "flag" -%}
{%- when "bool" -%}
=true
{%- when "string" -%}
="abc"
{%- when "number" -%}
=123
{%- when "integer" -%}
=123
{%- endcase -%}
{% endcapture %}

{% capture entire_prop %}
{{entry.name|strip}}{{suffix|strip}}
{% endcapture %}


<div class="unreal__prop" markdown="1">

<div class="prop__item">
<code class="left unreal__prefix">-{{ prefix }}</code>
<div class="right" markdown="1">
### `{{ entry.name }}`
{: class="no_toc unreal__prop" -}
<div class="unreal__suffix"><code>{{ suffix }}</code><button class="copy" onclick="copyToClipboard(this,'{{entire_prop|strip|escape}}');" title="Copy {{entire_prop|strip|escape}} to clipboard"><img src="/assets/copy.svg" class="svg-inline--fa svg-filter-link">Copy to clipboard</button></div>
</div>
</div>


<div class="prop__item">
<div class="left">

<div class="box">
<h5 class="no_toc">Type:</h5>
<p class="unreal__type no_toc">
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

{% if entry.required %}
<div class="box">
<h5 class="no_toc">Requires:</h5>
<ul class="proplist requires">
{% for requires in entry.required %}
<li>{% include unreal-link.md link=required %}</li>
{% endfor %}
</ul>
</div>
{% endif %}

{% if entry.incompatible %}
<div class="box">
<h5 class="no_toc">Incompatible with:</h5>
<ul class="proplist incompatible">
{% for incompatible in entry.incompatible %}
<li>{% include unreal-link.md link=incompatible %}</li>
{% endfor %}
</ul>
</div>
{% endif %}

{% if entry.antonyms %}
<div class="box">
<h5 class="no_toc">Opposite:</h5>
<ul class="proplist opposite">
{% for antonym in entry.antonyms %}
<li>{% include unreal-link.md link=antonym %}</li>
{% endfor %}
</ul>
</div>
{% endif %}

{% if entry.synonyms %}
<div class="box">
<h5 class="no_toc">Synonyms:</h5>
<ul class="proplist synonyms">
{% for syn in entry.synonyms %}
<li><code>{{syn}}</code></li>
{% endfor %}
</ul>
</div>
{% endif %}

{% if entry.related %}
<div class="box">
<h5 class="no_toc">Related:</h5>
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
<img src="/assets/data/UE-Specifier-Docs/images{{ image }}" />
{% endfor %}

</div>
</div>
</div>
</div>
