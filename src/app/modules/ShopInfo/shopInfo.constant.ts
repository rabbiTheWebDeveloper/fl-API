export  const sortingOptions: { [key: string]: string } = {
  '': '_id', // Default sorting by _id
  'feature': 'rating',
  'best-selling': '-rating',
  'a-z': 'name',
  'z-a': '-name',
  'low-to-high': 'price',
  'high-to-low': '-price',
  'old-to-new': 'createdAt',
};