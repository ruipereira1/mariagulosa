import { formatPrice } from '../config/currency'

interface PriceProps {
  value: number | string
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Price = ({ value, className = '', size = 'md' }: PriceProps) => {
  // Converte string para número se necessário
  const numericValue = typeof value === 'string' 
    ? parseFloat(value.replace(/[€\s]/g, '').replace(',', '.'))
    : value

  // Classes de tamanho
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  return (
    <span className={`font-semibold text-rose-gold ${sizeClasses[size]} ${className}`}>
      {formatPrice(numericValue)}
    </span>
  )
}

export default Price 