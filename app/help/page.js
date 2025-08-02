"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Search, HelpCircle, Book, MessageCircle, Phone, Mail } from "lucide-react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const faqData = [
    {
      id: "getting-started",
      question: "How do I register a new case?",
      answer:
        "To register a new case, log in to your account and click on 'Register New Case' from your dashboard. Fill out the required information including case type, description, and opposite party details. You can also upload supporting documents.",
      category: "Getting Started",
    },
    {
      id: "case-types",
      question: "What types of cases can be mediated?",
      answer:
        "ResolveIt handles three main types of cases: Family disputes (divorce, custody, inheritance), Business disputes (contracts, partnerships, employment), and Criminal cases (minor offenses, settlements). Each type has specialized mediators.",
      category: "Case Types",
    },
    {
      id: "mediation-process",
      question: "How does the mediation process work?",
      answer:
        "Once your case is registered, it goes through review and is assigned to a qualified mediator. You'll participate in structured mediation sessions (virtual or in-person) to reach a mutually acceptable resolution. The process typically takes 2-6 weeks.",
      category: "Process",
    },
    {
      id: "costs",
      question: "What are the costs involved?",
      answer:
        "ResolveIt offers transparent pricing with no hidden fees. Basic consultation is free, and mediation fees depend on case complexity and duration. Payment plans are available for qualifying cases.",
      category: "Pricing",
    },
    {
      id: "confidentiality",
      question: "Is the mediation process confidential?",
      answer:
        "Yes, all mediation sessions and communications are strictly confidential. Information shared during mediation cannot be used in court proceedings if mediation fails. We follow strict privacy protocols.",
      category: "Privacy",
    },
    {
      id: "agreement",
      question: "Are mediation agreements legally binding?",
      answer:
        "Yes, once both parties sign the mediation agreement, it becomes legally binding and enforceable in court. We provide properly formatted legal documents that meet jurisdictional requirements.",
      category: "Legal",
    },
    {
      id: "timeline",
      question: "How long does mediation typically take?",
      answer:
        "Most cases are resolved within 2-6 weeks, depending on complexity and party cooperation. Simple disputes may resolve in 1-2 sessions, while complex cases might require multiple sessions over several weeks.",
      category: "Timeline",
    },
    {
      id: "virtual-sessions",
      question: "Can mediation sessions be conducted online?",
      answer:
        "Yes, we offer secure virtual mediation sessions through our platform. This includes video conferencing, document sharing, and digital signature capabilities. In-person sessions are also available when preferred.",
      category: "Technology",
    },
  ]

  const contactOptions = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak with our support team",
      contact: "+1 (555) 123-4567",
      hours: "Mon-Fri, 9 AM - 6 PM EST",
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us your questions",
      contact: "support@resolveit.com",
      hours: "Response within 24 hours",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our team",
      contact: "Available on website",
      hours: "Mon-Fri, 9 AM - 6 PM EST",
    },
  ]

  const filteredFAQs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const categories = [...new Set(faqData.map((faq) => faq.category))]

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Help & Support</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions or get in touch with our support team
        </p>
      </div>

      {/* Search */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* FAQ Categories */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="cursor-pointer">
                All Categories
              </Badge>
              {categories.map((category) => (
                <Badge key={category} variant="secondary" className="cursor-pointer">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                {searchQuery
                  ? `Found ${filteredFAQs.length} result${filteredFAQs.length !== 1 ? "s" : ""} for "${searchQuery}"`
                  : "Find answers to the most common questions about ResolveIt"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8">
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or browse all categories</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-2">
                          <span>{faq.question}</span>
                          <Badge variant="outline" className="text-xs">
                            {faq.category}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <a href="/register">Create Account</a>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <a href="/dashboard/cases/new">Register New Case</a>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <a href="/dashboard">View My Cases</a>
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                <a href="/profile">Update Profile</a>
              </Button>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Need more help? Get in touch with our team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contactOptions.map((option, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <option.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{option.title}</h4>
                    <p className="text-sm text-muted-foreground mb-1">{option.description}</p>
                    <p className="text-sm font-medium">{option.contact}</p>
                    <p className="text-xs text-muted-foreground">{option.hours}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Helpful Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Documentation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• User Guide</li>
                  <li>• Mediation Process</li>
                  <li>• Legal Requirements</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Video Tutorials</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Getting Started</li>
                  <li>• Case Registration</li>
                  <li>• Virtual Sessions</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
