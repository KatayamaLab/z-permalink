ZoteroPermalink = {
	id: null,
	version: null,
	rootURI: null,
	initialized: false,
	addedElementIDs: [],

	init({ id, version, rootURI }) {
		if (this.initialized) return;
		this.id = id;
		this.version = version;
		this.rootURI = rootURI;
		this.initialized = true;
	},

	log(msg) {
		Zotero.debug("Zotero Permalink: " + msg);
	},

	addToWindow(window) {
		let doc = window.document;

		// Use Fluent for localization
		window.MozXULElement.insertFTLIfNeeded("make-it-red.ftl");

		// Add context menu item for items
		let itemMenuItem = doc.createXULElement('menuitem');
		itemMenuItem.id = 'zotero-permalink-copy-web-link-item';
		itemMenuItem.setAttribute('data-l10n-id', 'zotero-permalink-copy-web-link');
		itemMenuItem.addEventListener('command', () => {
			ZoteroPermalink.copyWebLink(window);
		});

		// Add to item context menu
		let itemMenu = doc.getElementById('zotero-itemmenu');
		if (itemMenu) {
			itemMenu.appendChild(itemMenuItem);
			this.storeAddedElement(itemMenuItem);

			// Add popupshowing listener to control menu visibility
			itemMenu.addEventListener('popupshowing', () => {
				ZoteroPermalink.updateItemMenuVisibility(window);
			});
		}

		// Add context menu item for collections
		let collectionMenuItem = doc.createXULElement('menuitem');
		collectionMenuItem.id = 'zotero-permalink-copy-web-link-collection';
		collectionMenuItem.setAttribute('data-l10n-id', 'zotero-permalink-copy-web-link');
		collectionMenuItem.addEventListener('command', () => {
			ZoteroPermalink.copyCollectionWebLink(window);
		});

		// Add to collection context menu
		let collectionMenu = doc.getElementById('zotero-collectionmenu');
		if (collectionMenu) {
			collectionMenu.appendChild(collectionMenuItem);
			this.storeAddedElement(collectionMenuItem);

			// Add popupshowing listener to control menu visibility
			collectionMenu.addEventListener('popupshowing', () => {
				ZoteroPermalink.updateCollectionMenuVisibility(window);
			});
		}
	},

	addToAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.addToWindow(win);
		}
	},

	storeAddedElement(elem) {
		if (!elem.id) {
			throw new Error("Element must have an id");
		}
		this.addedElementIDs.push(elem.id);
	},

	removeFromWindow(window) {
		var doc = window.document;
		// Remove all elements added to DOM
		for (let id of this.addedElementIDs) {
			doc.getElementById(id)?.remove();
		}
		doc.querySelector('[href="make-it-red.ftl"]')?.remove();
	},

	removeFromAllWindows() {
		var windows = Zotero.getMainWindows();
		for (let win of windows) {
			if (!win.ZoteroPane) continue;
			this.removeFromWindow(win);
		}
	},

	updateItemMenuVisibility(window) {
		try {
			const doc = window.document;
			const menuitem = doc.getElementById('zotero-permalink-copy-web-link-item');
			if (!menuitem) return;

			const zoteroPane = window.ZoteroPane || Zotero.getActiveZoteroPane();
			if (!zoteroPane) {
				menuitem.hidden = true;
				return;
			}

			const selectedItems = zoteroPane.getSelectedItems();
			if (selectedItems.length === 0) {
				menuitem.hidden = true;
				return;
			}

			const item = selectedItems[0];
			if (!item.isRegularItem()) {
				menuitem.hidden = true;
				return;
			}

			const libraryID = item.libraryID;
			
			// Show menu only for group libraries
			if (libraryID !== Zotero.Libraries.userLibraryID) {
				const group = Zotero.Groups.getByLibraryID(libraryID);
				menuitem.hidden = !group;
			} else {
				// Hide for personal library
				menuitem.hidden = true;
			}

		} catch (error) {
			this.log('Error updating item menu visibility: ' + error.message);
			const doc = window.document;
			const menuitem = doc.getElementById('zotero-permalink-copy-web-link-item');
			if (menuitem) menuitem.hidden = true;
		}
	},

	updateCollectionMenuVisibility(window) {
		try {
			const doc = window.document;
			const menuitem = doc.getElementById('zotero-permalink-copy-web-link-collection');
			if (!menuitem) return;

			const zoteroPane = window.ZoteroPane || Zotero.getActiveZoteroPane();
			if (!zoteroPane) {
				menuitem.hidden = true;
				return;
			}

			const selectedCollection = zoteroPane.getSelectedCollection();
			if (!selectedCollection) {
				menuitem.hidden = true;
				return;
			}

			const libraryID = selectedCollection.libraryID;
			
			// Show menu only for group libraries
			if (libraryID !== Zotero.Libraries.userLibraryID) {
				const group = Zotero.Groups.getByLibraryID(libraryID);
				menuitem.hidden = !group;
			} else {
				// Hide for personal library
				menuitem.hidden = true;
			}

		} catch (error) {
			this.log('Error updating collection menu visibility: ' + error.message);
			const doc = window.document;
			const menuitem = doc.getElementById('zotero-permalink-copy-web-link-collection');
			if (menuitem) menuitem.hidden = true;
		}
	},

	async copyWebLink(window) {
		try {
			const zoteroPane = window.ZoteroPane || Zotero.getActiveZoteroPane();
			if (!zoteroPane) {
				this.log('Zotero pane not available');
				return;
			}

			const selectedItems = zoteroPane.getSelectedItems();
			if (selectedItems.length === 0) {
				this.log('No items selected');
				return;
			}

			const item = selectedItems[0];
			if (!item.isRegularItem()) {
				this.log('Selected item is not a regular item');
				return;
			}

			const itemKey = item.key;
			const libraryID = item.libraryID;

			let groupID;

			// Check if this is a group library
			if (libraryID !== Zotero.Libraries.userLibraryID) {
				const group = Zotero.Groups.getByLibraryID(libraryID);
				if (group) {
					groupID = group.id;
				} else {
					this.log('Could not find group for library ID: ' + libraryID);
					return;
				}
			} else {
				this.log('Item is in personal library, cannot generate group link');
				return;
			}

			// Generate the permalink URL
			const permalinkURL = `https://www.zotero.org/groups/${groupID}/items/${itemKey}/`;

			// Copy to clipboard
			const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
				.getService(Components.interfaces.nsIClipboardHelper);
			clipboardHelper.copyString(permalinkURL);

			this.log(`Copied to clipboard: ${permalinkURL}`);

			// Show notification
			if (window.Zotero_Tabs && window.Zotero_Tabs.displayAlert) {
				window.Zotero_Tabs.displayAlert('Copied web link to clipboard', 'success');
			}

		} catch (error) {
			this.log('Error copying web link: ' + error.message);
			console.error('Zotero Permalink error:', error);
		}
	},

	async copyCollectionWebLink(window) {
		try {
			const zoteroPane = window.ZoteroPane || Zotero.getActiveZoteroPane();
			if (!zoteroPane) {
				this.log('Zotero pane not available');
				return;
			}

			const selectedCollection = zoteroPane.getSelectedCollection();
			if (!selectedCollection) {
				this.log('No collection selected');
				return;
			}

			const collectionKey = selectedCollection.key;
			const libraryID = selectedCollection.libraryID;

			let groupID;

			// Check if this is a group library
			if (libraryID !== Zotero.Libraries.userLibraryID) {
				const group = Zotero.Groups.getByLibraryID(libraryID);
				if (group) {
					groupID = group.id;
				} else {
					this.log('Could not find group for library ID: ' + libraryID);
					return;
				}
			} else {
				this.log('Collection is in personal library, cannot generate group link');
				return;
			}

			// Generate the collection permalink URL
			const permalinkURL = `https://www.zotero.org/groups/${groupID}/collections/${collectionKey}/`;

			// Copy to clipboard
			const clipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"]
				.getService(Components.interfaces.nsIClipboardHelper);
			clipboardHelper.copyString(permalinkURL);

			this.log(`Copied collection link to clipboard: ${permalinkURL}`);

			// Show notification
			if (window.Zotero_Tabs && window.Zotero_Tabs.displayAlert) {
				window.Zotero_Tabs.displayAlert('Copied collection web link to clipboard', 'success');
			}

		} catch (error) {
			this.log('Error copying collection web link: ' + error.message);
			console.error('Zotero Permalink collection error:', error);
		}
	},

	async main() {
		this.log('Zotero Permalink plugin initialized');
	},
};
