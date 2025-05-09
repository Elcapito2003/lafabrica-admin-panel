import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://qpolgtsgfuqfrlgpmvkk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwb2xndHNnZnVxZnJsZ3BtdmtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NTExNDUsImV4cCI6MjA2MjMyNzE0NX0.SSxVsx0pIKftHzlOTOji_v8AVTPrql6fZWZx2k2ejQk"
);

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [auth, setAuth] = useState({ user: "", pass: "" });

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "colchon",
    description: "",
    imagen_url_1: "",
    imagen_url_2: "",
    imagen_url_3: "",
    imagen_url_4: "",
    imagen_url_5: ""
  });

  const previewImages = [
    formData.imagen_url_1,
    formData.imagen_url_2,
    formData.imagen_url_3,
    formData.imagen_url_4,
    formData.imagen_url_5
  ].filter((url) => url !== "");

  useEffect(() => {
    if (isAuthenticated) fetchProducts();
  }, [isAuthenticated]);

  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*");
    if (!error) setProducts(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await supabase.from("products").insert([formData]);
    if (!error) {
      fetchProducts();
      setFormData({
        name: "",
        price: "",
        category: "colchon",
        description: "",
        imagen_url_1: "",
        imagen_url_2: "",
        imagen_url_3: "",
        imagen_url_4: "",
        imagen_url_5: ""
      });
    }
  }

  function handleLogin(e) {
    e.preventDefault();
    if (auth.user === "admin" && auth.pass === "lafabrica123") {
      setIsAuthenticated(true);
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 400, margin: "auto", padding: 40 }}>
        <h2>Iniciar sesión</h2>
        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          <input
            type="text"
            placeholder="Usuario"
            value={auth.user}
            onChange={(e) => setAuth({ ...auth, user: e.target.value })}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={auth.pass}
            onChange={(e) => setAuth({ ...auth, pass: e.target.value })}
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Panel de Administración</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="text"
          placeholder="Nombre"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value="colchon">Colchón</option>
          <option value="mueble">Mueble</option>
        </select>
        <textarea
          placeholder="Descripción"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        {[1, 2, 3, 4, 5].map((i) => (
          <input
            key={i}
            type="text"
            placeholder={`Imagen URL ${i}`}
            value={formData[`imagen_url_${i}`]}
            onChange={(e) =>
              setFormData({ ...formData, [`imagen_url_${i}`]: e.target.value })
            }
          />
        ))}

        <button type="submit">Agregar producto</button>
      </form>

      {formData.name && (
        <div
          style={{
            border: "1px solid #ccc",
            marginTop: 20,
            padding: 10,
            borderRadius: 6
          }}
        >
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: 10,
              marginBottom: 10
            }}
          >
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`img-${index}`}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8
                }}
              />
            ))}
          </div>
          <h2>{formData.name}</h2>
          <p>${formData.price}</p>
          <small>{formData.category}</small>
          <p>{formData.description}</p>
        </div>
      )}
    </div>
  );
}
