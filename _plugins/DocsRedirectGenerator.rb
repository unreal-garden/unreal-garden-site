module DocsRedirectPlugin
	class RedirectPageGenerator < Jekyll::Generator
		safe true
  
		def generate(site)
			parts = [
				"uproperty",
				"uclass",
				"ufunction",
				"uinterface",
				"ustruct",
				"umeta",
				"uparam",
				"uenum"
			]
			parts.each do |part|
				if site.data.key?('UE-Specifier-Docs') and
					site.data['UE-Specifier-Docs'].key?('yaml') and
					site.data['UE-Specifier-Docs']['yaml'].key?(part) and
					site.data['UE-Specifier-Docs']['yaml'][part].key?('specifiers') then
					site.data['UE-Specifier-Docs']['yaml'][part]['specifiers'].each do |specifier|
						site.pages << RedirectPage.new(site, part, specifier)
					end
				else
					puts('failed to find specifier ' + part)
				end
			end
		end
	end
  
	# Subclass of `Jekyll::Page` with custom method definitions.
	class RedirectPage < Jekyll::Page
		def initialize(site, category, specifier)
			@site = site             # the current site instance.
			@base = site.source      # path to the source directory.
			@dir  = "/unreal/#{category}/#{specifier['name']}"        # the directory the page will reside in.
  
			# All pages have the same filename, so define attributes straight away.
			@basename = 'index'      # filename without the extension.
			@ext      = '.html'      # the extension.
			@name     = 'index.html' # basically @basename + @ext.
		
			# Initialize data hash with a key pointing to all posts under current category.
			# This allows accessing the list in a template via `page.linked_docs`.
			@data = {}
			@data["layout"] = "redirect"
			@data["redirect"] = {
				"to" => "#{site.baseurl}/unreal/#{category}/##{specifier['name']}"
			}
	  end
  
		# Placeholders that are used in constructing page URL.
		def url_placeholders
			{
				:path       => @dir,
				:category   => @dir,
				:basename   => basename,
				:output_ext => output_ext,
			}
		end
	end
end
