# Folio Reader

A simple PDF reader in Google's Material 3 Expressive design. Use it to read, share and print PDFs. It works offline, and your files stay on your device (nothing is uploaded).

## Put it online with GitHub Pages

1. On GitHub, create a new **public** repository, for example `folio-reader`.
2. Click **uploading an existing file**. Drag in **everything inside this folder**, including the `icons` and `lib` folders, then click **Commit changes**. There are 56 files, which is under GitHub's limit of 100 files per upload.
3. Go to **Settings → Pages**. Under *Build and deployment*, choose **Deploy from a branch**, select the **main** branch and the **/ (root)** folder, then click **Save**.
4. After a minute or two, open `https://YOUR-USERNAME.github.io/folio-reader/`.

You can also put it in a subfolder of an existing repository, such as your Folio repository. It works from any folder.

## Install it as an app

- **Android (Chrome):** tap ⋮ and then **Install app** (or **Add to Home screen**). After that, Folio Reader appears in the share menu, so you can send PDFs to it from WhatsApp, Gmail or Files.
- **iPhone/iPad (Safari):** tap **Share** and then **Add to Home Screen**.
- **Windows/Mac (Chrome or Edge):** click the install icon in the address bar. After that, you can right-click a PDF and choose **Open with → Folio Reader**.

## Features

- Open PDFs from your device, by dragging files onto the window, or by sharing to the app (Android).
- **Tabs on a computer:** each PDF opens in its own tab and keeps its place, zoom and page while you switch. Open several at once from the file picker, by dragging them in, or by selecting them in File Explorer and choosing *Open with → Folio Reader*. Phones and tablets show one PDF at a time.
- Smooth scrolling, pinch or Ctrl+scroll to zoom, double-tap to zoom, fit to width, rotate, and go to page. Zooming and moving between screens are animated on the GPU, so they stay smooth on 90 and 120 Hz screens.
- Clickable links and text you can select and copy.
- Share (uses your device's share menu) and print (prints every page at full page size).
- Opens password-protected PDFs.
- Recent files, with thumbnails, stay available offline. Each file reopens at the page where you stopped.
- Light, dark and system themes, with six colours to choose from.
- Material 3 Expressive design: Google Sans Flex, springy motion, shape-morphing buttons and loading indicator, grouped lists and a floating toolbar.
- Keyboard shortcuts: Ctrl+O open, Ctrl+P print, Ctrl+S save a copy, Ctrl +/− zoom, Ctrl+0 fit, ←/→ change page. With tabs: Ctrl+Tab and Ctrl+Shift+Tab switch tabs, Ctrl+1 to Ctrl+9 pick a tab, Ctrl+W closes one, Ctrl+T opens a PDF in a new tab and Ctrl+Shift+T reopens the last one you closed.

## Updating

To update the app, upload the new files over the old ones (keep the same names). The app picks up the update the next time it's opened and shows *"Folio Reader has been updated"* with a **Reload** button.

## Files

- `index.html`, `app.js`, `app.css`: the app
- `sw.js`, `manifest.webmanifest`: offline support and installing
- `icons/`: app icons
- `lib/`: PDF.js by Mozilla (Apache 2.0 licence), with its fonts and image decoders
- `fonts/`: Google Sans Flex (SIL Open Font License), a small web version made by `.github/workflows/add-font.yml`
- `.github/workflows/build-pdf-engine.yml`: builds `lib/pdfjs.js` (PDF.js with three small changes that keep scrolling and zooming smooth) on GitHub's servers
