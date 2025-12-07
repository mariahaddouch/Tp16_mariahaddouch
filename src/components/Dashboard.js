import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_TOTAL_SOLDE, GET_TRANSACTION_STATS } from '../graphql/queries';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

function Dashboard() {
  const { data: statsData, loading: statsLoading } = useQuery(GET_TOTAL_SOLDE);
  const { data: transStatsData, loading: transLoading } = useQuery(GET_TRANSACTION_STATS);

  if (statsLoading || transLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
        <div className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
        <div className="bg-gray-200 animate-pulse rounded-lg h-32"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium">Solde Total</p>
            <p className="text-3xl font-bold mt-2">
              {statsData?.totalSolde?.sum?.toFixed(2) || '0.00'} DH
            </p>
            <p className="text-blue-200 text-xs mt-1">
              {statsData?.totalSolde?.count || 0} compte(s)
            </p>
          </div>
          <DollarSign className="w-12 h-12 text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm font-medium">Total Dépôts</p>
            <p className="text-3xl font-bold mt-2">
              {transStatsData?.transactionStats?.sumDepots?.toFixed(2) || '0.00'} DH
            </p>
            <p className="text-green-200 text-xs mt-1">
              {transStatsData?.transactionStats?.count || 0} transaction(s)
            </p>
          </div>
          <TrendingUp className="w-12 h-12 text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-sm font-medium">Total Retraits</p>
            <p className="text-3xl font-bold mt-2">
              {transStatsData?.transactionStats?.sumRetraits?.toFixed(2) || '0.00'} DH
            </p>
            <p className="text-red-200 text-xs mt-1">
              Solde moyen: {statsData?.totalSolde?.average?.toFixed(2) || '0.00'} DH
            </p>
          </div>
          <TrendingDown className="w-12 h-12 text-red-200" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;