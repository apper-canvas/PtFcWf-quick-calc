import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, RotateCcw, Percent, Divide, X, Minus, Plus, Equal } from 'lucide-react'

const MainFeature = ({ onCalculate }) => {
  const [displayValue, setDisplayValue] = useState('0')
  const [expression, setExpression] = useState('')
  const [memory, setMemory] = useState(0)
  const [lastOperation, setLastOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [animateDisplay, setAnimateDisplay] = useState(false)

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        inputDigit(parseInt(e.key))
      } else if (e.key === '.') {
        inputDot()
      } else if (e.key === '+') {
        performOperation('+')
      } else if (e.key === '-') {
        performOperation('-')
      } else if (e.key === '*') {
        performOperation('×')
      } else if (e.key === '/') {
        performOperation('÷')
      } else if (e.key === '%') {
        performOperation('%')
      } else if (e.key === 'Enter' || e.key === '=') {
        performEquals()
      } else if (e.key === 'Escape') {
        clearAll()
      } else if (e.key === 'Backspace') {
        clearEntry()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [displayValue, expression, waitingForOperand, lastOperation])

  const animateDisplayChange = () => {
    setAnimateDisplay(true)
    setTimeout(() => setAnimateDisplay(false), 150)
  }

  const inputDigit = (digit) => {
    if (waitingForOperand) {
      setDisplayValue(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplayValue(displayValue === '0' ? String(digit) : displayValue + digit)
    }
    animateDisplayChange()
  }

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplayValue('0.')
      setWaitingForOperand(false)
    } else if (displayValue.indexOf('.') === -1) {
      setDisplayValue(displayValue + '.')
    }
    animateDisplayChange()
  }

  const clearEntry = () => {
    setDisplayValue('0')
    animateDisplayChange()
  }

  const clearAll = () => {
    setDisplayValue('0')
    setExpression('')
    setLastOperation(null)
    setWaitingForOperand(false)
    animateDisplayChange()
  }

  const toggleSign = () => {
    const value = parseFloat(displayValue)
    setDisplayValue(String(-value))
    animateDisplayChange()
  }

  const performOperation = (nextOperator) => {
    const inputValue = parseFloat(displayValue)
    
    if (expression === '') {
      setExpression(displayValue + ' ' + nextOperator + ' ')
      setLastOperation({ operator: nextOperator, value: inputValue })
      setWaitingForOperand(true)
    } else if (waitingForOperand) {
      // Replace the operator
      setExpression(expression.slice(0, -2) + nextOperator + ' ')
      setLastOperation({ ...lastOperation, operator: nextOperator })
    } else {
      // Perform the calculation
      const result = calculate(lastOperation.value, inputValue, lastOperation.operator)
      setDisplayValue(String(result))
      setExpression(result + ' ' + nextOperator + ' ')
      setLastOperation({ operator: nextOperator, value: result })
      setWaitingForOperand(true)
    }
    animateDisplayChange()
  }

  const performEquals = () => {
    const inputValue = parseFloat(displayValue)
    
    if (lastOperation && !waitingForOperand) {
      const result = calculate(lastOperation.value, inputValue, lastOperation.operator)
      const fullExpression = expression + displayValue
      
      setDisplayValue(String(result))
      setExpression('')
      setLastOperation(null)
      setWaitingForOperand(true)
      
      onCalculate && onCalculate({
        expression: fullExpression,
        result: result
      })
    }
    animateDisplayChange()
  }

  const calculate = (leftOperand, rightOperand, operator) => {
    switch (operator) {
      case '+': return leftOperand + rightOperand
      case '-': return leftOperand - rightOperand
      case '×': return leftOperand * rightOperand
      case '÷': return leftOperand / rightOperand
      case '%': return (leftOperand * rightOperand) / 100
      default: return rightOperand
    }
  }

  const memoryAdd = () => {
    setMemory(memory + parseFloat(displayValue))
  }

  const memorySubtract = () => {
    setMemory(memory - parseFloat(displayValue))
  }

  const memoryRecall = () => {
    setDisplayValue(String(memory))
    setWaitingForOperand(false)
    animateDisplayChange()
  }

  const memoryClear = () => {
    setMemory(0)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden shadow-card"
    >
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20">
        <div className="mb-2 h-6 text-right text-surface-500 dark:text-surface-400 text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
          {expression}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={displayValue + (animateDisplay ? 'animate' : 'static')}
            initial={animateDisplay ? { opacity: 0, y: -10 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="text-4xl md:text-5xl font-bold text-right mb-2 overflow-x-auto whitespace-nowrap scrollbar-hide"
          >
            {displayValue}
          </motion.div>
        </AnimatePresence>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={memoryAdd} 
              className="px-2 py-1 text-xs rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
            >
              M+
            </button>
            <button 
              onClick={memorySubtract} 
              className="px-2 py-1 text-xs rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
            >
              M-
            </button>
            <button 
              onClick={memoryRecall} 
              className="px-2 py-1 text-xs rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
            >
              MR
            </button>
            <button 
              onClick={memoryClear} 
              className="px-2 py-1 text-xs rounded-lg bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
            >
              MC
            </button>
          </div>
          
          <div className="text-xs text-surface-500 dark:text-surface-400">
            {memory !== 0 && `Memory: ${memory}`}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3 p-6">
        <button onClick={clearAll} className="calc-button-function h-16">
          <Trash2 size={20} />
        </button>
        <button onClick={clearEntry} className="calc-button-function h-16">
          <RotateCcw size={20} />
        </button>
        <button onClick={() => performOperation('%')} className="calc-button-function h-16">
          <Percent size={20} />
        </button>
        <button onClick={() => performOperation('÷')} className="calc-button-operation h-16">
          <Divide size={20} />
        </button>
        
        <button onClick={() => inputDigit(7)} className="calc-button-number h-16">7</button>
        <button onClick={() => inputDigit(8)} className="calc-button-number h-16">8</button>
        <button onClick={() => inputDigit(9)} className="calc-button-number h-16">9</button>
        <button onClick={() => performOperation('×')} className="calc-button-operation h-16">
          <X size={20} />
        </button>
        
        <button onClick={() => inputDigit(4)} className="calc-button-number h-16">4</button>
        <button onClick={() => inputDigit(5)} className="calc-button-number h-16">5</button>
        <button onClick={() => inputDigit(6)} className="calc-button-number h-16">6</button>
        <button onClick={() => performOperation('-')} className="calc-button-operation h-16">
          <Minus size={20} />
        </button>
        
        <button onClick={() => inputDigit(1)} className="calc-button-number h-16">1</button>
        <button onClick={() => inputDigit(2)} className="calc-button-number h-16">2</button>
        <button onClick={() => inputDigit(3)} className="calc-button-number h-16">3</button>
        <button onClick={() => performOperation('+')} className="calc-button-operation h-16">
          <Plus size={20} />
        </button>
        
        <button onClick={toggleSign} className="calc-button-number h-16">+/-</button>
        <button onClick={() => inputDigit(0)} className="calc-button-number h-16">0</button>
        <button onClick={inputDot} className="calc-button-number h-16">.</button>
        <button onClick={performEquals} className="calc-button-equals h-16">
          <Equal size={20} />
        </button>
      </div>
    </motion.div>
  )
}

export default MainFeature