"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Mail, Check, X } from "lucide-react"

interface UserProfile {
  fullName: string
  nickName: string
  email: string
  gender: string
  country: string
  language: string
  timeZone: string
  avatar: string
}

export function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "Alexa Rawles",
    nickName: "Alex",
    email: "alexarawles@gmail.com",
    gender: "Female",
    country: "United States",
    language: "English",
    timeZone: "UTC-5 (EST)",
    avatar: "/placeholder.svg?height=80&width=80",
  })

  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "South Korea",
    "Singapore",
    "Vietnam",
  ]

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Korean",
    "Vietnamese",
    "Chinese",
    "Portuguese",
    "Italian",
  ]

  const timeZones = [
    "UTC-12 (Baker Island)",
    "UTC-11 (Samoa)",
    "UTC-10 (Hawaii)",
    "UTC-9 (Alaska)",
    "UTC-8 (PST)",
    "UTC-7 (MST)",
    "UTC-6 (CST)",
    "UTC-5 (EST)",
    "UTC-4 (AST)",
    "UTC-3 (BRT)",
    "UTC-2 (GST)",
    "UTC-1 (Azores)",
    "UTC+0 (GMT)",
    "UTC+1 (CET)",
    "UTC+2 (EET)",
    "UTC+3 (MSK)",
    "UTC+4 (GST)",
    "UTC+5 (PKT)",
    "UTC+6 (BST)",
    "UTC+7 (ICT)",
    "UTC+8 (CST)",
    "UTC+9 (JST)",
    "UTC+10 (AEST)",
    "UTC+11 (NCT)",
    "UTC+12 (NZST)",
  ]

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-border p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {profile.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{profile.fullName}</h1>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700">
                <Check className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="fullName"
                      value={editedProfile.fullName}
                      onChange={(e) => setEditedProfile({ ...editedProfile, fullName: e.target.value })}
                      placeholder="Your First Name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">{profile.fullName}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickName">Nick Name</Label>
                  {isEditing ? (
                    <Input
                      id="nickName"
                      value={editedProfile.nickName}
                      onChange={(e) => setEditedProfile({ ...editedProfile, nickName: e.target.value })}
                      placeholder="Your First Name"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">{profile.nickName}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.gender}
                      onValueChange={(value) => setEditedProfile({ ...editedProfile, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">{profile.gender}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.country}
                      onValueChange={(value) => setEditedProfile({ ...editedProfile, country: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">{profile.country}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.language}
                      onValueChange={(value) => setEditedProfile({ ...editedProfile, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">{profile.language}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeZone">Time Zone</Label>
                  {isEditing ? (
                    <Select
                      value={editedProfile.timeZone}
                      onValueChange={(value) => setEditedProfile({ ...editedProfile, timeZone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeZones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-md text-sm">{profile.timeZone}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Email Addresses */}
          <Card>
            <CardHeader>
              <CardTitle>My email Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{profile.email}</div>
                  <div className="text-xs text-muted-foreground">1 month ago</div>
                </div>
                <Mail className="h-4 w-4 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Account Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">2</div>
                  <div className="text-sm text-muted-foreground">Completed Tours</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">2</div>
                  <div className="text-sm text-muted-foreground">Upcoming Tours</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-sm text-muted-foreground">Favourite Guides</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
