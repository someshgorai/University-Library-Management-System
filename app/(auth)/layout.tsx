import { ReactNode } from "react";
import Image from "next/image";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { ImageKitProvider } from "@imagekit/next";
import config from "@/lib/config";
import { Toaster } from "@/components/ui/sonner";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (session) redirect("/");

  return (
    <main className="auth-container">
      <section className="auth-form">
        <div className="auth-box">
          <div className="flex items-center gap-3">
            <Image src="/icons/logo2.png" alt="logo" width={50} height={50} />
            <h1 className="text-4xl font-semibold text-white whitespace-nowrap">
              Bookery
            </h1>
          </div>

          <ImageKitProvider urlEndpoint={config.env.imagekit.urlEndpoint}>
            <div>{children}</div>
            <Toaster />
          </ImageKitProvider>
        </div>
      </section>

      <section className="auth-illustration">
        <Image
          src="/images/lms-auth.jpg"
          alt="auth illustration"
          height={1000}
          width={1000}
          className="size-full object-cover"
        />
      </section>
    </main>
  );
};

export default Layout;
