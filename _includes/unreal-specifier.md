{% assign entriesGrouped = include.data.specifiers | sort_specifiers | group_by: "group" %}
{% assign type = include.type %}
{% assign entrypath = include.entrypath %}

<div class="unreal__outer" markdown="1">

{% for group in entriesGrouped %}
# {{ group.name }}
{: class="unreal__group" }

{% assign subGroups = group.items | group_by: "subgroup" %}
{% for subGroup in subGroups -%}
{% if subGroup.name != '' %}
## {{ subGroup.name }}
{: class="no_toc unreal__subgroup" }
{% for item in subGroup.items %}
{% include {{ entrypath }} entry=item type=type %}
{% endfor %}
{% else %}
{% for item in group.items %}
{% unless item.subgroup %}
{% include {{entrypath}} entry=item type=type %}
{% endunless %}
{% endfor %}

{% endif %}
{% endfor %}

{% endfor %}

</div>
