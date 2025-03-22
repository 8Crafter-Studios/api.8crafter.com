import { DOC_VERSIONS } from '../../versions.js';

const select = document.getElementById('plugin-versions-select');

DOC_VERSIONS.forEach((version) => {
	const option = document.createElement('option');
	option.value = version;
	option.innerHTML = version;
	select.appendChild(option);
});

const locationSplit = location.pathname.split('/');
const thisVersion = locationSplit.find((path) => ['stable', 'dev', ...DOC_VERSIONS].includes(path));
select.value = DOC_VERSIONS.includes(thisVersion)
	? thisVersion
	: DOC_VERSIONS[0];
select.onchange = () => {
	if(select.value === thisVersion) return; // Prevents an infinite refresh loop.
	const newPaths = window.location.pathname.replace(`/${thisVersion}/`, `/${select.value}/`);
	const newUrl = new URL(newPaths, window.location.origin);
	// console.error("REDIRECTED");
	window.location.assign(newUrl);
};
