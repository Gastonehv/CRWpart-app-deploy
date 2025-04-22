import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function QRInvite({ url, size = 128 }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <QRCodeSVG value={url} size={size} bgColor="#fff" fgColor="#155e75" level="Q" />
      <div className="text-xs text-gray-400 text-center flex items-center justify-center gap-1 mt-1">
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <ellipse cx="12" cy="10" rx="7" ry="8" stroke="#a78bfa" strokeWidth="2" fill="#e0f2fe"/>
          <path d="M12 18c1.5 0 2.5-2 2.5-4" stroke="#06b6d4" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 18v3" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="10.5" cy="9" r="1" fill="#a78bfa"/>
          <circle cx="13.5" cy="11" r="1" fill="#06b6d4"/>
        </svg>
        Escanea para ver tu invitación
      </div>
    </div>
  );
}
