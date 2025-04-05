"use client";

import { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"

type Props = {
  username: string;
  onSuccess: () => void;
}

export default function WebcamRegister({username, onSuccess}: Props) {
    const webcamRef = useRef<Webcam>(null);
    const [image, setImage] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const { toast } = useToast();

    const messages = [
        "Position your face inside the circle.",
        "Keep your head steady and look straight at the camera.",
        "Face the camera directly and keep a neutral expression."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 3000);

        return () => clearInterval(interval); // Cleanup
    }, []);

    const capture = () => {
        const screenshot = webcamRef.current?.getScreenshot();
        if (screenshot) {
            const base64 = screenshot.split(',')[1];
            setImage((prev) => {
            const updated = [...prev, base64];
        
            if (updated.length === 3) {
                const data = {
                    username: username,
                    faces_base64: updated,
                };
                console.log(data);
        
                fetch("http://127.0.0.1:5000/api/scan/register", {
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
                        title: "Register Success",
                        description: resData.message,
                        });
                        onSuccess();
                    }
                    else
                    {
                        setImage([]);
                        toast({
                        title: "Register Failed",
                        description: "Please try again",
                        variant: "destructive",
                        });
                    }
                    })
                })
            }
        
            return updated;
            });
        }
    };

  return (
    <div className="p-4 max-w-lg mx-auto relative">
      <div className="relative w-full overflow-hidden">
        {image.length < 3 ? (
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
            <div className="w-full flex justify-center">
              <p>Analyzing and storing your facial scan...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-4">
          {image.length < 3 ? 
            <div className="flex flex-col items-center justify-center mt-2">
                <Button onClick={capture}>Capture (<span>{image.length} / 3</span>)</Button>
                <p className="text-center text-sm mt-3">{messages[currentIndex]}</p>
            </div>
            :
            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          }
      </div>
    </div>
  );
};