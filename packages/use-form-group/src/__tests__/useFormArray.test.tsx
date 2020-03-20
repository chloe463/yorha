import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { FormGroupProvider } from "../FormGroupContext";
import { useFormArray } from "../useFormArray";
import { useFormGroup } from "../useFormGroup";

const MockCheckboxComponent: React.FC = () => {
  const { hasValue, addOrRemoveValue } = useFormArray("numbers");
  return (
    <>
      <input
        type="checkbox"
        value={1}
        checked={hasValue("1")}
        data-testid="checkbox1"
        onChange={e => addOrRemoveValue(e.target)}
      />
      <input
        type="checkbox"
        value={2}
        checked={hasValue("2")}
        data-testid="checkbox2"
        onChange={e => addOrRemoveValue(e.target)}
      />
      <input
        type="checkbox"
        value={3}
        checked={hasValue("3")}
        data-testid="checkbox3"
        onChange={e => addOrRemoveValue(e.target)}
      />
    </>
  );
};

const ValueComponent: React.FC = () => {
  const formGroup = useFormGroup();
  return <div data-testid="value">{JSON.stringify(formGroup.values.numbers)}</div>;
};

const MockContainer: React.FC = () => {
  const props = {
    values: {
      numbers: [],
    },
  };
  return (
    <FormGroupProvider {...props}>
      <MockCheckboxComponent />
      <ValueComponent />
    </FormGroupProvider>
  );
};

describe("useFormArray", () => {
  it("can manage value array", () => {
    const { getByTestId } = render(<MockContainer />);
    const checkbox1 = getByTestId("checkbox1");
    const checkbox2 = getByTestId("checkbox2");
    fireEvent.click(checkbox1);
    let value = getByTestId("value").innerHTML;
    expect(value).toBe(JSON.stringify(["1"]));

    fireEvent.click(checkbox2);
    value = getByTestId("value").innerHTML;
    expect(value).toBe(JSON.stringify(["1", "2"]));

    fireEvent.click(checkbox2);
    value = getByTestId("value").innerHTML;
    expect(value).toBe(JSON.stringify(["1"]));
  });
});
