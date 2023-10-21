import React from 'react'
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import ChatSideBar from '@/components/ChatSideBar';
import PDFViewer from '@/components/PDFViewer';
import ChatComponent from '@/components/ChatComponent';
import { checkSubscription } from '@/lib/subscription';

type Props = {
    params: {
        chatId: string;
    };
};

const ChatPage = async ({ params: { chatId } }: Props) => {
    const { userId } = await auth();
    if (!userId) {
        return redirect("/sign-in");
    }
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
    if (!_chats) {
        return redirect("/");
    }
    if (!_chats.find((chat) => chat.id === parseInt(chatId))) {
        return redirect("/");
    }

    const currentChat = _chats.find((chat) => chat.id === parseInt(chatId));
    const isPro = await checkSubscription();

    return (
        <div className="flex">
            {/* chat sidebar */}
            <div className="flex-[1] min-w-[17rem] max-w-xs">
                <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
            </div>
            {/* pdf viewer */}
            <div className="flex-[5] min-h-screen p-4">
                <PDFViewer pdf_url={currentChat?.pdfUrl || ""} />
            </div>
            {/* chat component */}
            <div className="flex-[3] border-l-4 border-l-slate-200 min-w-[20rem]">
                <ChatComponent chatId={parseInt(chatId)} />
            </div>
        </div>
    );
}

export default ChatPage