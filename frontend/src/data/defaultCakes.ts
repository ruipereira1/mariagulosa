export const DEFAULT_CAKES = [
  {
    id: 'default-1',
    name: 'Bolo de Chocolate',
    description: 'Delicioso bolo de chocolate com cobertura cremosa',
    price: 25.00,
    image: '/images/cake-chocolate.jpg',
    category: 'chocolate',
    available: true
  },
  {
    id: 'default-2',
    name: 'Bolo de Morango',
    description: 'Bolo fofo com morangos frescos e chantilly',
    price: 28.00,
    image: '/images/cake-strawberry.jpg',
    category: 'frutas',
    available: true
  },
  {
    id: 'default-3',
    name: 'Bolo de Cenoura',
    description: 'Tradicional bolo de cenoura com cobertura de chocolate',
    price: 22.00,
    image: '/images/cake-carrot.jpg',
    category: 'tradicionais',
    available: true
  },
  {
    id: 'default-4',
    name: 'Bolo Red Velvet',
    description: 'Elegante bolo red velvet com cream cheese',
    price: 32.00,
    image: '/images/cake-red-velvet.jpg',
    category: 'especial',
    available: true
  },
  {
    id: 'default-5',
    name: 'Bolo de Limão',
    description: 'Refrescante bolo de limão com cobertura cítrica',
    price: 26.00,
    image: '/images/cake-lemon.jpg',
    category: 'frutas',
    available: true
  },
  {
    id: 'default-6',
    name: 'Bolo de Coco',
    description: 'Tropical bolo de coco com flocos naturais',
    price: 24.00,
    image: '/images/cake-coconut.jpg',
    category: 'tropical',
    available: true
  }
]

export type CakeType = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
} 