Una aplicación de tareas moderna y responsiva construida con **Ionic Framework** y **Angular 20**. Utiliza una base de datos SQLite local para almacenamiento offline y soporta sincronización con Firebase. Compatible con iOS y Android, ideal para gestionar tus tareas en cualquier dispositivo.

## 🚀 Características

- ✅ Crear, editar y eliminar tareas
- 📂 Organizar tareas por categorías
- 🎯 Prioridades de tareas (baja, media, alta)
- 🔄 Estado de tareas (pendiente, completado)
- 💾 Almacenamiento local con SQLite
- 🌐 Sincronización con Firebase
- 📱 Completamente responsivo (iOS y Android)
- ⚡ Angular Signals para reactividad
- 🎨 Diseño moderno con Ionic Components

## 📋 Requisitos Previos

- **Node.js** >= 18.x
- **npm** >= 9.x o **yarn**
- **Ionic CLI**: `npm install -g @ionic/cli`
- **Cordova**: `npm install -g cordova`
- Para iOS: **Xcode** (macOS)
- Para Android: **Android Studio** + Android SDK

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/N3croide/TodoListIonic.git
cd TodoListIonic
```

### 2. Instalar dependencias

```bash
npm install
# o si preferís yarn:
# yarn install
```

### 3. Correr la app en modo desarrollo (web)

```bash
ionic serve
```

### 4. Correr en dispositivo o emulador

#### Android

```bash
ionic cordova platform add android
ionic cordova run android
```

#### iOS (solo en macOS)

```bash
ionic cordova platform add ios
ionic cordova run ios
```

> **Tip:** Si es la primera vez que usás Cordova, asegurate de tener configurado el entorno de Android Studio o Xcode y los emuladores.

### 5. Troubleshooting

- Si tenés problemas con dependencias nativas, corré:
  ```bash
  npm install
  ionic cordova prepare
  ```
- Para limpiar la plataforma:
  ```bash
  ionic cordova platform rm android
  ionic cordova platform add android
 
