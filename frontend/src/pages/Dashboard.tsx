import React, { useState, useEffect } from 'react';
import { Bell, ArrowUpRight, ArrowDownLeft, CreditCard, FileText, TrendingUp, Star } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import apiService from '../services/api';

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlySpending: number;
  savingsRate: number;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  category: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 482350,
    monthlyIncome: 120000,
    monthlySpending: 34820,
    savingsRate: 71
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const txnData = await apiService.getTransactions();
        setTransactions(txnData.slice(0, 5));
      } catch (error) {
        console.error('Failed to load transactions:', error);
      }
    };

    loadTransactions();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  const quickActions = [
    { icon: ArrowUpRight, label: 'Send Money', color: 'bg-green/10 text-green' },
    { icon: ArrowDownLeft, label: 'Add Money', color: 'bg-blue/10 text-blue' },
    { icon: CreditCard, label: 'My Cards', color: 'bg-purple/10 text-purple' },
    { icon: FileText, label: 'Apply Loan', color: 'bg-amber/10 text-amber' },
  ];

  return (
    <div className="page active">
      <div className="topbar flex items-center justify-between mb-8">
        <div>
          <h1 className="page-title font-serif text-2xl text-text mb-1">
            Good morning, {user?.fullName || 'Arjun'}
          </h1>
          <p className="page-sub text-sm text-text3">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} · Premium Member
          </p>
        </div>
        <div className="topbar-right flex items-center gap-3">
          <div className="notif-btn w-9 h-9 rounded-full bg-bg3 border border-border2 flex items-center justify-center cursor-pointer relative">
            <Bell size={16} />
            <div className="notif-dot w-1.5 h-1.5 bg-accent rounded-full absolute top-1.5 right-1.5 border-2 border-bg3"></div>
          </div>
        </div>
      </div>

      <div className="cards-grid grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4 mb-8">
        <div className="stat-card accent-card bg-gradient-to-br from-[#1f1800] to-[#16120a] border-accent-dim">
          <div className="stat-label text-xs text-text3 tracking-wider uppercase mb-2.5">Total Balance</div>
          <div className="stat-value gold font-serif text-2xl text-accent">
            {formatCurrency(stats.totalBalance)}
          </div>
          <div className="stat-change text-sm text-green flex items-center gap-1 mt-1.5">
            <ArrowUpRight size={12} />
            ↑ 3.2% this month
          </div>
          <div className="mini-chart flex items-end gap-0.75 h-10 mt-3">
            {[30, 45, 38, 60, 50, 72, 100].map((height, i) => (
              <div
                key={i}
                className={`bar flex-1 bg-accent/30 rounded-sm transition-all duration-300 ${
                  i === 6 ? 'hi bg-accent' : ''
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label text-xs text-text3 tracking-wider uppercase mb-2.5">Monthly Income</div>
          <div className="stat-value font-serif text-2xl text-text">
            {formatCurrency(stats.monthlyIncome)}
          </div>
          <div className="stat-change text-sm text-green flex items-center gap-1 mt-1.5">
            <ArrowUpRight size={12} />
            ↑ 8% vs last month
          </div>
          <div className="card-icon absolute right-4 top-4 w-8 h-8 rounded-lg bg-white/4 flex items-center justify-center opacity-60">
            <TrendingUp size={16} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label text-xs text-text3 tracking-wider uppercase mb-2.5">Monthly Spending</div>
          <div className="stat-value font-serif text-2xl text-text">
            {formatCurrency(stats.monthlySpending)}
          </div>
          <div className="stat-change neg text-sm text-red flex items-center gap-1 mt-1.5">
            <ArrowUpRight size={12} />
            ↑ 12% vs last month
          </div>
          <div className="card-icon absolute right-4 top-4 w-8 h-8 rounded-lg bg-white/4 flex items-center justify-center opacity-60">
            <ArrowDownLeft size={16} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label text-xs text-text3 tracking-wider uppercase mb-2.5">Savings Rate</div>
          <div className="stat-value font-serif text-2xl text-text">{stats.savingsRate}%</div>
          <div className="stat-change text-sm text-green mt-1.5">↑ Excellent health</div>
          <div className="card-icon absolute right-4 top-4 w-8 h-8 rounded-lg bg-white/4 flex items-center justify-center opacity-60">
            <Star size={16} />
          </div>
        </div>
      </div>

      <div className="section mb-8">
        <div className="section-head flex items-center justify-between mb-4">
          <h2 className="section-title font-serif text-lg">Quick Actions</h2>
        </div>
        <div className="quick-actions grid grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <div key={index} className="qa-btn stat-card p-4.5 cursor-pointer text-center transition-all duration-200 flex flex-col items-center gap-2">
              <div className={`qa-icon w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-lg`}>
                <action.icon size={18} />
              </div>
              <div className="qa-label text-xs text-text2 font-medium">{action.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-head flex items-center justify-between mb-4">
          <h2 className="section-title font-serif text-lg">Recent Transactions</h2>
          <button className="link-btn text-xs text-accent cursor-pointer tracking-wider border-none bg-none p-0 font-inherit">
            View all
          </button>
        </div>
        <div className="txn-list stat-card overflow-hidden">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="txn-item flex items-center gap-3.5 p-3.5 border-b border-border2 transition-colors duration-100 cursor-pointer last:border-b-0 hover:bg-bg3">
              <div className={`txn-icon w-9.5 h-9.5 rounded-lg flex items-center justify-center flex-shrink-0 text-base ${
                transaction.type === 'CREDIT' ? 'bg-green-bg text-green' : 'bg-red-bg text-red'
              }`}>
                {transaction.type === 'CREDIT' ? '↓' : '↑'}
              </div>
              <div className="txn-info flex-1">
                <div className="txn-name text-sm font-medium text-text">{transaction.description}</div>
                <div className="txn-date text-xs text-text3 mt-px">{formatDate(transaction.date)}</div>
              </div>
              <div className={`txn-amount text-sm font-semibold text-right ${
                transaction.type === 'CREDIT' ? 'text-green' : 'text-red'
              }`}>
                {transaction.type === 'CREDIT' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
