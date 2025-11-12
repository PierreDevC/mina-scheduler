"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/contexts/preferences-context";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Settings,
  User,
  Bell,
  Calendar,
  Shield,
  Palette,
  Globe,
  Smartphone,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  ExternalLink,
  RefreshCw,
  Zap,
  Clock,
  Lock,
  Mail,
  MessageSquare,
  Video,
  FileText,
  Database,
  Monitor,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Mock user data
const mockUser = {
  name: "Pierre Sylvestre Cypré",
  email: "pierre.cypre@example.com",
  avatar: "/api/placeholder/100/100",
  role: "Software Engineer",
  department: "Development",
  timezone: "America/New_York",
  language: "English",
};

// Sync integrations data with official logos (using placeholder URLs for demo)
const syncIntegrations = [
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Sync your Teams meetings with your calendar",
    logo: "https://img.icons8.com/color/96/microsoft-teams.png",
    connected: true,
    lastSync: "2 minutes ago",
    features: ["Meetings", "Status", "Calendar"],
  },
  {
    id: "google",
    name: "Google Calendar",
    description: "Bidirectional sync with Google Calendar",
    logo: "https://img.icons8.com/color/96/google-calendar.png",
    connected: true,
    lastSync: "5 minutes ago",
    features: ["Events", "Reminders", "Invitations"],
  },
  {
    id: "notion",
    name: "Notion Calendar",
    description: "Integrate your Notion tasks and events",
    logo: "https://img.icons8.com/color/96/notion.png",
    connected: false,
    lastSync: "Never",
    features: ["Tasks", "Databases", "Templates"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Receive notifications and manage your status",
    logo: "https://img.icons8.com/color/96/slack-new.png",
    connected: true,
    lastSync: "1 minute ago",
    features: ["Notifications", "Status", "Channels"],
  },
];

