const apiBaseUrl =
  window.location.hostname === "juegoscpa.test.cajapop.org"
    ? "http://juegoscpa.test.cajapop.org/api/"
    : window.location.hostname === "agenciasdequiniela.cajapopular.gov.ar"
    ? "https://agenciasdequiniela.cajapopular.gov.ar/api/"
    : window.location.hostname === "juegoscpa.dev.cajapop.org"
    ? "http://juegoscpa.dev.cajapop.org/api/"
    : window.location.hostname === "pruebajuegos.cajapopular.gov.ar"
    ? "https://pruebajuegos.cajapopular.gov.ar/api/"
    : "http://localhost:8002/api/";

export const REACT_APP_API_BASE_URL = apiBaseUrl;

// const apiBaseUrl =
//     window.location.hostname === "juegoscpa.test.cajapop.org"
//         ? "http://juegoscpa.test.cajapop.org/api/"
//         : "https://agenciasdequiniela.cajapopular.gov.ar/api/";

// export const REACT_APP_API_BASE_URL = apiBaseUrl;

// const apiBaseUrl = "http://juegoscpa.test.cajapop.org/api/"
// export const REACT_APP_API_BASE_URL = apiBaseUrl;

// const apiBaseUrl =
//     window.location.hostname === "juegoscpa.dev.cajapop.org"
//         ? "http://juegoscpa.dev.cajapop.org/api/"
//         : "https://pruebajuegos.cajapopular.gov.ar/api/";

// export const REACT_APP_API_BASE_URL = apiBaseUrl;
