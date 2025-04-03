import { Button } from "@/components/ui/button";

export default function Home() {

  const username = "<username>";

  return (
    <div className="flex justify-center w-full h-[100vh]">
      <div className="flex-col my-auto">
        <p className="text-center text-2xl">Hello {username},</p>
        <p className="text-center text-3xl">You have successfully logged in.</p>
        <div className="flex justify-center mt-4">
          <Button>Log out</Button>
        </div>
      </div>
    </div>
  );
}
