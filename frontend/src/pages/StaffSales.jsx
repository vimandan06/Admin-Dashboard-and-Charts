import React, { useEffect, useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getProducts, createSale } from '../services/api';

export default function StaffSales() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  // ✅ Convert productId to number for matching
  const selectedProduct = useMemo(
    () => products.find((p) => p.id === Number(productId)),
    [productId, products]
  );

  // ✅ Calculate total price live
  const totalPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    return selectedProduct.price * Number(quantity || 0);
  }, [selectedProduct, quantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || quantity < 1) {
      setMsg('❌ Please select a product and enter a valid quantity.');
      return;
    }

    try {
      await createSale({ productId, quantity, totalPrice });
      setMsg(`✅ Sale recorded successfully! Total: $${totalPrice}`);
      setProductId('');
      setQuantity(1);
    } catch (err) {
      console.error('Error creating sale:', err);
      setMsg('❌ Failed to record sale.');
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 bg-gray-100 flex-1">
          <h2 className="text-2xl font-bold mb-4">Record a Sale</h2>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md max-w-md space-y-4"
          >
            {/* Product Select */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Select Product
              </label>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
                className="w-full border p-2 rounded"
              >
                <option value="">-- Choose a product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.price})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full border p-2 rounded"
              />
            </div>

            {/* Live Total Price */}
            <div className="text-gray-700 font-medium">
              Total Price: <span className="font-bold">${totalPrice}</span>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Submit Sale
            </button>

            {msg && <div className="text-sm mt-3">{msg}</div>}
          </form>
        </main>
      </div>
    </div>
  );
}
