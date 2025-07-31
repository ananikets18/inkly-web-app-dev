"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { PenTool, BookOpen, Trophy, Users, Heart, ArrowRight, Twitter, Instagram, Github, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import HeroSection from "@/components/HeroSection"
// import JoinModal from "@/components/JoinModal"
import BottomNav from "@/components/BottomNav"
import SideNav from "@/components/SideNav"
import Header from "@/components/Header"
import { NetworkWarning } from "@/components/NetworkWarning"

const features = [
  {
    icon: PenTool,
    title: "Create & Share Inks",
    description:
      "Express your thoughts, poetry, and ideas in beautiful, shareable formats that resonate with your community.",
  },
  {
    icon: BookOpen,
    title: "Collections",
    description:
      "Organize and curate your favorite inks into personalized collections that reflect your interests and mood.",
  },
  {
    icon: Trophy,
    title: "XP & Badges",
    description:
      "Earn experience points and unlock achievements as you engage with the community and share your creativity.",
  },
  {
    icon: Users,
    title: "Personalized Feeds",
    description:
      "Discover content tailored to your interests through our intelligent algorithm that learns what inspires you.",
  },
]

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/inkly", label: "Follow us on Twitter" },
  { icon: Instagram, href: "https://instagram.com/inkly", label: "Follow us on Instagram" },
  { icon: Github, href: "https://github.com/inkly", label: "View our GitHub" },
  { icon: Mail, href: "mailto:hello@inkly.com", label: "Email us" },
]

const quickLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Community Guidelines", href: "/guidelines" },
  { label: "Help Center", href: "/help" },
  { label: "Contact Us", href: "/contact" },
]

const team = [
  { name: "Alex Johnson", role: "Founder & CEO", bio: "Poet, product visionary, and community builder." },
  { name: "Maya Chen", role: "Lead Designer", bio: "Passionate about beautiful, accessible digital experiences." },
  { name: "Jordan Kim", role: "Head of Engineering", bio: "Loves scalable systems and creative code." },
]

export default function AboutPage() {
  const [isJoinOpen, setIsJoinOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNav />
        <div className="flex-1">
          {/* Main about content starts here */}
      <div className="w-full">
        {/* Network Warning */}
        <NetworkWarning variant="banner" />
        
        {/* Hero Section */}
        <HeroSection
          title="Inkly: Where Ideas Find Their Voice"
          subtitle="A creative sanctuary where thoughts become art and words inspire connection."
          icon={Heart}
        />

        {/* Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 w-full" aria-labelledby="story-heading">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 id="story-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Our Story
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto text-muted-foreground space-y-8"
            >
              <p className="text-lg sm:text-xl leading-relaxed">
                Inkly was born from a simple belief: everyone has a story worth telling, and every thought deserves a beautiful canvas. In a world filled with noise, we wanted to create a space where creativity could flourish, where words could find their perfect form, and where meaningful connections could grow through shared expression.
              </p>
              <p className="text-lg sm:text-xl leading-relaxed">
                We noticed that traditional social platforms often prioritize quantity over quality, speed over reflection. Inkly is different. Here, we celebrate the art of thoughtful expression, whether it's a profound poem, a daily reflection, or a moment of inspiration that deserves to be preserved and shared.
              </p>
              <p className="text-lg sm:text-xl leading-relaxed">
                Our platform combines the visual appeal of modern design with the timeless power of the written word, creating an environment where creators can focus on what matters most: authentic self-expression and genuine human connection.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 w-full"
          aria-labelledby="features-heading"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Core Features
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover the tools and features that make Inkly the perfect platform for creative expression.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 bg-white dark:bg-gray-800">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <feature.icon className="w-8 h-8 text-white" aria-hidden="true" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 w-full" aria-labelledby="team-heading">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 id="team-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8">
                Meet the Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {team.map((member) => (
                  <div key={member.name} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                    <p className="text-purple-600 font-medium mb-2">{member.role}</p>
                    <p className="text-muted-foreground">{member.bio}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Community & Vision Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 w-full" aria-labelledby="vision-heading">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 id="vision-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-8">
                Community & Vision
              </h2>
              <div className="space-y-8 text-muted-foreground">
                <p className="text-lg sm:text-xl leading-relaxed">
                  At Inkly, we believe in the transformative power of positive creative expression. Our community is built on principles of respect, authenticity, and mutual inspiration. We're not just a platform—we're a movement toward more meaningful digital interaction.
                </p>
                <p className="text-lg sm:text-xl leading-relaxed">
                  Our vision is to create a world where every voice is heard, every story is valued, and every creative spark has the potential to ignite something beautiful in others. Join us in building a more thoughtful, creative, and connected digital future.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-purple-950/20 dark:via-background dark:to-orange-950/20 w-full"
          aria-labelledby="cta-heading"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 id="cta-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Ready to Share Your Voice?
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                Join thousands of creators who have already discovered the joy of meaningful expression on Inkly.
              </p>
              <Button
                size="lg"
                className="px-12 py-6 text-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => setIsJoinOpen(true)}
                aria-label="Join Inkly community"
              >
                Join Inkly Now
                <ArrowRight className="w-6 h-6 ml-3" aria-hidden="true" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className="bg-gray-900 dark:bg-gray-950 text-white py-16 px-4 sm:px-6 lg:px-8 w-full"
          role="contentinfo"
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Brand */}
              <div className="space-y-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Inkly
                </h3>
                <p className="text-gray-300 leading-relaxed text-lg">
                  Where ideas find their voice and creativity knows no bounds.
                </p>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-12 h-12 rounded-full bg-gray-800 hover:bg-purple-600 flex items-center justify-center transition-colors duration-200"
                      aria-label={social.label}
                      title={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <social.icon className="w-6 h-6" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-6">
                <h4 className="text-xl font-semibold">Quick Links</h4>
                <nav className="space-y-3" aria-label="Footer navigation">
                  {quickLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block text-gray-300 hover:text-purple-400 transition-colors duration-200 text-lg"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Contact */}
              <div className="space-y-6">
                <h4 className="text-xl font-semibold">Get in Touch</h4>
                <div className="space-y-3 text-gray-300">
                  <p className="text-lg">Have questions or feedback?</p>
                  <a
                    href="mailto:hello@inkly.com"
                    className="text-purple-400 hover:text-purple-300 transition-colors duration-200 text-lg"
                  >
                    hello@inkly.com
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                  <p className="text-lg">&copy;2025 | Made with  by the Inkly team. </p>
            </div>
          </div>
        </footer>
      </div>
          {/* End of main about content */}
      <BottomNav />
        </div>
      </div>
    </div>
  )
}
