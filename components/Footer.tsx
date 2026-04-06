"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 pb-12 border-b border-gray-700">
          <div>
            <div className="text-3xl font-bold text-blue-400">5K+</div>
            <div className="text-sm text-gray-400 mt-1">GitHub Stars</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">50K+</div>
            <div className="text-sm text-gray-400 mt-1">Users</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">100+</div>
            <div className="text-sm text-gray-400 mt-1">Roadmaps</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400">24/7</div>
            <div className="text-sm text-gray-400 mt-1">AI Support</div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/explore" className="hover:text-white">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Guides
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Social</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400">
                <Github size={20} />
              </a>
              <a href="#" className="hover:text-blue-400">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-400">
                <Linkedin size={20} />
              </a>
              <a href="#" className="hover:text-blue-400">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2026 RoadmapAI. All rights reserved.</p>
          <p className="mt-4 sm:mt-0">Built with 🚀 for learners everywhere</p>
        </div>
      </div>
    </footer>
  );
}
