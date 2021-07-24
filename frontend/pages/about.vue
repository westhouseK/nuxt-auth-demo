<template>
    <h1>このページはログインしていないユーザには見れません</h1>
</template>
<script>
export default {
    middleware: 'auth'
}
</script>