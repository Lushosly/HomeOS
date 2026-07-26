(function () {
  "use strict";

  function renderTasks(state, helpers) {
    var list = document.getElementById("fullTaskList");
    var count = document.getElementById("taskCount");

    count.textContent = String(state.tasks.filter(function (task) {
      return !task.completed;
    }).length);

    if (!state.tasks.length) {
      list.innerHTML = '<div class="empty-state">No tasks yet.</div>';
      return;
    }

    list.innerHTML = state.tasks.map(function (task) {
      return [
        '<div class="task-row ' + (task.completed ? 'completed' : '') + '">',
        '<input type="checkbox" data-toggle-task="' + task.id + '"' + (task.completed ? ' checked' : '') + '>',
        '<span class="task-label">' + helpers.escapeHtml(task.title) + '</span>',
        '<button class="delete-small" data-delete-task="' + task.id + '">×</button>',
        '</div>'
      ].join("");
    }).join("");
  }

  function renderNotes(state, helpers) {
    var list = document.getElementById("fullNoteList");

    if (!state.notes.length) {
      list.innerHTML = '<div class="empty-state">No notes yet.</div>';
      return;
    }

    list.innerHTML = state.notes.map(function (note) {
      return [
        '<article class="note-card">',
        '<h3>' + helpers.escapeHtml(note.title) + '</h3>',
        '<p>' + helpers.escapeHtml(note.body) + '</p>',
        '<button data-delete-note="' + note.id + '">Delete</button>',
        '</article>'
      ].join("");
    }).join("");
  }

  window.HomeOSTasks = {
    renderTasks: renderTasks,
    renderNotes: renderNotes
  };
}());
