"use client";

import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"

type Props = {
  username: string;
  onSuccess: () => void;
  onFail: () => void;
}

export default function WebcamCapture({username, onSuccess, onFail}: Props) {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const { toast } = useToast();

  const capture = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setImage(screenshot);
      // console.log(screenshot);
      
      const base64Img = screenshot.split(',')[1]
      const data = {
        'username': username,
        'face_base64': base64Img
      }

      fetch("http://127.0.0.1:5000/api/scan/match", {
        method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
      }).then((res) => {
        res.json().then((resData) => {
          if(res.ok)
          {
            toast({
              title: "Login Success",
              description: resData.message,
            });
            onSuccess();
          }
          else
          {
            toast({
              title: "Login Failed",
              description: resData.message,
              variant: "destructive",
            });
            onFail();
          }
        })
      })
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto relative">
      <div className="relative w-full overflow-hidden">
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
          <div className="flex-col justify-center items-center">
            <img src={image} alt="Captured" className="w-full rounded-lg mb-0" />
            <div className="w-full flex justify-center mt-4">
              <p>Analyzing your facial scan...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4">
          {!image ?
            <Button onClick={capture}>Proceed</Button>:
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          }
      </div>
    </div>
  );
};