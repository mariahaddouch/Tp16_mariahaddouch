import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TRANSACTION } from '../graphql/mutations';
import { GET_COMPTE_TRANSACTIONS, GET_ALL_COMPTES, GET_TOTAL_SOLDE, GET_TRANSACTION_STATS } from '../graphql/queries';
import { TypeTransaction } from '../graphql/types';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

function AddTransaction({ compteId, onSuccess }) {
  const [type, setType] = useState(TypeTransaction.DEPOT);
  const [montant, setMontant] = useState('');

  const [addTransaction, { loading }] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [
      { query: GET_COMPTE_TRANSACTIONS, variables: { id: compteId } },
      { query: GET_ALL_COMPTES },
      { query: GET_TOTAL_SOLDE },
      { query: GET_TRANSACTION_STATS }
    ],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!montant || parseFloat(montant) <= 0) {
      alert('Veuillez entrer un montant valide (supérieur à 0)');
      return;
    }

    try {
      await addTransaction({
        variables: {
          transactionRequest: {
            type: type,
            montant: parseFloat(montant),
            compteId: compteId,
          },
        },
      });

      setMontant('');
      setType(TypeTransaction.DEPOT);
      alert('✅ Transaction effectuée avec succès!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erreur lors de la transaction:', error);
      alert('❌ Erreur lors de la transaction: ' + error.message);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Nouvelle Transaction
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de Transaction
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setType(TypeTransaction.DEPOT)}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border-2 transition ${
                type === TypeTransaction.DEPOT
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <ArrowDownCircle className="w-5 h-5 mr-2" />
              Dépôt
            </button>
            <button
              type="button"
              onClick={() => setType(TypeTransaction.RETRAIT)}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border-2 transition ${
                type === TypeTransaction.RETRAIT
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <ArrowUpCircle className="w-5 h-5 mr-2" />
              Retrait
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Montant (DH)
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Entrez le montant"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center ${
            type === TypeTransaction.DEPOT
              ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
              : 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
          } text-white`}
        >
          {type === TypeTransaction.DEPOT ? (
            <ArrowDownCircle className="w-5 h-5 mr-2" />
          ) : (
            <ArrowUpCircle className="w-5 h-5 mr-2" />
          )}
          {loading ? 'Traitement...' : `Effectuer le ${type === TypeTransaction.DEPOT ? 'Dépôt' : 'Retrait'}`}
        </button>
      </form>
    </div>
  );
}

export default AddTransaction;