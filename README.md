# SNEAK SHOES

E-commerce de sneakers urbanos y deportivos construido con Astro, React y Tailwind CSS.

El proyecto esta optimizado para mostrar un catalogo visual por categorias, gestionar carrito persistente en el navegador y cerrar la venta por WhatsApp con un mensaje preformateado.

## Demo funcional

- Catalogo organizado por marcas/categorias.
- Filtro rapido por categoria con vista previa inteligente en desktop.
- Carrusel por producto con zoom en imagen activa.
- Carrito flotante con seleccion de talla y color.
- Persistencia de carrito y estado abierto en `localStorage`.
- Checkout por WhatsApp con resumen de pedido.

## Stack tecnologico

- Astro 5
- React 19 (islas interactivas)
- Nano Stores (estado global del carrito)
- Tailwind CSS 4
- TypeScript

## Datos del catalogo

- Categorias: 6
- Productos: 26
- Fuente de datos: `src/utils/shoes.json`

Categorias actuales:

- JORDAN
- ADIDAS
- NIKE
- NEW BALANCE
- PUMA
- ESPECIALES

## Scripts disponibles

Ejecutar desde la raiz del proyecto:

| Comando | Descripcion |
| :-- | :-- |
| `pnpm install` | Instala dependencias |
| `pnpm dev` | Inicia entorno local en `http://localhost:4321` |
| `pnpm build` | Genera build de produccion en `dist/` |
| `pnpm preview` | Sirve la build para validacion local |
| `pnpm astro ...` | Ejecuta comandos del CLI de Astro |

## Estructura del proyecto

```text
.
|- public/
|  |- fonts/
|  `- shoes-category/
|- src/
|  |- components/
|  |  |- Cart.tsx
|  |  |- FloatingCartButton.astro
|  |  |- Footer.astro
|  |  |- Hero.astro
|  |  `- Shoe.astro
|  |- layouts/
|  |  `- Layout.astro
|  |- pages/
|  |  `- index.astro
|  |- store/
|  |  `- cartStore.ts
|  |- styles/
|  |  `- global.css
|  |- types/
|  |  `- shop.ts
|  `- utils/
|     `- shoes.json
|- astro.config.mjs
`- package.json
```

## Flujo de compra

1. El usuario explora productos por categoria.
2. Agrega productos al carrito desde cada card.
3. Ajusta cantidad, talla y color en el panel lateral.
4. Completa su nombre.
5. Se abre WhatsApp con el resumen completo del pedido y total.

## Persistencia del carrito

La app guarda automaticamente en `localStorage`:

- Items del carrito en `fadikirbag-shoes-cart-items`
- Estado de apertura del carrito en `fadikirbag-shoes-cart-open`

Esto permite recuperar la sesion del comprador al recargar la pagina.

## SEO y metadatos

El layout principal incluye:

- Metas basicas (`description`, `keywords`, `robots`)
- Open Graph
- Twitter Cards
- Canonical dinamico

Archivo clave: `src/layouts/Layout.astro`

## Como agregar o editar productos

Editar `src/utils/shoes.json` siguiendo la estructura de cada producto:

```json
{
	"id": 1,
	"name": "NOMBRE DEL MODELO",
	"price": 25,
	"images": ["/shoes-category/ruta/1.jpeg"],
	"sizes": ["35", "36", "37"],
	"colors": ["Negro", "Blanco"]
}
```

Recomendaciones:

- Mantener `id` unico en todo el catalogo.
- Verificar que las rutas de imagen existan en `public/shoes-category/`.
- Mantener consistencia en nombres de tallas y colores.

## Roadmap sugerido

- Integrar pasarela de pago.
- Agregar panel de administracion para inventario.
- Implementar buscador y ordenamiento por precio.
- Añadir pruebas E2E del flujo de compra.

## Autor

Desarrollado por Fadi Kirbag para SNEAK SHOES.
