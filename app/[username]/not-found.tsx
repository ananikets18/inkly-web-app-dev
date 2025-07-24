import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserX, Home, Search } from "lucide-react"
import Header from "../../components/Header"
import SideNav from "../../components/SideNav"
import BottomNav from "../../components/BottomNav"

export default function UserNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <Header />
      <div className="flex sm:flex-row flex-col">
        <SideNav />
        <main className="flex-1 sm:px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 dark:border-gray-800 shadow-xl p-8 sm:p-12 text-center">
              <div className="mb-8">
                <UserX className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">User Not Found</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                  Sorry, we couldn't find the user you're looking for.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  The username might be invalid, reserved, or the user may not exist.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:from-purple-600 hover:to-pink-600 dark:hover:from-purple-800 dark:hover:to-pink-800 transition-all duration-200">
                      <Home className="w-4 h-4 mr-2" />
                      Go Home
                    </Button>
                  </Link>
                  <Link href="/explore">
                    <Button
                      variant="outline"
                      className="border-2 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-bold px-6 py-3 rounded-full hover:bg-purple-50 dark:hover:bg-purple-950 transition-all duration-200 bg-transparent"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Explore Users
                    </Button>
                  </Link>
                </div>

                <div className="mt-8 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Valid Username Format:</h3>
                  <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                    <li>• 3-30 characters long</li>
                    <li>• Letters, numbers, dots, underscores, and hyphens only</li>
                    <li>• Cannot be a reserved path (like /about, /help)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
