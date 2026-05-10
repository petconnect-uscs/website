import { useState, useRef } from "react";

import { DownloadIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type FileUploadProps = {
  className?: string;
  multiple?: boolean;
  onFilesChange?: (files: File[]) => void;
};

export function FileUpload({
  className,
  multiple = true,
  onFilesChange,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;

    if (multiple && input.files) {
      const newFiles = Array.from(input.files);
      setFiles(newFiles);
      onFilesChange?.(newFiles);
    }

    if (!multiple && input.files) {
      const newFiles = [input.files[0]];
      setFiles(newFiles);
      onFilesChange?.(newFiles);
    }
  }

  function handleDragEnter(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleDragOver(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();

    setIsDragging(false);

    const droppedFiles = e.dataTransfer?.files;

    if (droppedFiles && droppedFiles.length > 0) {
      if (multiple) {
        const newFiles = Array.from(droppedFiles) as File[];

        setFiles(newFiles);
        onFilesChange?.(newFiles);
      } else {
        const newFiles = [droppedFiles[0]] as File[];

        setFiles(newFiles);
        onFilesChange?.(newFiles);
      }
    }
  }

  function handleLabelClick() {
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).click();
    }
  }

  return (
    <>
      <label
        htmlFor="file-upload"
        className={cn(
          "w-full py-4.5 flex flex-col items-center justify-center gap-2.5 cursor-pointer border border-border/80 border-dashed rounded-xl",
          isDragging && "border-border bg-neutral-50",
          className,
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleLabelClick}
      >
        <DownloadIcon size={18} className="text-muted-foreground" />

        <div className="flex flex-col items-center justify-center gap-1">
          {files.length > 0 ? (
            <div className="flex flex-col items-center justify-center">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="text-gray-700 text-sm font-semibold text-center"
                >
                  <h3 className="text-foreground text-sm font-semibold">
                    {file.name}
                  </h3>
                  <p className="text-xs leading-3 tracking-normal text-muted-foreground">
                    Extensões aceitas: png, jpg, jpeg, webm
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <>
              <h3 className="text-foreground text-sm font-semibold">
                Arraste o arquivo ou{" "}
                <span className="underline cursor-pointer">clique aqui</span>
              </h3>
              <p className="text-xs leading-3 tracking-normal text-muted-foreground">
                Extensões aceitas: png, jpg, jpeg, webm
              </p>
            </>
          )}
        </div>
      </label>

      <input
        ref={fileInputRef}
        id="file-upload"
        type="file"
        className="hidden"
        multiple={multiple}
        onChange={handleFileChange}
        accept=".jpg,.jpeg,.png,.mp4"
      />
    </>
  );
}
