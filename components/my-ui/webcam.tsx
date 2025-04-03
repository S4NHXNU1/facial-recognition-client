"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";

export default function WebcamCapture() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setImage(screenshot);
      // console.log(screenshot);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto relative">
      <div className="relative w-full aspect-square overflow-hidden">
        {!image ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover rounded-lg"
              mirrored
            />
            {/* Mask Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-80 h-80 border-4 border-white rounded-full opacity-70" />
            </div>
          </>
        ) : (
          <img src={image} alt="Captured" className="w-full rounded-lg mb-0" />
        )}
      </div>

      <div className="flex justify-center mt-4">
          <Button onClick={capture}>Proceed</Button>
      </div>
    </div>
  );
};