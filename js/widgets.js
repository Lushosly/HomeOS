(function () {
  "use strict";

  var definitions = {
    events: { title: "Today's Events", icon: "▣", wide: true },
    weather: { title: "Weather", icon: "☀", compact: true },
    tasks: { title: "Tasks", icon: "✓", compact: true },
    notes: { title: "Notes", icon: "✎", compact: true },
    shopping: { title: "Shopping", icon: "◉", compact: true },
    quickActions: { title: "Quick Actions", icon: "⌘", compact: true }
  };

  function controls(id) {
    return [
      '<div class="widget-controls">',
      '<button data-widget-up="' + id + '" aria-label="Move widget up">↑</button>',
      '<button data-widget-down="' + id + '" aria-label="Move widget down">↓</button>',
      '<button data-widget-hide="' + id + '" aria-label="Hide widget">×</button>',
      '</div>'
    ].join("");
  }

  function shell(id, body) {
    var definition = definitions[id];
    var classes = ["widget"];
    if (definition.wide) classes.push("wide");
    if (definition.compact) classes.push("compact");

    return [
      '<article class="' + classes.join(" ") + '" data-widget="' + id + '">',
      controls(id),
      '<div class="widget-header">',
      '<div class="widget-title"><span>' + definition.icon + '</span><h3>' + definition.title + '</h3></div>',
      '</div>',
      body,
      '</article>'
    ].join("");
  }

  function empty(message) {
    return '<div class="empty-state">' + message + '</div>';
  }

  function renderEvents(state, helpers) {
    var today = helpers.isoDate(new Date());
    var events = state.events
      .filter(function (event) { return event.date === today; })
      .sort(function (a, b) { return a.time.localeCompare(b.time); })
      .slice(0, 4);

    var body = events.length
      ? '<div class="event-list">' + events.map(function (event) {
          return [
            '<div class="event-row">',
            '<span class="event-color" style="background:' + event.color + '"></span>',
            '<div class="event-main"><strong>' + helpers.escapeHtml(event.title) + '</strong><span>' + helpers.timeLabel(event.time) + '</span></div>',
            '<button class="delete-small" data-delete-event="' + event.id + '" aria-label="Delete event">×</button>',
            '</div>'
          ].join("");
        }).join("") + '</div>'
      : empty("No events today.");

    body += '<button class="primary-button" data-open-event-modal>Add event</button>';
    return shell("events", body);
  }

  function renderWeather() {
    return shell("weather", [
      '<div class="weather-main"><span class="weather-icon">☀️</span><span class="weather-temp">82°</span></div>',
      '<p class="muted">Clear skies · Demo weather</p>'
    ].join(""));
  }

  function renderTasks(state, helpers) {
    var tasks = state.tasks.slice(0, 4);
    var body = tasks.length
      ? '<div class="task-list">' + tasks.map(function (task) {
          return [
            '<div class="task-row ' + (task.completed ? 'completed' : '') + '">',
            '<input type="checkbox" data-toggle-task="' + task.id + '"' + (task.completed ? ' checked' : '') + '>',
            '<span class="task-label">' + helpers.escapeHtml(task.title) + '</span>',
            '<button class="delete-small" data-delete-task="' + task.id + '">×</button>',
            '</div>'
          ].join("");
        }).join("") + '</div>'
      : empty("No tasks yet.");

    body += '<button class="primary-button" data-open-task-modal>Add task</button>';
    return shell("tasks", body);
  }

  function renderNotes(state, helpers) {
    var notes = state.notes.slice(0, 2);
    var body = notes.length
      ? '<div class="note-grid">' + notes.map(function (note) {
          return [
            '<article class="note-card">',
            '<h3>' + helpers.escapeHtml(note.title) + '</h3>',
            '<p>' + helpers.escapeHtml(note.body) + '</p>',
            '<button data-delete-note="' + note.id + '">Delete</button>',
            '</article>'
          ].join("");
        }).join("") + '</div>'
      : empty("No notes yet.");

    body += '<button class="primary-button" data-open-note-modal>Add note</button>';
    return shell("notes", body);
  }

  function renderShopping(state, helpers) {
    var items = state.shopping.slice(0, 5);
    var body = items.length
      ? '<div class="shopping-list">' + items.map(function (item) {
          return [
            '<div class="shopping-row ' + (item.completed ? 'completed' : '') + '">',
            '<input type="checkbox" data-toggle-shopping="' + item.id + '"' + (item.completed ? ' checked' : '') + '>',
            '<span class="shopping-label">' + helpers.escapeHtml(item.title) + '</span>',
            '<button class="delete-small" data-delete-shopping="' + item.id + '">×</button>',
            '</div>'
          ].join("");
        }).join("") + '</div>'
      : empty("Shopping list is empty.");

    body += '<button class="primary-button" data-open-shopping-modal>Add item</button>';
    return shell("shopping", body);
  }

  function renderQuickActions() {
    return shell("quickActions", [
      '<div class="quick-actions">',
      '<button data-open-event-modal>＋ Event</button>',
      '<button data-open-task-modal>＋ Task</button>',
      '<button data-open-note-modal>＋ Note</button>',
      '<button data-open-shopping-modal>＋ Shopping</button>',
      '</div>'
    ].join(""));
  }

  function renderWidget(id, state, helpers) {
    if (id === "events") return renderEvents(state, helpers);
    if (id === "weather") return renderWeather();
    if (id === "tasks") return renderTasks(state, helpers);
    if (id === "notes") return renderNotes(state, helpers);
    if (id === "shopping") return renderShopping(state, helpers);
    if (id === "quickActions") return renderQuickActions();
    return "";
  }

  window.HomeOSWidgets = {
    definitions: definitions,
    renderWidget: renderWidget
  };
}());
