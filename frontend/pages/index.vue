<template>
  <div
    class="relative flex items-top justify-center min-h-screen bg-gray-100 sm:items-center sm:pt-0"
  >
    <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss@2.1.2/dist/tailwind.min.css"
      rel="stylesheet"
    />
    <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
      <h2>ログイン状態:{{ $auth.loggedIn }}</h2>
      <p>名前とか:{{ $auth.user }}</p>
      <div>
        <nav>
        <nuxt-link to="/login">Login</nuxt-link>
        </nav>
      </div>
      <div>
        <nav>
        <nuxt-link to="/register">Resister</nuxt-link>
        </nav>
      </div>
      <div v-if="$auth.loggedIn">
        <nuxt-link to="/about">About</nuxt-link>
      </div>
      <div v-if="$auth.loggedIn">
        <button @click="$auth.logout()">Logout</button>
      </div>
    </div>
  </div>
</template>