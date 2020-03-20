import { initMeta, initValidators } from "../FormGroupContext";
import { Validators } from "../Validators";

describe("initMeta", () => {
  it("initializes meta values", () => {
    const values = {
      num: 1,
      str: "string",
      bool: true,
    };
    const actual = initMeta(values);
    const expected = {
      num: { pristine: true, dirty: false, touched: false, untouched: true },
      str: { pristine: true, dirty: false, touched: false, untouched: true },
      bool: { pristine: true, dirty: false, touched: false, untouched: true },
    };
    expect(actual).toEqual(expected);
  });
});

describe("initValidators", () => {
  it("initializes validators", () => {
    const values = {
      num: [Validators.max(5)],
      str: [Validators.maxLength(3)],
      bool: [Validators.required],
    };
    const actual = initValidators(values);
    expect(actual.validators).toBeTruthy();
    expect(Object.keys(actual.validators).length).toBe(3);
    expect(Object.keys(actual.validators)).toEqual(["num", "str", "bool"]);
    expect(Object.values(actual.validators).length).toBe(3);
    Object.values(actual.validators).forEach(validator => {
      expect(validator).toBeInstanceOf(Function);
    });
  });
});
