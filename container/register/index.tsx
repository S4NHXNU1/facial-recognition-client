"use client";
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
import { useState, useEffect } from "react";
import WebcamRegister from "@/components/my-ui/webcamRegister";

const formSchema = z.object({
    username: z.string().min(1, {message: "Required"}),
    password: z.string().min(1, {message: "Required"}),
    confirmPassword: z.string().min(1, {message: "Required"})
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
});

export default function Register()
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

        const credentails = {
            username: data.username,
            password: data.password
        }

        fetch("http://127.0.0.1:5000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentails),
        }).then((res) => {
            res.json().then((resData) => {
                if (res.ok) {
                    setUsername(data["username"]);
                    setOpen(true);
                } else {
                    toast({
                        title: "Register Failed",
                        description: resData.message,
                        variant: "destructive",
                    });
                }
            })
        })
    }

    const registerSuccessHandler = () => {
        router.replace("/login");
        router.refresh();
    }

    return(
        <div className="flex-col my-auto">
            <p className="text-center font-semibold text-2xl">Register</p>
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
                    <div className="flex flex-row mt-4">
                        <IconLockFilled className="size-6 my-auto mr-2" />
                        <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="w-[200px]" type="password" placeholder="Confirm Password" {...field}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}/>
                    </div>
                    <div className="flex justify-center mt-4">
                        <Button type="submit" className="w-[230px]">Register</Button>
                    </div>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="text-center">Facial Recognition Registration</DialogTitle>
                            </DialogHeader>
                            <WebcamRegister username={username} onSuccess={registerSuccessHandler} />
                        </DialogContent>
                    </Dialog>
                </form>
            </Form>
            <div className="flex justify-center mt-2">
                <p className="text-xs text-gray-700 mr-1">Already have an account?</p>
                <a className="text-xs underline cursor-pointer" onClick={() => {
                    router.replace("/login");
                    router.refresh();
                }}>Login</a>
            </div>
        </div>
    )
}