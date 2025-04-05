---
layout: none
---

/**
 * the url is the authority, the form is just a visual rep of that
 * 1. set up form state from url
 * 2. on state change in form or clicking buttons, write state to url
 * 3. refresh search
 */
/* this is really bad, i'm definitely not a js programmer */

let lunrIndex = lunr(function () {
	this.field('title');
	this.field('excerpt');
	this.field('categories');
	this.field('tags');
	this.field('date');
	this.ref('id');

	this.pipeline.remove(lunr.trimmer);

	for (let item in store) {
		this.add({
			title: store[item].title,
			excerpt: store[item].excerpt,
			categories: store[item].categories,
			tags: store[item].tags,
			date: store[item].date,
			id: item
		})
	}
});

const searchTextInputId = 'search';
const textVarName = 'q';
const tagsVarName = 'tags';
const categoriesVarName = 'categories';
const formName = 'search_form';
const allCategories = ['articles','bits','docs'];

function onTextChanged(e)
{
	let searchData = getSearchDataFromURL();
	searchData.text = e.target.value;
	writeSearchDataBackToURL(searchData);
	refreshPosts();
}

function onCategoryChanged(e) {
	let categories_all = null;
	let categories_group = [];

	// get all the other category things
	let form = document.getElementById(formName);
	let idToChecked = {};
	[...form.getElementsByTagName("input")].forEach((child) => {
		if (child.dataset['group'] == "categories")
		{
			if (child.dataset['all']) {
				categories_all = child;
			}
			else {
				idToChecked[child.id] = child.checked;
				categories_group.push(child);
			}
		}
	});

	let none_selected = true;
	let all_selected = true;
	categories_group.forEach((item) => {
		if (item.checked) {
			none_selected = false;
		}
		else 
		{
			all_selected = false;
		}
	});

	let searchData = getSearchDataFromURL();

	// Just clicked 'all' button
	if (e.target == categories_all) {
		if (categories_all.checked == true) {
			categories_all.disabled = true;
			categories_group.forEach((item) => {
				item.checked = false;
			});
		}
		searchData.categories = allCategories;
	}
	else
	{
		// Checked all of the individuals, deselect them and select all
		if (all_selected) {
			categories_all.checked = true;
			categories_all.disabled = true;
			categories_group.forEach((item) => {
				item.checked = false;
			});
			searchData.categories = allCategories;
		}
		else if (none_selected) {
			categories_all.checked = true;
			categories_all.disabled = true;
			searchData.categories = allCategories;
		}
		else
		{
			categories_all.checked = false;
			categories_all.disabled = false;
		}
	}

	searchData.categories = [];
	for (var id in idToChecked)
	{
		// don't add if they're all checked i guess
		if (!categories_all.checked && idToChecked[id])
		{
			searchData.categories.push(id);
		}
	}

	writeSearchDataBackToURL(searchData);
	refreshPosts();
}

function onPostTagClicked(e) {
	onFormTagClicked(e);
	refreshFormFromURL();
}

function onFormTagClicked(e) {
	const button = e.target;
	const buttonState = button.getAttribute('data-state');
	const tag = button.getAttribute('data-tag');

	let searchData = getSearchDataFromURL();

	if (buttonState == 'inactive')
	{
		// Toggle on and add
		button.classList.add('is-active');
		button.setAttribute('data-state', 'active');
		if (!searchData.tags.includes(tag))
		{
			searchData.tags.push(tag);
		}
	}
	else
	{
		// Toggle off and remove
		button.classList.remove('is-active');
		button.setAttribute('data-state', 'inactive')
		const index = searchData.tags.indexOf(tag);
		if (index > -1)
		{
			searchData.tags.splice(index, 1);
		}
	}

	// refresh state from url
	writeSearchDataBackToURL(searchData);
	refreshPosts();
}


