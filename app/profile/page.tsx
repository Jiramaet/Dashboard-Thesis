"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Navbar from "@/components/navbar"
import { User, Mail, Shield, Calendar, Edit, Save, X } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  role: string
  joinDate?: string
  department?: string
  studentId?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<UserProfile>({
    name: "",
    email: "",
    role: "",
    department: "",
    studentId: "",
  })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    // Add mock additional data
    const fullUser = {
      ...parsedUser,
      joinDate: "January 2024",
      department: parsedUser.role === "student" ? "Computer Science" : "Engineering",
      studentId: parsedUser.role === "student" ? "CS2024001" : undefined,
    }

    setUser(fullUser)
    setEditForm(fullUser)
  }, [router])

  const handleSave = () => {
    if (user) {
      const updatedUser = { ...user, ...editForm }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setEditForm(user)
    }
    setIsEditing(false)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <motion.div
        className="container mx-auto px-4 py-8 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            className="lg:col-span-1"
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
          >
            <Card className="rounded-2xl border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-heading font-bold text-foreground mb-2">{user.name}</h2>
                <p className="text-muted-foreground mb-4">{user.email}</p>
                <Badge className="mb-4 capitalize bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  {user.role}
                </Badge>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {user.joinDate}</span>
                  </div>
                  {user.department && (
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  {user.studentId && (
                    <div className="flex items-center justify-center gap-2">
                      <User className="h-4 w-4" />
                      <span>ID: {user.studentId}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="rounded-2xl border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="font-heading">Personal Information</CardTitle>
                  <CardDescription>Update your personal details and information</CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={handleCancel} variant="outline" size="sm">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <motion.div
                        whileFocus={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        />
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <motion.div
                        whileFocus={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          id="email"
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        />
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    {isEditing ? (
                      <motion.div
                        whileFocus={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                        transition={{ duration: 0.2 }}
                      >
                        <Input
                          id="department"
                          value={editForm.department || ""}
                          onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                          className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                        />
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span>{user.department || "Not specified"}</span>
                      </div>
                    )}
                  </div>

                  {user.role === "student" && (
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      {isEditing ? (
                        <motion.div
                          whileFocus={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)" }}
                          transition={{ duration: 0.2 }}
                        >
                          <Input
                            id="studentId"
                            value={editForm.studentId || ""}
                            onChange={(e) => setEditForm({ ...editForm, studentId: e.target.value })}
                            className="focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                          />
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{user.studentId || "Not specified"}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{user.joinDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Information */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="rounded-2xl border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="font-heading">Account Statistics</CardTitle>
              <CardDescription>Your activity and engagement overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {user.role === "student" ? "3" : user.role === "advisor" ? "12" : "156"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.role === "student" ? "Submissions" : user.role === "advisor" ? "Students" : "Total Users"}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {user.role === "student" ? "2" : user.role === "advisor" ? "8" : "89"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.role === "student" ? "Approved" : user.role === "advisor" ? "Completed" : "Total Theses"}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {user.role === "student" ? "5" : user.role === "advisor" ? "3" : "12"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.role === "student" ? "Feedback" : "This Month"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
