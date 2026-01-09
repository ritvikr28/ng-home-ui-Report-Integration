import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import translationEn from "../../src/locales/en/translation.json";
import translationCy from "../../src/locales/cy/translation.json";
import { IntlProvider } from "@essnextgen/ui-intl-kit";

IntlProvider.init({
  translation: {
    en: translationEn,
    cy: translationCy
  }
});

jest.mock('../../src/shared/utils/api-service', () => ({
  service: {
    get: jest.fn(() => Promise.reject({
      response: { data: { code: 'validation_error', reason: { some: ['error'] } } }
    })),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    init: jest.fn(),
    config: jest.fn(),
    setInterceptor: jest.fn(),
  }
}));

window.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
