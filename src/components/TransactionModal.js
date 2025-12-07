import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMPTE_TRANSACTIONS } from '../graphql/queries';
import AddTransaction from './AddTransaction';
import { X, ArrowDownCircle, ArrowUpCircle, Clock } from 'lucide-react';

function TransactionModal({ compte, onClose }) {
  const { loading, error, data, refetch } = useQuery(GET_COMPTE_TRANSACTIONS, {
    variables: { id: compte.id },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Compte {compte.type === 'COURANT' ? 'Courant' : 'Épargne'}
              </h2>
              <p className="text-blue-100 text-sm mt-1">ID: {compte.id}</p>
              <p className="text-3xl font-bold mt-2">
                {compte.solde.toFixed(2)} DH
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-500 p-2 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <AddTransaction 
            compteId={compte.id} 
            onSuccess={() => refetch()}
          />

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              Historique des Transactions
            </h3>
          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-20"></div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">❌ Erreur: {error.message}</p>
            </div>
          )}

          {data && data.compteTransactions && data.compteTransactions.length === 0 && (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Aucune transaction pour ce compte</p>
            </div>
          )}

          {data && data.compteTransactions && data.compteTransactions.length > 0 && (
            <div className="space-y-3">
              {data.compteTransactions
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`border-l-4 ${
                      transaction.type === 'DEPOT'
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    } rounded-lg p-4 hover:shadow-md transition`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {transaction.type === 'DEPOT' ? (
                          <ArrowDownCircle className="w-8 h-8 text-green-600 mr-3" />
                        ) : (
                          <ArrowUpCircle className="w-8 h-8 text-red-600 mr-3" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">
                            {transaction.type === 'DEPOT' ? 'Dépôt' : 'Retrait'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          transaction.type === 'DEPOT' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'DEPOT' ? '+' : '-'}
                          {transaction.montant.toFixed(2)} DH
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;