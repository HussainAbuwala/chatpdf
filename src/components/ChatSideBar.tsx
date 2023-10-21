"use client";

import { DrizzleChat } from '@/lib/db/schema';
import React from 'react'
import Link from "next/link";
import { Button } from "./ui/button";
import { Home, MessageCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { Progress } from './ui/progress';
import SubscriptionButton from './SubscriptionButton';
import { Separator } from './ui/separator';



type Props = {
    chats: DrizzleChat[];
    chatId: number;
    isPro: boolean;

};

const ChatSideBar = ({ chats, chatId, isPro }: Props) => {
    const [loading, setLoading] = React.useState(false)
    const handleSubscription = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/stripe')
            window.location.href = response.data.url;
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }
    const totalPDFs = chats.length;
    return (
        <div className="w-full min-h-screen p-4  text-gray-200 bg-gray-900 overflow-auto relative">
            <Link href="/">
                <Button className="w-full border-dashed border-white border">
                    <PlusCircle className="mr-2 w-4 h-4" />
                    New Chat
                </Button>
            </Link>

            <div className="flex pb-20 flex-col gap-2 mt-4">
                {chats.map((chat) => (
                    <Link key={chat.id} href={`/chat/${chat.id}`}>
                        <div
                            className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
                                "bg-blue-600 text-white": chat.id === chatId,
                                "hover:text-white": chat.id !== chatId,
                            })}
                        >
                            <MessageCircle className="mr-2" />
                            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
                                {chat.pdfName}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className='absolute bottom-0 left-0 w-full flex flex-col p-4 gap-2'>
                
                <Separator />
                {!isPro && <h3>Free Tier (PDF): {totalPDFs} / 3</h3>}
                {!isPro && <Progress value={33.33 * totalPDFs} className="w-[90%]" />}
                <div className='flex items-center gap-1 '>
                    <SubscriptionButton isPro={isPro} variant='secondary' size='sm'/>
                    <Link href='/'>
                        <Button variant='ghost' size='sm'>
                            <Home />
                        </Button>
                    </Link>
                </div>
            </div>

        </div>
    );
}

export default ChatSideBar