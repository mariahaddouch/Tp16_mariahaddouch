import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_COMPTE } from '../graphql/mutations';
import { GET_ALL_COMPTES, GET_TOTAL_SOLDE } from '../graphql/queries';
import { TypeCompte } from '../graphql/types';
import { PlusCircle } from 'lucide-react';

function CreateCompte() {
  const [solde, setSolde] = useState('');
  const [type, setType] = useState(TypeCompte.COURANT);
  
  const [saveCompte, { loading }] = useMutation(SAVE_COMPTE, {
    refetchQueries: [
      { query: GET_ALL_COMPTES },
      { query: GET_TOTAL_SOLDE }
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!solde || parseFloat(solde) < 0) {
      alert('Veuillez entrer un solde valide (supérieur ou égal à 0)');
      return;
    }

    try {
      await saveCompte({
        variables: {
          compte: {
            solde: parseFloat(solde),
            type: type,
          },
        },
      });
      
      setSolde('');
      setType(TypeCompte.COURANT);
      alert('✅ Compte créé avec succès!');
    } catch (error) {
      console.error('Erreur lors de la création du compte:', error);
      alert('❌ Erreur lors de la création du compte: ' + error.message);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <PlusCircle className="w-6 h-6 mr-2 text-blue-600" />
        Créer un Nouveau Compte
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Solde Initial (DH)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={solde}
            onChange={(e) => setSolde(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Entrez le solde initial"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de Compte
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value={TypeCompte.COURANT}>Compte Courant</option>
            <option value={TypeCompte.EPARGNE}>Compte Épargne</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          {loading ? 'Création en cours...' : 'Créer le Compte'}
        </button>
      </form>
    </div>
  );
}

export default CreateCompte;