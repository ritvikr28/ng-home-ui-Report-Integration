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
jest.setTimeout(30000);
