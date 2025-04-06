"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Settings page tabs
const tabs = [
  { id: "account", label: "Account" },
  { id: "customization", label: "Customization" },
  { id: "history", label: "History & Sync" },
  { id: "models", label: "Models" },
  { id: "attachments", label: "Attachments" },
  { id: "contact", label: "Contact Us" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("history");
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-primary-light dark:bg-primary-dark text-text-light dark:text-text-dark">
      {/* Header */}
      <header className="w-full p-4 flex justify-between items-center border-b border-gray-light dark:border-gray-dark sticky top-0 bg-primary-light dark:bg-primary-dark backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 z-10">
        <Link 
          href="/" 
          className="flex items-center text-text-light dark:text-text-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors"
          aria-label="Back to chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Back to Chat</span>
        </Link>
        <button 
          className="flex items-center text-text-light dark:text-text-dark hover:text-secondary-light dark:hover:text-secondary-dark transition-colors" 
          aria-label="Sign out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Sign out</span>
        </button>
      </header>

      <div className="max-w-screen-xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="md:w-1/4">
          <div className="flex flex-col rounded-xl overflow-hidden transition-all duration-300 bg-gradient-to-br from-gray-light/80 to-gray-light dark:from-gray-dark/80 dark:to-gray-dark border border-gray-200/20 dark:border-gray-700/20">
            {/* Profile Header */}
            <div className="flex flex-col items-center p-6 pb-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 ring-4 ring-white/10 dark:ring-black/10">
                <Image
                  src="/placeholder-profile.svg"
                  alt="Profile"
                  width={128}
                  height={128}
                  className="object-cover hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <h2 className="text-xl font-semibold">notshekhar</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">notshekhar@gmail.com</p>
              <div className="px-4 py-1.5 bg-gradient-to-r from-secondary-light to-secondary-light/90 dark:from-secondary-dark dark:to-secondary-dark/90 text-white text-xs font-semibold rounded-full shadow-sm">
                Pro Plan
              </div>
            </div>
            
            {/* Message Usage Section */}
            <div className="w-full p-6 pt-4 border-t border-gray-200/10 dark:border-gray-700/10">
              <div className="flex justify-between items-center text-sm mb-2">
                <p className="font-medium">Message Usage</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-200/50 dark:bg-gray-800/50 px-2 py-0.5 rounded-full">Resets 05/04/2025</p>
              </div>
              
              <div className="space-y-4 mt-3">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-sm font-medium">Standard</p>
                    <p className="text-xs font-medium">4/1500</p>
                  </div>
                  <div className="w-full h-2 bg-gray-300/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                    <div className="h-2 bg-secondary-light dark:bg-secondary-dark rounded-full transition-all duration-500" style={{ width: '30%' }}></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">1496 messages remaining</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">Premium</p>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium">3/100</p>
                  </div>
                  <div className="w-full h-2 bg-gray-300/50 dark:bg-gray-700/50 rounded-full overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: '10%' }}></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">97 messages remaining</p>
                </div>
              </div>
              
              <button className="w-full mt-5 py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200/50 dark:bg-gray-800/30 border border-gray-300/20 dark:border-gray-700/30 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-center group">
                Buy more premium credits
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Keyboard Shortcuts */}
            <div className="w-full p-6 border-t border-gray-200/10 dark:border-gray-700/10">
              <h3 className="text-base font-medium mb-4">Keyboard Shortcuts</h3>
              
              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <p className="text-sm">Search</p>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 text-xs bg-gray-200/70 dark:bg-gray-800/70 rounded-md font-sans font-medium shadow-sm">⌘</kbd>
                    <kbd className="px-2 py-1 text-xs bg-gray-200/70 dark:bg-gray-800/70 rounded-md font-sans font-medium shadow-sm">K</kbd>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm">New Chat</p>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 text-xs bg-gray-200/70 dark:bg-gray-800/70 rounded-md font-sans font-medium shadow-sm">⌘</kbd>
                    <kbd className="px-2 py-1 text-xs bg-gray-200/70 dark:bg-gray-800/70 rounded-md font-sans font-medium shadow-sm">Shift</kbd>
                    <kbd className="px-2 py-1 text-xs bg-gray-200/70 dark:bg-gray-800/70 rounded-md font-sans font-medium shadow-sm">O</kbd>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm">Toggle Sidebar</p>
                  <div className="flex items-center space-x-1">
                    <kbd className="px-2 py-1 text-xs bg-gray-200/70 dark:bg-gray-800/70 rounded-md font-sans font-medium shadow-sm">⌘</kbd>
                    <kbd className="px-2 py-1 text-xs bg-gray-200/70 dark:bg-gray-800/70 rounded-md font-sans font-medium shadow-sm">B</kbd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Settings Content */}
        <div className="md:w-3/4">
          {/* Tabs */}
          <div className="overflow-x-auto md:overflow-visible scrollbar-hide mb-8 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="border-b border-gray-light dark:border-gray-dark min-w-max md:min-w-0">
              <nav className="flex space-x-1 md:space-x-6" aria-label="Settings tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-3 md:px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-secondary-light dark:border-secondary-dark text-secondary-light dark:text-secondary-dark"
                        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-text-light dark:hover:text-text-dark hover:border-gray-300 dark:hover:border-gray-700"
                    }`}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="space-y-12">
            {/* Cloud Sync Section */}
            <section className="rounded-xl overflow-hidden border border-gray-200/20 dark:border-gray-700/20 bg-gradient-to-br from-gray-light/80 to-gray-light dark:from-gray-dark/80 dark:to-gray-dark p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Cloud Sync</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
                    Enable and disable Cloud Sync. Threads will be synced whenever new messages are sent*
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-secondary-light/10 dark:bg-secondary-dark/10 text-secondary-light dark:text-secondary-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <span className="text-sm font-medium mr-4">Enable Cloud Sync</span>
                <button 
                  onClick={() => setCloudSyncEnabled(!cloudSyncEnabled)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-secondary-light focus:ring-offset-2 ${
                    cloudSyncEnabled ? 'bg-secondary-light dark:bg-secondary-dark' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  role="switch"
                  aria-checked={cloudSyncEnabled}
                >
                  <span 
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      cloudSyncEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`} 
                  />
                </button>
              </div>
              
              <button className="flex items-center px-4 py-2.5 text-sm font-medium bg-gray-200/50 dark:bg-gray-800/30 border border-gray-300/20 dark:border-gray-700/30 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light dark:focus:ring-secondary-dark">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Sync Now
              </button>
            </section>
            
            {/* Message History Section */}
            <section className="rounded-xl overflow-hidden border border-gray-200/20 dark:border-gray-700/20 bg-gradient-to-br from-gray-light/80 to-gray-light dark:from-gray-dark/80 dark:to-gray-dark p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Message History</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
                    Save your history as JSON, or import someone else's. Importing will NOT delete existing messages
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-secondary-light/10 dark:bg-secondary-dark/10 text-secondary-light dark:text-secondary-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button className="flex items-center px-4 py-2.5 text-sm font-medium bg-gray-200/50 dark:bg-gray-800/30 border border-gray-300/20 dark:border-gray-700/30 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light dark:focus:ring-secondary-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Import
                </button>
                
                <button className="flex items-center px-4 py-2.5 text-sm font-medium bg-gray-200/50 dark:bg-gray-800/30 border border-gray-300/20 dark:border-gray-700/30 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-light dark:focus:ring-secondary-dark">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" transform="rotate(180, 10, 10)" />
                  </svg>
                  Export
                </button>
              </div>
            </section>
            
            {/* Danger Zone Section */}
            <section className="rounded-xl overflow-hidden border border-red-200/20 dark:border-red-800/20 bg-gradient-to-br from-red-50/80 to-red-50 dark:from-red-950/20 dark:to-red-950/10 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-2 text-red-600 dark:text-red-500">Danger Zone</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl">
                    Permanently delete your history from both your local device and our servers.*
                  </p>
                </div>
                <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <button className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete Chat History
              </button>
              
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-6">
                *The retention policies of our LLM hosting partners may vary.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
