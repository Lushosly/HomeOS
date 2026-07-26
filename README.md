# HomeOS v0.3

A local-first, customizable dashboard designed for an iPad mini 4 running iPadOS 15.

## New in v0.3

- Multi-file project structure
- Home, Calendar, Tasks, Notes, and Settings pages
- Modular widgets
- Dashboard edit mode
- Reorder, hide, and restore widgets
- Notes widget and full Notes page
- Shopping-list widget
- Persistent events, tasks, notes, shopping items, themes, and widget layout
- Improved iPad navigation and spacing

## Deploy to GitHub Pages

Upload every file and folder in this project to the root of your `HomeOS` repository.

The repository should look like:

```text
HomeOS/
├── index.html
├── README.md
├── css/
│   ├── main.css
│   └── widgets.css
└── js/
    ├── app.js
    ├── calendar.js
    ├── settings.js
    ├── storage.js
    ├── tasks.js
    └── widgets.js
```

Do not upload the enclosing `HomeOS-v0.3` folder itself. Upload its contents.

Your GitHub Pages address remains:

```text
https://lushosly.github.io/HomeOS/
```

## Data storage

Data is saved in Safari `localStorage` on the device. It is not uploaded to GitHub and is not currently synchronized between devices.

Clearing Safari website data will clear HomeOS local data.

## Next milestone

Planned for v0.4:

- Real weather
- Better monthly calendar
- Export/import backup
- Custom dashboard name
- Optional passcode screen
