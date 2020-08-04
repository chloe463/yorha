import React from "react";
import { useFormGroup } from "@chloe463/use-form-group";

export const Preview: React.FC = () => {
  const formGroup = useFormGroup();
  return (
    <div className="preview">
      <pre className="preview__values">
        {JSON.stringify(
          {
            status: formGroup.status,
            values: formGroup.values,
            errors: formGroup.errors,
            meta: formGroup.metaInfos,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
};
