"use client"

import { motion } from "framer-motion"
import { Shield } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import BottomNav from "@/components/BottomNav"
import Footer from "@/components/Footer"
import { NetworkWarning } from "@/components/NetworkWarning"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNav />
        <main className="flex-1 w-full">
          {/* Network Warning */}
          <NetworkWarning variant="banner" />
          
          <HeroSection
            title="Privacy Policy"
            subtitle="Your creative journey is safe and respected at Inkly."
            icon={Shield}
          />
          <section className="py-16 px-4 sm:px-6 lg:px-8 w-full" aria-labelledby="privacy-heading">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 id="privacy-heading" className="text-3xl font-bold text-foreground mb-6">Privacy Policy</h2>
                <p className="text-lg text-muted-foreground">This Privacy Policy explains how Inkly ("we", "us", or "our") collects, uses, and protects your information when you use our Platform. By using Inkly, you consent to these practices.</p>
                <h3 className="text-xl font-semibold mt-8">1. Information We Collect</h3>
                <p className="text-muted-foreground">We collect information you provide directly (such as your name, email, and content you create), and information about your use of Inkly (such as device, browser, and usage data). We may use cookies and similar technologies to enhance your experience.</p>
                <h3 className="text-xl font-semibold mt-8">2. How We Use Information</h3>
                <p className="text-muted-foreground">We use your information to operate, personalize, and improve Inkly, including:
                  <ul className='list-disc ml-6 mt-2'>
                    <li>Creating and managing your account</li>
                    <li>Personalizing your feed, XP, badges, and collections</li>
                    <li>Providing support and responding to your requests</li>
                    <li>Protecting the community and enforcing our policies</li>
                    <li>Analyzing usage to improve features</li>
                  </ul>
                </p>
                <h3 className="text-xl font-semibold mt-8">3. Sharing & Disclosure</h3>
                <p className="text-muted-foreground">We do not sell your personal information. We may share data with trusted service providers who help us operate Inkly, or if required by law. Public content (like inks and comments) may be visible to others.</p>
                <h3 className="text-xl font-semibold mt-8">4. Data Security</h3>
                <p className="text-muted-foreground">We use industry-standard security measures to protect your data. However, no system is 100% secure. Please use strong passwords and notify us of any suspicious activity.</p>
                <h3 className="text-xl font-semibold mt-8">5. Your Choices & Rights</h3>
                <p className="text-muted-foreground">You can access, update, or delete your information at any time via your profile or settings. You may also request data export or account deletion by contacting us.</p>
                <h3 className="text-xl font-semibold mt-8">6. Children's Privacy</h3>
                <p className="text-muted-foreground">Inkly is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us information, please contact us for removal.</p>
                <h3 className="text-xl font-semibold mt-8">7. Changes to This Policy</h3>
                <p className="text-muted-foreground">We may update this Privacy Policy from time to time. We will notify you of major changes. Continued use of Inkly after changes means you accept the new Policy.</p>
                <h3 className="text-xl font-semibold mt-8">8. Contact</h3>
                <p className="text-muted-foreground">Questions or requests? Contact us at <a href="mailto:hello@inkly.com" className="text-purple-600 hover:underline">hello@inkly.com</a>.</p>
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