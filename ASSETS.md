# 📂 Asset Management & Project Structure Guide - Holaliz Portfolio

This guide explains the new unified asset structure and best practices for adding or updating content in this project. Following these guidelines ensures that paths remain consistent and the project is easy to maintain.

---

## 🏗 Directory Structure

All global assets are centralized in the `assets/` directory at the root level:

```text
/holaliz
├── assets/
│   ├── css/        # Compiled CSS files (style.css, fontawesome.css)
│   ├── fonts/      # Typography files (Bueno-VF.ttf, Inter)
│   ├── images/     # All media (Icons, Profile photos, Project thumbnails)
│   │   └── projects/  # Case-study-specific images and videos
│   └── js/         # JavaScript logic (script.js, bootstrap, analytics)
├── content/        # Dynamic content fragments (work.html, intro.html)
├── portfolio/      # Case studies (rewards-points.html, Drivers-App.html)
├── scss/           # Source SASS files for styling
└── scripts/        # Automation scripts (WebP conversion, posters)
```

---

## 🔗 Linking to Assets

### 1. From root HTML files (`index.html`, `aboutme.html`, `resume.html`)
Use first-level paths:
```html
<link rel="stylesheet" href="assets/css/style.css">
<img src="assets/images/logo.svg" alt="Logo">
<script src="assets/js/script.js"></script>
```

### 2. From portfolio files (`portfolio/*.html`)
Since these are in a subfolder, always go up one level first:
```html
<link rel="stylesheet" href="../assets/css/style.css">
<img src="../assets/images/logo.svg" alt="Logo">
<script src="../assets/js/script.js"></script>
```

### 3. From SCSS files (`scss/**/*.scss`)
Most SCSS files are inside `scss/sections/` or `scss/components/`. Use relative paths to the root:
```scss
// From scss/sections/_hero-new.scss
src: url('../../assets/fonts/Bueno-VF.ttf');
background: url('../../assets/images/dots.svg');
```

---

## 🛠 Automation & Tools

This project includes custom scripts (defined in `package.json`) to handle common asset tasks:

- **SASS Compilation**: `npm run compile:sass` - Compiles SASS directly to `assets/css/style.css`.
- **Development Server**: `npm run dev` - Starts Browser-Sync and a SASS watcher.
- **WebP Conversion**: `npm run generate:webp` - Converts your raw images in `assets/images/` to optimized `.webp` files.
- **Cache Bumping**: `npm run cache:bump` - Updates versioning strings on asset links to bypass browser caching after big updates.

---

## 💡 Best Practices

1. **Don't hardcode root paths**: Prefer relative paths (e.g., `./assets/...` or `../assets/...`) over absolute URLs when possible, unless it's for SEO (`og:image`).
2. **Organize Images**: Place project-specific images inside `assets/images/projects/[Project-Name]/` to keep the root level clean.
3. **Use WebP**: For best performance, use the conversion script and use `.webp` in your HTML.
4. **Compile SASS**: Never edit `assets/css/style.css` directly. Always edit the files in `scss/` and recompile.

---

*Last Updated: April 2026*