function getSearchDataFromURL() {
	// Returns a structure based on URL set-up
	let searchData = {
		text: "",
		tags: [],
		categories: []
	};

	const searchParams = new URLSearchParams(location.search);

	// Text
	if (searchParams.has(textVarName))
	{
		searchData.text = searchParams.get(textVarName);
	}

	// Categories
	if (searchParams.has(categoriesVarName))
	{
		let categories = searchParams.get(categoriesVarName).split(',');
		allCategories.forEach(function (term) {
			if (categories.includes(term))
			{
				searchData.categories.push(term);
			}
		});
	}
	else
	{
		searchData.categories = allCategories;
	}

	if (searchParams.has(tagsVarName))
	{
		searchData.tags = searchParams.get(tagsVarName).split(',');
	}

	return searchData;
}

function writeSearchDataBackToURL(newSearchData) {
	// Returns a structure based on URL set-up
	//let searchData = {
		//text: "",
		//tags: [],
		//categories: [],
	//};

	// Write history/url from form
	{
		let urlParts = [];

		// Text
		if (newSearchData.text.length > 0)
		{
			urlParts.push(textVarName + "=" + newSearchData.text);
		}
		// Only show categories if some are un-checked
		if (newSearchData.categories.length > 0) {
			allCategories.every(function (term) {
				if (!newSearchData.categories.includes(term)) {
					urlParts.push(categoriesVarName + "=" + newSearchData.categories.join(','));
					return false;
				}
				return true;
			});
		}

		// Tags
		if (newSearchData.tags.length > 0)
		{
			urlParts.push(tagsVarName + "=" + newSearchData.tags.join(','));
		}

		// Stick them together
		let searchString = "";
		if (urlParts.length > 0)
		{
			searchString = "?" + urlParts.join('&');
		}

		// not really using state for anything, just like copy-paste-able URLs
		history.replaceState({}, '', '/search/' + searchString);
	}
}

function refreshFormFromURL()
{
	// Set the form state from the URL on load
	let form = document.getElementById(formName);

	// Search data is our wrapper for search params
	const searchData = getSearchDataFromURL();

	// Text
	document.getElementById(searchTextInputId).value = searchData.text;

	// Categories
	const categoryElems = form.getElementsByClassName('category');
	const allCategoriesSelected = searchData.categories == allCategories;
	[...categoryElems].forEach((child) => {
		if (allCategoriesSelected) {
			child.checked = child.id == 'all';
		}
		else {
			if (searchData.categories.includes(child.id)) {
				child.checked = true;
			}
			else {
				child.checked = false;
			}
		}
	});

	// Tags
	const filterButtons = form.querySelectorAll('.filter-button');
	for (let i = 0; i < filterButtons.length; ++i) {
		if (searchData.tags.includes(filterButtons[i].getAttribute('data-tag'))) {
			filterButtons[i].classList.add('is-active');
			filterButtons[i].setAttribute('data-state', 'active');
		}
		else {
			filterButtons[i].classList.remove('is-active');
			filterButtons[i].setAttribute('data-state', 'inactive');
		}
	}
}


