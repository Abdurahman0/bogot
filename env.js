window.TG_ENV = {
  API_BASE: "https://armada.solar.api.cognilabs.org",
  WS_BASE: "",
  ...(window.TG_ENV || {}),
};

window.TG_API_BASE = window.TG_ENV.API_BASE;
