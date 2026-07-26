(function () {
  "use strict";

  function render(state, helpers) {
    var list = document.getElementById("calendarList");
    var rows = [];

    for (var index = 0; index < 7; index += 1) {
      var date = new Date();
      date.setDate(date.getDate() + index);
      var key = helpers.isoDate(date);

      var events = state.events
        .filter(function (event) { return event.date === key; })
        .sort(function (a, b) { return a.time.localeCompare(b.time); });

      var content = events.length
        ? events.map(function (event) {
            return '<div class="calendar-event"><strong>' +
              helpers.escapeHtml(event.title) +
              '</strong><span class="muted">' +
              helpers.timeLabel(event.time) +
              '</span></div>';
          }).join("")
        : '<span class="muted">No events</span>';

      rows.push(
        '<div class="calendar-day">' +
          '<div class="calendar-date">' + helpers.formatDay(key) + '</div>' +
          '<div class="calendar-events">' + content + '</div>' +
        '</div>'
      );
    }

    list.innerHTML = rows.join("");
  }

  window.HomeOSCalendar = { render: render };
}());
