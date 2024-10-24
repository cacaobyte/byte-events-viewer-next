import { useEffect, useState } from "react"

const getOS = () => {
  return new Promise<string>((resolve) => {
    const { userAgent } = window.navigator
    if (/windows/i.test(userAgent)) resolve("Windows")
    else if (/android/i.test(userAgent)) resolve("Android")
    else if (/linux/i.test(userAgent) && !/android/i.test(userAgent))
      resolve("Linux")
    else if (/iphone|ipad|ipod/i.test(userAgent)) resolve("iOS")
    else if (/macintosh|mac os x/i.test(userAgent)) resolve("macOS")
    else resolve("Unknown")
  })
}

export const useDetectOS = () => {
  const [os, setOS] = useState<string>("")

  useEffect(() => {
    getOS().then((result) => setOS(result))
  }, [])

  return os
}
