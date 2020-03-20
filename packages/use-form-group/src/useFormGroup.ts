import { useContext } from "react";
import { FormGroup, FormGroupContext } from "./FormGroupContext";

export function useFormGroup<T>(): FormGroup {
  const formGroupContext = useContext(FormGroupContext);
  return formGroupContext;
}