export default function SettingsView() {
  const [activeSection, setActiveSection] = useState("profile");
  const { animationsEnabled, setAnimationsEnabled } = usePreferences();
  const [settings, setSettings] = useState({
    // Profile settings
    name: mockUser.name,
    email: mockUser.email,
    bio: "Passionate about project management and digital innovation.",
    timezone: mockUser.timezone,
    language: "English",

    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    desktopNotifications: false,
    eventReminders: true,
    teamUpdates: true,
    weeklyDigest: true,

    // Calendar preferences
    weekStartsOn: "monday",
    defaultView: "week",
    showWeekends: true,
    timeFormat: "24h",
    autoAcceptMeetings: false,

    // Privacy & Security
    profileVisibility: "team",
    calendarsVisibility: "private",
    twoFactorAuth: false,
    sessionTimeout: "30",

    // Appearance
    theme: "system",
    accentColor: "blue",

    // Data & Privacy
    dataExport: false,
    analytics: true,
    crashReports: true,
  });

  const settingSections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "data", label: "Data", icon: Database },
  ];

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Personal Information
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Change photo
              </Button>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG or GIF. Maximum size: 2MB
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                className="mt-2"
                id="name"
                value={settings.name}
                onChange={(e) => updateSetting("name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                className="mt-2"
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting("email", e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              className="mt-2"
              id="bio"
              value={settings.bio}
              onChange={(e) => updateSetting("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Paris">Europe/Paris (GMT+1)</SelectItem>
                  <SelectItem value="Europe/London">Europe/London (GMT+0)</SelectItem>
                  <SelectItem value="America/New_York">America/New_York (GMT-5)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Français">French</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Español">Spanish</SelectItem>
                  <SelectItem value="Deutsch">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email notifications</Label>
              <p className="text-sm text-gray-500">Receive emails for important events</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push notifications</Label>
              <p className="text-sm text-gray-500">Notifications on your mobile device</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Desktop notifications</Label>
              <p className="text-sm text-gray-500">Notifications in your browser</p>
            </div>
            <Switch
              checked={settings.desktopNotifications}
              onCheckedChange={(checked) => updateSetting("desktopNotifications", checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Event reminders</Label>
              <p className="text-sm text-gray-500">Reminders 15 minutes before your events</p>
            </div>
            <Switch
              checked={settings.eventReminders}
              onCheckedChange={(checked) => updateSetting("eventReminders", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Team updates</Label>
              <p className="text-sm text-gray-500">Changes in your teams and projects</p>
            </div>
            <Switch
              checked={settings.teamUpdates}
              onCheckedChange={(checked) => updateSetting("teamUpdates", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly digest</Label>
              <p className="text-sm text-gray-500">Summary of your week every Monday</p>
            </div>
            <Switch
              checked={settings.weeklyDigest}
              onCheckedChange={(checked) => updateSetting("weeklyDigest", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCalendarSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Calendar Preferences
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weekStart">Week starts on</Label>
              <Select value={settings.weekStartsOn} onValueChange={(value) => updateSetting("weekStartsOn", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="defaultView">Default view</Label>
              <Select value={settings.defaultView} onValueChange={(value) => updateSetting("defaultView", value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show weekends</Label>
              <p className="text-sm text-gray-500">Saturday and Sunday in calendar view</p>
            </div>
            <Switch
              checked={settings.showWeekends}
              onCheckedChange={(checked) => updateSetting("showWeekends", checked)}
            />
          </div>
          
          <div>
            <Label htmlFor="timeFormat">Time format</Label>
            <Select value={settings.timeFormat} onValueChange={(value) => updateSetting("timeFormat", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12 hours (AM/PM)</SelectItem>
                <SelectItem value="24h">24 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-accept meetings</Label>
              <p className="text-sm text-gray-500">Accept invitations from your team</p>
            </div>
            <Switch
              checked={settings.autoAcceptMeetings}
              onCheckedChange={(checked) => updateSetting("autoAcceptMeetings", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Sync with other applications
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Connect your favorite tools for a unified experience
        </p>
        
        <div className="space-y-4">
          {syncIntegrations.map((integration) => (
            <Card key={integration.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img 
                    src={integration.logo} 
                    alt={integration.name}
                    className="w-12 h-12 rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {integration.name}
                      </h4>
                      {integration.connected ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <Check className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <X className="h-3 w-3 mr-1" />
                          Disconnected
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {integration.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Last sync: {integration.lastSync}</span>
                      <div className="flex items-center space-x-1">
                        <span>Features:</span>
                        {integration.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {integration.connected && (
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Sync
                    </Button>
                  )}
                  <Button 
                    variant={integration.connected ? "outline" : "default"} 
                    size="sm"
                  >
                    {integration.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Privacy and Security
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="profileVisibility">Profile visibility</Label>
            <Select value={settings.profileVisibility} onValueChange={(value) => updateSetting("profileVisibility", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="team">Team only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="calendarsVisibility">Calendar visibility</Label>
            <Select value={settings.calendarsVisibility} onValueChange={(value) => updateSetting("calendarsVisibility", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="team">Team only</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-factor authentication</Label>
              <p className="text-sm text-gray-500">Secure your account with 2FA</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
            />
          </div>
          
          <div>
            <Label htmlFor="sessionTimeout">Session timeout (minutes)</Label>
            <Select value={settings.sessionTimeout} onValueChange={(value) => updateSetting("sessionTimeout", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Appearance and Theme
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center">
                    <Laptop className="h-4 w-4 mr-2" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="accentColor">Accent color</Label>
            <div className="flex items-center space-x-2 mt-2">
              {["blue", "green", "purple", "red", "orange", "pink"].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 ${
                    settings.accentColor === color ? "border-gray-900 dark:border-white" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateSetting("accentColor", color)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Animations</Label>
              <p className="text-sm text-gray-500">Enable to have a more interactive interface</p>
            </div>
            <Switch
              checked={animationsEnabled}
              onCheckedChange={(checked) => {
                setAnimationsEnabled(checked);
                toast(checked ? "Animations enabled" : "Animations disabled", {
                  duration: 2000,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Data Management
        </h3>
        <div className="space-y-4">
          <Card className="p-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                  Export my data
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                  Download all your personal data in JSON format
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  <Download className="h-4 w-4 mr-2" />
                  Create export
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-start space-x-3">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 dark:text-red-100">
                  Delete my account
                </h4>
                <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                  This action is irreversible. All your data will be deleted.
                </p>
                <Button variant="destructive" size="sm" className="mt-3">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete account
                </Button>
              </div>
            </div>
          </Card>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Anonymous usage data</Label>
              <p className="text-sm text-gray-500">Help us improve the application</p>
            </div>
            <Switch
              checked={settings.analytics}
              onCheckedChange={(checked) => updateSetting("analytics", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Crash reports</Label>
              <p className="text-sm text-gray-500">Automatic error reports for resolution</p>
            </div>
            <Switch
              checked={settings.crashReports}
              onCheckedChange={(checked) => updateSetting("crashReports", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Customize your experience and manage your preferences
        </p>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <motion.div variants={itemVariants} className="lg:w-1/4">
          <Card className="p-4">
            <nav className="space-y-2">
              {settingSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? "bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </Card>
        </motion.div>

        {/* Settings Content */}
        <motion.div variants={itemVariants} className="lg:w-3/4">
          <Card className="p-6">
            {activeSection === "profile" && renderProfileSection()}
            {activeSection === "notifications" && renderNotificationsSection()}
            {activeSection === "calendar" && renderCalendarSection()}
            {activeSection === "integrations" && renderIntegrationsSection()}
            {activeSection === "privacy" && renderPrivacySection()}
            {activeSection === "appearance" && renderAppearanceSection()}
            {activeSection === "data" && renderDataSection()}
            
            <Separator className="my-6" />
            
            <div className="flex justify-end space-x-4">
              <Button variant="outline">
                Cancel
              </Button>
              <Button>
                Save changes
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
