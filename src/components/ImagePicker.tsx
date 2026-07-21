import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type ImagePickerValue = File | string;

interface CommonImagePickerProps {
  label?: string;
  helperText?: string;
  maxSize?: number;
  disabled?: boolean;
  onErrorChange?: (error: string | null) => void;
}

interface SingleImagePickerProps extends CommonImagePickerProps {
  multiple?: false;
  value: ImagePickerValue | null;
  onChange: (value: ImagePickerValue | null) => void;
}

interface MultipleImagePickerProps extends CommonImagePickerProps {
  multiple: true;
  value: ImagePickerValue[];
  onChange: (value: ImagePickerValue[]) => void;
}

type ImagePickerProps = SingleImagePickerProps | MultipleImagePickerProps;

const formatMegabytes = (bytes: number) => bytes / (1024 * 1024);

export default function ImagePicker(props: ImagePickerProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const values = useMemo(
    () => (props.multiple ? props.value : props.value ? [props.value] : []),
    [props.multiple, props.value],
  );
  const previews = useMemo(
    () =>
      values.map((value) =>
        typeof value === "string" ? value : URL.createObjectURL(value),
      ),
    [values],
  );

  useEffect(
    () => () => {
      values.forEach((value, index) => {
        if (value instanceof File) URL.revokeObjectURL(previews[index]);
      });
    },
    [previews, values],
  );

  const updateError = (message: string | null) => {
    setError(message);
    props.onErrorChange?.(message);
  };

  const updateValues = (nextValues: ImagePickerValue[]) => {
    if (props.multiple) props.onChange(nextValues);
    else props.onChange(nextValues[0] ?? null);
  };

  const selectFiles = (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;

    const invalidType = selectedFiles.some(
      (file) => !file.type.startsWith("image/"),
    );
    if (invalidType) {
      updateError("Please select image files only");
      return;
    }

    const maxSize = props.maxSize;
    if (maxSize && selectedFiles.some((file) => file.size > maxSize)) {
      updateError(`Each image must be ${formatMegabytes(maxSize)} MB or less`);
      return;
    }

    updateError(null);
    updateValues(
      props.multiple ? [...values, ...selectedFiles] : selectedFiles,
    );
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    selectFiles(Array.from(event.dataTransfer.files));
  };

  const removeImage = (index: number) => {
    updateError(null);
    updateValues(values.filter((_, valueIndex) => valueIndex !== index));
  };

  const picker = (
    <label
      htmlFor={inputId}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-sm transition-colors",
        props.multiple && values.length ? "h-32" : "h-24",
        isDragging
          ? "border-teal-deep bg-teal-deep/5 text-teal-deep"
          : "border-slate-300 bg-slate-50 text-slate-500 hover:border-slate-400",
        props.disabled && "pointer-events-none opacity-50",
      )}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
    >
      {props.multiple && values.length ? (
        <ImagePlus className="mb-1 h-5 w-5" />
      ) : (
        <Upload className="mb-1 h-5 w-5" />
      )}
      {isDragging
        ? "Drop the image here"
        : props.multiple && values.length
          ? "Add more images"
          : "Drag & drop or click to upload"}
    </label>
  );

  return (
    <div>
      {props.label && <Label htmlFor={inputId}>{props.label}</Label>}
      {props.helperText && (
        <p className="mt-1 text-xs text-slate-500">{props.helperText}</p>
      )}
      <Input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        multiple={props.multiple}
        disabled={props.disabled}
        className="sr-only"
        onChange={handleFileChange}
      />

      {props.multiple ? (
        <div className="mt-1 grid grid-cols-2 gap-3">
          {previews.map((preview, index) => (
            <ImagePreview
              key={`${preview}-${index}`}
              preview={preview}
              filename={
                values[index] instanceof File ? values[index].name : undefined
              }
              disabled={props.disabled}
              onRemove={() => removeImage(index)}
            />
          ))}
          {picker}
        </div>
      ) : previews[0] ? (
        <div className="relative mt-1 max-w-64">
          <ImagePreview
            preview={previews[0]}
            filename={values[0] instanceof File ? values[0].name : undefined}
            disabled={props.disabled}
            onRemove={() => removeImage(0)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={props.disabled}
            className="absolute right-12 top-2"
            onClick={() => inputRef.current?.click()}
          >
            Replace
          </Button>
        </div>
      ) : (
        <div className="mt-1">{picker}</div>
      )}

      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function ImagePreview({
  preview,
  filename,
  disabled,
  onRemove,
}: {
  preview: string;
  filename?: string;
  disabled?: boolean;
  onRemove: () => void;
}) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      <img
        src={preview}
        alt="Selected image preview"
        className="h-full w-full object-contain"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        aria-label="Remove image"
        className="absolute right-2 top-2"
        onClick={onRemove}
      >
        <X className="h-4 w-4" />
      </Button>
      {filename && (
        <div className="absolute inset-x-0 bottom-0 truncate bg-slate-950/60 px-3 py-2 text-xs text-white">
          {filename}
        </div>
      )}
    </div>
  );
}
