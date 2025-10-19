# SlimeThis.com - Banger Machine

A dynamic web application that generates random "bangers" (quotes, memes, videos, GIFs, and images) with customizable themes and automatic content copying/saving.

## How the Site Works

SlimeThis.com is a content generator that randomly displays different types of media and text from a curated collection. The site features:

- **Content Types**: Quotes, memes, videos, GIFs, double images, single images, and quad images
- **Theme System**: Multiple visual themes with customizable colors
- **Automatic Actions**: Clicking "slime!" saves and copies the current displayed content (text to clipboard, all media files downloaded)
- **Gallery Browsing**: Browse through image collections with next/previous navigation
- **Interactive UI**: Custom cursor effects, animations, and responsive design

## Functionality

### Core Features
- **Content Saving**: Click "slime!" to save and copy the currently displayed content (preserves gallery position)
- **Random Generation**: Select a content type to generate random bangers
- **Gallery Browsing**: Browse image collections with next/previous navigation when expanded
- **Type Filtering**: Choose specific content types (quotes, memes, videos, etc.) or view all
- **Theme Selection**: 12+ themes including Ultra Glass, Galactic Nebula, Electric Storm, etc.
- **Color Customization**: Adjust primary, secondary, and accent colors with intensity control
- **Automatic Copy/Save**: Text is copied to clipboard, all media files are automatically downloaded

### Technical Features
- **Responsive Design**: Works on desktop and mobile devices
- **Performance Optimized**: Uses Three.js for starfield effects (disabled on low-performance devices)
- **Local Storage**: Remembers theme and color preferences
- **GSAP Animations**: Smooth transitions and hover effects
- **Paint Worklets**: Custom CSS paint worklets for advanced visual effects

## Common Issues and Fixes

### JSON Syntax Errors
**Issue**: The site fails to load content due to malformed `bangers.json` file.
**Symptoms**: Console errors about JSON parsing, content not loading.
**Fix**: Ensure the JSON file is valid. Common issues include:
- Trailing commas in arrays/objects
- Missing commas between array elements
- Incorrect nesting of brackets/braces
- Use a JSON validator like `jq . bangers.json` in terminal

### Media Not Saving
**Issue**: Images/videos don't download automatically.
**Symptoms**: "Failed to save media" notification appears.
**Fix**:
- Check browser permissions for downloads
- Ensure the media files exist in the correct paths
- Try in a different browser (Chrome/Firefox recommended)

### Clipboard Not Working
**Issue**: Text isn't copied to clipboard.
**Symptoms**: "Failed to copy" or no copy notification.
**Fix**:
- Use HTTPS (required for clipboard API)
- Browser compatibility: Modern Chrome/Firefox work best
- Fallback method used for older browsers

### Starfield Not Appearing
**Issue**: Three.js starfield background doesn't load.
**Symptoms**: Plain background instead of animated stars.
**Fix**:
- Automatically disabled on mobile/low-performance devices
- Check browser WebGL support
- Ensure Three.js library loads correctly

### Theme Not Applying
**Issue**: Selected theme doesn't change appearance.
**Symptoms**: UI stays the same after theme selection.
**Fix**:
- Clear browser cache
- Check for JavaScript errors in console
- Ensure CSS theme files are loading

### Gallery Navigation Not Working
**Issue**: Next/previous buttons don't appear or work in gallery view.
**Symptoms**: Can't navigate through images when expanded.
**Fix**:
- Ensure you're viewing images from the gallery (not generated content)
- Check that there are multiple images in the current page
- Navigation is limited to the current page of 10 images

### Double/Quad Images Not Saving All Files
**Issue**: Only one image saves when clicking "slime!" on multi-image content.
**Symptoms**: Multiple images displayed but only one downloads.
**Fix**:
- This should work automatically - all images are saved with numbered filenames
- Check browser download permissions
- Ensure all image files exist and are accessible

### Content Not Loading
**Issue**: "No bangers available" or empty output.
**Symptoms**: Clicking generate shows no content.
**Fix**:
- Check `bangers.json` file exists and is accessible
- Verify JSON structure matches expected format
- Check browser network tab for failed requests
- Ensure file paths in JSON are correct

### Performance Issues
**Issue**: Site is slow or laggy.
**Symptoms**: Animations stutter, page unresponsive.
**Fix**:
- Starfield automatically disables on low-end devices
- Reduce browser tabs
- Clear browser cache
- Use a modern browser

### Mobile Responsiveness
**Issue**: Site doesn't work well on mobile.
**Symptoms**: Layout broken, buttons not working.
**Fix**:
- Use Chrome/Firefox mobile browsers
- Ensure viewport meta tag is present
- Test on different screen sizes

## Development

### File Structure
```
slimethis/
├── index.html          # Main HTML file
├── style.css           # Styles and themes
├── script.js           # Main JavaScript functionality
├── bangers.json        # Content data
├── assets-config.json  # Asset configuration
├── neon-grid.js        # Paint worklet for grid effects
├── neon-cursor.js      # Paint worklet for cursor effects
├── cyber-bg.js         # Paint worklet for background effects
└── [media files]       # Images, videos, GIFs
```

### Adding New Content
1. Add media files to the project directory
2. Update `bangers.json` with new entries
3. Or add filenames to the `knownImageFiles`/`knownGifFiles` arrays in `script.js`

### Customization
- Themes are defined in `style.css`
- Color variables can be modified in CSS custom properties
- New themes can be added by creating new CSS rules

## Technologies Used
- HTML5, CSS3, JavaScript (ES6+)
- Three.js for 3D starfield
- GSAP for animations
- CSS Paint Worklets for custom effects
- JSON for content storage

## Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing
1. Fork the repository
2. Add new content to `bangers.json`
3. Test functionality
4. Submit a pull request

## License
This project is open source. Feel free to use and modify.
