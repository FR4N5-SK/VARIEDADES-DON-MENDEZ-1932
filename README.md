# Variedades Don Mendez 1932

Sistema completo de gestión para tienda de variedades con punto de venta, inventario, pedidos en línea y más.

## Características

- **Autenticación** - Sistema de login con múltiples roles (Admin, Gerente, Cajero, Cliente)
- **Dashboard** - Panel con métricas en tiempo real
- **Inventario** - Gestión completa de productos con control de stock
- **Punto de Venta (POS)** - Sistema de cobro rápido y eficiente
- **Gestión de Ventas** - Historial y reportes de ventas
- **Gestión de Usuarios** - Control de empleados y clientes
- **Gestión de Proveedores** - Administración de distribuidores
- **Catálogo en Línea** - Los clientes pueden ver productos y hacer pedidos por WhatsApp
- **Pedidos a Crédito** - Sistema de anotación de mercancía fiada
- **Cuentas por Cobrar** - Control de deudas y pagos
- **Cierre Diario** - Exportar reportes a Excel
- **Calculadora de Precios** - Calcular precios de venta e imprimir etiquetas

## Tecnologías

- **Next.js 16** - Framework de React
- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **Supabase** - Base de datos PostgreSQL
- **Shadcn/ui** - Componentes de UI
- **Zustand** - Gestión de estado
- **xlsx** - Exportar a Excel

## Instalación

### Requisitos Previos

- Node.js 18 o superior
- Una cuenta en Supabase (gratis)
- Una cuenta en Vercel (gratis, opcional para deployment)

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/variedades-don-mendez.git
cd variedades-don-mendez
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto (tarda ~2 minutos)
3. Ve a SQL Editor y ejecuta el script `scripts/01-setup-database.sql`
4. Ve a Settings > API y copia:
   - Project URL
   - anon public key

### Paso 4: Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

2. Abre `.env.local` y agrega tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-publica-aqui
```

### Paso 5: Ejecutar en modo desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Usuario por Defecto

- **Email:** admin@donmendez.com
- **Contraseña:** admin123

**IMPORTANTE:** Cambia esta contraseña después de iniciar sesión por primera vez.

## Despliegue en Vercel (Método Fácil)

### Opción 1: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub usando GitHub Desktop:**
   - Descarga [GitHub Desktop](https://desktop.github.com/)
   - Abre GitHub Desktop
   - Clic en "File" > "Add Local Repository"
   - Selecciona la carpeta del proyecto
   - Clic en "Publish repository"
   - Marca o desmarca "Keep this code private" según prefieras
   - Clic en "Publish Repository"

2. **Despliega en Vercel:**
   - Ve a [https://vercel.com](https://vercel.com)
   - Inicia sesión con GitHub
   - Clic en "Add New..." > "Project"
   - Selecciona tu repositorio
   - Agrega las variables de entorno:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Clic en "Deploy"
   - Espera 2-3 minutos
   - Tu app estará en: `https://tu-proyecto.vercel.app`

### Opción 2: Despliegue directo (Sin GitHub)

```bash
# Instala Vercel CLI
npm i -g vercel

# Despliega
vercel
```

## Límites de Plan Gratuito

### Supabase (Gratis)

- ✅ 500 MB de base de datos
- ✅ 5 GB de ancho de banda
- ✅ 2 GB de almacenamiento de archivos
- ✅ 50,000 usuarios activos mensuales
- ✅ Sin límite de tiempo

**Suficiente para:** Una tienda pequeña con ~1000 productos y ~500 ventas al mes

### Vercel (Gratis)

- ✅ 100 GB de ancho de banda
- ✅ Despliegues ilimitados
- ✅ Dominios personalizados
- ✅ SSL automático
- ✅ Sin límite de tiempo

**Suficiente para:** Tráfico de ~10,000 visitantes mensuales

## Actualizar tu Aplicación

Cuando hagas cambios en el código:

### Con GitHub Desktop:

1. Abre GitHub Desktop
2. Verás tus cambios listados
3. Escribe un mensaje de commit (ej: "Agregué nueva funcionalidad")
4. Clic en "Commit to main"
5. Clic en "Push origin"
6. Vercel detectará los cambios y actualizará automáticamente tu sitio

### Sin GitHub:

```bash
vercel --prod
```

## Roles de Usuario

### Admin
- Acceso completo a todas las funcionalidades
- Gestión de usuarios, inventario, proveedores
- Configuración del sistema
- Reportes y cierres diarios

### Gerente
- Acceso a ventas, inventario y reportes
- No puede gestionar usuarios
- Puede confirmar pedidos y pagos

### Cajero
- Punto de venta (POS)
- Ver inventario
- Confirmar pedidos

### Cliente Tipo 1
- Ver catálogo de productos
- Hacer pedidos por WhatsApp
- Ver historial de pedidos

### Cliente Tipo 2
- Todo lo del Cliente 1
- Puede anotar mercancía a crédito (si está autorizado)
- Puede realizar abonos a su deuda

## Soporte

Si necesitas ayuda:
- Revisa la documentación de [Supabase](https://supabase.com/docs)
- Revisa la documentación de [Vercel](https://vercel.com/docs)
- Abre un issue en GitHub

## Licencia

MIT
