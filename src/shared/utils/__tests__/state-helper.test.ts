import { renderHook, act } from '@testing-library/react-hooks';
import { usePersistantState } from '../state-helper';

describe('usePersistantState', () => {
  let mockStorage: { [key: string]: string } = {};

  beforeEach(() => {
    mockStorage = {};
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn((key) => mockStorage[key] || null),
        setItem: jest.fn((key, value) => {
          mockStorage[key] = value;
        }),
        removeItem: jest.fn((key) => {
          delete mockStorage[key];
        }),
        clear: jest.fn(() => {
          mockStorage = {};
        })
      }
    });
  });

  it('should initialize with default value when no stored value exists', () => {
    const { result } = renderHook(() => usePersistantState('testKey', true));
    const [value] = result.current;

    expect(value).toBe(true);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should initialize with stored value when it exists', () => {
    mockStorage.testKey = JSON.stringify(false);

    const { result } = renderHook(() => usePersistantState('testKey', true));
    const [value] = result.current;

    expect(value).toBe(false);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith('testKey');
  });

  it('should update sessionStorage when value changes', () => {
    const { result } = renderHook(() => usePersistantState('testKey', false));

    act(() => {
      const setValue = result.current[1];
      setValue(true);
    });

    expect(result.current[0]).toBe(true);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(true));
  });

  it('should handle different keys independently', () => {
    const { result: result1 } = renderHook(() => usePersistantState('key1', true));
    const { result: result2 } = renderHook(() => usePersistantState('key2', false));

    expect(result1.current[0]).toBe(true);
    expect(result2.current[0]).toBe(false);

    act(() => {
      const setValue1 = result1.current[1];
      setValue1(false);
    });

    expect(result1.current[0]).toBe(false);
    expect(result2.current[0]).toBe(false);
    expect(mockStorage.key1).toBe(JSON.stringify(false));
    expect(mockStorage.key2).toBe(JSON.stringify(false));
  });

  it('should handle state updates with function updater', () => {
    const { result } = renderHook(() => usePersistantState('testKey', false));

    act(() => {
      const setValue = result.current[1];
      setValue(prev => !prev);
    });

    expect(result.current[0]).toBe(true);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(true));
  });

  it('should persist value across hook re-renders', () => {
    mockStorage.testKey = JSON.stringify(true);

    const { result, rerender } = renderHook(() => usePersistantState('testKey', false));
    expect(result.current[0]).toBe(true);

    rerender();
    expect(result.current[0]).toBe(true);
  });
}); 