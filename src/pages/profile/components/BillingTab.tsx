import { motion } from 'framer-motion'
import { CreditCard, DollarSign, TrendingUp, Calendar, Download, AlertCircle, CheckCircle } from 'lucide-react'

interface UsageData {
  month: string
  apiCalls: number
  cost: number
  tokens: number
}

interface InvoiceData {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue'
  description: string
}

function BillingTab() {
  // Mock billing data
  const currentPlan = {
    name: 'Pro',
    price: 29,
    period: 'month',
    features: [
      '100,000 API calls/month',
      'Advanced analytics',
      'Priority support',
      'Custom integrations',
    ],
  }

  const usageData: UsageData[] = [
    { month: 'Dec 2023', apiCalls: 45230, cost: 29.00, tokens: 2150000 },
    { month: 'Nov 2023', apiCalls: 52100, cost: 29.00, tokens: 2480000 },
    { month: 'Oct 2023', apiCalls: 38760, cost: 29.00, tokens: 1840000 },
    { month: 'Sep 2023', apiCalls: 41890, cost: 29.00, tokens: 1990000 },
  ]

  const recentInvoices: InvoiceData[] = [
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      amount: 29.00,
      status: 'paid',
      description: 'Pro Plan - January 2024',
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-01',
      amount: 29.00,
      status: 'paid',
      description: 'Pro Plan - December 2023',
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-01',
      amount: 29.00,
      status: 'paid',
      description: 'Pro Plan - November 2023',
    },
  ]

  const currentUsage = {
    apiCalls: 23450,
    limit: 100000,
    cost: 14.50,
    tokensUsed: 1120000,
    resetDate: '2024-02-01',
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-300 border-green-500/20'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
      case 'overdue':
        return 'bg-red-500/10 text-red-300 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-300 border-gray-500/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className='w-3 h-3' />
      case 'pending':
        return <Calendar className='w-3 h-3' />
      case 'overdue':
        return <AlertCircle className='w-3 h-3' />
      default:
        return <AlertCircle className='w-3 h-3' />
    }
  }

  const usagePercentage = (currentUsage.apiCalls / currentUsage.limit) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full space-y-6'
    >
      {/* Header */}
      <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500'>
            <CreditCard className='w-5 h-5 text-white' />
          </div>
          <h3 className='text-lg font-semibold text-gray-200'>Billing & Usage</h3>
        </div>
        <p className='text-gray-400'>
          Manage your subscription, view usage statistics, and download invoices.
        </p>
      </div>

      {/* Current Plan & Usage */}
      <div className='grid gap-6 grid-cols-1 lg:grid-cols-2'>
        {/* Current Plan */}
        <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500'>
              <DollarSign className='w-5 h-5 text-white' />
            </div>
            <h4 className='text-lg font-semibold text-gray-200'>Current Plan</h4>
          </div>

          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-xl font-bold text-gray-200'>
                  {currentPlan.name}
                  {' '}
                  Plan
                </p>
                <p className='text-sm text-gray-400'>
                  {formatCurrency(currentPlan.price)}
                  /
                  {currentPlan.period}
                </p>
              </div>
              <button className='px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200'>
                Upgrade
              </button>
            </div>

            <div className='space-y-2'>
              {currentPlan.features.map((feature, index) => (
                <div key={index} className='flex items-center gap-2 text-sm text-gray-300'>
                  <CheckCircle className='w-4 h-4 text-green-400' />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Current Usage */}
        <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500'>
              <TrendingUp className='w-5 h-5 text-white' />
            </div>
            <h4 className='text-lg font-semibold text-gray-200'>This Month&apos;s Usage</h4>
          </div>

          <div className='space-y-4'>
            <div>
              <div className='flex items-center justify-between mb-2'>
                <span className='text-sm text-gray-400'>API Calls</span>
                <span className='text-sm text-gray-300'>
                  {formatNumber(currentUsage.apiCalls)}
                  {' '}
                  /
                  {formatNumber(currentUsage.limit)}
                </span>
              </div>
              <div className='w-full bg-gray-700 rounded-full h-2'>
                <div
                  className='bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300'
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                />
              </div>
              <p className='text-xs text-gray-400 mt-1'>
                {usagePercentage.toFixed(1)}
                % used
              </p>
            </div>

            <div className='grid gap-4 grid-cols-2'>
              <div>
                <p className='text-sm text-gray-400'>Current Cost</p>
                <p className='text-lg font-semibold text-gray-200'>{formatCurrency(currentUsage.cost)}</p>
              </div>
              <div>
                <p className='text-sm text-gray-400'>Tokens Used</p>
                <p className='text-lg font-semibold text-gray-200'>{formatNumber(currentUsage.tokensUsed)}</p>
              </div>
            </div>

            <div className='text-xs text-gray-400'>
              Resets on
              {' '}
              {new Date(currentUsage.resetDate).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Usage History */}
      <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500'>
            <TrendingUp className='w-5 h-5 text-white' />
          </div>
          <h4 className='text-lg font-semibold text-gray-200'>Usage History</h4>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-gray-700'>
                <th className='text-left py-2 text-gray-400'>Month</th>
                <th className='text-right py-2 text-gray-400'>API Calls</th>
                <th className='text-right py-2 text-gray-400'>Tokens</th>
                <th className='text-right py-2 text-gray-400'>Cost</th>
              </tr>
            </thead>
            <tbody>
              {usageData.map((data, index) => (
                <tr key={index} className='border-b border-gray-800'>
                  <td className='py-3 text-gray-300'>{data.month}</td>
                  <td className='py-3 text-right text-gray-300'>{formatNumber(data.apiCalls)}</td>
                  <td className='py-3 text-right text-gray-300'>{formatNumber(data.tokens)}</td>
                  <td className='py-3 text-right text-gray-300'>{formatCurrency(data.cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className='backdrop-blur-md bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 rounded-xl p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500'>
              <Calendar className='w-5 h-5 text-white' />
            </div>
            <h4 className='text-lg font-semibold text-gray-200'>Recent Invoices</h4>
          </div>
          <button className='flex items-center gap-2 px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors'>
            <Download className='w-4 h-4' />
            Download All
          </button>
        </div>

        <div className='space-y-3'>
          {recentInvoices.map(invoice => (
            <div key={invoice.id} className='flex items-center justify-between p-4 rounded-lg bg-gray-800/50'>
              <div className='flex items-center gap-4'>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(invoice.status)}`}>
                  {getStatusIcon(invoice.status)}
                  <span className='capitalize'>{invoice.status}</span>
                </div>
                <div>
                  <p className='text-gray-200 font-medium'>{invoice.description}</p>
                  <p className='text-sm text-gray-400'>
                    {invoice.id}
                    {' '}
                    •
                    {' '}
                    {new Date(invoice.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-gray-200 font-semibold'>{formatCurrency(invoice.amount)}</span>
                <button className='p-1 text-gray-400 hover:text-gray-300 transition-colors'>
                  <Download className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default BillingTab
