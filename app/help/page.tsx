"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  HelpCircle,
  BookOpen,
  Users,
  Settings,
  Shield,
  Mail,
  MessageCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import HeroSection from "@/components/HeroSection"
import BottomNav from "@/components/BottomNav"
import SideNav from "@/components/SideNav"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { NetworkWarning } from "@/components/NetworkWarning"

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    questions: [
      {
        question: "How do I create my first ink?",
        answer:
          "Click the 'Create' button in the header or bottom navigation, then write your thoughts, poetry, or ideas. You can format your text, add hashtags, and choose your mood before publishing.",
      },
      {
        question: "What makes a good ink?",
        answer:
          "Great inks are authentic, thoughtful, and engaging. Whether it's a profound quote, personal reflection, or creative poetry, focus on quality over quantity. Use relevant hashtags to help others discover your content.",
      },
      {
        question: "How do I follow other users?",
        answer:
          "Visit any user's profile and click the 'Follow' button. You can also follow users directly from their inks by clicking on their username or avatar.",
      },
      {
        question: "What are echoes and how do they work?",
        answer:
          "Echoes are like likes or hearts on other platforms. When you echo an ink, you're showing appreciation for the content. The creator earns XP, and the ink may appear in more feeds.",
      },
    ],
  },
  {
    id: "collections",
    title: "Collections",
    icon: BookOpen,
    questions: [
      {
        question: "How do I create a collection?",
        answer:
          "Click the bookmark icon on any ink and select 'Create New Collection'. Give it a name, description, and choose privacy settings. You can also create collections from your profile page.",
      },
      {
        question: "Can I make my collections private?",
        answer:
          "Yes! When creating or editing a collection, you can set it to private. Private collections are only visible to you and won't appear in your public profile.",
      },
      {
        question: "How many inks can I add to a collection?",
        answer:
          "There's no limit to how many inks you can add to a collection. Organize them however makes sense to you - by theme, mood, author, or any other criteria.",
      },
      {
        question: "Can I collaborate on collections with others?",
        answer:
          "Currently, collections are individual, but we're working on collaborative collections for future updates. Stay tuned!",
      },
    ],
  },
  {
    id: "profile-settings",
    title: "Profile & Settings",
    icon: Settings,
    questions: [
      {
        question: "How do I change my profile picture?",
        answer:
          "Go to Settings > Profile, then click on your current avatar. You can upload a new image or choose from our avatar options.",
      },
      {
        question: "Can I change my username?",
        answer:
          "Yes, you can change your username once every 30 days. Go to Settings > Profile and update your username field. Remember, this will change your profile URL.",
      },
      {
        question: "How do I enable dark mode?",
        answer:
          "Dark mode automatically follows your system preference, but you can manually toggle it in Settings > Appearance. Choose from Light, Dark, or System modes.",
      },
      {
        question: "What are XP and badges?",
        answer:
          "XP (Experience Points) are earned by creating inks, receiving echoes, and engaging with the community. Badges are achievements you unlock for various milestones and activities.",
      },
    ],
  },
]

const tutorials = [
  {
    title: "Creating Your First Ink",
    description: "Learn how to write, format, and publish your first piece of content",
    duration: "3 min read",
    category: "Beginner",
  },
  {
    title: "Building Collections",
    description: "Organize your favorite inks into beautiful, curated collections",
    duration: "5 min read",
    category: "Intermediate",
  },
  {
    title: "Understanding the Feed Algorithm",
    description: "How Inkly decides what content to show you and how to optimize your reach",
    duration: "4 min read",
    category: "Advanced",
  },
  {
    title: "Community Guidelines",
    description: "Best practices for positive engagement and content creation",
    duration: "6 min read",
    category: "Essential",
  },
]

