"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail } from "lucide-react"
import HeroSection from "@/components/HeroSection"
import Header from "@/components/Header"
import SideNav from "@/components/SideNav"
import BottomNav from "@/components/BottomNav"
import Footer from "@/components/Footer"
import { NetworkWarning } from "@/components/NetworkWarning"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNav />
        <main className="flex-1 w-full">
          {/* Network Warning */}
          <NetworkWarning variant="banner" />
          
          <HeroSection
            title="Contact Us"
            subtitle="We love hearing from our creative community."
            icon={Mail}
          />
          <section className="py-16 px-4 sm:px-6 lg:px-8 w-full" aria-labelledby="contact-heading">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <h2 id="contact-heading" className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
                <p className="text-lg text-muted-foreground">Have a question, suggestion, or just want to say hello? Fill out the form below or email us at <a href="mailto:hello@inkly.com" className="text-purple-600 hover:underline">hello@inkly.com</a>. We read every message and love hearing your creative ideas!<br/><span className='text-xs text-muted-foreground block mt-2'>Please do not include sensitive information. We will never ask for your password.</span></p>
                <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                  <div className="grid grid-cols-1 gap-6">
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      required
                      aria-label="Your Name"
                    />
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Your Email"
                      required
                      aria-label="Your Email"
                    />
                    <Input
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Subject (e.g. Feature Request, Bug, Feedback)"
                      required
                      aria-label="Subject"
                    />
                    <Textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Your Message"
                      rows={5}
                      required
                      aria-label="Your Message"
                    />
                  </div>
                  <Button type="submit" className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Send Message
                  </Button>
                  {submitted && (
                    <div className="text-green-600 text-center mt-4">Thank you! Your message has been sent. We appreciate your input and will get back to you soon.</div>
                  )}
                </form>
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