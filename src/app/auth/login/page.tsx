"use client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Github, Calendar} from "lucide-react"
import { useState } from "react";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // auth logic
        console.log("Login with", email);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
        {/* Section gauche - Image */}
        <div className="hidden lg:flex lg:flex-col lg:justify-end relative bg-zinc-900">
          <div className="absolute inset-0">
            <img 
              src="/images/auth/login-background.jpg" 
              alt="Login background"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 p-8 flex flex-col justify-end h-full">
            <blockquote className="text-white text-xl font-medium">
              "Cette bibliothèque de calendrier m'a fait gagner énormément de temps et m'a aidé à livrer 
              des designs époustouflants à mes clients plus rapidement que jamais."
            </blockquote>
            <cite className="text-white/80 text-sm mt-2">
              Sofia Davis
            </cite>
          </div>
        </div>

        {/* Section droite - Formulaire */}
        <div className="flex flex-col">
        {/* Navigation */}
        <nav className="flex items-center justify-between p-6">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span className="font-semibold">CalendApp</span>
          </Link>
          <Link href="/auth/register">
            <Button variant="ghost" size="sm">
              S'inscrire
            </Button>
          </Link>
        </nav>

                {/* Formulaire centré */}
                <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Bon retour
              </h1>
              <p className="text-sm text-muted-foreground">
                Entrez votre email pour vous connecter à votre compte
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nom@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Connexion..." : "Se connecter avec Email"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Ou continuer avec
                  </span>
                </div>
              </div>

              <Button variant="outline" className="w-full" type="button">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </form>

            <p className="px-8 text-center text-xs text-muted-foreground">
              En cliquant continuer, vous acceptez nos{" "}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Conditions d'utilisation
              </Link>{" "}
              et notre{" "}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Politique de confidentialité
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
    )
}