const policies = [
  { title: "Privacy Policy", href: "/privacy", description: "How we protect and use your data" },
  { title: "Terms of Service", href: "/terms", description: "Legal terms and conditions" },
  { title: "Community Guidelines", href: "/guidelines", description: "Rules for respectful interaction" },
  { title: "Content Policy", href: "/content-policy", description: "What content is allowed on Inkly" },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFAQs, setFilteredFAQs] = useState(faqCategories)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  // Filter FAQs based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredFAQs(faqCategories)
      return
    }

    const filtered = faqCategories
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (q) =>
            q.question.toLowerCase().includes(query.toLowerCase()) ||
            q.answer.toLowerCase().includes(query.toLowerCase()),
        ),
      }))
      .filter((category) => category.questions.length > 0)

    setFilteredFAQs(filtered)
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Contact form submitted:", contactForm)
    // Reset form
    setContactForm({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <SideNav />
        <div className="flex-1">
          {/* Main help content starts here */}
        {/* Hero Section */}
        <HeroSection
          title="Need Help? We've Got You Covered"
          subtitle="Find answers, learn new features, and get the support you need to make the most of Inkly"
          icon={HelpCircle}
        />

        {/* Network Warning */}
        <NetworkWarning variant="banner" />
        
        {/* Search Section */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 w-full">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for help topics, features, or questions..."
                className="w-full pl-16 pr-6 py-6 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                aria-label="Search help topics"
              />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 w-full" aria-labelledby="faq-heading">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 id="faq-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Quick answers to common questions about using Inkly
              </p>
            </motion.div>

            <div className="space-y-8">
              {filteredFAQs.map((category, categoryIndex) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center gap-4 text-2xl">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <category.icon className="w-6 h-6 text-white" aria-hidden="true" />
                        </div>
                        {category.title}
                        <Badge variant="secondary" className="ml-auto text-sm">
                          {category.questions.length} questions
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="space-y-4">
                        {category.questions.map((faq, index) => (
                          <AccordionItem
                            key={index}
                            value={`${category.id}-${index}`}
                            className="border rounded-xl px-6"
                          >
                            <AccordionTrigger className="text-left hover:no-underline py-6">
                              <span className="font-medium text-lg">{faq.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 text-muted-foreground leading-relaxed text-base">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {filteredFAQs.length === 0 && searchQuery && (
              <div className="text-center py-16">
                <HelpCircle className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-foreground mb-4">No results found</h3>
                <p className="text-lg text-muted-foreground">Try different keywords or browse our tutorials below</p>
              </div>
            )}
          </div>
        </section>

        {/* Tutorials Section */}
        <section
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 w-full"
          aria-labelledby="tutorials-heading"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 id="tutorials-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Quick Tutorials & Guides
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Step-by-step guides to help you master Inkly's features
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {tutorials.map((tutorial, index) => (
                <motion.div
                  key={tutorial.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border-0 bg-white dark:bg-gray-800">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge
                          variant={tutorial.category === "Essential" ? "default" : "secondary"}
                          className={tutorial.category === "Essential" ? "bg-purple-600" : ""}
                        >
                          {tutorial.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{tutorial.duration}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-3">{tutorial.title}</h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">{tutorial.description}</p>
                      <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium">
                        Read Guide
                        <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 w-full" aria-labelledby="contact-heading">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 id="contact-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Contact Support
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground">
                Can't find what you're looking for? We're here to help!
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <MessageCircle className="w-6 h-6 text-purple-600" />
                      Send us a message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-3">
                            Name
                          </label>
                          <Input
                            id="name"
                            type="text"
                            value={contactForm.name}
                            onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                            required
                            className="w-full py-3"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-3">
                            Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                            required
                            className="w-full py-3"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-3">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          type="text"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                          required
                          className="w-full py-3"
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-3">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          value={contactForm.message}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                          required
                          rows={6}
                          className="w-full resize-none"
                          placeholder="Describe your issue or question in detail..."
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      >
                        Send Message
                        <Mail className="w-5 h-5 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Direct Contact */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <Mail className="w-8 h-8 text-purple-600" />
                      <h3 className="text-2xl font-semibold">Email Support</h3>
                    </div>
                    <p className="text-muted-foreground mb-6 text-lg">For general inquiries and support requests</p>
                    <a
                      href="mailto:support@inkly.com"
                      className="text-purple-600 hover:text-purple-700 font-medium text-lg"
                    >
                      support@inkly.com
                    </a>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <Users className="w-8 h-8 text-purple-600" />
                      <h3 className="text-2xl font-semibold">Community</h3>
                    </div>
                    <p className="text-muted-foreground mb-6 text-lg">
                      Join our community discussions and get help from other users
                    </p>
                    <Button variant="outline" className="w-full py-4 text-lg bg-transparent">
                      Join Community
                      <ExternalLink className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <div className="text-muted-foreground space-y-4">
                  <p className="text-lg">
                    <strong>Response Time:</strong> We typically respond within 24 hours
                  </p>
                  <p className="text-lg">
                    <strong>Support Hours:</strong> Monday - Friday, 9 AM - 6 PM PST
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Policies Section */}
        <section
          className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 w-full"
          aria-labelledby="policies-heading"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 id="policies-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Policies & Legal
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground">Important information about using Inkly</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {policies.map((policy, index) => (
                <motion.div
                  key={policy.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border-0 bg-white dark:bg-gray-800">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-3">{policy.title}</h3>
                        <p className="text-muted-foreground mb-6">{policy.description}</p>
                        <div className="flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium">
                          Read More
                          <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
          {/* End of main help content */}
          <BottomNav />
          <Footer />
        </div>
      </div>
    </div>
  )
}
