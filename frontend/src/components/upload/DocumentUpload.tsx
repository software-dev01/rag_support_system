import { useRef, useState } from "react";
import axios from "axios";
import {
  Upload,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DocumentUpload() {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const uploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);
      setSuccess(false);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      await axios.post(
        `${process.env.AI_SERVICE_URL}/upload`,
        formData
      );

      await axios.post(
        `${process.env.AI_SERVICE_URL}/reingest`
      );

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(error);

      alert(
        "Failed to upload document"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.txt,.md,.docx"
        onChange={uploadFile}
      />

      <Button
        variant="outline"
        className="gap-2"
        disabled={loading}
        onClick={() =>
          fileInputRef.current?.click()
        }
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Uploaded
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" />
            Upload Knowledge
          </>
        )}
      </Button>
    </>
  );
}