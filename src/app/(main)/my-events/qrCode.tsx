// QRModal.tsx
import React from 'react';
import QRCode from 'react-qr-code';
import { Button } from "@/components/ui/button"; // Importa el botón de shadcn

interface QRModalProps {
  id: string;
  onClose: () => void;
}

const QRModal: React.FC<QRModalProps> = ({ id, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-lg">
        <Button variant="ghost" className="absolute right-2 top-2" onClick={onClose}>
          X
        </Button>
        <h2 className="mb-4 text-xl font-semibold">Código QR</h2>
        <QRCode value={id} size={256} />
      </div>
    </div>
  );
};

export default QRModal;
