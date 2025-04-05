{% if include.link contains '.' %}
{% assign parts = include.link | split:"." %}

{% assign linkurl = "unknown" %}
{% if parts[0] == "uclass" %}
{% capture linkurl %}{% link _pages/docs/uclass.md %}{% endcapture %}
{% else if parts[0] == "uproperty" %}
{% capture linkurl %}{% link _pages/docs/uproperty.md %}{% endcapture %}
{% else if parts[0] == "ustruct" %}
{% capture linkurl %}{% link _pages/docs/ustruct.md %}{% endcapture %}
{% else if parts[0] == "ufunction" %}
{% capture linkurl %}{% link _pages/docs/ufunction.md %}{% endcapture %}
{% else if parts[0] == "umeta" %}
{% capture linkurl %}{% link _pages/docs/uenum-umeta.md %}{% endcapture %}
{% else if parts[0] == "uenum" %}
{% capture linkurl %}{% link _pages/docs/uenum-umeta.md %}{% endcapture %}
{% endif %}
<a href="{{linkurl}}#{{parts[1] | slugify}}"><code>{{parts[1]}}</code></a>
{% else %} 
<a href="#{{include.link | slugify}}"><code>{{include.link}}</code></a>
{% endif %}
