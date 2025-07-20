var ZoteroPermalink;

function log(msg) {
	Zotero.debug("Zotero Permalink: " + msg);
}

function install() {
	log("Installed 2.0");
}

async function startup({ id, version, rootURI }) {
	log("Starting 2.0");

	Services.scriptloader.loadSubScript(rootURI + 'zotero-permalink.js');
	ZoteroPermalink.init({ id, version, rootURI });
	ZoteroPermalink.addToAllWindows();
	await ZoteroPermalink.main();
}

function onMainWindowLoad({ window }) {
	ZoteroPermalink.addToWindow(window);
}

function onMainWindowUnload({ window }) {
	ZoteroPermalink.removeFromWindow(window);
}

function shutdown() {
	log("Shutting down 2.0");
	ZoteroPermalink.removeFromAllWindows();
	ZoteroPermalink = undefined;
}

function uninstall() {
	log("Uninstalled 2.0");
}
