export default function findProduct(good_id) {
  let path = '';
  switch (good_id) {
    case 204120:
      path = 'products/libido-fortis.webp';
      break;
    case 204119:
      path = 'products/fem-balance.webp';
      break;
    case 204118:
      path = 'products/alco-balance.webp';
      break;
    case 204117:
      path = 'products/ero-king.webp';
      break;
    case 204116:
      path = 'products/body-balance.webp';
      break;
    case 202914:
      path = 'products/flex-balance.webp';
      break;
    case 202690:
      path = 'products/man-balance.webp';
      break;
    default:
      path = 'products/default-product.webp';
  };

  return path;
};
