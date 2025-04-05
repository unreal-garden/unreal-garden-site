module Jekyll
	module BenFilters
		def replace_filename(input, new_suffix)
			index = input.rindex(/\./)
			if index
				filename = input.slice(0, index)
				return filename + "." + new_suffix
			end
			return input
		end

		def get_extension(input)
			index = input.rindex(/\./)
			if index
				return input.slice(index+1 .. -1)
			end
			return input
		end

		def is_youtube_url(input)
			if input.match?(/https?:\/\/(www\.)?youtube.com/)
				return true
			end
			return false
		end
		
		def get_youtube_video_id(input)
			# (?: ) is a non-matching group
			found = match(/https?:\/\/(?:www\.)?youtube.com\/watch\?v=([^&]+)/)
			if found
				return found[1]
			end
			return Nil
		end

		def sort_specifiers(specifiers)
      specifiers.sort! do |a,b|
        if a.key?('group') and b.key?('group')
          answer = 0
          if a['group'].downcase().include?('deprecated') or a['group'].downcase().include?('todo')
            answer = 1
          elsif b['group'].downcase().include?('deprecated') or b['group'].downcase().include?('todo')
            answer = -1
          else
            answer = a['group'] <=> b['group']
          end
          answer
        end
      end
      return specifiers
		end

    def shuffle(array, seed)
      array.shuffle(random: Random.new(seed))
    end

		#def ben_test(input)
			#Jekyll::Tags::HighlightBlock.render(input)
		#end
	end
end

Liquid::Template.register_filter(Jekyll::BenFilters)