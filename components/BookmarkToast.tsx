"use client"

import { useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"

interface BookmarkToastProps {
  message: string
}

export default function BookmarkToast({ message }: BookmarkToastProps) {
  const { toast } = useToast()

  useEffect(() => {
    toast({
      title: message,
      duration: 2000,
    })
  }, [message, toast])

  return null
}
