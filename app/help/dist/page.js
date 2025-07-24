"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_1 = require("react");
var framer_motion_1 = require("framer-motion");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var textarea_1 = require("@/components/ui/textarea");
var card_1 = require("@/components/ui/card");
var accordion_1 = require("@/components/ui/accordion");
var badge_1 = require("@/components/ui/badge");
var HeroSection_1 = require("@/components/HeroSection");
var faqCategories = [
    {
        id: "getting-started",
        title: "Getting Started",
        icon: lucide_react_1.BookOpen,
        questions: [
            {
                question: "How do I create my first ink?",
                answer: "Click the 'Create' button in the header or bottom navigation, then write your thoughts, poetry, or ideas. You can format your text, add hashtags, and choose your mood before publishing."
            },
            {
                question: "What makes a good ink?",
                answer: "Great inks are authentic, thoughtful, and engaging. Whether it's a profound quote, personal reflection, or creative poetry, focus on quality over quantity. Use relevant hashtags to help others discover your content."
            },
            {
                question: "How do I follow other users?",
                answer: "Visit any user's profile and click the 'Follow' button. You can also follow users directly from their inks by clicking on their username or avatar."
            },
            {
                question: "What are echoes and how do they work?",
                answer: "Echoes are like likes or hearts on other platforms. When you echo an ink, you're showing appreciation for the content. The creator earns XP, and the ink may appear in more feeds."
            },
        ]
    },
    {
        id: "collections",
        title: "Collections",
        icon: lucide_react_1.BookOpen,
        questions: [
            {
                question: "How do I create a collection?",
                answer: "Click the bookmark icon on any ink and select 'Create New Collection'. Give it a name, description, and choose privacy settings. You can also create collections from your profile page."
            },
            {
                question: "Can I make my collections private?",
                answer: "Yes! When creating or editing a collection, you can set it to private. Private collections are only visible to you and won't appear in your public profile."
            },
            {
                question: "How many inks can I add to a collection?",
                answer: "There's no limit to how many inks you can add to a collection. Organize them however makes sense to you - by theme, mood, author, or any other criteria."
            },
            {
                question: "Can I collaborate on collections with others?",
                answer: "Currently, collections are individual, but we're working on collaborative collections for future updates. Stay tuned!"
            },
        ]
    },
    {
        id: "profile-settings",
        title: "Profile & Settings",
        icon: lucide_react_1.Settings,
        questions: [
            {
                question: "How do I change my profile picture?",
                answer: "Go to Settings > Profile, then click on your current avatar. You can upload a new image or choose from our avatar options."
            },
            {
                question: "Can I change my username?",
                answer: "Yes, you can change your username once every 30 days. Go to Settings > Profile and update your username field. Remember, this will change your profile URL."
            },
            {
                question: "How do I enable dark mode?",
                answer: "Dark mode automatically follows your system preference, but you can manually toggle it in Settings > Appearance. Choose from Light, Dark, or System modes."
            },
            {
                question: "What are XP and badges?",
                answer: "XP (Experience Points) are earned by creating inks, receiving echoes, and engaging with the community. Badges are achievements you unlock for various milestones and activities."
            },
        ]
    },
];
var tutorials = [
    {
        title: "Creating Your First Ink",
        description: "Learn how to write, format, and publish your first piece of content",
        duration: "3 min read",
        category: "Beginner"
    },
    {
        title: "Building Collections",
        description: "Organize your favorite inks into beautiful, curated collections",
        duration: "5 min read",
        category: "Intermediate"
    },
    {
        title: "Understanding the Feed Algorithm",
        description: "How Inkly decides what content to show you and how to optimize your reach",
        duration: "4 min read",
        category: "Advanced"
    },
    {
        title: "Community Guidelines",
        description: "Best practices for positive engagement and content creation",
        duration: "6 min read",
        category: "Essential"
    },
];
var policies = [
    { title: "Privacy Policy", href: "/privacy", description: "How we protect and use your data" },
    { title: "Terms of Service", href: "/terms", description: "Legal terms and conditions" },
    { title: "Community Guidelines", href: "/guidelines", description: "Rules for respectful interaction" },
    { title: "Content Policy", href: "/content-policy", description: "What content is allowed on Inkly" },
];
function HelpPage() {
    var _a = react_1.useState(""), searchQuery = _a[0], setSearchQuery = _a[1];
    var _b = react_1.useState(faqCategories), filteredFAQs = _b[0], setFilteredFAQs = _b[1];
    var _c = react_1.useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    }), contactForm = _c[0], setContactForm = _c[1];
    // Filter FAQs based on search query
    var handleSearch = function (query) {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredFAQs(faqCategories);
            return;
        }
        var filtered = faqCategories
            .map(function (category) { return (__assign(__assign({}, category), { questions: category.questions.filter(function (q) {
                return q.question.toLowerCase().includes(query.toLowerCase()) ||
                    q.answer.toLowerCase().includes(query.toLowerCase());
            }) })); })
            .filter(function (category) { return category.questions.length > 0; });
        setFilteredFAQs(filtered);
    };
    var handleContactSubmit = function (e) {
        e.preventDefault();
        // Handle form submission
        console.log("Contact form submitted:", contactForm);
        // Reset form
        setContactForm({ name: "", email: "", subject: "", message: "" });
    };
    return (React.createElement("div", { className: "min-h-screen bg-background" },
        React.createElement("div", { className: "w-full" },
            React.createElement(HeroSection_1["default"], { title: "Need Help? We've Got You Covered", subtitle: "Find answers, learn new features, and get the support you need to make the most of Inkly", icon: lucide_react_1.HelpCircle }),
            React.createElement("section", { className: "py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 w-full" },
                React.createElement("div", { className: "max-w-4xl mx-auto" },
                    React.createElement("div", { className: "relative" },
                        React.createElement(lucide_react_1.Search, { className: "absolute left-6 top-1/2 transform -translate-y-1/2 text-muted-foreground w-6 h-6" }),
                        React.createElement(input_1.Input, { type: "text", value: searchQuery, onChange: function (e) { return handleSearch(e.target.value); }, placeholder: "Search for help topics, features, or questions...", className: "w-full pl-16 pr-6 py-6 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent", "aria-label": "Search help topics" })))),
            React.createElement("section", { className: "py-20 px-4 sm:px-6 lg:px-8 w-full", "aria-labelledby": "faq-heading" },
                React.createElement("div", { className: "max-w-6xl mx-auto" },
                    React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "text-center mb-16" },
                        React.createElement("h2", { id: "faq-heading", className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" }, "Frequently Asked Questions"),
                        React.createElement("p", { className: "text-lg sm:text-xl text-muted-foreground" }, "Quick answers to common questions about using Inkly")),
                    React.createElement("div", { className: "space-y-8" }, filteredFAQs.map(function (category, categoryIndex) { return (React.createElement(framer_motion_1.motion.div, { key: category.id, initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: categoryIndex * 0.1 }, viewport: { once: true } },
                        React.createElement(card_1.Card, { className: "border-0 shadow-lg" },
                            React.createElement(card_1.CardHeader, { className: "pb-6" },
                                React.createElement(card_1.CardTitle, { className: "flex items-center gap-4 text-2xl" },
                                    React.createElement("div", { className: "w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center" },
                                        React.createElement(category.icon, { className: "w-6 h-6 text-white", "aria-hidden": "true" })),
                                    category.title,
                                    React.createElement(badge_1.Badge, { variant: "secondary", className: "ml-auto text-sm" },
                                        category.questions.length,
                                        " questions"))),
                            React.createElement(card_1.CardContent, null,
                                React.createElement(accordion_1.Accordion, { type: "single", collapsible: true, className: "space-y-4" }, category.questions.map(function (faq, index) { return (React.createElement(accordion_1.AccordionItem, { key: index, value: category.id + "-" + index, className: "border rounded-xl px-6" },
                                    React.createElement(accordion_1.AccordionTrigger, { className: "text-left hover:no-underline py-6" },
                                        React.createElement("span", { className: "font-medium text-lg" }, faq.question)),
                                    React.createElement(accordion_1.AccordionContent, { className: "pb-6 text-muted-foreground leading-relaxed text-base" }, faq.answer))); })))))); })),
                    filteredFAQs.length === 0 && searchQuery && (React.createElement("div", { className: "text-center py-16" },
                        React.createElement(lucide_react_1.HelpCircle, { className: "w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-6" }),
                        React.createElement("h3", { className: "text-2xl font-semibold text-foreground mb-4" }, "No results found"),
                        React.createElement("p", { className: "text-lg text-muted-foreground" }, "Try different keywords or browse our tutorials below"))))),
            React.createElement("section", { className: "py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 w-full", "aria-labelledby": "tutorials-heading" },
                React.createElement("div", { className: "max-w-7xl mx-auto" },
                    React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "text-center mb-16" },
                        React.createElement("h2", { id: "tutorials-heading", className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" }, "Quick Tutorials & Guides"),
                        React.createElement("p", { className: "text-lg sm:text-xl text-muted-foreground" }, "Step-by-step guides to help you master Inkly's features")),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8" }, tutorials.map(function (tutorial, index) { return (React.createElement(framer_motion_1.motion.div, { key: tutorial.title, initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: index * 0.1 }, viewport: { once: true } },
                        React.createElement(card_1.Card, { className: "h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border-0 bg-white dark:bg-gray-800" },
                            React.createElement(card_1.CardContent, { className: "p-6" },
                                React.createElement("div", { className: "flex items-start justify-between mb-4" },
                                    React.createElement(badge_1.Badge, { variant: tutorial.category === "Essential" ? "default" : "secondary", className: tutorial.category === "Essential" ? "bg-purple-600" : "" }, tutorial.category),
                                    React.createElement("span", { className: "text-sm text-muted-foreground" }, tutorial.duration)),
                                React.createElement("h3", { className: "text-xl font-semibold text-foreground mb-3" }, tutorial.title),
                                React.createElement("p", { className: "text-muted-foreground leading-relaxed mb-6" }, tutorial.description),
                                React.createElement("div", { className: "flex items-center text-purple-600 dark:text-purple-400 font-medium" },
                                    "Read Guide",
                                    React.createElement(lucide_react_1.ExternalLink, { className: "w-4 h-4 ml-2", "aria-hidden": "true" })))))); })))),
            React.createElement("section", { className: "py-20 px-4 sm:px-6 lg:px-8 w-full", "aria-labelledby": "contact-heading" },
                React.createElement("div", { className: "max-w-6xl mx-auto" },
                    React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "text-center mb-16" },
                        React.createElement("h2", { id: "contact-heading", className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" }, "Contact Support"),
                        React.createElement("p", { className: "text-lg sm:text-xl text-muted-foreground" }, "Can't find what you're looking for? We're here to help!")),
                    React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12" },
                        React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, x: -30 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8 }, viewport: { once: true } },
                            React.createElement(card_1.Card, { className: "border-0 shadow-lg" },
                                React.createElement(card_1.CardHeader, null,
                                    React.createElement(card_1.CardTitle, { className: "flex items-center gap-3 text-2xl" },
                                        React.createElement(lucide_react_1.MessageCircle, { className: "w-6 h-6 text-purple-600" }),
                                        "Send us a message")),
                                React.createElement(card_1.CardContent, null,
                                    React.createElement("form", { onSubmit: handleContactSubmit, className: "space-y-6" },
                                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6" },
                                            React.createElement("div", null,
                                                React.createElement("label", { htmlFor: "name", className: "block text-sm font-medium text-foreground mb-3" }, "Name"),
                                                React.createElement(input_1.Input, { id: "name", type: "text", value: contactForm.name, onChange: function (e) { return setContactForm(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }, required: true, className: "w-full py-3" })),
                                            React.createElement("div", null,
                                                React.createElement("label", { htmlFor: "email", className: "block text-sm font-medium text-foreground mb-3" }, "Email"),
                                                React.createElement(input_1.Input, { id: "email", type: "email", value: contactForm.email, onChange: function (e) { return setContactForm(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }, required: true, className: "w-full py-3" }))),
                                        React.createElement("div", null,
                                            React.createElement("label", { htmlFor: "subject", className: "block text-sm font-medium text-foreground mb-3" }, "Subject"),
                                            React.createElement(input_1.Input, { id: "subject", type: "text", value: contactForm.subject, onChange: function (e) { return setContactForm(function (prev) { return (__assign(__assign({}, prev), { subject: e.target.value })); }); }, required: true, className: "w-full py-3" })),
                                        React.createElement("div", null,
                                            React.createElement("label", { htmlFor: "message", className: "block text-sm font-medium text-foreground mb-3" }, "Message"),
                                            React.createElement(textarea_1.Textarea, { id: "message", value: contactForm.message, onChange: function (e) { return setContactForm(function (prev) { return (__assign(__assign({}, prev), { message: e.target.value })); }); }, required: true, rows: 6, className: "w-full resize-none", placeholder: "Describe your issue or question in detail..." })),
                                        React.createElement(button_1.Button, { type: "submit", className: "w-full py-4 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" },
                                            "Send Message",
                                            React.createElement(lucide_react_1.Mail, { className: "w-5 h-5 ml-2" })))))),
                        React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, x: 30 }, whileInView: { opacity: 1, x: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "space-y-8" },
                            React.createElement(card_1.Card, { className: "border-0 shadow-lg" },
                                React.createElement(card_1.CardContent, { className: "p-8" },
                                    React.createElement("div", { className: "flex items-center gap-4 mb-6" },
                                        React.createElement(lucide_react_1.Mail, { className: "w-8 h-8 text-purple-600" }),
                                        React.createElement("h3", { className: "text-2xl font-semibold" }, "Email Support")),
                                    React.createElement("p", { className: "text-muted-foreground mb-6 text-lg" }, "For general inquiries and support requests"),
                                    React.createElement("a", { href: "mailto:support@inkly.com", className: "text-purple-600 hover:text-purple-700 font-medium text-lg" }, "support@inkly.com"))),
                            React.createElement(card_1.Card, { className: "border-0 shadow-lg" },
                                React.createElement(card_1.CardContent, { className: "p-8" },
                                    React.createElement("div", { className: "flex items-center gap-4 mb-6" },
                                        React.createElement(lucide_react_1.Users, { className: "w-8 h-8 text-purple-600" }),
                                        React.createElement("h3", { className: "text-2xl font-semibold" }, "Community")),
                                    React.createElement("p", { className: "text-muted-foreground mb-6 text-lg" }, "Join our community discussions and get help from other users"),
                                    React.createElement(button_1.Button, { variant: "outline", className: "w-full py-4 text-lg bg-transparent" },
                                        "Join Community",
                                        React.createElement(lucide_react_1.ExternalLink, { className: "w-5 h-5 ml-2" })))),
                            React.createElement("div", { className: "text-muted-foreground space-y-4" },
                                React.createElement("p", { className: "text-lg" },
                                    React.createElement("strong", null, "Response Time:"),
                                    " We typically respond within 24 hours"),
                                React.createElement("p", { className: "text-lg" },
                                    React.createElement("strong", null, "Support Hours:"),
                                    " Monday - Friday, 9 AM - 6 PM PST")))))),
            React.createElement("section", { className: "py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 w-full", "aria-labelledby": "policies-heading" },
                React.createElement("div", { className: "max-w-6xl mx-auto" },
                    React.createElement(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "text-center mb-16" },
                        React.createElement("h2", { id: "policies-heading", className: "text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6" }, "Policies & Legal"),
                        React.createElement("p", { className: "text-lg sm:text-xl text-muted-foreground" }, "Important information about using Inkly")),
                    React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8" }, policies.map(function (policy, index) { return (React.createElement(framer_motion_1.motion.div, { key: policy.title, initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: index * 0.1 }, viewport: { once: true } },
                        React.createElement(card_1.Card, { className: "h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer border-0 bg-white dark:bg-gray-800" },
                            React.createElement(card_1.CardContent, { className: "p-6" },
                                React.createElement("div", { className: "text-center" },
                                    React.createElement(lucide_react_1.Shield, { className: "w-12 h-12 text-purple-600 mx-auto mb-4" }),
                                    React.createElement("h3", { className: "text-xl font-semibold text-foreground mb-3" }, policy.title),
                                    React.createElement("p", { className: "text-muted-foreground mb-6" }, policy.description),
                                    React.createElement("div", { className: "flex items-center justify-center text-purple-600 dark:text-purple-400 font-medium" },
                                        "Read More",
                                        React.createElement(lucide_react_1.ChevronRight, { className: "w-4 h-4 ml-1", "aria-hidden": "true" }))))))); }))))),
        React.createElement(BottomNav, null)));
}
exports["default"] = HelpPage;
