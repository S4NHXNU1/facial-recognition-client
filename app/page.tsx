"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/cookies?key=session_id`,{
      method: "GET",
      headers: {
          "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((resData) => {
        if(resData.status == 200)
        {
          setUsername(resData.value);
        }
        else
        {
          router.replace("/login");
          router.refresh();
        }
      })
    })
  }, []);

  const logoutHandler = () => {
    fetch(`/api/cookies?key=session_id`,{
      method: "DELETE",
      headers: {
          "Content-Type": "application/json",
      },
    })

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="flex justify-center w-full h-[100vh]">
      <div className="flex-col my-auto">
        <p className="text-center text-2xl">Hello {username},</p>
        <p className="text-center text-3xl">You have successfully logged in.</p>
        <div className="flex justify-center mt-4">
          <Button onClick={logoutHandler}>Log out</Button>
        </div>
      </div>
    </div>
  );
}
