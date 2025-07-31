"use client"

import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import BottomNav from "@/components/BottomNav"
import Footer from "@/components/Footer"
import { NetworkWarning } from "@/components/NetworkWarning"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNav />
        <main className="flex-1 w-full">
          {/* Network Warning */}
          <NetworkWarning variant="banner" />
          
          <HeroSection
            title="Terms of Service"
            subtitle="Our promise and your responsibilities as a creative member of Inkly."
            icon={Shield}
          />
          <section className="py-16 px-4 sm:px-6 lg:px-8 w-full" aria-labelledby="terms-heading">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 id="terms-heading" className="text-3xl font-bold text-foreground mb-6">Welcome to Inkly</h2>
                <p className="text-lg text-muted-foreground">These Terms of Service ("Terms") govern your use of Inkly (the "Platform"), operated by the Inkly team. By accessing or using Inkly, you agree to these Terms. Please read them carefully.</p>
                <h3 className="text-xl font-semibold mt-8">1. Eligibility</h3>
                <p className="text-muted-foreground">You must be at least 13 years old to use Inkly. By using the Platform, you represent and warrant that you meet this requirement.</p>
                <h3 className="text-xl font-semibold mt-8">2. Your Content & Rights</h3>
                <p className="text-muted-foreground">You retain ownership of the inks, collections, and other content you create. By posting on Inkly, you grant us a non-exclusive, royalty-free license to display, distribute, and promote your content within the Platform and related marketing, always crediting you as the creator. You are responsible for the content you post and must have the necessary rights to share it.</p>
                <h3 className="text-xl font-semibold mt-8">3. Community Guidelines</h3>
                <p className="text-muted-foreground">You agree to follow our <a href='/guidelines' className='text-purple-600 hover:underline'>Community Guidelines</a>. Do not post content that is unlawful, harmful, hateful, harassing, infringing, or otherwise inappropriate. We reserve the right to remove content or suspend accounts that violate these rules.</p>
                <h3 className="text-xl font-semibold mt-8">4. Platform Use & Restrictions</h3>
                <p className="text-muted-foreground">You may not misuse Inkly by attempting to hack, disrupt, or reverse-engineer the Platform, or by using bots or scripts to manipulate XP, badges, or other features. Automated or bulk account creation is prohibited.</p>
                <h3 className="text-xl font-semibold mt-8">5. Intellectual Property</h3>
                <p className="text-muted-foreground">All Platform code, design, and trademarks are the property of Inkly or its licensors. You may not copy, modify, or distribute any part of Inkly without permission, except for your own content as described above.</p>
                <h3 className="text-xl font-semibold mt-8">6. Disclaimers & Limitation of Liability</h3>
                <p className="text-muted-foreground">Inkly is provided "as is" and "as available." We do not guarantee uninterrupted or error-free service. To the fullest extent permitted by law, Inkly and its team are not liable for any damages arising from your use of the Platform.</p>
                <h3 className="text-xl font-semibold mt-8">7. Account Termination</h3>
                <p className="text-muted-foreground">We may suspend or terminate your account if you violate these Terms or our Community Guidelines. You may also delete your account at any time via your profile or by contacting us.</p>
                <h3 className="text-xl font-semibold mt-8">8. Changes to Terms</h3>
                <p className="text-muted-foreground">We may update these Terms from time to time. We will notify you of major changes. Continued use of Inkly after changes means you accept the new Terms.</p>
                <h3 className="text-xl font-semibold mt-8">9. Contact</h3>
                <p className="text-muted-foreground">Questions? Contact us at <a href="mailto:hello@inkly.com" className="text-purple-600 hover:underline">hello@inkly.com</a>.</p>
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