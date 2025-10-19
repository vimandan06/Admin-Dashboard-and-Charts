import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { getProducts, createProduct } from '../services/api';

export default function Products(){
  const [list,setList]=useState([]);
  const [form,setForm]=useState({name:'', price:''});
  const [msg,setMsg]=useState('');

  useEffect(()=>{ load(); },[]);
  const load=async()=>{ const res=await getProducts(); setList(res.data); };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createProduct({ name: form.name, price: Number(form.price) });
      setForm({ name:'', price:'' });
      setMsg('Product added');
      load();
    } catch (err) { setMsg('Error adding'); }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <h2 className="text-xl mb-4">Products</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Add Product</h3>
              <form onSubmit={submit} className="space-y-2">
                <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" className="w-full p-2 border rounded" required />
                <input value={form.price} onChange={e=>setForm({...form, price:e.target.value})} placeholder="Price" className="w-full p-2 border rounded" required />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
                {msg && <div className="text-sm mt-2">{msg}</div>}
              </form>
            </div>
            <div className="md:col-span-2 bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Product List</h3>
              <ul>
                {list.map(p => (
                  <li key={p.id} className="flex justify-between py-2 border-b">
                    <div>{p.name}</div><div>${p.price}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
