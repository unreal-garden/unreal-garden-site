# Unreal Garden

Unreal Garden is a community-run website for Unreal Engine tutorials, documentation and tips.


## Contact

- [Discord](https://discord.unreal-garden.com/)


## Helping Out

- Check out the [TODO](#to-do) list, do some of those
- Write articles or fix existing articles.
- Create or improve documentation for specifiers.
- Link your own tutorials by adding an external link.


## Running and Testing

### Requirements

Ruby, Jekyll. Tested on Windows. Should work on most platforms.


### Installation

1. Clone the repo or download a .zip file of the repo.
2. Follow the [Jekyll Quickstart Guide](https://jekyllrb.com/docs/) to install Jekyll.


### Running

1. Run the server locally with `run.bat`, or the following from the command-line:
```
bundle exec jekyll serve
```
2. Open a browser and visit [https://localhost:4000/](https://localhost:4000/).


### External Dependencies

The repo has an external dependency on
[benui-dev/UE-Specifier-Docs](https://github.com/benui-dev/UE-Specifier-Docs/).
If changes have been made in that repo, you will need to manually merge them
into this repo. This can be done using `update-submodule.bat`, or the following
from the command-line:

```
git submodule update --remote --merge
```

### Updating Bots

There are two bots, one on Bluesky and one on Mastodon that automatically post content, twice a day.
Their source data is created by /assets/bot-data/bot-bsky.json and bot-mastodon.json, respectively. It must be manually copied to the bot sites for them to link to new articles.

As new content is added to the site, the data used by the bot

- Mastodon: [Cheap Bots, Toot Suite](https://cheapbotstootsweet.com/)
- Bluesky: [Blue Bots, Done Quick](https://bluebotsdonequick.com/)

## License

See [LICENSE](https://github.com/unreal-garden/unreal-garden-site/blob/main/LICENSE) file.


## To do

- [ ] Move these TODOs into GitHub issues I guess?

### Scripts

- [ ] Need custom static teaser/preview screenshots for every page that includes the title text and logo.
  - [ ] Create script that makes static images of each page's header, saves them somewhere. Use the article slug as ID.
  - [ ] Change header matter to point to it, or include them automatically based on slug.
  - [ ] Existing images should be replaced so they no longer say "benui" in the bottom-left.
- [ ] Update bits.yml site preview script to output preview images as compressed .webp and not .png. Some files are large.
- [ ] Make an Unreal Garden fork of [benui-dev/UE-Specifier-Docs](https://github.com/benui-dev/UE-Specifier-Docs/), change the site to use that.
- [ ] Update bots to use Unreal Garden.
- [ ] Create Unreal Garden Mastodon account.

### Bots

- [ ] Create and run bots that automatically post to Bsky/Mastodon/Discord when new content is added to the site.
- [ ] Refactor bot-bsky.json and bot-mastodon.json to have minimal duplicated code.
- [ ] Update existing bots to add pictures with posts.

### Front-End HTML/CSS

- [ ] Fix GitHub logo in footer showing black.
- [ ] Use PageSpeed Insights to find places to optimize/fix:
  - [ ] Homepage: https://pagespeed.web.dev/analysis?url=https%3A%2F%2Funreal-garden.com%2F
  - [ ] UPROPERTY: https://pagespeed.web.dev/analysis?url=https%3A%2F%2Funreal-garden.com%2Fdocs%2Fuproperty
  - [ ] Tutorial example: https://pagespeed.web.dev/analysis?url=https%3A%2F%2Funreal-garden.com%2Ftutorials%2Fdelegates-advanced
- [ ] Update site to use Jekyll picture stuff so it lazy-loads minimal-sized images.

### Art, Visual

- [ ] It would be awesome if the plant logo grew and waved in the wind.
