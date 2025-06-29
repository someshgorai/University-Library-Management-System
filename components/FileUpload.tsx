"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { ChangeEvent, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Image as IKImage } from "@imagekit/next";
import config from "@/lib/config";

interface Props {
  fileType: "image";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  fileType,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
}: Props) => {
  const [progress, setProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlEndpoint = config.env.imagekit.urlEndpoint;
  const abortController = new AbortController();

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const validateFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Only image files are allowed.",
      });
      return false;
    }
    if (fileType === "image" && file.size > 20 * 1024 * 1024) {
      toast.error("File size too large", {
        description: "Please upload a file less than 20MB in size",
      });
      return false;
    }
    return true;
  };

  const authenticator = async () => {
    try {
      const response = await fetch("/api/auth/imagekit-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`,
        );
      }

      const { signature, expire, token, publicKey } = await response.json();
      return { signature, expire, token, publicKey };
    } catch (error) {
      console.error("Authentication error:", error);
      throw new Error("Authentication request failed");
    }
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected", {
        description: "Please select a file to upload",
      });
      return;
    }

    if (!validateFile(file)) return;

    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      toast.error("Authentication failed", {
        description: "Unable to authenticate with ImageKit",
      });
      return;
    }

    const { signature, expire, token, publicKey } = authParams;

    try {
      const { url, filePath } = await upload({
        file,
        fileName: file.name,
        token,
        expire,
        signature,
        publicKey,
        folder,
        onProgress: (event) => {
          setProgress((event.loaded / event.total) * 100);
        },
        abortSignal: abortController.signal,
      });

      toast.success("Upload successful", {
        description: "Your file was uploaded successfully.",
      });

      setUploadedFileName(file.name);
      setUploadedFilePath(filePath);
      onFileChange(filePath);
    } catch (error) {
      if (error instanceof ImageKitAbortError) {
        toast.error("Upload Aborted", {
          description: error.reason,
        });
      } else if (error instanceof ImageKitInvalidRequestError) {
        toast.error("Invalid Request", {
          description: error.message,
        });
      } else if (error instanceof ImageKitUploadNetworkError) {
        toast.error("Network Error", {
          description: error.message,
        });
      } else if (error instanceof ImageKitServerError) {
        toast.error("Server Error", {
          description: error.message,
        });
      } else {
        toast.error("Upload Failed", {
          description: String(error),
        });
      }
    }
  };

  // @ts-ignore
  // @ts-ignore
  return (
    <>
      {/* Hidden File Input */}
      <br />
      <input
        type="file"
        ref={fileInputRef}
        accept={accept}
        onChange={handleUpload}
        className="hidden"
      />

      {/* Styled Upload Button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        variant={variant}
        className={cn("upload-btn", styles.button)}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />
        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>
      </button>

      {/* Upload Progress */}
      <div className="mt-4 w-full">
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-500 h-2.5 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {progress > 0 && progress < 100 && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            Uploading: {progress.toFixed(0)}%
          </p>
        )}

        {progress === 100 && uploadedFileName && (
          <p className="text-sm text-green-600 mt-2 text-center">
            Successfully uploaded {uploadedFileName}
          </p>
        )}

        {uploadedFilePath && (
          <div className="mt-4 flex justify-center">
            <IKImage
              urlEndpoint={urlEndpoint}
              src={uploadedFilePath}
              width={500}
              height={300}
              alt="Uploaded Image"
              className="rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default FileUpload;
