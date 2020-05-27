## select-search下拉搜索框<br>
**infoList：需要渲染的数据，**<br>
    默认为：空数组<br>
    类型：array<br>

**showValue：要显示的数据key**<br>
    默认为：'name'<br>
    类型：string<br>

**v-model：绑定值**<br>
    默认为：-<br>
    类型：string    <br>

**loading：正在加载···**<br>
    默认为：false<br>
    类型：boolean   <br>   

**type：按钮颜色，目前只支持4种颜色**<br>
    默认为：'primary'<br>
    类型：string  <br>
    primary - 蓝色<br>
    success - 绿色<br>
    warning - 橘色<br>
    error - 红色<br>   

**uniShadow：是否显示bar**<br>
    默认为：true<br>
    类型：boolean<br>

**size：组件大小**<br>
    默认为：medium<br>
    类型：string<br>
	medium - 正常大小
	small - 小组件



**事件**<br>
目前只有2个事件：<br>

**@handleSearch：botton按钮点击事件**<br>
    说明：点击按钮触发的事件<br>
    回调参数：无<br>
**@change：选中值发生变化时，触发的事件，参数为选中值的那一组数据**<br>
    说明：选中值发生变化时触发<br>
    回调参数：目前选中的值对应的一组数据 <br>
**tips：**<br>
    infoList为一个数组，里边的数据需以对象形式出现！<br>



**完整的例子**<br>
<br>
```
<template>
	<view style="margin-top: 100px;">
		<select
		@handleSearch = "handleSearch"
		@change = "change"
		placeholder = "请输入信息"
		:infoList = "infoList"
		:showValue = "showValue"
		v-model = "searchValue"
		:loading = "loading"
		type = "primary"
		:uniShadow = "true"
		></select>
	</view>
</template>
<script>
	import select from '../../components/uni-select-search.vue'
	export default {
		components:{select},
		data() {
			return {
				loading: false,
				showValue: 'name', // 需要显示的数据，必须与infoList中的name对应
				searchValue: '',
				infoList: [],
				infoLists: [{
					name: '吕星辰1'
				},{
					name: '吕星辰2'
				},{
					name: '吕星辰3'
				},{
					name: '吕星辰4'
				}]
			}
		},
		methods:{
			handleSearch() {
				this.loading = true
				setTimeout(() => {
					this.loading = false
					this.infoList = this.infoLists
				}, 2000)
			},
			change(val){
				console.log(val)
			}
		}
	}
</script>
```
<br>
有什么问题或疑问欢迎大家及时留言，大家共同进步！<br>


