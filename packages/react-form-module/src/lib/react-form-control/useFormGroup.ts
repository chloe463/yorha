import { useState, useCallback, useMemo } from "react";
import { Validator, AsyncValidator, ValidatorErrors, mergeValidators } from "./Validators";
import { FormGroupStatus } from "./constants";

type formValue = number | string | boolean | number[] | string[] | boolean[] | null;
export interface Meta {
  pristine: boolean;
  dirty: boolean;
  touched: boolean;
  untouched: boolean;
}

type FormValueSetterFn = (keysAndValues: Record<string, any>) => void;
export interface FormGroup {
  status: FormGroupStatus;
  metaInfos: Record<string, Meta>;
  setValue: FormValueSetterFn;
  values: any;
  errors: ValidatorErrors;
}

export interface GroupOptions {
  [key: string]:
    [formValue, Validator?] |
    [formValue, Validator[]] |
    [formValue, Validator, AsyncValidator?] |
    [formValue, Validator[], AsyncValidator?] |
    [formValue, Validator, AsyncValidator[]] |
    [formValue, Validator[], AsyncValidator[]];
}

function initValues(options: GroupOptions) {
  const values: Record<string, any> = {};
  Object.keys(options).forEach((key: string) => {
    const option = options[key];
    if (Array.isArray(option)) {
      const [value, _validator, _asyncValidator] = option;
      values[key] = value;
    } else {
      const value = option;
      values[key] = value;
    }
  });
  return values;
}

function initMeta(options: GroupOptions) {
  const meta: Record<string, any> = {};
  Object.keys(options).forEach((key: string) => {
    meta[key] = {
      pristine: true,
      dirty: false,
      touched: false,
      untouched: true,
    };
  });
  return meta;
}

function initValidators(options: GroupOptions) {
  const validators: { [key: string]: Validator | Validator[] | undefined } = {};
  const asyncValidators: { [key: string]: AsyncValidator | AsyncValidator[] | undefined } = {};
  Object.keys(options).forEach(key => {
    const option = options[key];
    if (Array.isArray(option)) {
      const [_value, validator, asyncValidator] = option;
      validators[key] = mergeValidators(validator);
      asyncValidators[key] = asyncValidator;
    }
  });
  return { validators, asyncValidators };
}

export function useFormGroup(formGroupOptions: GroupOptions): FormGroup {
  const [values, setValues] = useState<Record<string, any>>(initValues(formGroupOptions));
  const [metaInfos, setMetaInfo] = useState<Record<string, Meta>>(initMeta(formGroupOptions));
  const [errors, setErrors] = useState<ValidatorErrors>({});
  const [status, setStatus] = useState<null | FormGroupStatus>(null);

  const { validators } = useMemo(() => {
    return initValidators(formGroupOptions);
  }, [formGroupOptions]);

  const setValue = useCallback((keysAndValues: Record<string, any>) => {
    const updatedValues: Record<string, any> = {};
    const updatedMeta: Record<string, any> = {};
    const newErrors: ValidatorErrors = {};
    setStatus("VALID");
    Object.keys(keysAndValues).forEach(key => {
      updatedValues[key] = keysAndValues[key];
      updatedMeta[key] = {
        pristine: false,
        dirty: true,
        touched: true,
        untouched: false,
      };

      const validator = validators[key];
      if (!validator) {
        return;
      }
      const value = updatedValues[key];
      newErrors[key] = Array.isArray(validator) ?
        validator.map(fn => fn(value)).filter(Boolean) :
        validator(value);
    });
    setValues(currentValues => ({ ...currentValues, ...updatedValues }));
    setMetaInfo(currentMetas => ({ ...currentMetas, ...updatedMeta }));
    setErrors(currentErrors => ({ ...currentErrors, ...newErrors }));
    Object.values(newErrors).forEach(e => {
      if (e !== null && e.length > 0) {
        setStatus("INVALID");
      }
    });
  }, [validators]);

  return {
    status,
    setValue,
    metaInfos,
    values,
    errors,
  };
}