import { Button } from './ui/button';
import { Upload } from 'lucide-react';
import { useRef } from 'react';

interface ErrorStateProps {
  error: string | null;
  onFileUpload: (file: File) => void;
}

export function ErrorState({ error, onFileUpload }: ErrorStateProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-950 text-white">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <Upload className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-500 mb-2">Upload Failed</h1>
          <p className="text-gray-400">{error || 'Something went wrong'}</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          onClick={handleButtonClick}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Another File
        </Button>
      </div>
    </div>
  );
}