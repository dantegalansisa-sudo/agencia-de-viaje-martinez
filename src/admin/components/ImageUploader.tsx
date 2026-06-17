import { useState, useRef } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/config';
import './AdminComponents.css';

interface Props {
  folder: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
}

export default function ImageUploader({ folder, currentUrl, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(currentUrl || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;
    const storageRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);

    setUploading(true);
    task.on(
      'state_changed',
      (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      () => { setUploading(false); },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        setPreview(url);
        setUploading(false);
        onUploaded(url);
      },
    );
  };

  return (
    <div className="img-uploader">
      {preview && <img src={preview} alt="Preview" className="img-uploader__preview" />}
      <div className="img-uploader__actions">
        <button
          type="button"
          className="adm-btn adm-btn--ghost adm-btn--sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? `Subiendo ${progress}%...` : preview ? 'Cambiar imagen' : 'Subir imagen'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>
    </div>
  );
}
