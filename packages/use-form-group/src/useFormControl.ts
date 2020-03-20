import { useContext, useCallback, useRef, useEffect, useMemo } from "react";
import { FormGroupContext } from "./FormGroupContext";

export function useFormControl<T>(name: string) {
  const formGroup = useContext(FormGroupContext);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const selectRef = useRef<HTMLSelectElement | null>(null);

  if (!formGroup) {
    throw new Error(
      ['Could not find "formGroup" in context.', "Wrap the root component in a <FormGroupProvider>."].join(" ")
    );
  }

  const { values, metaInfos, errors, setTouchedOnBlur } = formGroup;
  const setValue = useCallback((value: any) => formGroup.setValue({ [name]: value }), [formGroup, name]);

  useEffect(() => {
    const element = inputRef.current || textareaRef.current || selectRef.current;
    if (!element) {
      return;
    }
    const onBlur = () => setTouchedOnBlur(name);
    element.addEventListener("blur", onBlur);
    return () => element.removeEventListener("blur", onBlur);
    // NOTE: Call this effect onMount only.
    /* eslint-disable-next-line */
  }, []);

  const value = useMemo(() => values[name], [name, values]);
  const metaInfo = useMemo(() => metaInfos[name], [metaInfos, name]);
  const error = useMemo(() => errors[name], [errors, name]);

  return {
    value,
    ...metaInfo,
    errors: error,
    setValue,
    inputRef,
    selectRef,
    textareaRef,
  };
}
