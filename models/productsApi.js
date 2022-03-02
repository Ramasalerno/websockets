class ProductsApi {
  constructor() {
    this.data = [];
  }
  getAll() {
    return [...this.data];
  }
  save(nameProduct, priceProduct, imageProduct) {
    const findId = this.data.map(item => item.id);
    let newId; 
    if(findId.length == 0) newId = 1; 
    else newId = Math.max.apply(null, findId) + 1;
    const newProduct = {
      id: newId,
      nameProduct,
      priceProduct,
      imageProduct
    };
    this.data.push(newProduct);
  }
}
const products = new ProductsApi();

module.exports = products;