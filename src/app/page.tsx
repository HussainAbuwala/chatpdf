import FileUpload from "@/components/FileUpload";
import SubscriptionButton from "@/components/SubscriptionButton";
import { Button } from "@/components/ui/button";
import { checkSubscription } from "@/lib/subscription";
import { UserButton, auth } from "@clerk/nextjs";
import { ArrowRight, LogIn } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Progress } from "@/components/ui/progress";
import Image from 'next/image'
import landing from '../../public/landing.png'




export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let firstChat;
  let allChats
  if (userId) {
    allChats = await db.select().from(chats).where(eq(chats.userId, userId));
    if (allChats) {
      firstChat = allChats[0];
    }
  }


  return (
    <div className="bg-gradient-to-r min-h-screen from-teal-200 to-lime-200 flex justify-center items-center">
      <div className="mt-4  w-[100%] sm:w-[70%] md:w-[60%] p-3">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center">
            <h1 className="text-5xl  font-serif">Chat with <span className="text-5xl text-blue-600 italic font-bold">PDF</span></h1>
          </div>

          <div className="flex mt-2 justify-center items-center gap-1">
            {isAuth && firstChat && (
              <>
                <UserButton afterSignOutUrl="/" />
                <Link href={`/chat/${firstChat.id}`}>
                  <Button>
                    Go to Chats <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <div className="ml-3">
                  <SubscriptionButton isPro={isPro} variant="outline" size="default" />
                </div>
              </>
            )}
          </div>

          <p className="max-w-xl mt-1 mb-2 text-lg text-slate-600">
            Join millions of students, researchers and professionals to instantly
            answer questions and understand research with AI.
          </p>
          <Image
            src={landing}
            placeholder="blur"
            alt="Picture of the author"
            className="rounded-lg shadow-xl"
          />
          <div className="w-full mt-4">
            {!isAuth && <Link href="/sign-in">
              <Button>
                Login to get started!
                <LogIn className="w-4 h-4 ml-2" />
              </Button>
            </Link>}
            {isAuth && (isPro || allChats?.length < 3) &&
              <FileUpload />
            }
            {isAuth && !isPro &&
              <>
                <Progress value={33.33 * allChats?.length} className="w-[100%] mb-3 mt-2" />
                <span className="bg-slate-100 p-2 rounded-sm text-center  align-middle font-medium">Free Tier (PDF):  {allChats?.length} / 3</span>
              </>
            }
          </div>
        </div>
      </div>
    </div>

  )
}
