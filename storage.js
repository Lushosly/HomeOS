(function () {
  "use strict";

  var KEY = "homeos-v03-state";

  function isoDate(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function plusDays(days) {
    var date = new Date();
    date.setDate(date.getDate() + days);
    return isoDate(date);
  }

  var defaultState = {
    version: "0.3",
    events: [
      { id: 1, title: "Morning walk", date: plusDays(0), time: "08:00", color: "#3f79d8" },
      { id: 2, title: "Project check-in", date: plusDays(0), time: "10:30", color: "#5f9467" },
      { id: 3, title: "Pick up groceries", date: plusDays(0), time: "16:15", color: "#d07a5f" },
      { id: 4, title: "Call Mom", date: plusDays(1), time: "18:30", color: "#8a61c7" }
    ],
    tasks: [
      { id: 1, title: "Buy groceries", completed: false },
      { id: 2, title: "Charge iPad to 85%", completed: false }
    ],
    notes: [
      { id: 1, title: "Welcome", body: "HomeOS v0.3 is ready. Use Edit Dashboard to arrange your widgets." }
    ],
    shopping: [
      { id: 1, title: "Milk", completed: false },
      { id: 2, title: "Coffee", completed: false }
    ],
    settings: {
      theme: "dark",
      fontScale: "1",
      accent: "#3f79d8"
    },
    widgets: [
      { id: "events", visible: true },
      { id: "weather", visible: true },
      { id: "tasks", visible: true },
      { id: "notes", visible: true },
      { id: "shopping", visible: true },
      { id: "quickActions", visible: true }
    ]
  };

  function cloneDefaults() {
    return JSON.parse(JSON.stringify(defaultState));
  }

  function load() {
    try {
      var stored = localStorage.getItem(KEY);
      if (!stored) return cloneDefaults();

      var parsed = JSON.parse(stored);
      var fallback = cloneDefaults();

      return {
        version: "0.3",
        events: Array.isArray(parsed.events) ? parsed.events : fallback.events,
        tasks: Array.isArray(parsed.tasks) ? parsed.tasks : fallback.tasks,
        notes: Array.isArray(parsed.notes) ? parsed.notes : fallback.notes,
        shopping: Array.isArray(parsed.shopping) ? parsed.shopping : fallback.shopping,
        settings: Object.assign({}, fallback.settings, parsed.settings || {}),
        widgets: Array.isArray(parsed.widgets) ? parsed.widgets : fallback.widgets
      };
    } catch (error) {
      return cloneDefaults();
    }
  }

  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
  }

  function reset() {
    var state = cloneDefaults();
    save(state);
    return state;
  }

  window.HomeOSStorage = {
    load: load,
    save: save,
    reset: reset,
    isoDate: isoDate,
    plusDays: plusDays
  };
}());
