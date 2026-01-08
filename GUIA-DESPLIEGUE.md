# Guía Completa de Despliegue

## Método Más Fácil: GitHub Desktop + Vercel

### Parte 1: Subir a GitHub con GitHub Desktop

#### 1. Descargar GitHub Desktop

- Ve a [https://desktop.github.com/](https://desktop.github.com/)
- Descarga e instala GitHub Desktop
- Abre GitHub Desktop
- Inicia sesión con tu cuenta de GitHub (o crea una)

#### 2. Agregar tu proyecto

1. En GitHub Desktop, clic en **"File" > "Add Local Repository"**
2. Clic en **"Choose..."** y selecciona la carpeta de tu proyecto
3. Si dice "This directory does not appear to be a Git repository", clic en **"Create a repository"**
4. Llena los campos:
   - **Name:** variedades-don-mendez
   - **Description:** Sistema de gestión para Variedades Don Mendez
   - **Git Ignore:** Node
5. Clic en **"Create Repository"**

#### 3. Publicar en GitHub

1. Clic en **"Publish repository"**
2. Opciones:
   - **Name:** variedades-don-mendez (puedes cambiar si quieres)
   - **Description:** Sistema de gestión para Variedades Don Mendez
   - **Keep this code private:** Marca si quieres que sea privado
3. Clic en **"Publish Repository"**
4. ¡Listo! Tu código está en GitHub

### Parte 2: Configurar Supabase

#### 1. Crear cuenta y proyecto

1. Ve a [https://supabase.com](https://supabase.com)
2. Clic en **"Start your project"**
3. Inicia sesión con GitHub o email
4. Clic en **"New Project"**
5. Llena los datos:
   - **Name:** variedades-don-mendez
   - **Database Password:** Crea una contraseña segura (GUÁRDALA)
   - **Region:** South America (São Paulo)
   - **Pricing Plan:** Free
6. Clic en **"Create new project"**
7. Espera 2-3 minutos mientras se crea

#### 2. Crear las tablas

1. En el menú lateral, clic en **"SQL Editor"**
2. Clic en **"New query"**
3. Abre el archivo `scripts/01-setup-database.sql` de tu proyecto
4. Copia TODO el contenido
5. Pégalo en el editor SQL de Supabase
6. Clic en **"Run"** (botón verde abajo a la derecha)
7. Deberías ver "Success. No rows returned"

#### 3. Obtener las credenciales

1. En el menú lateral, clic en **"Settings"** (icono de engranaje)
2. Clic en **"API"**
3. Encontrarás dos valores importantes:
   - **Project URL** (algo como: https://abc123xyz.supabase.co)
   - **anon public** key (una cadena larga de texto)
4. **COPIA ESTOS DOS VALORES** - los necesitarás en el siguiente paso

### Parte 3: Desplegar en Vercel

#### 1. Crear cuenta en Vercel

1. Ve a [https://vercel.com](https://vercel.com)
2. Clic en **"Sign Up"**
3. Clic en **"Continue with GitHub"**
4. Autoriza a Vercel para acceder a tus repositorios

#### 2. Importar tu proyecto

1. En el dashboard de Vercel, clic en **"Add New..." > "Project"**
2. Busca **"variedades-don-mendez"** en la lista
3. Clic en **"Import"**

#### 3. Configurar Variables de Entorno

**IMPORTANTE:** Antes de dar clic en Deploy, necesitas agregar las variables de entorno:

1. Busca la sección **"Environment Variables"**
2. Agrega la primera variable:
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Pega tu Project URL de Supabase
   - Clic en **"Add"**
3. Agrega la segunda variable:
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Pega tu anon key de Supabase
   - Clic en **"Add"**

#### 4. Desplegar

1. Clic en **"Deploy"**
2. Espera 2-3 minutos
3. Verás una pantalla de celebración con confeti
4. Tu aplicación está en línea en: `https://variedades-don-mendez-xxx.vercel.app`

### Parte 4: Probar tu Aplicación

1. Clic en el link de tu aplicación
2. Deberías ver la pantalla de login
3. Inicia sesión con:
   - **Email:** admin@donmendez.com
   - **Contraseña:** admin123
4. ¡Funciona! 🎉

### Parte 5: Compartir con Usuarios

Ahora puedes compartir el link de tu aplicación:

- `https://tu-proyecto.vercel.app`

Los usuarios pueden:
- Registrarse desde la pantalla de login
- Hacer pedidos como clientes
- Los admins pueden gestionarlo todo

## Actualizar tu Aplicación

Cuando hagas cambios en el código:

### Usando GitHub Desktop:

1. Abre GitHub Desktop
2. Verás todos los archivos que cambiaste
3. En la esquina inferior izquierda:
   - **Summary:** Escribe un mensaje corto (ej: "Agregué nueva función")
   - **Description:** (Opcional) Explica más detalles
4. Clic en **"Commit to main"**
5. Clic en **"Push origin"** (botón arriba)
6. Vercel detectará automáticamente los cambios
7. Tu sitio se actualizará en 1-2 minutos

## Límites del Plan Gratuito

### Supabase FREE

- ✅ 500 MB de base de datos (suficiente para ~5,000 productos)
- ✅ 5 GB de transferencia mensual
- ✅ 2 GB de almacenamiento
- ✅ 50,000 usuarios activos al mes
- ✅ Ilimitado tiempo - nunca expira

### Vercel FREE

- ✅ 100 GB de ancho de banda mensual
- ✅ Despliegues ilimitados
- ✅ Dominios personalizados gratis
- ✅ SSL/HTTPS automático
- ✅ Ilimitado tiempo - nunca expira

### ¿Es suficiente para mi negocio?

**Supabase gratis es suficiente si:**
- Tienes menos de 1,000 productos
- Menos de 1,000 ventas al mes
- Menos de 100 usuarios registrados

**Vercel gratis es suficiente si:**
- Menos de 10,000 visitantes al mes
- Tu tienda no es viral en redes sociales

## Dominio Personalizado (Opcional)

Si quieres usar tu propio dominio (ej: www.donmendez.com):

1. Compra un dominio en [Namecheap](https://www.namecheap.com) o [Google Domains](https://domains.google)
2. En Vercel:
   - Ve a tu proyecto
   - Clic en **"Settings" > "Domains"**
   - Agrega tu dominio
   - Sigue las instrucciones para configurar los DNS
3. Listo en 10-30 minutos

## Problemas Comunes

### Error: "Database connection failed"

- Verifica que las variables de entorno estén correctas
- Asegúrate de que ejecutaste el script SQL en Supabase

### Error: "Module not found"

- Ejecuta `npm install` de nuevo
- Borra `node_modules` y `.next`, luego ejecuta `npm install`

### Los cambios no se reflejan

- Espera 2-3 minutos después de hacer push
- Verifica en Vercel > Deployments que el deploy terminó

## ¿Necesitas Ayuda?

- Supabase Docs: [https://supabase.com/docs](https://supabase.com/docs)
- Vercel Docs: [https://vercel.com/docs](https://vercel.com/docs)
- GitHub Docs: [https://docs.github.com](https://docs.github.com)
