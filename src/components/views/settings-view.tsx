"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  name: "Sophie Martin",
  email: "sophie.martin@example.com",
  avatar: "/api/placeholder/100/100",
  role: "Chef de projet",
  department: "Marketing",
  timezone: "Europe/Paris",
  language: "Français",
};

// Sync integrations data with official logos (using placeholder URLs for demo)
const syncIntegrations = [
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Synchronisez vos réunions Teams avec votre calendrier",
    logo: "https://img.icons8.com/color/96/microsoft-teams.png",
    connected: true,
    lastSync: "Il y a 2 minutes",
    features: ["Réunions", "Statut", "Calendrier"],
  },
  {
    id: "google",
    name: "Google Calendar",
    description: "Synchronisation bidirectionnelle avec Google Calendar",
    logo: "https://img.icons8.com/color/96/google-calendar.png",
    connected: true,
    lastSync: "Il y a 5 minutes",
    features: ["Événements", "Rappels", "Invitations"],
  },
  {
    id: "notion",
    name: "Notion Calendar",
    description: "Intégrez vos tâches et événements Notion",
    logo: "https://img.icons8.com/color/96/notion.png",
    connected: false,
    lastSync: "Jamais",
    features: ["Tâches", "Bases de données", "Templates"],
  },
  {
    id: "slack",
    name: "Slack",
    description: "Recevez des notifications et gérez vos statuts",
    logo: "https://img.icons8.com/color/96/slack-new.png",
    connected: true,
    lastSync: "Il y a 1 minute",
    features: ["Notifications", "Statut", "Canaux"],
  },
];

