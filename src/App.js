import React from 'react';
import Dashboard from './components/Dashboard';
import CreateCompte from './components/CreateCompte';
import CompteList from './components/CompteList';
import { Landmark } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <Landmark className="w-10 h-10 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Gestion de Comptes Bancaires
              </h1>
              <p className="text-sm text-gray-600">
                Application de gestion financière avec GraphQL
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <Dashboard />

        {/* Create Account Form */}
        <div className="mb-8">
          <CreateCompte />
        </div>

        {/* Accounts List */}
        <CompteList />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>© 2024 Gestion de Comptes Bancaires - Propulsé par React & GraphQL</p>
        </div>
      </footer>
    </div>
  );
}

export default App;