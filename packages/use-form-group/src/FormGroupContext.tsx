import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { Validator, ValidatorErrors, mergeValidators } from "./Validators";
import { FormGroupStatus } from "./constants";

type FormValueSetterFn = (keysAndValues: Record<string, any>) => void;

export interface FormGroup {
  status: FormGroupStatus;
  metaInfos: Record<string, Meta>;
  setValue: FormValueSetterFn;
  values: any;
  errors: ValidatorErrors;
  reset: () => void;
  setTouchedOnBlur: (key: string) => void;
}

export const FormGroupContext = createContext<FormGroup>({
  status: "VALID",
  metaInfos: {},
  setValue: () => {
    /* Do something */
  },
  values: {},
  errors: {},
  reset: () => {
    /* Do something */
  },
  setTouchedOnBlur: (_key: string) => {
    /* Do something */
  },
});

type ValidatorsOption<T> = { [key in keyof T]?: Validator | Validator[] };
export interface FormGroupOptions<T extends Record<string, any>> {
  values: T;
  validators?: ValidatorsOption<T>;
}

interface FormGroupProviderProps<T = Record<string, any>> {
  values: T;
  validators?: ValidatorsOption<T>;
}

export interface Meta {
  pristine: boolean;
  dirty: boolean;
  touched: boolean;
  untouched: boolean;
}

export function initMeta<T>(values: T) {
  const meta: Record<string, any> = {};
  Object.keys(values).forEach((key: string) => {
    meta[key] = {
      pristine: true,
      dirty: false,
      touched: false,
      untouched: true,
    };
  });
  return meta;
}

export function initValidators<T>(validators: FormGroupOptions<T>["validators"]) {
  if (!validators) {
    return { validators: {} };
  }
  const mergedValidators: { [key: string]: Validator } = {};
  Object.keys(validators).forEach(key => {
    const validator = (validators as any)[key];
    mergedValidators[key] = mergeValidators(validator);
  });
  return { validators: mergedValidators };
}

export function initErrors<T>(values: T) {
  const errors: ValidatorErrors = {};
  Object.keys(values).forEach(key => {
    errors[key] = null;
  });
  return errors;
}

export const FormGroupProvider: React.FC<FormGroupProviderProps> = props => {
  const [initialValues] = useState<Record<string, any>>(props.values);
  const [values, setValues] = useState<Record<string, any>>(props.values);
  const [metaInfos, setMetaInfo] = useState<Record<string, Meta>>(initMeta(props.values));
  const [errors, setErrors] = useState<ValidatorErrors>(initErrors(values));
  const [status, setStatus] = useState<null | FormGroupStatus>("VALID");

  const { validators } = useMemo(() => initValidators(props.validators), [props.validators]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setMetaInfo(initMeta(initialValues));
    setErrors({});
    // eslint-disable-next-line
  }, []);

  const setValue = useCallback(
    (keysAndValues: Record<string, any>) => {
      const updatedValues: Record<string, any> = {};
      const updatedMeta: Record<string, any> = {};
      const newErrors: ValidatorErrors = {};
      Object.keys(keysAndValues).forEach(key => {
        updatedValues[key] = keysAndValues[key];
        updatedMeta[key] = {
          pristine: updatedValues[key] === initialValues[key],
          dirty: updatedValues[key] !== initialValues[key],
          touched: true,
          untouched: false,
        };

        const validator = validators[key];
        if (validator) {
          newErrors[key] = validator(updatedValues[key]);
        }
      });
      setValues(currentValues => ({ ...currentValues, ...updatedValues }));
      setMetaInfo(currentMetas => ({ ...currentMetas, ...updatedMeta }));
      setErrors(currentErrors => ({ ...currentErrors, ...newErrors }));
    },
    [initialValues, validators]
  );

  const setTouchedOnBlur = useCallback((key: string) => {
    setMetaInfo(currentMetas => ({
      ...currentMetas,
      [key]: {
        ...currentMetas[key],
        touched: true,
        untouched: false,
      },
    }));
  }, []);

  useEffect(() => {
    const hasError = Boolean(Object.values(errors).filter(e => e !== null && Object.keys(e).length > 0).length);
    setStatus(hasError ? "INVALID" : "VALID");
  }, [errors]);

  const contextValue = {
    status,
    setValue,
    metaInfos,
    values,
    errors,
    reset,
    setTouchedOnBlur,
  };

  return <FormGroupContext.Provider value={contextValue}>{props.children}</FormGroupContext.Provider>;
};
