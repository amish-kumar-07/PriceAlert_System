"use client";
import React from 'react';
import Link from 'next/link';
import { NavbarDemo } from './dashboard/_components/navbar';
import {
  Search, Bell, Shield, Smartphone, CheckCircle, Star,
  ArrowRight, Eye, Target, Zap, Users, Mail, Github, Twitter
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const features = [
    { icon: <Search className="h-6 w-6" />, title: "Real-time Price Tracking", description: "Monitor prices across thousands of retailers and marketplaces automatically." },
    { icon: <Bell className="h-6 w-6" />, title: "Instant Email Alerts", description: "Get notified immediately when your tracked products drop to your target price." },
    { icon: <Smartphone className="h-6 w-6" />, title: "Multi-platform Support", description: "Works with Amazon, eBay, Best Buy, Target, and hundreds of other stores." },
    { icon: <Shield className="h-6 w-6" />, title: "Clean Dashboard UI", description: "Beautiful, intuitive interface to manage all your price watches in one place." },
  ];

  const steps = [
    { icon: <Search className="h-8 w-8" />, title: "Search Your Product", description: "Paste any product URL or search by name to find what you want to track." },
    { icon: <Target className="h-8 w-8" />, title: "Set Target Price", description: "Choose your ideal price point and we'll monitor it 24/7 for you." },
    { icon: <Bell className="h-8 w-8" />, title: "Get Instant Alerts", description: "Receive email notifications the moment prices drop to your target." }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson", role: "Smart Shopper",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      content: "I've saved over $500 this year using PriceWatcher! The alerts are instant and accurate.", rating: 5
    },
    {
      name: "Mike Chen", role: "Tech Enthusiast",
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
      content: "Finally found a price tracker that actually works. Clean interface and reliable notifications.", rating: 5
    },
    {
      name: "Emma Wilson", role: "Budget Conscious",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      content: "Love how easy it is to track multiple products. The dashboard makes everything so organized!", rating: 5
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-gray-950 to-black text-white">
      {/* Navbar with blur effect */}
      <div className="w-full flex justify-evenly items-center px-4 sm:px-6 lg:px-8 py-4 shadow-sm bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <NavbarDemo />
      </div>


      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
          Track Your Favorite Products.
          <span className="block text-indigo-500">Get Notified When Prices Drop.</span>
        </h1>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
          Never miss a deal again. PriceWatcher monitors millions of products across the web and alerts you instantly when prices hit your target.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signin" className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-xl font-semibold transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg">
            <span>Start Tracking For Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <a href="#how-it-works" className="text-indigo-400 hover:text-indigo-300 px-8 py-4 font-semibold flex items-center space-x-2">
            <span>See How It Works</span>
            <Eye className="h-5 w-5" />
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-6 py-12">
        {[
          { label: "Products Tracked", value: "2M+", color: "text-indigo-400" },
          { label: "Money Saved", value: "$50M+", color: "text-green-400" },
          { label: "Happy Users", value: "100K+", color: "text-yellow-400" }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl text-center">
            <div className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
            <div className="text-gray-400">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section id="features" className="w-full bg-black/80 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">Everything You Need to Save Money</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-xl hover:border-indigo-500 transition">
                <div className="bg-indigo-600 w-12 h-12 flex items-center justify-center rounded-lg mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-black to-gray-900 w-full">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <span className="text-sm text-indigo-400 mb-2">STEP {i + 1}</span>
                <h3 className="text-white font-bold text-xl mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="w-full bg-black/80 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Loved by Smart Shoppers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="text-yellow-400 w-5 h-5" />
                  ))}
                </div>
                <p className="text-gray-300 italic mb-4">"{t.content}"</p>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} className="w-12 h-12 rounded-full" />
                  <div>
                    <div className="text-white font-semibold">{t.name}</div>
                    <div className="text-sm text-gray-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20 w-full text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Saving?</h2>
        <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
          Join over 100,000 smart shoppers who never pay full price. Start tracking your first product today.
        </p>
        <Link href="/signin" className="bg-white text-indigo-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 inline-flex items-center space-x-2 shadow-lg transition-all transform hover:scale-105">
          <span>Get Started</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 w-full">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="h-6 w-6 text-indigo-500" />
              <span className="text-xl font-bold">PriceWatcher</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              The smartest way to track product prices and get instant alerts when they drop.
            </p>
            <div className="flex gap-4">
              <Twitter className="text-gray-400 hover:text-white" />
              <Github className="text-gray-400 hover:text-white" />
              <Mail className="text-gray-400 hover:text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              <li><a href="#" className="hover:text-white">Pricing</a></li>
              <li><a href="#" className="hover:text-white">API</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
              <li><a href="#" className="hover:text-white">Privacy</a></li>
              <li><a href="#" className="hover:text-white">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-500 mt-10 border-t border-white/10 pt-6">
          © 2024 PriceWatcher. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
