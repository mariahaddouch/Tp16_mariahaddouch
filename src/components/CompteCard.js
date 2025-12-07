import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_COMPTE } from '../graphql/mutations';
import { GET_ALL_COMPTES, GET_TOTAL_SOLDE } from '../graphql/queries';
import { CreditCard, Trash2, Eye } from 'lucide-react';

function CompteCard({ compte, onViewTransactions }) {
  const [deleteCompte, { loading }] = useMutation(DELETE_COMPTE, {
    refetchQueries: [
      { query: GET_ALL_COMPTES },
      { query: GET_TOTAL_SOLDE }
    ],
  });

  const handleDelete = async () => {
    if (window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer ce compte?')) {
      try {
        await deleteCompte({ 
          variables: { id: compte.id } 
        });
        alert('✅ Compte supprimé avec succès!');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('❌ Erreur lors de la suppression du compte: ' + error.message);
      }
    }
  };

  const getTypeColor = (type) => {
    return type === 'COURANT' ? 'text-blue-600' : 'text-green-600';
  };

  const getTypeBgColor = (type) => {
    return type === 'COURANT' ? 'bg-blue-50' : 'bg-green-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-200 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className={`${getTypeBgColor(compte.type)} p-3 rounded-lg`}>
            <CreditCard className={`w-8 h-8 ${getTypeColor(compte.type)}`} />
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-700">
              Compte {compte.type === 'COURANT' ? 'Courant' : 'Épargne'}
            </p>
            <p className="text-xs text-gray-400">ID: {compte.id}</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition disabled:opacity-50"
          title="Supprimer le compte"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4 py-4 border-t border-b border-gray-100">
        <p className="text-sm text-gray-500 mb-1">Solde disponible</p>
        <p className="text-3xl font-bold text-gray-800">
          {compte.solde.toFixed(2)} <span className="text-lg text-gray-500">DH</span>
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Créé le: {new Date(compte.dateCreation).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>

      <button
        onClick={() => onViewTransactions(compte)}
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
      >
        <Eye className="w-4 h-4 mr-2" />
        Voir les Transactions
      </button>
    </div>
  );
}

export default CompteCard;