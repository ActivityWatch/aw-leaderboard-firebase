<template>
	<AWLHeader></AWLHeader>
	<div>
		<!-- TODO: add copy and paste. Better styling. A lot.-->
		Your api-key is {{ apikey }} <br>
		Copy this key and configure it in your activitywatch rust server.
	</div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth';
import { onMounted, ref } from 'vue';
import AWLHeader from '@/components/Header.vue';

export default {
	name: 'ApiKey',
	setup() {
		useAuthStore().fetchKey()
		const apikey = ref(useAuthStore().getApiKey)
		onMounted(async () => {
			await useAuthStore().fetchKey()
			apikey.value = useAuthStore().getApiKey
		})
		return { apikey };
	},
	components: {
		AWLHeader
	}

};
</script>