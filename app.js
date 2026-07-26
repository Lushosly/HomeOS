(function () {
  "use strict";

  var state = HomeOSStorage.load();
  var editing = false;
  var toastTimer;

  var helpers = {
    isoDate: HomeOSStorage.isoDate,

    escapeHtml: function (value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    timeLabel: function (value) {
      var parts = value.split(":");
      var date = new Date();
      date.setHours(Number(parts[0]), Number(parts[1]), 0, 0);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
      });
    },

    formatDay: function (value) {
      var date = new Date(value + "T12:00:00");
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric"
      });
    }
  };

  function save() {
    HomeOSStorage.save(state);
  }

  function showToast(message) {
    var toast = document.getElementById("toast");
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 1800);
  }

  function updateClock() {
    var now = new Date();
    var hour = now.getHours();
    var greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    document.getElementById("dateLabel").textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    document.getElementById("clockLabel").textContent = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit"
    });

    document.getElementById("greetingLabel").textContent = greeting;
  }

  function renderDashboard() {
    var grid = document.getElementById("widgetGrid");
    var visibleWidgets = state.widgets.filter(function (widget) {
      return widget.visible;
    });

    grid.classList.toggle("editing", editing);
    grid.innerHTML = visibleWidgets.map(function (widget) {
      return HomeOSWidgets.renderWidget(widget.id, state, helpers);
    }).join("");

    var hidden = state.widgets.filter(function (widget) {
      return !widget.visible;
    });

    var library = document.getElementById("widgetLibrary");
    var list = document.getElementById("hiddenWidgetList");

    library.classList.toggle("hidden", !editing || hidden.length === 0);
    list.innerHTML = hidden.map(function (widget) {
      var definition = HomeOSWidgets.definitions[widget.id];
      return [
        '<div class="library-item">',
        '<strong>' + definition.icon + ' ' + definition.title + '</strong>',
        '<button class="toolbar-button" data-widget-show="' + widget.id + '">Add widget</button>',
        '</div>'
      ].join("");
    }).join("");
  }

  function renderAll() {
    HomeOSSettings.apply(state);
    renderDashboard();
    HomeOSCalendar.render(state, helpers);
    HomeOSTasks.renderTasks(state, helpers);
    HomeOSTasks.renderNotes(state, helpers);
  }

  function navigate(page) {
    var titleMap = {
      home: "Today",
      calendar: "Calendar",
      tasks: "Tasks",
      notes: "Notes",
      settings: "Settings"
    };

    document.querySelectorAll(".page").forEach(function (section) {
      section.classList.toggle("active", section.id === page + "Page");
    });

    document.querySelectorAll(".bottom-nav [data-nav]").forEach(function (button) {
      button.classList.toggle("active", button.dataset.nav === page);
    });

    document.getElementById("pageTitle").textContent = titleMap[page] || "HomeOS";
    window.scrollTo(0, 0);
  }

  function openDialog(id) {
    var dialog = document.getElementById(id);
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  }

  function closeDialog(button) {
    var dialog = button.closest("dialog");
    if (dialog) dialog.close();
  }

  function moveWidget(id, direction) {
    var index = state.widgets.findIndex(function (widget) {
      return widget.id === id;
    });

    var next = index + direction;
    if (index < 0 || next < 0 || next >= state.widgets.length) return;

    var item = state.widgets[index];
    state.widgets.splice(index, 1);
    state.widgets.splice(next, 0, item);
    save();
    renderDashboard();
  }

  function deleteById(collection, id) {
    state[collection] = state[collection].filter(function (item) {
      return String(item.id) !== String(id);
    });
    save();
    renderAll();
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.nav) {
      navigate(button.dataset.nav);
    }

    if (button.hasAttribute("data-open-event-modal")) {
      document.getElementById("eventTitle").value = "";
      document.getElementById("eventDate").value = helpers.isoDate(new Date());
      document.getElementById("eventTime").value = "09:00";
      openDialog("eventDialog");
    }

    if (button.hasAttribute("data-open-task-modal")) {
      document.getElementById("taskTitle").value = "";
      openDialog("taskDialog");
    }

    if (button.hasAttribute("data-open-note-modal")) {
      document.getElementById("noteTitle").value = "";
      document.getElementById("noteBody").value = "";
      openDialog("noteDialog");
    }

    if (button.hasAttribute("data-open-shopping-modal")) {
      document.getElementById("shoppingTitle").value = "";
      openDialog("shoppingDialog");
    }

    if (button.hasAttribute("data-close-dialog")) {
      closeDialog(button);
    }

    if (button.dataset.deleteEvent) deleteById("events", button.dataset.deleteEvent);
    if (button.dataset.deleteTask) deleteById("tasks", button.dataset.deleteTask);
    if (button.dataset.deleteNote) deleteById("notes", button.dataset.deleteNote);
    if (button.dataset.deleteShopping) deleteById("shopping", button.dataset.deleteShopping);

    if (button.dataset.widgetUp) moveWidget(button.dataset.widgetUp, -1);
    if (button.dataset.widgetDown) moveWidget(button.dataset.widgetDown, 1);

    if (button.dataset.widgetHide) {
      var hiddenWidget = state.widgets.find(function (widget) {
        return widget.id === button.dataset.widgetHide;
      });
      if (hiddenWidget) hiddenWidget.visible = false;
      save();
      renderDashboard();
    }

    if (button.dataset.widgetShow) {
      var shownWidget = state.widgets.find(function (widget) {
        return widget.id === button.dataset.widgetShow;
      });
      if (shownWidget) shownWidget.visible = true;
      save();
      renderDashboard();
    }

    if (button.dataset.theme) {
      state.settings.theme = button.dataset.theme;
      save();
      HomeOSSettings.apply(state);
    }

    if (button.dataset.font) {
      state.settings.fontScale = button.dataset.font;
      save();
      HomeOSSettings.apply(state);
    }

    if (button.dataset.color) {
      state.settings.accent = button.dataset.color;
      save();
      HomeOSSettings.apply(state);
    }
  });

  document.addEventListener("change", function (event) {
    var input = event.target;

    if (input.dataset.toggleTask) {
      var task = state.tasks.find(function (item) {
        return String(item.id) === input.dataset.toggleTask;
      });
      if (task) task.completed = input.checked;
      save();
      renderAll();
    }

    if (input.dataset.toggleShopping) {
      var item = state.shopping.find(function (entry) {
        return String(entry.id) === input.dataset.toggleShopping;
      });
      if (item) item.completed = input.checked;
      save();
      renderAll();
    }
  });

  document.getElementById("editDashboardButton").addEventListener("click", function () {
    editing = true;
    document.getElementById("editBanner").classList.remove("hidden");
    renderDashboard();
  });

  document.getElementById("finishEditingButton").addEventListener("click", function () {
    editing = false;
    document.getElementById("editBanner").classList.add("hidden");
    renderDashboard();
  });

  document.getElementById("eventForm").addEventListener("submit", function (event) {
    event.preventDefault();

    state.events.push({
      id: Date.now(),
      title: document.getElementById("eventTitle").value.trim(),
      date: document.getElementById("eventDate").value,
      time: document.getElementById("eventTime").value,
      color: document.getElementById("eventColor").value
    });

    save();
    renderAll();
    document.getElementById("eventDialog").close();
    showToast("Event saved");
  });

  document.getElementById("taskForm").addEventListener("submit", function (event) {
    event.preventDefault();

    state.tasks.push({
      id: Date.now(),
      title: document.getElementById("taskTitle").value.trim(),
      completed: false
    });

    save();
    renderAll();
    document.getElementById("taskDialog").close();
    showToast("Task saved");
  });

  document.getElementById("noteForm").addEventListener("submit", function (event) {
    event.preventDefault();

    state.notes.unshift({
      id: Date.now(),
      title: document.getElementById("noteTitle").value.trim(),
      body: document.getElementById("noteBody").value.trim()
    });

    save();
    renderAll();
    document.getElementById("noteDialog").close();
    showToast("Note saved");
  });

  document.getElementById("shoppingForm").addEventListener("submit", function (event) {
    event.preventDefault();

    state.shopping.push({
      id: Date.now(),
      title: document.getElementById("shoppingTitle").value.trim(),
      completed: false
    });

    save();
    renderAll();
    document.getElementById("shoppingDialog").close();
    showToast("Shopping item saved");
  });

  document.getElementById("resetButton").addEventListener("click", function () {
    if (!window.confirm("Reset all HomeOS data stored on this iPad?")) return;
    state = HomeOSStorage.reset();
    editing = false;
    document.getElementById("editBanner").classList.add("hidden");
    renderAll();
    navigate("home");
    showToast("HomeOS reset");
  });

  updateClock();
  window.setInterval(updateClock, 30000);
  renderAll();
}());
