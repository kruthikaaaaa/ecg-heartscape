import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (uploadedFile: File) => {
    const validTypes = ["image/png", "image/jpeg", "image/jpg", "text/csv"];
    if (!validTypes.includes(uploadedFile.type)) {
      toast.error("Invalid file type. Please upload PNG, JPG, or CSV files.");
      return;
    }

    if (uploadedFile.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB.");
      return;
    }

    setFile(uploadedFile);
    toast.success("File uploaded successfully!");
  };

  const handleAnalyze = () => {
    if (!file) {
      toast.error("Please upload a file first.");
      return;
    }
    navigate("/results", { state: { file } });
  };

  const removeFile = () => {
    setFile(null);
    toast.info("File removed");
  };

  return (
    <div className="space-y-6">
      <Card
        className={`relative border-2 border-dashed transition-all ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center py-12 px-6 cursor-pointer"
        >
          <div className="p-4 rounded-full bg-gradient-medical mb-4">
            <Upload className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-semibold mb-2">Upload ECG File</p>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Drag and drop your ECG file here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: PNG, JPG, CSV (Max 10MB)
          </p>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".png,.jpg,.jpeg,.csv"
            onChange={handleChange}
          />
        </label>
      </Card>

      {file && (
        <Card className="p-4 shadow-medical">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10">
                <File className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={removeFile}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      <Button
        onClick={handleAnalyze}
        disabled={!file}
        className="w-full bg-gradient-medical shadow-medical hover:opacity-90 transition-opacity"
        size="lg"
      >
        Analyze ECG
      </Button>
    </div>
  );
};
