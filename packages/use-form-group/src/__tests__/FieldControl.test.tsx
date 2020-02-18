import React from "react";
import { render, fireEvent, cleanup, act } from "@testing-library/react";
import { FormGroupProvider } from "../FormGroupContext";
import { useFormGroup } from "../useFormGroup";
import { FieldControl } from "../FieldControl";

afterEach(cleanup);

const MockComponent: React.FC<{}> = () => {
  const formGroup = useFormGroup({
    values: {
      text: "",
    },
  });
  return (
    <FormGroupProvider formGroup={formGroup}>
      <FieldControl name="text">
        {({ value, setValue, inputRef, touched, untouched }) => {
          return (
            <>
              <input
                type="text"
                value={value}
                onChange={e => setValue(e.target.value)}
                ref={inputRef as React.RefObject<HTMLInputElement>}
                data-testid="input"
              />
              <span data-testid="value">{value}</span>
              <span data-testid="touched">{touched ? "true" : "false"}</span>
              <span data-testid="untouched">{untouched ? "true" : "false"}</span>
            </>
          );
        }}
      </FieldControl>
    </FormGroupProvider>
  );
};

describe("FieldControl", () => {
  it("renders without crashing", () => {
    const container = render(<MockComponent />);
    expect(container).toBeTruthy();
  });

  it("can changes value", async () => {
    const { getByTestId } = render(<MockComponent />);
    const input = getByTestId("input");
    const value = getByTestId("value");
    expect(value.innerHTML).toBe("");
    act(() => {
      fireEvent.change(input, { target: { value: "abc" } });
    });
    expect(value.innerHTML).toBe("abc");
  });

  it("adds onBlur event listener on mount", () => {
    const { getByTestId } = render(<MockComponent />);
    const input = getByTestId("input");
    const touched = getByTestId("touched");
    const untouched = getByTestId("untouched");
    expect(touched.innerHTML).toBe("false");
    expect(untouched.innerHTML).toBe("true");
    act(() => {
      input.focus();
      input.blur();
    });
    expect(touched.innerHTML).toBe("true");
    expect(untouched.innerHTML).toBe("false");
  });
});

const MockComponentWithoutProvider: React.FC<{}> = () => {
  return (
    <FieldControl name="text">
      {({ value, setValue }) => {
        return <input type="text" value={value} onChange={e => setValue(e.target.value)} />;
      }}
    </FieldControl>
  );
};

describe("FieldControl", () => {
  it("crashes if it is not contained by FormGroupProvider", () => {
    expect(() => render(<MockComponentWithoutProvider />)).toThrow();
  });
});

const MockComponentWithoutRef: React.FC<{}> = () => {
  const formGroup = useFormGroup({
    values: {
      text: "",
    },
  });
  return (
    <FormGroupProvider formGroup={formGroup}>
      <FieldControl name="text">
        {({ value, setValue }) => {
          return (
            <>
              <input type="text" value={value} onChange={e => setValue(e.target.value)} data-testid="input" />
            </>
          );
        }}
      </FieldControl>
    </FormGroupProvider>
  );
};

describe("FieldControl without inputRef", () => {
  it("works correctly without *Ref", () => {
    const container = render(<MockComponentWithoutRef />);
    expect(container).toBeTruthy();
  });
});
