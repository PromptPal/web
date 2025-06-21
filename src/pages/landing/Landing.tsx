import { Link, Navigate } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { tokenAtom } from '../../stats/profile'
import { Button } from '../../components/Button/Button'
import {
  Sparkles,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Code,
  Brain,
  Workflow,
} from 'lucide-react'
import { motion } from 'framer-motion'

function LandingPage() {
  const token = useAtomValue(tokenAtom)

  if (token) {
    return <Navigate to='/projects' />
  }

  return (
    <div className='min-h-screen bg-black overflow-hidden'>
      {/* Hero Section */}
      <section className='relative'>
        {/* Background Gradient Effects */}
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl' />
          <div className='absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl' />
        </div>

        <div className='relative z-10 container mx-auto px-4 py-20 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className='text-5xl md:text-7xl font-bold mb-6'>
              <span className='bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent'>
                PromptPal
              </span>
            </h1>
            <p className='text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto'>
              Your AI-powered companion for managing prompts, providers, and projects with elegance
            </p>

            <div className='flex gap-4 justify-center'>
              <Link to='/auth'>
                <Button variant='primary' className='group'>
                  Get Started
                  <ArrowRight className='w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform' />
                </Button>
              </Link>
              <Link to='/auth'>
                <Button variant='ghost'>
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4'>
        <div className='container mx-auto'>
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className='text-4xl font-bold text-center mb-12'
          >
            <span className='bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent'>
              Powerful Features
            </span>
          </motion.h2>

          <div className='grid md:grid-cols-3 gap-8'>
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='group'
              >
                <div className='p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10'>
                  <div className='w-12 h-12 mb-4 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white'>
                    {feature.icon}
                  </div>
                  <h3 className='text-xl font-semibold mb-2 text-white'>{feature.title}</h3>
                  <p className='text-gray-400'>{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-20 px-4'>
        <div className='container mx-auto'>
          <div className='grid md:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className='text-center'
              >
                <div className='text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2'>
                  {stat.value}
                </div>
                <div className='text-gray-400'>{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='container mx-auto text-center'
        >
          <div className='relative inline-block'>
            <div className='absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 blur-2xl opacity-50' />
            <div className='relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm border border-gray-700/50 rounded-3xl p-12'>
              <h2 className='text-3xl md:text-4xl font-bold mb-4'>
                <span className='bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent'>
                  Ready to elevate your AI workflow?
                </span>
              </h2>
              <p className='text-gray-300 mb-8 max-w-2xl mx-auto'>
                Join thousands of developers who are already using PromptPal to streamline their AI development process
              </p>
              <Link to='/auth'>
                <Button variant='primary' className='group'>
                  Start Building Today
                  <Sparkles className='w-4 h-4 ml-2 group-hover:animate-pulse' />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

const features = [
  {
    icon: <Brain className='w-6 h-6' />,
    title: 'Smart Prompt Management',
    description: 'Organize, version, and optimize your AI prompts with intelligent categorization and search',
  },
  {
    icon: <Layers className='w-6 h-6' />,
    title: 'Multi-Provider Support',
    description: 'Seamlessly switch between different AI providers with unified configuration management',
  },
  {
    icon: <Shield className='w-6 h-6' />,
    title: 'Secure & Private',
    description: 'Your data stays yours with enterprise-grade security and privacy-first architecture',
  },
  {
    icon: <Workflow className='w-6 h-6' />,
    title: 'Project Organization',
    description: 'Group related prompts and providers into projects for better workflow management',
  },
  {
    icon: <Zap className='w-6 h-6' />,
    title: 'Lightning Fast',
    description: 'Optimized performance with instant search and real-time collaboration features',
  },
  {
    icon: <Code className='w-6 h-6' />,
    title: 'Developer Friendly',
    description: 'Built by developers, for developers with powerful APIs and extensibility',
  },
]

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '50K+', label: 'Prompts Created' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' },
]

export default LandingPage
