import React from "react";
import { renderHook, act } from "@testing-library/react-hooks";
import { FormGroupProvider } from "../FormGroupContext";
import { useFormGroup } from "../useFormGroup";
import { Validators } from "../Validators";

const DEFAULT_PROPS = {
  values: {
    num: 0,
  },
};

describe("useFormGroup", () => {
  it("can render initial values", () => {
    const { result } = renderHook(() => useFormGroup(), {
      wrapper: ({ children }) => <FormGroupProvider {...DEFAULT_PROPS}>{children}</FormGroupProvider>,
    });
    expect(result.current.values).toEqual({ num: 0 });
    expect(result.current.errors).toEqual({ num: null });
    expect(typeof result.current.setValue).toBe("function");
    expect(typeof result.current.reset).toBe("function");
    expect(result.current.metaInfos).toEqual({
      num: {
        pristine: true,
        dirty: false,
        touched: false,
        untouched: true,
      },
    });
    expect(result.current.status).toBe("VALID");
  });

  it("can set value on change event", () => {
    const { result } = renderHook(() => useFormGroup(), {
      wrapper: ({ children }) => <FormGroupProvider {...DEFAULT_PROPS}>{children}</FormGroupProvider>,
    });

    expect(result.current.values).toEqual({ num: 0 });
    expect(result.current.metaInfos).toEqual({
      num: {
        pristine: true,
        dirty: false,
        touched: false,
        untouched: true,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.setValue({ num: 1 });
    });
    expect(result.current.values).toEqual({ num: 1 });
    expect(result.current.metaInfos).toEqual({
      num: {
        pristine: false,
        dirty: true,
        touched: true,
        untouched: false,
      },
    });
  });

  it("can handle validation errors", () => {
    const props = {
      ...DEFAULT_PROPS,
      validators: {
        num: Validators.max(3),
      },
    };
    const { result } = renderHook(() => useFormGroup(), {
      wrapper: ({ children }) => <FormGroupProvider {...props}>{children}</FormGroupProvider>,
    });
    expect(result.current.errors).toEqual({ num: null });
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.setValue({ num: 5 });
    });
    expect(result.current.errors).toEqual({
      num: { max: { max: 3, actualValue: 5 } },
    });
    expect(result.current.status).toBe("INVALID");

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.setValue({ num: 2 });
    });
    expect(result.current.errors).toEqual({
      num: null,
    });
    expect(result.current.status).toBe("VALID");
  });

  it("can reset values", () => {
    const { result } = renderHook(() => useFormGroup(), {
      wrapper: ({ children }) => <FormGroupProvider {...DEFAULT_PROPS}>{children}</FormGroupProvider>,
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.setValue({ num: 1 });
    });
    expect(result.current.values).toEqual({ num: 1 });
    expect(result.current.metaInfos).toEqual({
      num: {
        pristine: false,
        dirty: true,
        touched: true,
        untouched: false,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.reset();
    });
    expect(result.current.values).toEqual({ num: 0 });
    expect(result.current.metaInfos).toEqual({
      num: {
        pristine: true,
        dirty: false,
        touched: false,
        untouched: true,
      },
    });
  });

  it("can update touched/untouched via setTouchedOnBlur", async () => {
    const { result } = renderHook(() => useFormGroup(), {
      wrapper: ({ children }) => <FormGroupProvider {...DEFAULT_PROPS}>{children}</FormGroupProvider>,
    });

    expect(result.current.metaInfos).toEqual({
      num: {
        pristine: true,
        dirty: false,
        touched: false,
        untouched: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    act(() => {
      result.current.setTouchedOnBlur("num");
    });

    expect(result.current.metaInfos).toEqual({
      num: {
        pristine: true,
        dirty: false,
        touched: true,
        untouched: false,
      },
    });
  });
});
