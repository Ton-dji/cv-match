"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useProfileStore } from "@/store/useProfileStore";

export function CloudSync() {
  const { data: session, status } = useSession();
  const { profile, setProfile } = useProfileStore();
  const isInitialLoad = useRef(true);

  // Fetch on login
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.fullName !== undefined) {
            setProfile(data);
          }
        })
        .catch(console.error)
        .finally(() => {
          isInitialLoad.current = false;
        });
    } else if (status === "unauthenticated") {
      isInitialLoad.current = false;
    }
  }, [status, setProfile]);

  // Save to cloud on changes
  useEffect(() => {
    if (status === "authenticated" && !isInitialLoad.current) {
      const saveToCloud = setTimeout(() => {
        fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        }).catch(console.error);
      }, 1500); // Debounce saves by 1.5s

      return () => clearTimeout(saveToCloud);
    }
  }, [profile, status]);

  return null;
}
