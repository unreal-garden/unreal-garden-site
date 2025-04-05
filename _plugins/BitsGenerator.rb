module BitsPagePlugin
	class RedirectPageGenerator < Jekyll::Generator
		safe true

		def should_output(bit)
			if bit.key?('id') and bit.key?('tags') and bit['tags'].include?('tip') then
				return true
			end
			return false
		end
  
		def generate(site)
			if site.data.key?('bits') then
				site.data['bits'].each do |bit|
					if should_output(bit) then
						site.pages << BitsPage.new(site, bit)
					end
				end
			else
				puts('failed to get bits data')
			end
		end
	end
  
	# Subclass of `Jekyll::Page` with custom method definitions.
	class BitsPage < Jekyll::Page
		def initialize(site, bit)
			@site = site             # the current site instance.
			@base = site.source      # path to the source directory.
			dirname = 'unknown' 
			if bit['id'] then
				dirname = bit['id']
			end
			@dir  = "/bits/#{dirname}/"        # the directory the page will reside in.
  
			# All pages have the same filename, so define attributes straight away.
			@basename = 'index'      # filename without the extension.
			@ext      = '.html'      # the extension.
			@name     = 'index.html' # basically @basename + @ext.
		
			# Initialize data hash with a key pointing to all posts under current category.
			# This allows accessing the list in a template via `page.linked_docs`.
			@data = {}
			@data["layout"] = "single"
			@data['title'] = bit['title']
			@content = bit['description']
			@data['date'] = bit['posted_date']
			@data['last_modified_at'] = bit['posted_date']
			@data['tags'] = bit['tags']
			@data['category'] = 'bits'
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
