export default function findProductName(good_id) {
  let name, path = '';
  switch (good_id) {
    case 204120:
      name = 'Libido Fortis';
      path = 'products/libido-fortis.webp';
      break;
    case 204119:
      name = 'Fem Balance';
      path = 'products/fem-balance.webp';
      break;
    case 204118:
      name = 'Alco Balance';
      path = 'products/alco-balance.webp';
      break;
    case 204117:
      name = 'Ero King';
      path = 'products/ero-king.webp';
      break;
    case 204116:
      name = 'Body Balance';
      path = 'products/body-balance.webp';
      break;
    case 202914:
      name = 'Flex Balance';
      path = 'products/flex-balance.webp';
      break;
    case 202690:
      name = 'Man Balance';
      path = 'products/man-balance.webp';
      break;
    default:
      name = 'No Product';
      path = 'products/default-product.webp';
  };

  return {
    name,
    path
  }
};
