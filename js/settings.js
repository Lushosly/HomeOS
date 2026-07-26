(function () {
  "use strict";

  function rgba(hex, alpha) {
    var value = hex.replace("#", "");
    var red = parseInt(value.substring(0, 2), 16);
    var green = parseInt(value.substring(2, 4), 16);
    var blue = parseInt(value.substring(4, 6), 16);
    return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
  }

  function apply(state) {
    document.body.classList.toggle("dark", state.settings.theme === "dark");
    document.documentElement.style.setProperty("--font-scale", state.settings.fontScale);
    document.documentElement.style.setProperty("--accent", state.settings.accent);
    document.documentElement.style.setProperty("--accent-soft", rgba(state.settings.accent, .17));

    document.querySelectorAll("[data-theme]").forEach(function (button) {
      button.classList.toggle("selected", button.dataset.theme === state.settings.theme);
    });

    document.querySelectorAll("[data-font]").forEach(function (button) {
      button.classList.toggle("selected", button.dataset.font === state.settings.fontScale);
    });

    document.querySelectorAll("[data-color]").forEach(function (button) {
      button.classList.toggle("selected", button.dataset.color === state.settings.accent);
    });
  }

  window.HomeOSSettings = { apply: apply };
}());
