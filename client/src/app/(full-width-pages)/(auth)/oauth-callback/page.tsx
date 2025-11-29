"use client";

import { Suspense } from "react";
import OAuthCallbackClient from "./oauthCallbackClient";


export default function OAuthCallback() {
  return (<Suspense fallback={<div className="w-full h-screen flex items-center justify-center text-lg">
      Signing you in...
      </div>}>
      
      <OAuthCallbackClient />
      </Suspense>
  );
}

