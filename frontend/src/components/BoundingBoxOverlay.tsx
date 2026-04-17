import React from 'react';

type Detection = {
  label: string;
  confidence: number;
  box: [number, number, number, number]; // [left, top, right, bottom]
};

interface BoundingBoxOverlayProps {
  imageSrc: string;
  detections: Detection[];
  width: number;
  height: number;
}

export default function BoundingBoxOverlay({ imageSrc, detections, width, height }: BoundingBoxOverlayProps) {
  // A helper function to generate colors based on labels
  const stringToColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };

  return (
    <div className="relative inline-block" style={{ width, height }}>
      {/* The original image */}
      <img src={imageSrc} alt="Uploaded for detection" className="w-full h-full object-contain" />
      
      {/* The bounding boxes */}
      {detections.map((det, index) => {
        const [left, top, right, bottom] = det.box;
        // The image object-contain might scale the image down. 
        // For MVP, we assume the provided width and height perfectly match the natural image sizes.
        
        const boxWidth = right - left;
        const boxHeight = bottom - top;
        const color = stringToColor(det.label);

        return (
          <div
            key={index}
            className="absolute border-2 flex flex-col justify-start items-start"
            style={{
              left: left,
              top: top,
              width: boxWidth,
              height: boxHeight,
              borderColor: color,
            }}
          >
            <span
              className="px-1 text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: color, transform: 'translateY(-100%)' }}
            >
              {det.label} ({Math.round(det.confidence * 100)}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}
