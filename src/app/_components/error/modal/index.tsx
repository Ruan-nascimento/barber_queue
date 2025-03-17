"use client";
import { useState, useEffect } from "react";

type ErrorModalProps = {
  isOpen: boolean;
  onClose: () => void;
  errorMessage: string;
};

export const ErrorModal = ({ isOpen, onClose, errorMessage }: ErrorModalProps) => {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-red-600 mb-4">Erro</h2>
        <p className="text-zinc-300 mb-6">{errorMessage}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-200"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};