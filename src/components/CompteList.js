import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_COMPTES } from '../graphql/queries';
import CompteCard from './CompteCard';
import TransactionModal from './TransactionModal';
import { Wallet } from 'lucide-react';

function CompteList() {
  const { loading, error, data } = useQuery(GET_ALL_COMPTES);
  const [selectedCompte, setSelectedCompte] = useState(null);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">❌ Erreur: {error.message}</p>
      </div>
    );
  }

  if (!data?.allComptes || data.allComptes.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Aucun compte disponible
        </h3>
        <p className="text-gray-500">
          Créez votre premier compte pour commencer
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <Wallet className="w-6 h-6 mr-2 text-blue-600" />
          Mes Comptes ({data.allComptes.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.allComptes.map((compte) => (
          <CompteCard
            key={compte.id}
            compte={compte}
            onViewTransactions={setSelectedCompte}
          />
        ))}
      </div>

      {selectedCompte && (
        <TransactionModal
          compte={selectedCompte}
          onClose={() => setSelectedCompte(null)}
        />
      )}
    </>
  );
}

export default CompteList;