"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

interface User {
  id?: number;
  firstName: string;
  lastName: string;
  emailId: string;
}

export default function TestUserForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; user?: User } | null>(null);
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      // Utiliser le template JWT configuré "spring_backend"
      const token = await getToken({ template: "spring_backend" });
      
      if (!token) {
        setResult({
          success: false,
          message: "Impossible d'obtenir le token d'authentification du template spring_backend"
        });
        return;
      }
      
      console.log("Token spring_backend obtenu:", token ? "✅ Oui" : "❌ Non");
      
      // Appel à l'API Spring Boot
      const response = await fetch("http://localhost:8080/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      console.log("Réponse API:", response.status, response.statusText);

      if (response.ok) {
        const createdUser = await response.json();
        setResult({
          success: true,
          message: `Utilisateur créé avec succès ! ID: ${createdUser.id}`,
          user: createdUser
        });
        // Reset form
        setFormData({ firstName: "", lastName: "", emailId: "" });
      } else {
        const errorText = await response.text();
        setResult({
          success: false,
          message: `Erreur ${response.status}: ${errorText || "Échec de création"}`
        });
      }
    } catch (error: any) {
      console.error("Erreur complète:", error);
      setResult({
        success: false,
        message: `Erreur de connexion: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        🧪 Test Backend - Créer Utilisateur
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Prénom
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Jean"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nom
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: Dupont"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            name="emailId"
            value={formData.emailId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Ex: jean.dupont@example.com"
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? "Création en cours..." : "Créer Utilisateur"}
        </Button>
      </form>

      {/* Résultat */}
      {result && (
        <div className={`mt-6 p-4 rounded-lg ${
          result.success 
            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200" 
            : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
        }`}>
          <p className="font-medium">
            {result.success ? "✅ Succès" : "❌ Erreur"}
          </p>
          <p className="text-sm mt-1">{result.message}</p>
          {result.user && (
            <div className="mt-2 text-xs">
              <p><strong>Données créées:</strong></p>
              <pre className="mt-1 bg-black/10 p-2 rounded text-xs">
                {JSON.stringify(result.user, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p><strong>Test de connexion:</strong></p>
        <p>• Backend: http://localhost:8080/api/v1/users</p>
        <p>• Méthode: POST avec authentification Clerk</p>
        <p>• Ce formulaire teste la communication avec votre API Spring Boot</p>
      </div>
    </div>
  );
} 