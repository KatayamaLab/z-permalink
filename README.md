# Zotero Permalink Plugin

A Zotero 7+ plugin that adds the ability to copy web links to Zotero items and collections in group libraries directly to your clipboard.

## Features

- **Item Links**: Right-click on any item in a group library to copy its web link
- **Collection Links**: Right-click on any collection in a group library to copy its web link

### Link Formats

- **Items**: `https://www.zotero.org/groups/{groupID}/items/{itemKey}/`
- **Collections**: `https://www.zotero.org/groups/{groupID}/collections/{collectionKey}/`

## Requirements

- **Zotero 7.0 or higher**
- Group library membership (personal library items are not supported)

## Installation

### Method 1: Download and Install

1. Download the latest release from the [Releases page](https://github.com/KatayamaLab/zotero-permalink/releases)
2. In Zotero, go to **Tools > Add-ons**
3. Click the gear icon (⚙️) and select **Install Add-on From File...**
4. Select the downloaded `.xpi` file
5. Restart Zotero if prompted

### Method 2: Build from Source

1. Clone this repository:
   ```bash
   git clone https://github.com/KatayamaLab/zotero-permalink.git
   cd zotero-permalink
   ```

2. Build the plugin:
   ```bash
   ./make-zips
   ```

3. Install the generated `build/zotero-permalink-1.0.0.xpi` file following Method 1 steps 2-5

## Usage

1. Open a group library in Zotero 7
2. Right-click on any collection (folder)
3. Select **"Copy Web Link to This Item"**
4. The collection web link is copied to your clipboard
5. Paste the link anywhere you need it

## Example Links

- **Item**: `https://www.zotero.org/groups/12345667/items/U368UFVD/`
- **Collection**: `https://www.zotero.org/groups/12345667/collections/GBBPIDG5/`

## Development

### File Structure

```
src/
├── manifest.json              # Plugin metadata and Zotero 7 configuration
├── bootstrap.js               # Plugin lifecycle management
├── zotero-permalink.js        # Main functionality implementation
└── locale/
    └── en-US/
        └── zotero-permalink.ftl  # Menu labels and localization
```


## Compatibility

- **Zotero Version**: 7.0 - 7.1.*
- **Platform**: Cross-platform (Windows, macOS, Linux)
- **Library Type**: Group libraries only

## Limitations

- Only works with group libraries (personal "My Library" items are not supported)
- Requires internet access to access the generated web links
- Menu items are hidden for personal library items

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Zotero 7
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues:

1. Check that you're using Zotero 7.0 or higher
2. Verify you're working with group library items (not personal library)
3. Open an issue on the [GitHub repository](https://github.com/KatayamaLab/zotero-permalink/issues)

## Changelog

### Version 1.0.0
- Initial release
