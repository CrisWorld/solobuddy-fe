"use client";

import { Toast } from "@/lib/useToast";
import { X } from "lucide-react";

interface Props {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

const typeStyles: Record<string, string> = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
};

export function ToastContainer({ toasts, onRemove }: Props) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between px-4 py-3 rounded-lg shadow-lg ${typeStyles[toast.type]}`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="ml-3 text-white hover:opacity-80"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