async function refreshPosts() {
	let searchData = getSearchDataFromURL();
	
	let result =
		lunrIndex.query(function (q) {
			if (searchData.text != "")
			{
				searchData.text.split(lunr.tokenizer.separator).forEach(function (term) {
					q.term(term, { boost: 100 });
					if (searchData.text.lastIndexOf(" ") != searchData.text.length - 1) {
						q.term(term, { usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING, boost: 10 });
					}
					if (term != "") {
						q.term(term, { usePipeline: false, editDistance: 1, boost: 1 });
					}
				});
			}
			else
			{
				// Blank global search
				q.term("*");
			}

			searchData.tags.forEach(function (tag) {
				q.term(tag, { fields: ['tags'], presence: lunr.Query.presence.REQUIRED });
			});

			// Work out which categories are banned
			let banned_categories = []
			if (searchData.categories.length > 0) {
				allCategories.forEach(function (term) {
					if (!searchData.categories.includes(term)) {
						banned_categories.push(term);
					}
				});
			}
			banned_categories.forEach(function (category) {
				q.term(category, { fields: ['categories'], presence: lunr.Query.presence.PROHIBITED });
			});
		});

	let resultdiv = document.getElementById('results');
	resultdiv.textContent = '';

	resultdiv.insertAdjacentHTML('beforeend', '<p class="results__found">' + result.length + ' Result(s) found</p>');

	fragment = new DocumentFragment();

	{% include tags.js %}

	// sort by date if not searching by text
	if (searchData.text == "")
	{
		result.sort((a, b) => {
			let refA = a.ref;
			let refB = b.ref;
			return store[refA].date <= store[refB].date;
		});
	}

	for (let item in result) {
		let ref = result[item].ref;
		// external links
		let searchItem =
			'<div class="archive__item">';

		let urlFrontForText = "";
		let urlEndForText = "";
		let urlFrontForImg = "";
		let urlEndForImg = "";
		if (store[ref].url)
		{
			let externalLinkText = ""
			if (store[ref].categories.includes('bits'))
			{
				externalLinkText = '<img src="/assets/external-link.svg" class="svg-suffix--fa svg-filter-grey" />';
			}

			urlFrontForText = '<a href="' + store[ref].url + '" rel="permalink">';
			urlEndForText = externalLinkText + '</a>';

			urlFrontForImg = '<a href="' + store[ref].url + '" rel="permalink">';
			urlEndForImg = '</a>';
		}
		
		if (store[ref].teaser)
		{
			searchItem += '<div class="archive__item-left archive__item-teaser">' +
				urlFrontForImg + '<img src="' + store[ref].teaser + '" alt="">' + urlEndForImg +
				'</div>';
		}

		searchItem += '<div class="archive__item-right "><h2 class="archive__item-title" itemprop="headline">' +
			urlFrontForText + store[ref].title + urlEndForText + '</h2>';
		
		if (store[ref].categories.includes('bits') && store[ref].url)
		{
			searchItem += '<p class="url">' + store[ref].url + '</p>';
		}

		if (store[ref].excerpt)
		{
			searchItem += '<div class="archive__item-excerpt" itemprop="description">' + store[ref].excerpt + '</div>';
		}

		if (store[ref].tags)
		{
			searchItem += '<ul class="page__taxonomy tags inline-tags" itemprop="keywords">';
			for (let tag_index in store[ref].tags)
			{
				let tag = store[ref].tags[tag_index]
				let title = "FAILED TO FIND TAG";
				let icon = "";
				if (tag in tag_data)
				{
					title = tag_data[tag].title;
					icon = tag_data[tag].icon;
				}
				let dataState = searchData.tags.includes(tag) ? 'active' : 'inactive';
				let cssTag = searchData.tags.includes(tag) ? ' is-active' : '';
				searchItem += '<li class="tag-link"><button class="filter-button' + cssTag + '" data-state="' + dataState + '" data-tag="' + tag + '" onclick="onPostTagClicked(event)">';
				searchItem += '<span class="icon">' + icon + '</span>';
				searchItem += title;
				searchItem += '</button></li>';
			}
			searchItem += '</ul>';
		}

		searchItem += '</div></div>';

		let template = document.createElement('template');
		template.innerHTML = searchItem;
		fragment.append(template.content.children[0]);
	}

	resultdiv.appendChild(fragment);
}

document.addEventListener("DOMContentLoaded", () => {
	refreshFormFromURL();

	let form = document.getElementById(formName);
	[...form.getElementsByTagName("input")].forEach((child) => {
		if (child.type == 'text' || child.type == 'search') {
			child.addEventListener("keyup", onTextChanged);
		}
		// special handling for categories
		else if (child.className == "category") {
			child.addEventListener("change", onCategoryChanged);
		}
	});

	refreshPosts();
});
