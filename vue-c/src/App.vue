<template>
  	<div id="app">
		<router-view/>
  	</div>
</template>

<script>
export default {
  name: 'app'
}

</script>

<style lang='stylus' scopted>
#app
	width:100%
	display flex
	flex-direction column
	align-items center
	justify-content center
	margin-top:100px
</style>
