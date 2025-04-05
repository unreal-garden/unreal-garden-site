---
layout: none
---
document.addEventListener("DOMContentLoaded", () => {
	// Add anchors for headings
	var pageContent = document.getElementsByClassName('page__content');
	if (pageContent.length > 0) {
		pageContent[0].querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((header) => {
			var id = header.getAttribute('id');
			if (id) {
				var anchor = document.createElement("a");
				anchor.className = 'header-link';
				anchor.href = '#' + id;
				anchor.innerHTML = '<span class=\"sr-only\">Permalink</span><img src="/assets/link.svg" class="svg-inline--fa svg-filter-white" alt="Permalink">'
				anchor.title = "Permalink";
				header.append(anchor);
			}
		});
	}

	[...document.getElementsByTagName('detail')].forEach((detail) => {
		rememberDetailsExpansion(detail);
	});
});

function rememberDetailsExpansion(element) {
	if (element) {
		var localStorageKey = "detailsExpanded_" + element.className;

		// Listen to the toggle event, which fires whenever the <details>
		// is opened or closed.  The event fires after the state has changed,
		// so looking it up will tell us the current value.
		// See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details#Events
		element.addEventListener("toggle", event => {
			if (details.open) {
				localStorage.setItem(localStorageKey, true);
			} else {
				localStorage.removeItem(localStorageKey);
			}
		});

		// If the stored value tells us the <details> was open the last time we
		// opened the page, re-open it now.
		if (localStorage.getItem(localStorageKey)) {
			details.open = true;
		}
	}
}

function copyToClipboard(element, text)
{
	element.innerText = "Copied!";
	navigator.clipboard.writeText(text);
}

function copyFigureCode(element)
{
	const codeBlocks = element.parentNode.parentNode.getElementsByTagName('code')
	if (codeBlocks.length > 0)
	{
		navigator.clipboard.writeText(codeBlocks[0].innerText);
		element.innerText = "Copied!";
	}
}