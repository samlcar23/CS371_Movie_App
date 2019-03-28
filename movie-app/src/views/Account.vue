<template>
<div>
<v-breadcrumbs :items="navPath" divider=">"></v-breadcrumbs>
</div>
</template>

<script>
export default {
  data: () => ({
      navPath:[
          {
            text: 'Home',
          disabled: false,
          to: '/'
      },
      {
            text: 'My Account',
          disabled: true,
          to: '/account'
      }
      ]
  })
};
</script>