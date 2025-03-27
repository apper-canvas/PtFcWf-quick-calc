import { useState } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [history, setHistory] = useState([])

  const addToHistory = (calculation) => {
    setHistory(prev => [calculation, ...prev].slice(0, 10))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Powerful Calculations Made Simple
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <MainFeature onCalculate={addToHistory} />
          </div>
          
          <div className="bg-white dark:bg-surface-800 rounded-2xl p-4 shadow-card">
            <h2 className="text-xl font-semibold mb-3 text-primary dark:text-primary-light">
              Calculation History
            </h2>
            
            {history.length > 0 ? (
              <ul className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-hide">
                {history.map((item, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-xl bg-surface-100 dark:bg-surface-700"
                  >
                    <div className="text-sm text-surface-600 dark:text-surface-400">
                      {item.expression}
                    </div>
                    <div className="text-lg font-medium">
                      = {item.result}
                    </div>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8 text-surface-500 dark:text-surface-400">
                Your calculation history will appear here
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Home