---
layout: none

specifiers:
  - { key: uclass, url: uclass }
  - { key: uenum, url: uenum-umeta }
  - { key: ufunction, url: ufunction }
  - { key: uinterface, url: uinterface }
  - { key: umeta, url: uenum-umeta }
  - { key: uparam, url: uparam }
  - { key: uproperty, url: uproperty }
  - { key: ustruct, url: ustruct }
  - { key: ugame, url: ugame }
---

var store = [
  {%- for entry in site.data.bits -%}
      {
        "categories": ["bits"]
        ,"tags": {{ entry.tags | jsonify }}
        {% if entry.title %}
        ,"title": {{ entry.title | jsonify }}
        {% endif %}

        {% if entry.description %}
        ,"excerpt": {{ entry.description | markdownify | jsonify }}
        {% endif %}

        {% if entry.url %}
        ,"url": {{ entry.url | jsonify }}
        {% endif %}

        {%- if entry.site_preview -%}
        {%- capture teaser_url -%}
          /assets/bits/site-previews/{{ entry.site_preview }}
        {%- endcapture -%}
        ,"teaser": {{ teaser_url | jsonify }}
        {%- endif -%}

        {%- if entry.images -%}
        ,"images": {{ entry.images | jsonify }}
        {%- endif -%}

        {%- if entry.posted_date -%}
        ,"date": {{ entry.posted_date | date: "%s" }}
        {%- endif -%}
      },
  {%- endfor -%}

  {%- for specifier_entry in page.specifiers -%}
    {% assign specifier = specifier_entry.key %}
    {% assign specifier_url = specifier_entry.url %}
    {% for entry in site.data.UE-Specifier-Docs.yaml[specifier].specifiers %}
      {%- capture title -%}{{ specifier | upcase }} {{ entry.name }}{%- endcapture -%}
      {%- capture url -%}unreal/{{ specifier_url }}/#{{ entry.name | downcase }}{%- endcapture -%}
      {
        "title": {{ title | jsonify }},
        "url": {{ url | absolute_url | jsonify }},
        {%- if entry.comment -%}
        "excerpt": {{ entry.comment | strip_html | strip_newlines | jsonify }},
        {%- else if entry.documentation -%}
        "excerpt": {{ entry.documentation.text | strip_html | strip_newlines | jsonify }},
        {%- endif -%}
        {%- if entry.images -%}
        "teaser": "/assets/data/UE-Specifier-Docs/images{{ entry.images[0] }}",
        {%- endif -%}
        "categories": [ "docs", {{ specifier | jsonify }} ]
      },
    {%- endfor -%}
  {%- endfor -%}

  {%- for c in site.collections -%}
    {%- if forloop.last -%}
      {%- assign l = true -%}
    {%- endif -%}
    {%- assign docs = c.docs | where_exp:'doc','doc.search != false' -%}
    {%- for doc in docs -%}
      {%- if doc.header.teaser -%}
        {%- capture teaser -%}{{ doc.header.teaser }}{%- endcapture -%}
      {%- else -%}
        {%- assign teaser = site.teaser -%}
      {%- endif -%}
      {
        "title": {{ doc.title | jsonify }},
        "excerpt":
          {{ doc.content | newline_to_br |
            replace:"<br />", " " |
            replace:"</p>", " " |
            replace:"</h1>", " " |
            replace:"</h2>", " " |
            replace:"</h3>", " " |
            replace:"</h4>", " " |
            replace:"</h5>", " " |
            replace:"</h6>", " "|
          strip_html | strip_newlines | truncatewords: 50 | markdownify | jsonify }},
          {% assign article_single_element_array = "articles" | split: '_' | first %}
          {% assign article_categories_merged_array = article_single_element_array | concat: doc.categories %}
        "categories": {{ article_categories_merged_array | jsonify }},
        "tags": {{ doc.tags | jsonify }},
        "url": {{ doc.url | absolute_url | jsonify }},
        "teaser": {{ teaser | absolute_url | jsonify }},
        "date": {{ doc.date | date: "%s" }}
      }{%- unless forloop.last and l -%},{%- endunless -%}
    {%- endfor -%}
  {%- endfor -%}]
