import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconLockFilled, IconUserFilled } from "@tabler/icons-react";

export default function Login()
{
    return(
        <div className="flex-col my-auto">
            <p className="text-center font-semibold text-2xl">Login</p>
            <div className="flex flex-row mt-4">
                <IconUserFilled className="size-6 my-auto mr-2" />
                <Input className="w-[200px]" type="text" placeholder="Username" />
            </div>
            <div className="flex flex-row mt-4">
                <IconLockFilled className="size-6 my-auto mr-2" />
                <Input className="w-[200px]" type="password" placeholder="Password" />
            </div>
            <div className="flex justify-center mt-4">
                <Button className="w-[230px]">Login</Button>
            </div>
        </div>
    )
}