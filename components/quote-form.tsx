"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function QuoteForm() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [dialogType, setDialogType] = useState<"success" | "error">("success")
  const [dialogMessage, setDialogMessage] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceArea: "",
    serviceType: "",
    propertyType: "",
    squareFootage: "",
    adults: "",
    kids: "",
    pets: "",
    serviceLevel: "",
    kitchens: "",
    fullBathrooms: "",
    halfBathrooms: "",
    walkInShowers: "",
    largeOvalTubs: "",
    doubleSinks: "",
    basement: "",
    dusting: "",
    comments: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      serviceArea: "",
      serviceType: "",
      propertyType: "",
      squareFootage: "",
      adults: "",
      kids: "",
      pets: "",
      serviceLevel: "",
      kitchens: "",
      fullBathrooms: "",
      halfBathrooms: "",
      walkInShowers: "",
      largeOvalTubs: "",
      doubleSinks: "",
      basement: "",
      dusting: "",
      comments: "",
    })
    if (formRef.current) {
      formRef.current.reset()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const quoteResponse = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!quoteResponse.ok) throw new Error("Failed to save quote")

      const emailResponse = await fetch("/api/quote-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!emailResponse.ok) {
        console.warn("Email notification failed, but quote was saved")
      }

      setDialogType("success")
      setDialogMessage(
        "Thank you! Your quote request has been submitted successfully. We'll review it and contact you soon."
      )
      setShowDialog(true)

      resetForm()

      toast({
        title: "Quote Submitted",
        description: "Thank you! We'll review your quote request and contact you soon.",
      })
    } catch (error) {
      setDialogType("error")
      setDialogMessage("Failed to submit quote. Please try again or contact us directly.")
      setShowDialog(true)

      toast({
        title: "Error",
        description: "Failed to submit quote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card className="border-sky-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50 border-b border-sky-100">
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-700 via-sky-600 to-cyan-500 bg-clip-text text-transparent">
            Contact Info
          </CardTitle>
          <CardDescription>Provide your contact information</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sky-700 font-medium">
                    Name (Optional)
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="border-sky-100 focus:border-sky-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sky-700 font-medium">
                    Address (Optional)
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Your address"
                    className="border-sky-100 focus:border-sky-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sky-700 font-medium">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone"
                    className="border-sky-100 focus:border-sky-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sky-700 font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                    className="border-sky-100 focus:border-sky-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceArea" className="text-sky-700 font-medium">
                    Service Area <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.serviceArea}
                    onValueChange={(value) => handleSelectChange("serviceArea", value)}
                  >
                    <SelectTrigger className="border-sky-100 focus:border-sky-400">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ottawa">Ottawa</SelectItem>
                      <SelectItem value="gatineau">Gatineau</SelectItem>
                      <SelectItem value="kanata">Kanata</SelectItem>
                      <SelectItem value="barrhaven">Barrhaven</SelectItem>
                      <SelectItem value="nepean">Nepean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* About Your Family */}
            <div className="space-y-4 pt-6 border-t border-sky-100">
              <h3 className="text-lg font-semibold text-sky-700">About Your Family</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: "adults", label: "Adults" },
                  { id: "kids", label: "Kids" },
                  { id: "pets", label: "Pets" },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-sky-700 font-medium">
                      {field.label} <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData[field.id as keyof typeof formData]}
                      onValueChange={(value) => handleSelectChange(field.id, value)}
                    >
                      <SelectTrigger className="border-sky-100 focus:border-sky-400">
                        <SelectValue placeholder={`Please select number of ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>

            {/* About Your House */}
            <div className="space-y-4 pt-6 border-t border-sky-100">
              <h3 className="text-lg font-semibold text-sky-700">About Your House</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="serviceLevel" className="text-sky-700 font-medium">
                    Service Level <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.serviceLevel}
                    onValueChange={(value) => handleSelectChange("serviceLevel", value)}
                  >
                    <SelectTrigger className="border-sky-100 focus:border-sky-400">
                      <SelectValue placeholder="Please select your service level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="deep-clean">Deep Clean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="squareFootage" className="text-sky-700 font-medium">
                    Area of House/Apt <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="squareFootage"
                    name="squareFootage"
                    placeholder="Square footage"
                    value={formData.squareFootage}
                    onChange={handleChange}
                    className="border-sky-100 focus:border-sky-400"
                  />
                </div>
              </div>

              {/* Bathrooms and extras */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: "kitchens", label: "Kitchens" },
                  { id: "fullBathrooms", label: "Full Bathrooms" },
                  { id: "halfBathrooms", label: "Half Bathrooms" },
                  { id: "walkInShowers", label: "Walk In Showers" },
                  { id: "largeOvalTubs", label: "Large Oval Tubs" },
                  { id: "doubleSinks", label: "Double Sinks" },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-sky-700 font-medium">
                      {field.label} <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData[field.id as keyof typeof formData]}
                      onValueChange={(value) => handleSelectChange(field.id, value)}
                    >
                      <SelectTrigger className="border-sky-100 focus:border-sky-400">
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {[0, 1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="basement" className="text-sky-700 font-medium">
                    Do Basement <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.basement} onValueChange={(value) => handleSelectChange("basement", value)}>
                    <SelectTrigger className="border-sky-100 focus:border-sky-400">
                      <SelectValue placeholder="Do you want the basement cleaned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dusting" className="text-sky-700 font-medium">
                    Dusting <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.dusting} onValueChange={(value) => handleSelectChange("dusting", value)}>
                    <SelectTrigger className="border-sky-100 focus:border-sky-400">
                      <SelectValue placeholder="Please select time required to dust" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2 pt-6 border-t border-sky-100">
              <Label htmlFor="comments" className="text-sky-700 font-medium">
                Comments
              </Label>
              <Textarea
                id="comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                placeholder="Any additional information or special requests..."
                className="border-sky-100 focus:border-sky-400 min-h-[120px]"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-sky-100">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-500 hover:from-sky-700 hover:via-blue-700 hover:to-cyan-600 text-white font-semibold py-6 text-lg"
              >
                {isLoading ? "Submitting..." : "Get Quote"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className={dialogType === "success" ? "border-green-200" : "border-red-200"}>
          <AlertDialogHeader>
            <AlertDialogTitle className={dialogType === "success" ? "text-green-600" : "text-red-600"}>
              {dialogType === "success" ? "Success!" : "Error"}
            </AlertDialogTitle>
            <AlertDialogDescription>{dialogMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogAction
            onClick={() => setShowDialog(false)}
            className={dialogType === "success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
          >
            {dialogType === "success" ? "Great!" : "Try Again"}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