export default function SettingsView() {
  const [activeSection, setActiveSection] = useState("profile");
  const [settings, setSettings] = useState({
    // Profile settings
    name: mockUser.name,
    email: mockUser.email,
    bio: "Passionnée par la gestion de projet et l'innovation digitale.",
    timezone: mockUser.timezone,
    language: mockUser.language,
    
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
    workingHours: { start: "09:00", end: "18:00" },
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
    compactMode: false,
    animations: true,
    
    // Data & Privacy
    dataExport: false,
    analytics: true,
    crashReports: true,
  });

  const settingSections = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "calendar", label: "Calendrier", icon: Calendar },
    { id: "integrations", label: "Intégrations", icon: Zap },
    { id: "privacy", label: "Confidentialité", icon: Shield },
    { id: "appearance", label: "Apparence", icon: Palette },
    { id: "data", label: "Données", icon: Database },
  ];

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informations personnelles
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
              <AvatarFallback>{mockUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Changer la photo
              </Button>
              <p className="text-sm text-gray-500 mt-1">
                JPG, PNG ou GIF. Taille maximale : 2MB
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => updateSetting("name", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => updateSetting("email", e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              value={settings.bio}
              onChange={(e) => updateSetting("bio", e.target.value)}
              placeholder="Parlez-nous de vous..."
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Select value={settings.timezone} onValueChange={(value) => updateSetting("timezone", value)}>
                <SelectTrigger>
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
              <Label htmlFor="language">Langue</Label>
              <Select value={settings.language} onValueChange={(value) => updateSetting("language", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Français">Français</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Español">Español</SelectItem>
                  <SelectItem value="Deutsch">Deutsch</SelectItem>
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
          Préférences de notification
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications par email</Label>
              <p className="text-sm text-gray-500">Recevez des emails pour les événements importants</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications push</Label>
              <p className="text-sm text-gray-500">Notifications sur votre appareil mobile</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => updateSetting("pushNotifications", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifications desktop</Label>
              <p className="text-sm text-gray-500">Notifications sur votre navigateur</p>
            </div>
            <Switch
              checked={settings.desktopNotifications}
              onCheckedChange={(checked) => updateSetting("desktopNotifications", checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rappels d'événements</Label>
              <p className="text-sm text-gray-500">Rappels 15 minutes avant vos événements</p>
            </div>
            <Switch
              checked={settings.eventReminders}
              onCheckedChange={(checked) => updateSetting("eventReminders", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mises à jour d'équipe</Label>
              <p className="text-sm text-gray-500">Changements dans vos équipes et projets</p>
            </div>
            <Switch
              checked={settings.teamUpdates}
              onCheckedChange={(checked) => updateSetting("teamUpdates", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Digest hebdomadaire</Label>
              <p className="text-sm text-gray-500">Résumé de votre semaine chaque lundi</p>
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
          Préférences du calendrier
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weekStart">La semaine commence le</Label>
              <Select value={settings.weekStartsOn} onValueChange={(value) => updateSetting("weekStartsOn", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Lundi</SelectItem>
                  <SelectItem value="sunday">Dimanche</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="defaultView">Vue par défaut</Label>
              <Select value={settings.defaultView} onValueChange={(value) => updateSetting("defaultView", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Jour</SelectItem>
                  <SelectItem value="week">Semaine</SelectItem>
                  <SelectItem value="month">Mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-base">Heures de travail</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="workStart" className="text-sm">Début</Label>
                <Input
                  id="workStart"
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) => updateSetting("workingHours", {...settings.workingHours, start: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="workEnd" className="text-sm">Fin</Label>
                <Input
                  id="workEnd"
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) => updateSetting("workingHours", {...settings.workingHours, end: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Afficher les week-ends</Label>
              <p className="text-sm text-gray-500">Samedi et dimanche dans la vue calendrier</p>
            </div>
            <Switch
              checked={settings.showWeekends}
              onCheckedChange={(checked) => updateSetting("showWeekends", checked)}
            />
          </div>
          
          <div>
            <Label htmlFor="timeFormat">Format d'heure</Label>
            <Select value={settings.timeFormat} onValueChange={(value) => updateSetting("timeFormat", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12h">12 heures (AM/PM)</SelectItem>
                <SelectItem value="24h">24 heures</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Accepter automatiquement les réunions</Label>
              <p className="text-sm text-gray-500">Accepter les invitations de votre équipe</p>
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
          Synchronisation avec d'autres applications
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Connectez vos outils favoris pour une expérience unifiée
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
                          Connecté
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <X className="h-3 w-3 mr-1" />
                          Déconnecté
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {integration.description}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Dernière sync: {integration.lastSync}</span>
                      <div className="flex items-center space-x-1">
                        <span>Fonctionnalités:</span>
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
                      Synchroniser
                    </Button>
                  )}
                  <Button 
                    variant={integration.connected ? "outline" : "default"} 
                    size="sm"
                  >
                    {integration.connected ? "Déconnecter" : "Connecter"}
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
          Confidentialité et sécurité
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="profileVisibility">Visibilité du profil</Label>
            <Select value={settings.profileVisibility} onValueChange={(value) => updateSetting("profileVisibility", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="team">Équipe uniquement</SelectItem>
                <SelectItem value="private">Privé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="calendarsVisibility">Visibilité des calendriers</Label>
            <Select value={settings.calendarsVisibility} onValueChange={(value) => updateSetting("calendarsVisibility", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="team">Équipe uniquement</SelectItem>
                <SelectItem value="private">Privé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Authentification à deux facteurs</Label>
              <p className="text-sm text-gray-500">Sécurisez votre compte avec 2FA</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
            />
          </div>
          
          <div>
            <Label htmlFor="sessionTimeout">Expiration de session (minutes)</Label>
            <Select value={settings.sessionTimeout} onValueChange={(value) => updateSetting("sessionTimeout", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
                <SelectItem value="240">4 heures</SelectItem>
                <SelectItem value="never">Jamais</SelectItem>
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
          Apparence et thème
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="theme">Thème</Label>
            <Select value={settings.theme} onValueChange={(value) => updateSetting("theme", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center">
                    <Sun className="h-4 w-4 mr-2" />
                    Clair
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center">
                    <Moon className="h-4 w-4 mr-2" />
                    Sombre
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center">
                    <Laptop className="h-4 w-4 mr-2" />
                    Système
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="accentColor">Couleur d'accent</Label>
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
              <Label>Mode compact</Label>
              <p className="text-sm text-gray-500">Interface plus dense avec moins d'espacement</p>
            </div>
            <Switch
              checked={settings.compactMode}
              onCheckedChange={(checked) => updateSetting("compactMode", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Animations</Label>
              <p className="text-sm text-gray-500">Transitions et animations dans l'interface</p>
            </div>
            <Switch
              checked={settings.animations}
              onCheckedChange={(checked) => updateSetting("animations", checked)}
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
          Gestion des données
        </h3>
        <div className="space-y-4">
          <Card className="p-4 border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
            <div className="flex items-start space-x-3">
              <Download className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                  Exporter mes données
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                  Téléchargez toutes vos données personnelles au format JSON
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  <Download className="h-4 w-4 mr-2" />
                  Créer l'export
                </Button>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-start space-x-3">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 dark:text-red-100">
                  Supprimer mon compte
                </h4>
                <p className="text-sm text-red-700 dark:text-red-200 mt-1">
                  Cette action est irréversible. Toutes vos données seront supprimées.
                </p>
                <Button variant="destructive" size="sm" className="mt-3">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer le compte
                </Button>
              </div>
            </div>
          </Card>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Données d'utilisation anonymes</Label>
              <p className="text-sm text-gray-500">Aidez-nous à améliorer l'application</p>
            </div>
            <Switch
              checked={settings.analytics}
              onCheckedChange={(checked) => updateSetting("analytics", checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Rapports de crash</Label>
              <p className="text-sm text-gray-500">Envoi automatique des erreurs pour résolution</p>
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
          Paramètres
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Personnalisez votre expérience et gérez vos préférences
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
                Annuler
              </Button>
              <Button>
                Sauvegarder les modifications
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
