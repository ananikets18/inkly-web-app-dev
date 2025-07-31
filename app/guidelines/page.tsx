"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import BottomNav from "@/components/BottomNav"
import Footer from "@/components/Footer"
import { NetworkWarning } from "@/components/NetworkWarning"

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNav />
        <main className="flex-1 w-full">
          {/* Network Warning */}
          <NetworkWarning variant="banner" />
          
          <HeroSection
            title="Community Guidelines"
            subtitle="How we keep Inkly creative, kind, and inspiring for everyone."
            icon={BookOpen}
          />
          <section className="py-16 px-4 sm:px-6 lg:px-8 w-full" aria-labelledby="guidelines-heading">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 id="guidelines-heading" className="text-3xl font-bold text-foreground mb-6">Our Community Spirit</h2>
                <p className="text-lg text-muted-foreground">Inkly is a place for thoughtful expression, creative risk-taking, and genuine connection. These guidelines help us all create a space where every voice is valued and every story can shine.</p>
                <h3 className="text-xl font-semibold mt-8">1. Be Respectful & Kind</h3>
                <p className="text-muted-foreground">Treat everyone with respect. No hate speech, bullying, harassment, or discrimination. Celebrate diversity and encourage positive, constructive feedback.</p>
                <h3 className="text-xl font-semibold mt-8">2. Share Creatively & Responsibly</h3>
                <p className="text-muted-foreground">Post original inks, collections, and comments. Plagiarism, spam, and misleading content are not allowed. Use echoes and badges to uplift others, not to manipulate or game the system.</p>
                <h3 className="text-xl font-semibold mt-8">3. Keep Inkly Safe</h3>
                <p className="text-muted-foreground">Do not post illegal, explicit, or harmful content. Protect your privacy and the privacy of others. If you see something concerning, use the report feature or contact us directly.</p>
                <h3 className="text-xl font-semibold mt-8">4. Support Each Other</h3>
                <p className="text-muted-foreground">Welcome new members, celebrate achievements, and help others grow. XP and badges are for positive contributions. Let’s build a creative, supportive community together.</p>
                <h3 className="text-xl font-semibold mt-8">5. Moderation & Reporting</h3>
                <p className="text-muted-foreground">Our team and community moderators may remove content or suspend accounts that violate these guidelines. Appeals and feedback are always welcome at <a href="mailto:hello@inkly.com" className="text-purple-600 hover:underline">hello@inkly.com</a> or in the <a href="/help" className="text-purple-600 hover:underline">Help Center</a>.</p>
              </motion.div>
            </div>
          </section>
          <BottomNav />
          <Footer />
        </main>
      </div>
    </div>
  )
} 