"use client";
import WebcamCapture from "@/components/my-ui/webcam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconLockFilled, IconUserFilled } from "@tabler/icons-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"  
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react"

const formSchema = z.object({
    username: z.string().min(1, {message: "Cannot be blank"}),
    password: z.string().min(1, {message: "Cannot be blank"}),
});

export default function Login()
{
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const { toast } = useToast();
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        const data = {
          ...values,
        };

        fetch("http://127.0.0.1:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }).then((res) => {
            res.json().then((resData) => {
                if (res.ok) {
                    setUsername(data["username"]);
                    setOpen(true);
                } else {
                    toast({
                        title: "Login Failed",
                        description: resData.message,
                        variant: "destructive",
                    });
                }
            })
        })
    }

    const scanSuccessHandler = () => {

        fetch(`/api/cookies?key=session_id&value=${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })

        router.replace('/');
        router.refresh();
    }

    return(
        <div className="flex-col my-auto">
            <p className="text-center font-semibold text-2xl">Login</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-row mt-4">
                        <IconUserFilled className="size-6 my-auto mr-2" />
                        <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="w-[200px]" type="text" placeholder="Username" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}/>
                    </div>
                    <div className="flex flex-row mt-4">
                        <IconLockFilled className="size-6 my-auto mr-2" />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="w-[200px]" type="password" placeholder="Password" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}/>
                    </div>
                    <div className="flex justify-center mt-4">
                        <Button type="submit" className="w-[230px]">Login</Button>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-center">Facial Recognition Scan</DialogTitle>
                            </DialogHeader>
                            <WebcamCapture username={username} onFail={() => setOpen(false)} onSuccess={scanSuccessHandler} />
                        </DialogContent>
                    </Dialog>
                </form>
            </Form>
            <div className="flex justify-center mt-2">
                <p className="text-xs text-gray-700 mr-1">Don't have an account yet?</p>
                <a className="text-xs underline cursor-pointer" onClick={() => {
                    router.replace("/register");
                    router.refresh();
                }}>Create one</a>
            </div>
        </div>
    )
}