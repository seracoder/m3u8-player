<svelte:head>
	<title>M3U8 Player</title>
	<meta name="description" content="Play any m3u8 file online with this simple web player.">
</svelte:head>

<script lang="ts">
	import Player from '$lib/components/Player.svelte';
	import { onMount } from 'svelte';

	let urls: string[] = [];
	let inputUrl: string = '';
	let currentlyPlayingUrl: string

	onMount(() => {
		urls = (JSON.parse(localStorage.getItem('urls') || '[]')).reverse()
		console.log(urls.length === 1)
		if (urls.length >= 1) {
			currentlyPlayingUrl = urls[0];
			console.log(currentlyPlayingUrl);
		}
	})

	function saveToStorage() {
		localStorage.setItem('urls', JSON.stringify(urls));
	}

	function clearStorage() {
		localStorage.removeItem('urls');
		urls = [];
	}

</script>

<div class="my-10 mx-2">
	<div class="mb-5">
		<input type="text" placeholder="Type here" class="input input-bordered w-full" id="urlInput" bind:value={inputUrl} />
		<div class="flex gap-2 ">

			<div class="tooltip" data-tip="hello">
				<button class="p-2 w-fit bg-blue-500 mt-2 text-white min-w-20 hover:bg-blue-600 active:bg-blue-700"
					on:click={clearStorage}
			>
				Clear
			</button>
			</div>
		<button
			on:click={
				() => {
					urls = [...urls, inputUrl]
					saveToStorage();
					currentlyPlayingUrl = urls[0];
					inputUrl = '';
				}
			}
			class="p-2 w-full bg-blue-500 mt-2 text-white hover:bg-blue-600 active:bg-blue-700"
		>
			Play
		</button>
		</div>
	</div>
	<div class="grid gap-2">
		{#each urls as url}
			{#if currentlyPlayingUrl === url}
				<div class="flex flex-col justify-center relative">
					<button on:click={() => urls = urls.filter(u => u !== url)}
									class="p-2 py-1 bg-red-500 text-white w-fit absolute z-10 top-0 right-0">
						<svg xmlns="http://www.w3.org/2000/svg"
								 fill="none"
								 viewBox="0 0 24 24"
								 stroke-width="1.5"
								 stroke="currentColor"
								 class="size-4">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>


					<Player playUrl={url} />
				</div>
			{:else}
				<div class="flex justify-between  bg-neutral-600 p-2">
					<p class="line-clamp-1 max-w-60 md:max-w-none text-white">{urls}</p>
					<div class="flex gap-2">
						<button on:click={() => currentlyPlayingUrl = url}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:text-white active:fill-white">
								<path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
							</svg>
						</button>
						<button on:click={() => urls = urls.filter(u => u !== url)}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 hover:text-white active:fill-white">
								<path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
							</svg>
						</button>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>