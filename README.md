<p align="center">
  <img src="keyboard-layout-osd-logo.png" width="160" alt="Keyboard Layout OSD logo">
</p>

# Keyboard Layout OSD

Keyboard Layout OSD shows a brief on-screen display when you switch keyboard
layouts or input languages in GNOME Shell.

<p align="center">
  <img src="keyboard-layout-osd-animation.gif" alt="Keyboard Layout OSD in action">
</p>

## Features

- Uses GNOME input-source names for any configured keyboard layout
- Short, localized, and full layout-name modes
- Configurable opacity, visibility time, fade duration, and vertical position
- Optional display on every monitor
- Built-in test button
- Native GNOME Shell and libadwaita interface

![Keyboard Layout OSD preferences and display modes](keyboard-layout-osd-screen.png)

## Requirements

- GNOME Shell 50

## Install from source

Copy or clone the project to:

```text
~/.local/share/gnome-shell/extensions/keyboard-layout-osd@gruvery.systems/
```

Compile the settings schema and enable the extension:

```bash
cd ~/.local/share/gnome-shell/extensions/keyboard-layout-osd@gruvery.systems
glib-compile-schemas schemas
gnome-extensions enable keyboard-layout-osd@gruvery.systems
```

Open its settings from the Extensions application or with:

```bash
gnome-extensions prefs keyboard-layout-osd@gruvery.systems
```

## Development

After changing `extension.js` or the schema, reload the extension:

```bash
gnome-extensions disable keyboard-layout-osd@gruvery.systems
gnome-extensions enable keyboard-layout-osd@gruvery.systems
```

Close and reopen the preferences window after changing `prefs.js` or the
schema. On Wayland, logging out may be required if GNOME Shell keeps an older
extension instance or schema loaded.

## License

Keyboard Layout OSD is licensed under the
[GNU General Public License v3.0](LICENSE).
