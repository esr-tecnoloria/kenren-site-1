import { useState, useRef } from 'react';
import { api } from '../lib/api';

type Props = {
  folder: 'news' | 'events' | 'kenjinkais' | 'transparencia' | 'hero' | 'other';
  value: string;
  onChange: (publicUrl: string) => void;
  label?: string;
};

type SignResponse = { uploadUrl: string; gcsPath: string; publicUrl: string };

export function MediaUpload({ folder, value, onChange, label = 'Imagem' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  async function handlePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    setBusy(true);
    setProgress(0);
    try {
      const signed = await api.post<SignResponse>('/media/sign-upload', {
        filename: file.name,
        contentType: file.type,
        folder,
      });

      await uploadWithProgress(signed.uploadUrl, file, setProgress);

      onChange(signed.publicUrl);
      if (inputRef.current) inputRef.current.value = '';
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="media-upload">
      <label>{label}</label>
      {value && (
        <div className="media-preview">
          <img src={value} alt="" />
          <button type="button" className="link-btn" onClick={() => onChange('')}>Remover</button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handlePick}
        disabled={busy}
      />
      {busy && <div className="media-progress">Enviando… {progress}%</div>}
      {err && <div className="error">{err}</div>}
    </div>
  );
}

function uploadWithProgress(url: string, file: File, onProgress: (pct: number) => void) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload falhou: ${xhr.status}`));
    xhr.onerror = () => reject(new Error('Erro de rede no upload'));
    xhr.send(file);
  });
}
